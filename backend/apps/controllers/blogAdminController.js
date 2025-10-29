// backend/apps/controllers/blogAdminController.js
const Post = require('../models/postModel');

exports.getPendingPosts = async (req, res) => {
  try {
    const posts = await Post.find({ status: 'pending' });
    res.json(posts);
  } catch (err) {
    console.error('Error fetching pending posts:', err);
    res.status(500).json({ error: 'Failed to load pending posts' });
  }
};

exports.approvePost = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, { status: 'approved' });
    res.json({ message: 'Post approved' });
  } catch (err) {
    console.error('Error approving post:', err);
    res.status(500).json({ error: 'Failed to approve post' });
  }
};

exports.rejectPost = async (req, res) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, { status: 'rejected' });
    res.json({ message: 'Post rejected' });
  } catch (err) {
    console.error('Error rejecting post:', err);
    res.status(500).json({ error: 'Failed to reject post' });
  }
};
