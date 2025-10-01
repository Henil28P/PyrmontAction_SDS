const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  image_file_name: { type: String, required: true },
  caption: { type: String },
  alt: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const Gallery = mongoose.model('GalleryImage', galleryImageSchema);
module.exports = Gallery;