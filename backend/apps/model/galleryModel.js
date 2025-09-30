const mongoose = require('mongoose');

const galleryImageSchema = new mongoose.Schema({
  image_file_name: { type: String, required: true },
  caption: { type: String },
  alt: { type: String }
}, { timestamps: true });

const Gallery = mongoose.model('GalleryImage', galleryImageSchema);
module.exports = Gallery;