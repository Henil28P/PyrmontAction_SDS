const express = require('express');
const router = express.Router();
const Blog = require('../models/blogModel');

// === Get all pending posts ===
router.get('/admin/pending', async (req, res) => {
  try {
    const pending = await Blog.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(pending);
  } catch (err) {
    console.error('Failed to load pending posts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === Approve a post ===
router.patch('/admin/:id/approve', async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, { status: 'approved' });
    res.json({ success: true, message: 'Post approved' });
  } catch (err) {
    console.error('Approve failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// === Reject a post ===
router.patch('/admin/:id/reject', async (req, res) => {
  try {
    await Blog.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.json({ success: true, message: 'Post rejected' });
  } catch (err) {
    console.error('Reject failed:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
