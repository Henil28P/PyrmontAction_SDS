const mongoose = require('mongoose');
const slugify = require('slugify');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, unique: true },
  description: String,
  location: String,
  starts_at: { type: Date, required: true },
  ends_at: Date,
  cover_image_url: String,
  status: { type: String, enum: ['draft', 'pending_review', 'published'], default: 'draft' },
  created_by: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

EventSchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model('Event', EventSchema);
