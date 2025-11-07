const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./userModel');

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
    stripeCustomerID: { type: String, default: '' },
    memberExpiryDate: { type: Date, default: null },
    role: { type: mongoose.Schema.Types.ObjectId, ref: 'Role' },
}, { timestamps: true });

// Pre-update middleware to hash password
userSchema.pre('findOneAndUpdate', async function (next) {
    const update = this.getUpdate();

    // Check if password is being updated
    if (update.password) {
        try {
            const salt = 12;
            update.password = await bcrypt.hash(update.password, salt);
        } catch (error) {
            return next(error);
        }
    }

    next();
});

// Adding static methods to the schema
userSchema.statics.getEmailExists = async function (email) {
    const user = await this.findOne({ email });
    if (!user) return false;
    return true;
};

module.exports = mongoose.model('User', userSchema);