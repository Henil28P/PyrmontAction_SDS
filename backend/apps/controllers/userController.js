const User = require('../models/userModel');
const Role = require('../models/roleModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

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

            newUser.memberExpiryDate = this.calculateMemberExpiryDate(new Date());
            newUser.role = await Role.findOne({ name: 'member' }).exec();
            await newUser.save();
            return newUser;
        } catch (error) {
            console.error("Error creating user:", error);
            throw error;
        }
    },


    /* READ  */
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

            return res.status(200).json(updatedUser);
        } catch (error) {
            console.error("Error updating user:", error);
            return res.status(500).json({ message: 'Failed to update user.', errors: error.message });
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

    calculateMemberExpiryDate(date) {
        const oneYearFromNow = new Date(date);
        oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
        return oneYearFromNow;
    }
};

