const User = require('../models/userModel');
const Role = require('../models/roleModel');

module.exports = {
    // Create a new user
    async createMember(joinSession, stripeCustomerID) {
        try {
            // Map incoming joinSession fields to the User model fields.
            // joinSession was created in the registration flow and uses `firstName` / `lastName`.
            const newUser = new User({
                email: joinSession.email,
                password: joinSession.password,
                firstName: joinSession.firstName,
                lastName: joinSession.lastName,
                mobilePhone: joinSession.mobilePhone,
                areaOfInterest: joinSession.areaOfInterest,
                streetName: joinSession.streetName,
                city: joinSession.city,
                state: joinSession.state,
                postcode: joinSession.postcode,
                stripeCustomerID: stripeCustomerID
            });

            newUser.memberExpiryDate = this.calculateMemberExpiryDate();
            newUser.role = await Role.findOne({ name: 'member' }).exec();
            await newUser.save();
            return newUser;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },

    // Get current user's profile (using ID from JWT token)
    async getCurrentUser(req, res) {
        try {
            // Use object destructuring to exclude sensitive fields
            const { password, _id, __v, createdAt, updatedAt, role, ...userData } = req.user.toObject();

            return res.status(200).json(userData);
        } catch (error) {
            console.error("Error fetching user:", error);
            return res.status(500).json({ message: 'Failed to fetch user.', errors: error.message });
        }
    },

    // Get user by specific ID (admin only)
    async getUser(req, res) {
        try {
            const user = await User.findById(req.params.id).select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            return res.status(200).json(user);
        } catch (error) {
            console.error("Error fetching user:", error);
            return res.status(500).json({ message: 'Failed to fetch user.', errors: error.message });
        }
    },

    // Update current user's profile
    async updateCurrentUser(req, res) {
        try {
            // const userId = req.user._id;
            // const allowedUpdates = ['firstName', 'lastName', 'mobilePhone', 'streetName', 'city', 'state', 'postalCode', 'postcode'];
            
            // // Filter only allowed fields from request body
            // const updateData = {};
            // allowedUpdates.forEach(field => {
            //     if (req.body[field] !== undefined) {
            //         updateData[field] = req.body[field];
            //     }
            // });

            // // Handle both postalCode and postcode field names
            // if (req.body.postalCode) {
            //     updateData.postcode = req.body.postalCode;
            // }

            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found.' });
            }

            return res.status(200).json(updatedUser);
        } catch (error) {
            console.error("Error updating user:", error);
            return res.status(500).json({ message: 'Failed to update user.', errors: error.message });
        }
    },

    calculateMemberExpiryDate() {
        const oneYearFromNow = new Date();
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        return oneYearFromNow;
    }
};

