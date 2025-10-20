const Blog = require('../models/blogModel');

// =====================
// Create new blog (anyone)
// =====================
exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    const author = req.user ? req.user.id : null; // allow anonymous posts

    const newBlog = await Blog.create({ title, content, author });
    res.status(201).json({
      message: 'Blog created successfully. Awaiting approval.',
      blog: newBlog,
    });
  } catch (error) {
    console.error('Error creating blog:', error.message);
    res.status(500).json({ error: 'Failed to create blog.' });
  }
};

// =====================
// Get all blogs (public)
// =====================
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate('author', 'name email')
      .sort({ createdAt: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error.message);
    res.status(500).json({ error: 'Failed to fetch blogs.' });
  }
};

// =====================
// Update blog (Admin/Content Creator only)
// =====================
exports.updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, status } = req.body;

    const updatedBlog = await Blog.findByIdAndUpdate(
      id,
      { title, content, status, updatedAt: Date.now() },
      { new: true }
    );

    if (!updatedBlog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }

    res.status(200).json({
      message: 'Blog updated successfully.',
      blog: updatedBlog,
    });
  } catch (error) {
    console.error('Error updating blog:', error.message);
    res.status(500).json({ error: 'Failed to update blog.' });
  }
};

// =====================
// Delete blog (Admin/Content Creator only)
// =====================
exports.deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await Blog.findByIdAndDelete(id);

    if (!deletedBlog) {
      return res.status(404).json({ message: 'Blog not found.' });
    }

    res.status(200).json({ message: 'Blog deleted successfully.' });
  } catch (error) {
    console.error('Error deleting blog:', error.message);
    res.status(500).json({ error: 'Failed to delete blog.' });
  }
};

