const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
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
    isActive: { type: Boolean, default: true },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
    createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to hash password
userSchema.pre('save', async function (next) {
    // Only hash the password if it has been modified (or is new)
    if (!this.isModified('password')) return next();
    
    try {
        const salt = 12;
        this.password = await bcrypt.hash(this.password, salt);
        console.log("1", await bcrypt.hash("1", salt));
        console.log("admin", await bcrypt.hash("admin", salt));
        next();
    } catch (error) {
        next(error);
    }
});

// Adding static methods to the schema
userSchema.statics.getEmailExists = async function (email) {
    const user = await this.findOne({ email });
    if (!user) return false;
    return true;
};

module.exports = mongoose.model('User', userSchema);