const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Anonymous' },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    imageUrl: { type: String },
    imageName: { type: String }
  },
  { timestamps: true }
);

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
