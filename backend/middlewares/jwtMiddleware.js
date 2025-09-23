const jwt = require('jsonwebtoken');
const User = require('../apps/user/userModel');
const Role = require('../apps/user/roleModel');
require('dotenv').config();

module.exports = {
    // Generate access token
    generateAccessToken(userId, email, roleId) {
        return jwt.sign(
            { 
                userId: userId,
                email: email, 
                roleId: roleId 
            }, 
            process.env.ACCESS_TOKEN_SECRET, 
            { expiresIn: '1h' }
        );
    },

    // Generate refresh token
    generateRefreshToken(userId, email, roleId) {
        return jwt.sign(
            { 
                userId: userId,
                email: email, 
                roleId: roleId 
            }, 
            process.env.REFRESH_TOKEN_SECRET, 
            { expiresIn: '7d' }
        );
    },

    // Verify access token middleware
    verifyAccessToken(req, res, next) {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

        if (!token) {
            return res.status(401).json({ message: 'Access token required' });
        }

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, async (err, decoded) => {
            if (err) {
                return res.status(403).json({ message: 'Invalid or expired access token' });
            }

            try {
                // Fetch current user data including role
                const user = await User.findById(decoded.userId).populate('role');
                if (!user || !user.isActive) {
                    return res.status(403).json({ message: 'User not found or inactive' });
                }

                req.user = {
                    id: user._id,
                    email: user.email,
                    role: user.role
                };
                next();
            } catch (error) {
                return res.status(500).json({ message: 'Error verifying user' });
            }
        });
    },

    // Verify refresh token
    verifyRefreshToken(token) {
        return new Promise((resolve, reject) => {
            jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
    },

    // Role-based authorization middleware
    requireRole(allowedRoles) {
        return (req, res, next) => {
            if (!req.user || !req.user.role) {
                return res.status(403).json({ message: 'Access denied: No role information' });
            }

            const userRole = req.user.role.name;
            if (!allowedRoles.includes(userRole)) {
                return res.status(403).json({ 
                    message: `Access denied: Requires one of [${allowedRoles.join(', ')}], but user has '${userRole}'` 
                });
            }

            next();
        };
    },

    // Admin only access
    requireAdmin(req, res, next) {
        return module.exports.requireRole(['admin'])(req, res, next);
    },

    // Member or higher access
    requireMember(req, res, next) {
        return module.exports.requireRole(['member', 'admin'])(req, res, next);
    }
};