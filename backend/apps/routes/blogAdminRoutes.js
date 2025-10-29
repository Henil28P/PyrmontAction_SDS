// backend/apps/routes/blogAdminRoutes.js
const express = require('express');
const router = express.Router();
const {
  getPendingPosts,
  approvePost,
  rejectPost,
} = require('../controllers/blogAdminController');
const { verifyAdmin } = require('../middlewares/authMiddleware');

// Admin routes for blog moderation
router.get('/pending', verifyAdmin, getPendingPosts);
router.patch('/:id/approve', verifyAdmin, approvePost);
router.patch('/:id/reject', verifyAdmin, rejectPost);

module.exports = router;
