
const User = require('./userModel');
const Role = require('./roleModel');
const bcrypt = require('bcrypt');

module.exports = {
    // Get current user's profile information
    async getProfile(req, res) {
        try {
            const user = await User.findById(req.user.id).populate('role').select('-password');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({
                message: 'Profile retrieved successfully',
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    mobilePhone: user.mobilePhone,
                    areaOfInterest: user.areaOfInterest,
                    streetName: user.streetName,
                    city: user.city,
                    state: user.state,
                    postcode: user.postcode,
                    role: user.role.name,
                    isActive: user.isActive,
                    createdAt: user.createdAt
                }
            });
        } catch (error) {
            console.error("Get profile error:", error);
            return res.status(500).json({ message: 'Error retrieving profile' });
        }
    },

    // Update user profile (excluding email and role)
    async updateProfile(req, res) {
        try {
            const allowedUpdates = [
                'firstName', 'lastName', 'mobilePhone', 'areaOfInterest', 
                'streetName', 'city', 'state', 'postcode'
            ];
            
            const updates = {};
            Object.keys(req.body).forEach(key => {
                if (allowedUpdates.includes(key) && req.body[key] !== undefined) {
                    updates[key] = req.body[key];
                }
            });

            if (Object.keys(updates).length === 0) {
                return res.status(400).json({ message: 'No valid fields to update' });
            }

            const user = await User.findByIdAndUpdate(
                req.user.id, 
                updates, 
                { new: true, runValidators: true }
            ).populate('role').select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({
                message: 'Profile updated successfully',
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    mobilePhone: user.mobilePhone,
                    areaOfInterest: user.areaOfInterest,
                    streetName: user.streetName,
                    city: user.city,
                    state: user.state,
                    postcode: user.postcode,
                    role: user.role.name,
                    isActive: user.isActive,
                    createdAt: user.createdAt
                }
            });
        } catch (error) {
            console.error("Update profile error:", error);
            
            if (error.name === 'ValidationError') {
                const errors = {};
                Object.keys(error.errors).forEach(key => {
                    errors[key] = [error.errors[key].message];
                });
                return res.status(400).json({ 
                    message: 'Validation errors', 
                    errors 
                });
            }
            
            return res.status(500).json({ message: 'Error updating profile' });
        }
    },

    // Change password
    async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({ message: 'Current password and new password are required' });
            }

            const user = await User.findById(req.user.id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Verify current password
            const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
            if (!isCurrentPasswordValid) {
                return res.status(400).json({ message: 'Current password is incorrect' });
            }

            // Update password
            user.password = newPassword;
            await user.hashPassword();
            await user.save();

            return res.status(200).json({ message: 'Password changed successfully' });
        } catch (error) {
            console.error("Change password error:", error);
            return res.status(500).json({ message: 'Error changing password' });
        }
    },

    // Admin only: Get all users
    async getAllUsers(req, res) {
        try {
            const users = await User.find({ isActive: true }).populate('role').select('-password');
            
            return res.status(200).json({
                message: 'Users retrieved successfully',
                users: users.map(user => ({
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role.name,
                    createdAt: user.createdAt
                }))
            });
        } catch (error) {
            console.error("Get all users error:", error);
            return res.status(500).json({ message: 'Error retrieving users' });
        }
    },

    // Admin only: Get user by ID
    async getUserById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id).populate('role').select('-password');
            
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({
                message: 'User retrieved successfully',
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    mobilePhone: user.mobilePhone,
                    areaOfInterest: user.areaOfInterest,
                    streetName: user.streetName,
                    city: user.city,
                    state: user.state,
                    postcode: user.postcode,
                    role: user.role.name,
                    isActive: user.isActive,
                    createdAt: user.createdAt
                }
            });
        } catch (error) {
            console.error("Get user by ID error:", error);
            return res.status(500).json({ message: 'Error retrieving user' });
        }
    },

    // Admin only: Deactivate user (soft delete)
    async deactivateUser(req, res) {
        try {
            const { id } = req.params;
            
            // Prevent admin from deactivating themselves
            if (req.user.id === id) {
                return res.status(400).json({ message: 'Cannot deactivate your own account' });
            }

            const user = await User.findByIdAndUpdate(
                id, 
                { isActive: false }, 
                { new: true }
            ).select('-password');

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            return res.status(200).json({
                message: 'User deactivated successfully',
                user: {
                    id: user._id,
                    email: user.email,
                    isActive: user.isActive
                }
            });
        } catch (error) {
            console.error("Deactivate user error:", error);
            return res.status(500).json({ message: 'Error deactivating user' });
        }
    }
};

