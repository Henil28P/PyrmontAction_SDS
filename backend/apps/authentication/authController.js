const User = require('../user/userModel');
const Role = require('../user/roleModel');
const bcrypt = require('bcrypt');
const jwtMiddleware = require('../../middlewares/jwtMiddleware');

module.exports = {
    // User registration
    async join(req, res) {
        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email: req.body.email });
            if (existingUser) {
                return res.status(400).json({ 
                    message: 'Registration failed', 
                    errors: { email: ['Email address is already registered'] }
                });
            }

            const user = new User({
                email: req.body.email,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                mobilePhone: req.body.mobilePhone,
                areaOfInterest: req.body.areaOfInterest,
                streetName: req.body.streetName,
                city: req.body.city,
                state: req.body.state,
                postcode: req.body.postcode,
            });
    
            // Hash password
            await user.hashPassword();
            
            // Assign role
            if (req.body.role) {
                const role = await Role.findOne({ name: req.body.role });
                if (!role) {
                    return res.status(400).json({ message: 'Invalid role specified' });
                }
                user.role = role._id;
            } else {
                const defaultRole = await Role.findOne({ name: "member" });
                if (!defaultRole) {
                    return res.status(500).json({ message: 'Default member role not found. Please contact administrator.' });
                }
                user.role = defaultRole._id;
            }
            
            await user.save();
            
            return res.status(201).json({ message: "User registered successfully." });
        } catch (error) {
            console.error("Registration error:", error);
            
            // Handle mongoose validation errors
            if (error.name === 'ValidationError') {
                const errors = {};
                Object.keys(error.errors).forEach(key => {
                    errors[key] = [error.errors[key].message];
                });
                return res.status(400).json({ 
                    message: 'Registration failed - validation errors', 
                    errors 
                });
            }
            
            return res.status(500).json({ message: 'Registration failed. Please try again.' });
        }
    },

    // User login
    async login(req, res) {
        try {
            const { email, password } = req.body;

            // Basic validation
            if (!email || !password) {
                return res.status(400).json({ message: 'Email and password are required' });
            }

            // Find user and populate role
            const user = await User.findOne({ email: email.toLowerCase() }).populate('role');
            if (!user || !user.isActive) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Verify password
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Generate tokens
            const accessToken = jwtMiddleware.generateAccessToken(user._id, user.email, user.role._id);
            const refreshToken = jwtMiddleware.generateRefreshToken(user._id, user.email, user.role._id);

            return res.status(200).json({
                message: 'Successfully logged in',
                tokens: {
                    accessToken,
                    refreshToken
                },
                user: {
                    id: user._id,
                    email: user.email,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    role: user.role.name
                }
            });

        } catch (error) {
            console.error("Login error:", error);
            return res.status(500).json({ message: 'Login failed. Please try again.' });
        }
    },

    // Refresh token endpoint
    async refreshToken(req, res) {
        try {
            const { refreshToken } = req.body;

            if (!refreshToken) {
                return res.status(401).json({ message: 'Refresh token required' });
            }

            const decoded = await jwtMiddleware.verifyRefreshToken(refreshToken);
            
            // Fetch current user data to ensure they still exist and are active
            const user = await User.findById(decoded.userId).populate('role');
            if (!user || !user.isActive) {
                return res.status(403).json({ message: 'User not found or inactive' });
            }

            // Generate new access token
            const newAccessToken = jwtMiddleware.generateAccessToken(user._id, user.email, user.role._id);

            return res.status(200).json({
                message: 'Token refreshed successfully',
                accessToken: newAccessToken
            });

        } catch (error) {
            console.error("Token refresh error:", error);
            return res.status(403).json({ message: 'Invalid refresh token' });
        }
    },

    // Logout (optional - for token blacklisting if needed)
    async logout(req, res) {
        try {
            // In a more sophisticated setup, you'd add the token to a blacklist
            // For now, we'll just return success since JWT tokens are stateless
            return res.status(200).json({ message: 'Logged out successfully' });
        } catch (error) {
            console.error("Logout error:", error);
            return res.status(500).json({ message: 'Logout failed' });
        }
    }
};
    