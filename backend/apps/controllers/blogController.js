const Blog = require('../models/blogModel.js');

module.exports = {
    /*  CREATE  */
    // A visitor can submit a blog post
    async submitBlog (req, res) {
        try {
            const { title, content, author, status } = req.body;
            if (await Blog.existsTitle(title)) {
                return  res.status(400).json({ message: 'Blog title already exists' });
            }

            const blogData = {title, content, author, status};
            if (req.file) {
                blogData.imageUrl = `/uploads/blogs/${req.file.filename}`;
                blogData.imageName = req.file.originalname;
            }
            blogData.editCode = await Blog.generateEditCode();
            const newBlog = new Blog(blogData);
            await newBlog.save();
            res.status(201).json(newBlog);
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
    async getBlogByID (req, res) {
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
    // Get blog by edit code for visitors
    async getBlogViaCode (req, res) {
        try {
            const blog = await Blog.findOne({ editCode: req.params.id });
            if (!blog) {
                return res.status(404).json({ message: 'Blog has either been approved or removed.' });
            }
            res.status(200).json(blog);
        } catch (error) {
            res.status(500).json({ message: 'Error fetching blog', error });
        }
    },

    /* UPDATE  */
    // Update for visitor via edit code
    async updateBlogViaCode (req, res) {
        try {
            const { id } = req.params;
            const { title, content, author, status } = req.body;
            const blogData = { title, content, author, status };
            if (req.file) {
                blogData.imageUrl = `/uploads/blogs/${req.file.filename}`;
                blogData.imageName = req.file.originalname;
            }
            const updatedBlog = await Blog.findByIdAndUpdate(id, blogData, { new: true });
            if (!updatedBlog) {
                return res.status(404).json({ message: 'Blog not found or invalid edit code' });
            }
            res.status(200).json(updatedBlog);
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
            res.status(200).json(updatedBlog);
        } catch (error) {
            res.status(500).json({ message: 'Error updating blog', error });
        }
    },
    // Approve blog (for editorial review)
    async approveBlog (req, res) {
        try {
            const { id } = req.params;
            const updatedBlog = await Blog.findByIdAndUpdate(id, { status: 'approved' }, { new: true });
            if (!updatedBlog) {
                return res.status(404).json({ message: 'Blog not found' });
            }
            res.status(200).json(updatedBlog);
        } catch (error) {
            res.status(500).json({ message: 'Error approving blog', error });
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
            res.status(200).json({ message: 'Blog deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Error deleting blog', error });
        }
    }
};