const router = require('express').Router();
const controller = require('../controllers/blogController');
const jwtAuth = require('../middlewares/jwtMiddleware');

/* CREATE */
router.post('/', controller.submitBlog);

/* READ */
router.get('/', controller.getAllBlogs);
router.get('/approved', controller.getApprovedBlogs);
router.get('/:id', controller.getBlogByID);

/* UPDATE */
router.put('/:id', controller.updateBlog);
router.put('/:id/approve', controller.approveBlog);

/* DELETE */
router.delete('/:id', controller.deleteBlog);

module.exports = router;
