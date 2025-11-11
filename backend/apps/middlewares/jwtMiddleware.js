const jwt = require('jsonwebtoken');
const User = require('../models/userModel');


const verifyToken = async (req, res, next) => {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
    
    if (!token) {
        return res.status(401).json({ message: 'Access token is required' });
    }

    try {
        // Verify and decode the token (jwt.verify automatically checks exp)
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);
        
        // Additional manual checks
        const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
        // Check if token was issued in the future (security check)
        if (decoded.iat && decoded.iat > currentTime + 60) { // Allow 60 seconds clock skew
            return res.status(401).json({ message: 'Token issued in the future' });
        }
        
        // Add user info to request object (only what's actually in the token)
        const user = await User.findById(decoded.id).populate('role');
        if (!user) {
            return res.status(404).json({ message: 'Not a valid user for this token' });
        }

        req.user = user;

        next();
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token has expired' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Invalid token' });
        } else {
            return res.status(403).json({ message: 'Token verification failed', errors: error.message });
        }
    }
};

const verifyRole = (requiredRoles) => {
    return async (req, res, next) => {
        if (!req.user || !req.user.role) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }

        // If role is not present in token, fetch from DB or another source if needed
        // requiredRoles is an array for multiple allowed roles
        if (!requiredRoles.includes(req.user.role.name)) {
            return res.status(403).json({ message: 'Forbidden: Insufficient role' });
        }

        next();
    };
};

module.exports = { verifyToken, verifyRole };