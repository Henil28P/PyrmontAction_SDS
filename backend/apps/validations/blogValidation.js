const Blog = require('../models/blogModel.js');
module.exports = {

    async verifyBlogInputs(req, res, next) {
        const { id } = req.params;
        const { title } = req.body;
        
        // Check if another blog with the same title exists
        const sameTitleBlog = await Blog.findOne({ title });
        
        if (sameTitleBlog) {
            // If id is an editCode (for visitor updates)
            if (id.length === 16) { // editCode format
                if (sameTitleBlog.editCode !== id) {
                    return res.status(400).json({ message: 'Blog title already exists' });
                }
            } 
            // If id is a MongoDB ObjectId (for admin updates)
            else if (sameTitleBlog._id.toString() !== id) {
                return res.status(400).json({ message: 'Blog title already exists' });
            }
        }

        next();
    }
};