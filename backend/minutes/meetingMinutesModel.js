const mongoose = require('mongoose');

const MeetingMinutesSchema = new mongoose.Schema({
  title: { type: String, required: true },
  meeting_date: { type: Date, required: true },
  file_path: { type: String, required: true },
  file_size: { type: Number, required: true },
  status: { type: String, enum: ['private', 'published'], default: 'private' },
  uploaded_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('MeetingMinute', MeetingMinutesSchema);
