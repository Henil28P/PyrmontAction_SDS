const Gallery = require('../models/galleryModel');

module.exports = {
    // Upload single gallery image
    async uploadGalleryImage(req, res) {
        try {
            const { caption, alt } = req.body;
            const imageData = { caption, alt };
        
            if (req.file) {
                // Add file info to gallery image
                imageData.imageUrl = `/uploads/gallery/${req.file.filename}`;
                imageData.image_file_name = req.file.originalname;
            }

            const newGalleryImage = new Gallery(imageData);
            await newGalleryImage.save();

            res.status(201).json(newGalleryImage);
        } catch (err) {
        res.status(500).json({ message: err.message });
        }
    },

    // Read
    async getGalleryImages(req, res){
        try{
            const images = await Gallery.find().sort({createdAt: -1});
            console.log("Fetched gallery images:", images);
            res.status(200).json(images);
        }
        catch(error){
            return res.status(400).json({error: 'Error with the Image page'});
        }

    },
    
    async updateGalleryImage(req, res) {
        try {
            const { caption, alt } = req.body;
            const imageData = { caption, alt };
            if (req.file) {
                // Update file info if new file uploaded
                imageData.imageUrl = `/uploads/gallery/${req.file.filename}`;
                imageData.image_file_name = req.file.originalname;
            }

            const updatedImage = await Gallery.findByIdAndUpdate(req.params.id, imageData, { new: true });
            res.status(200).json(updatedImage);
        } catch (error) {
            return res.status(500).json({ error: 'Error updating image' });
        }
    },

    // Delete
    async deleteGalleryImage(req, res){
        try {
            const deletedImage = await Gallery.findByIdAndDelete(req.params.id);
            if (!deletedImage) return res.status(404).json({ error: 'Image not found' });
            res.status(200).json({ message: 'Image deleted successfully' });
        } catch (error) {
            return res.status(400).json({ error: 'Error deleting image' });
        }
    },
}