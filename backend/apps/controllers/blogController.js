import Blog from '../models/blogModel.js';

module.exports = {
    /*  CREATE  */
    // A visitor can submit a blog post
    async submitBlog (req, res) {
        try {
            const { title, content, author, status } = req.body;
            const newBlog = new Blog({ title, content, author, status });
            await newBlog.save();
            res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
        } catch (error) {
            res.status(500).json({ message: 'Error creating blog', error });
        }
    },

    /* READ  */
    // Get all blogs for editorial dashboard
    async getAllBlogs (req, res) {
        try {
            const blogs = await Blog.find().sort({ createdAt: -1 });
            res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching blogs', error });
        }
    },
    // Get approved blogs for public view
    async getApprovedBlogs (req, res) {
        try {
            const blogs = await Blog.find({ status: 'approved' }).sort({ createdAt: -1 });
            res.status(200).json(blogs);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching approved blogs', error });
        }
    },
    // Get blog by ID
    async getBlogById (req, res) {
        try {
            const blog = await Blog.findById(req.params.id);
            if (!blog) {
                return res.status(404).json({ message: 'Blog not found' });
            }
            res.status(200).json(blog);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching blog', error });
        }
    },

    /* UPDATE  */
    // Approve blog (for editorial review)
    async approveBlog (req, res) {
        try {
            const { id } = req.params;
            const updatedBlog = await Blog.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
            if (!updatedBlog) {
                return res.status(404).json({ message: 'Blog not found' });
            }
            res.status(200).json({ message: 'Blog approved successfully', blog: updatedBlog });
        } catch (error) {
            res.status(500).json({ message: 'Error approving blog', error });
        }
    },
    // Update blog (for editorial review)
    async updateBlog (req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updatedBlog = await Blog.findByIdAndUpdate(id, updates, { new: true });
            if (!updatedBlog) {
                return res.status(404).json({ message: 'Blog not found' });
            }
            res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
        } catch (error) {
            res.status(500).json({ message: 'Error updating blog', error });
        }
    },
    // Update blog (for editorial review)
    async updateBlog (req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const updatedBlog = await Blog.findByIdAndUpdate(id, updates, { new: true });
            if (!updatedBlog) {
                return res.status(404).json({ message: 'Blog not found' });
            }
            res.status(200).json({ message: 'Blog updated successfully', blog: updatedBlog });
        } catch (error) {
            res.status(500).json({ message: 'Error updating blog', error });
        }
    },

    /* DELETE  */
    // Delete blog (for editorial review)
    async deleteBlog (req, res) {
        try {
            const { id } = req.params;
            const deletedBlog = await Blog.findByIdAndDelete(id);
            if (!deletedBlog) {
                return res.status(404).json({ message: 'Blog not found' });
            }
            res.status(200).json({ message: 'Blog deleted successfully', blog: deletedBlog });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting blog', error });
        }
    }

};