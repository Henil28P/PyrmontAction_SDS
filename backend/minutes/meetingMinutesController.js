const path = require('path');
const fs = require('fs');
const MeetingMinute = require('./meetingMinutesModel');

exports.uploadPrivate = async (req, res) => {
  try {
    const { title, meeting_date } = req.body;
    if (!title || !meeting_date || !req.file) {
      return res.status(400).json({ message: 'title, meeting_date, and PDF file required' });
    }

    const minute = await MeetingMinute.create({
      title,
      meeting_date,
      file_path: req.file.path,
      file_size: req.file.size,
      status: 'private',
      uploaded_by: req.user._id
    });

    res.status(201).json(minute);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.publish = async (req, res) => {
  try {
    const minute = await MeetingMinute.findByIdAndUpdate(req.params.id, { status: 'published' }, { new: true });
    if (!minute) return res.status(404).json({ message: 'Not found' });
    res.json({ message: 'Published', minute });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.listPublic = async (_req, res) => {
  const minutes = await MeetingMinute.find({ status: 'published' }).sort({ meeting_date: -1 });
  res.json(minutes);
};

exports.downloadPublic = async (req, res) => {
  const minute = await MeetingMinute.findOne({ _id: req.params.id, status: 'published' });
  if (!minute) return res.status(404).json({ message: 'Not found' });
  res.download(path.resolve(minute.file_path), path.basename(minute.file_path));
};

exports.remove = async (req, res) => {
  try {
    const minute = await MeetingMinute.findByIdAndDelete(req.params.id);
    if (!minute) return res.status(404).json({ message: 'Not found' });
    fs.unlink(minute.file_path, () => {});
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
