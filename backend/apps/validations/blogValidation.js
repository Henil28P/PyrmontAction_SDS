const Blog = require('../models/blogModel.js');
module.exports = {

    async verifyBlogInputs(req, res, next) {
        const { id } = req.params;
        const { title } = req.body;
        const sameTitleBlog = await Blog.findOne({ title });
        if (sameTitleBlog && sameTitleBlog._id.toString() !== id) {
            return  res.status(400).json({ message: 'Blog title already exists' });
        }

        next();
    }
};