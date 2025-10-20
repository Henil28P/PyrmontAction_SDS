const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');
const jwtMiddleware = require('../middlewares/jwtMiddleware');

// Public routes
router.get('/', blogController.getAllBlogs);

// Authenticated user routes
router.post('/', jwtMiddleware, blogController.createBlog);

// Admin-only routes
router.put('/:id', jwtMiddleware, blogController.updateBlog);
router.delete('/:id', jwtMiddleware, blogController.deleteBlog);

module.exports = router;
