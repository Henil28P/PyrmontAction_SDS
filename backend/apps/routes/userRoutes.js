const controller = require('../controllers/userController');
const jwtAuth = require('../middlewares/jwtMiddleware');
const router = require('express').Router();
const validation = require('../validations/userValidation');

// router.post('/login', validation.inputValidatorLogin, controller.login); // User login
router.post('/login', validation.login, controller.login); // User login
/* CREATE */
router.post('/manager', jwtAuth.verifyToken, jwtAuth.verifyRole(['admin']), controller.createManager); // User registration
/* READ */
router.get('/active-members', jwtAuth.verifyToken, jwtAuth.verifyRole(['admin']), controller.getActiveMembers); // Get active members list
router.get('/password/:id', jwtAuth.verifyToken, jwtAuth.verifyRole(['admin']), controller.setRandomPassword); // Generate a random password
router.get('/me', jwtAuth.verifyToken, controller.getCurrentUser); // Get current user's profile
router.get('/', jwtAuth.verifyToken, jwtAuth.verifyRole(['admin']), controller.getAllUsers); // Get all users (admin only)
/* UPDATE */
router.put('/me', jwtAuth.verifyToken, validation.updateAccount, controller.updateCurrentUser); // Update current user's profile
router.put('/role/:id', jwtAuth.verifyToken, jwtAuth.verifyRole(['admin']), controller.changeManagerRole); // Change user role
/* DELETE */
router.delete('/me', jwtAuth.verifyToken, controller.deleteCurrentUser); // Delete current user's profile
router.delete('/:id', jwtAuth.verifyToken, jwtAuth.verifyRole(['admin']), controller.deleteUser); // Delete user by ID
module.exports = router;
