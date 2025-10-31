const router = require('express').Router();
const controller = require('../controllers/blogController');
const jwtAuth = require('../middlewares/jwtMiddleware');

/* CREATE */
// Visitor can submit a blog post
router.post('/', controller.submitBlog);

/* READ */
// Admin: List all blogs
router.get('/', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.getAllBlogs
);
// Public: List approved blogs
router.get('/approved', controller.getApprovedBlogs);
// Get blog by ID
router.get('/:id', controller.getBlogByID);

/* UPDATE */
// Admin: Approve a blog post
router.put('/:id/approve', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.approveBlog
);
// Admin: Update a blog post
router.put('/:id', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.updateBlog
);

/* DELETE */
// Admin: Delete a blog post
router.delete('/:id', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.deleteBlog
);

module.exports = router;
