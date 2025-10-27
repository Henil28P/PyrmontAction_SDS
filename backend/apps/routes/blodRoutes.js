import express from 'express';
import Post from '../models/post.model.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Visitor submits draft
router.post('/submit', async (req, res) => {
  const post = await Post.create({
    title: req.body.title,
    content: req.body.content,
    authorEmail: req.body.authorEmail,
    status: 'pending',
  });
  res.json(post);
});

// Admin moderation
router.get('/admin/pending', requireAdmin, async (req, res) => {
  const posts = await Post.find({ status: 'pending' }).sort({ createdAt: -1 });
  res.json(posts);
});

router.patch('/admin/:id/approve', requireAdmin, async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { status: 'published', publishedAt: new Date() },
    { new: true }
  );
  res.json(post);
});

router.patch('/admin/:id/reject', requireAdmin, async (req, res) => {
  const post = await Post.findByIdAndUpdate(
    req.params.id,
    { status: 'rejected', publishedAt: null },
    { new: true }
  );
  res.json(post);
});

// Public
router.get('/', async (req, res) => {
  const posts = await Post.find({ status: 'published' }).sort({ publishedAt: -1 });
  res.json(posts);
});

export default router;
