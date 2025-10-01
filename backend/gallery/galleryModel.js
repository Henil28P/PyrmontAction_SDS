const mongoose = require('mongoose');

const GallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  image_url: { type: String, required: true },
  caption: String,
  alt: String
}, { timestamps: true });

module.exports = mongoose.model('Gallery', GallerySchema);
