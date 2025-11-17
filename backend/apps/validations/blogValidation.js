const Blog = require('../models/blogModel.js');
module.exports = {

    async verifyBlogInputs(req, res, next) {
        const { id } = req.params;
        const { title } = req.body;
        
        // Check if another blog with the same title exists
        const sameTitleBlog = await Blog.findOne({ title });
        if (sameTitleBlog) { return res.status(400).json({ message: 'Blog title already exists' }); }

        next();
    }
};