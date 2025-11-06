const router = require('express').Router();
const controller = require('../controllers/blogController');
const jwtAuth = require('../middlewares/jwtMiddleware');
const { upload } = require('../middlewares/fileUpload');

/* CREATE */
// Visitor can submit a blog post
router.post('/', upload.blogImage, controller.submitBlog);

/* READ */
// Admin: List all blogs
router.get('/', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.getAllBlogs
);
// Public: List approved blogs
router.get('/approved', controller.getApprovedBlogs);
// Anyone: Get blog by ID
router.get('/:id', controller.getBlogByID);
// Visitor: Get blog by edit code
router.get('/visitor/:id', controller.getBlogViaCode);

/* UPDATE */
// Admin: Approve a blog post
router.put('/:id/approve', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.approveBlog
);
// Admin: Update a blog post (image is not to be touched)
router.put('/:id',
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.updateBlog
);

// Visitor: Update a blog post
router.put('/visitor/:id',
    upload.blogImage,
    controller.updateBlogViaCode
);

/* DELETE */
// Admin: Delete a blog post
router.delete('/:id', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.deleteBlog
);

module.exports = router;
