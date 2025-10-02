const Event = require('./eventModel');

exports.create = async (req, res) => {
  try {
    const status = req.user.role === 'Admin' ? 'published' : 'pending_review';
    const event = await Event.create({ ...req.body, status, created_by: req.user._id });
    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.update = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!event) return res.status(404).json({ message: 'Not found' });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.publish = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(req.params.id, { status: 'published' }, { new: true });
    if (!event) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Published', event });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const result = await Event.findByIdAndDelete(req.params.id);
    if (!result) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPublic = async (_req, res) => {
  const events = await Event.find({ status: 'published' }).sort({ starts_at: 1 });
  res.json(events);
};

exports.getOnePublic = async (req, res) => {
  const event = await Event.findOne({ _id: req.params.id, status: 'published' });
  if (!event) return res.status(404).json({ message: 'Not found' });
  res.json(event);
};
