const User = require('../models/userModel');
const Role = require('../models/roleModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

module.exports = {
    async login(req, res) {
        try {
            // Step 1: Find the user by email
            const user = await User.findOne({ email: req.body.email }).populate('role');
            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }

            // Step 2: Compare passwords
            const isPasswordValid = await bcrypt.compare(req.body.password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password.' });
            }

            // Step 3: Generate a token
            const token = jwt.sign(
                { id: user._id },
                process.env.ACCESS_TOKEN || 'your_jwt_secret', // Use a secure secret in production
                { expiresIn: '24h' }
            );

            // Step 4: Send a response
            return res.status(200).json({
                message: 'Login successful.',
                token,
                role: user.role.name,
            });
            
        } catch (error) {
            console.error('Error during login:', error);
            return res.status(500).json({ message: 'Login failed. Please try again.', errors: error.message });
        }
    },
    /*  CREATE  */
    // Create a new user by joining
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
            
            newUser.memberExpiryDate = module.exports.calculateMemberExpiryDate(new Date());
            newUser.role = await Role.findOne({ name: 'member' }).exec();
            await newUser.save();
            return newUser;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },
    // Create a new manager (admin/editor) by admin
    async createManager(req, res) {
        try {
            const {firstName, lastName, email, role} = req.body;
            const password = module.exports.generateRandomPassword();
            const newUser = new User({
                firstName,
                lastName,
                email,
                password : password,
                role: await Role.findOne({ name: role }).exec()
            });
            await newUser.save();
            await User.findByIdAndUpdate(
                newUser._id,
                { password: password },
                { new: true }
            );
            return res.status(201).json(password);
        } catch (error) {
            console.error("Error creating user:", error);
            return res.status(500).json({ message: 'Failed to create user.', errors: error.message });
        }
    },

    /* READ  */
    // Admin view of Active Member's list
    async getActiveMembers(req, res) {
        try {
            const today = new Date();
            const activeMembers = await User.find({ memberExpiryDate: { $gte: today } })
                // Populate role to match only 'member' roles
                .populate({ path: 'role', match: { name: 'member' }, select: '-_id name' })
                .select('firstName lastName email mobilePhone memberExpiryDate createdAt -_id')
                .sort({ createdAt: -1 }) // Sort by createdAt in descending order
                .lean();
            return res.status(200).json(activeMembers);
        } catch (error) {
            console.error("Error fetching active members:", error);
            return res.status(500).json({ message: 'Failed to fetch active members.', errors: error.message });
        }
    },

    // Get current user's profile (using ID from JWT token)
    async setRandomPassword(req, res) {
        const { id } = req.params;
        const password = module.exports.generateRandomPassword();
        try {
            const user = await User.findByIdAndUpdate(
                id,
                { password: password },
                { new: true }
            );
    
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
    
            return res.status(200).json(password);
        } catch (error) {
            console.error("Error resetting password:", error);
            return res.status(500).json({ message: 'Failed to reset password.', errors: error.message });
        }
    },

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

    // Get all users (admin only)
    async getAllUsers(req, res) {
        try {
            const users = await User.aggregate([
                { $match: { // Exclude master admin and current user
                    email: { $ne: process.env.MASTER_ADMIN },
                    _id: { $ne: req.user._id }
                }},
                { $lookup: { // Join with roles collection
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'roleDetails' }
                },
                { $unwind: '$roleDetails' },
                { $project: {
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    role: '$roleDetails.name',
                    createdAt: 1 // Include createdAt for sorting
                }},
                { $sort: { createdAt: -1 } } // Sort by createdAt in descending order
            ]);

            if (!users || users.length === 0) {
                return res.status(404).json({ message: 'No users found.' });
            }
            return res.status(200).json(users);
        } catch (error) {
            console.error("Error fetching user:", error);
            return res.status(500).json({ message: 'Failed to fetch user.', errors: error.message });
        }
    },

    /* UPDATE  */
    // Update current user's profile
    async updateCurrentUser(req, res) {
        try {
            const updatedUser = await User.findByIdAndUpdate(
                req.user._id,
                req.body,
                { new: true, runValidators: true }
            );

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found.' });
            }

            return res.status(200).json({ message: 'User updated successfully.' });
        } catch (error) {
            console.error("Error updating user:", error);
            return res.status(500).json({ message: 'Failed to update user.', errors: error.message });
        }
    },

    async changeManagerRole(req, res) {
        try {
            const { id } = req.params;
            const user = await User.findById(id).populate('role');
            if (!user) {
                return res.status(404).json({ message: 'User not found.' });
            }
            if (user.email === process.env.MASTER_ADMIN) {
                return res.status(403).json({ message: 'Cannot change role of the master admin account.' });
            }
            if (user.role.name === 'editor') {
                user.role = await Role.findOne({ name: 'admin' }).exec();
            } else if (user.role.name === 'admin') {
                user.role = await Role.findOne({ name: 'editor' }).exec();
            } else {
                return res.status(400).json({ message: 'User role cannot be changed.' });
            }
            await user.save();
            return res.status(200).json( user.role.name );
        } catch (error) {
            console.error("Error changing user role:", error);
            return res.status(500).json({ message: 'Failed to change user role.', errors: error.message });
        }
    },

    /* DELETE  */
    // Delete user by ID (admin only)
    async deleteUser(req, res) {
        try {
            if (req.user._id.toString() === req.params.id) {
                return res.status(400).json({ message: 'Admins cannot delete their own accounts via this route.' });
            }
            const user = await User.findById(req.params.id);
            if (user.email === process.env.MASTER_ADMIN) {
                return res.status(403).json({ message: 'Cannot delete the master admin account.' });
            }
            if (!user) return res.status(404).json({ message: 'User not found' });
            await User.findByIdAndDelete(user._id);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    
    // Delete current user's account
    async deleteCurrentUser(req, res) {
        try {
            if (req.user.email === process.env.MASTER_ADMIN) {
                return res.status(403).json({ message: 'Cannot delete the master admin account.' });
            }
            const user = await User.findByIdAndDelete(req.user._id);
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.status(200).json({ message: 'Your account has been deleted successfully' });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    
    generateRandomPassword() {
        const length = 12; // Desired password length
        const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
        let password = "";
        
        // Generate a secure random password
        const randomBytes = crypto.randomBytes(length);
        for (let i = 0; i < length; i++) {
            const randomIndex = randomBytes[i] % charset.length;
            password += charset[randomIndex];
        }
    
        return password;
    },
    
    calculateMemberExpiryDate(date) {
        const oneYearFromNow = new Date(date);
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        return oneYearFromNow;
    }
};

