const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./userModel');

const joinSessionSchema = new mongoose.Schema({
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    mobilePhone: { type: String, default: '' },
    areaOfInterest: { type: String, default: '' },
    streetName: { type: String, default: '' },
    city: { type: String, default: '' },
    state: { type: String, default: '' },
    postcode: { type: String, default: '' },
    sessionID: { type: String, default: '' },
    expiresAt: {
        type: Date,
        required: true,
        index: { expireAfterSeconds: 0 } // TTL index for automatic cleanup
    }
}, {
    timestamps: true // Automatically adds createdAt and updatedAt
});

// Pre-save middleware to set expiration and hash password if not provided
joinSessionSchema.pre('save', async function(next) {
    try {
        // Set expiration if not provided
        if (this.isNew && (!this.expiresAt || this.expiresAt === undefined)) {
            this.expiresAt = new Date(Date.now() + 60 * 60 * 1000); // Default to 60 minutes from now
        }
        
        // Hash password if it's new or modified
        if (this.isModified('password')) {
            const saltRounds = 12;
            this.password = await bcrypt.hash(this.password, saltRounds);
        }
        
        next();
    } catch (error) {
        next(error);
    }
});

// Static method to create session with auto-expiration
joinSessionSchema.statics.createSession = async function(sessionData, ttlMinutes = null) {
    const ttl = ttlMinutes || parseInt(process.env.JOIN_SESSION_TTL_MINUTES, 10) || 60;
    const expiresAt = new Date(Date.now() + ttl * 60 * 1000);
    
    return this.create({
        ...sessionData,
        expiresAt
    });
};

// Instance method to extend session expiration
joinSessionSchema.methods.extendExpiry = function(additionalMinutes = 60) {
    this.expiresAt = new Date(Date.now() + additionalMinutes * 60 * 1000);
    return this.save();
};

joinSessionSchema.statics.getEmailExists = async function (email) {
    const userHasEmail = await User.getEmailExists(email);
    const sessionHasEmail = await this.findOne({ email });
    return !!userHasEmail || !!sessionHasEmail;
};

module.exports = mongoose.model('JoinSession', joinSessionSchema);