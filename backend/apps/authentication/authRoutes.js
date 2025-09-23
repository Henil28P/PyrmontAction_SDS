const router = require('express').Router();
const controller = require('./authController');
const { verifyAccessToken } = require('../../middlewares/jwtMiddleware');

// Public routes
router.post('/join', controller.join);
router.post('/login', controller.login);
router.post('/refresh-token', controller.refreshToken);

// Protected routes
router.post('/logout', verifyAccessToken, controller.logout);

module.exports = router;