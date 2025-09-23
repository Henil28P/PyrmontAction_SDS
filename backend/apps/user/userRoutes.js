const router = require('express').Router();
const userController = require('./userController');
const { verifyAccessToken, requireAdmin, requireMember } = require('../../middlewares/jwtMiddleware');

// All routes require authentication
router.use(verifyAccessToken);

// User profile routes (accessible by the user themselves)
router.get('/profile', userController.getProfile);
router.put('/profile', userController.updateProfile);
router.put('/change-password', userController.changePassword);

// Admin only routes
router.get('/all', requireAdmin, userController.getAllUsers);
router.get('/:id', requireAdmin, userController.getUserById);
router.put('/:id/deactivate', requireAdmin, userController.deactivateUser);

module.exports = router;
