const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: String,
    location: String,
    startDate: { type: Date, required: true },
    endDate: Date,
    imageUrl: String, // URL or filename for the event image/file
    imageName: String, // Store original filename for display
    status: { type: String, enum: ['draft', 'upcoming', 'cancelled', 'completed'], default: 'draft' },
  },
  { timestamps: true }
);

eventSchema.pre('save', function (next) {
  if (this.endDate && this.startDate > this.endDate) {
    return next(new Error('End date must be after start date'));
  }
  next();
});

const Event = mongoose.model('Event', eventSchema);
module.exports = Event;
