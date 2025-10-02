const Gallery = require('./galleryModel');

exports.addImage = async (req, res) => {
  try {
    const image = await Gallery.create(req.body);
    res.status(201).json(image);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getImages = async (_req, res) => {
  const images = await Gallery.find().sort({ createdAt: -1 });
  res.json(images);
};

exports.deleteImage = async (req, res) => {
  try {
    const result = await Gallery.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
