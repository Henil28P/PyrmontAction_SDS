const mongoose = require('mongoose');
const crypto = require('crypto');

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    content: { type: String, required: true },
    author: { type: String, default: 'Anonymous' },
    status: { type: String, enum: ['pending', 'approved'], default: 'pending' },
    imageUrl: { type: String },
    imageName: { type: String },
    editCode: { type: String }
  },
  { timestamps: true }
);

blogSchema.statics.generateEditCode = async function () {
  let editCode;
  let user = null;
  do {
    editCode = crypto.randomBytes(8).toString('hex'); // Generate an 8-character hex code
    user = await this.findOne({ editCode });
  } while (user);
  return editCode;
};

blogSchema.statics.existsTitle = async function (title) {
  const blog = await this.findOne({ title });
  return !!blog;
};

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;
