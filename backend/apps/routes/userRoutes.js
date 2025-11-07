const controller = require('../controllers/userController');
const jwtAuth = require('../middlewares/jwtMiddleware');
const router = require('express').Router();
const validation = require('../validations/userValidation');

router.post('/login', validation.inputValidatorLogin, controller.login); // User login
/* CREATE */
/* READ */
router.get('/me', jwtAuth.verifyToken, controller.getCurrentUser); // Get current user's profile
/* UPDATE */
router.put('/me', jwtAuth.verifyToken, controller.updateCurrentUser); // Update current user's profile
router.put('/', controller.generateRandomPassword); // Generate a random password
/* DELETE */
router.delete('/me', jwtAuth.verifyToken, controller.deleteCurrentUser); // Delete current user's profile
router.delete('/:id', jwtAuth.verifyToken, jwtAuth.verifyRole(['admin']), controller.deleteUser); // Delete user by ID
module.exports = router;
