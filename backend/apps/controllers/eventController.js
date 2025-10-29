const Event = require('../models/eventModel');

module.exports = {
  // Create event with optional file upload
  async createEvent (req, res) {
    try {
      const { title, description, location, startDate, endDate, status } = req.body;

      // Create event data
      const eventData = { title, description, location };
      eventData.startDate = new Date(startDate);
      eventData.endDate = new Date(endDate);

      if (req.file) { // Uploa
        eventData.imageUrl = `/uploads/events/${req.file.filename}`;
        eventData.imageName = req.file.originalname;
      }

      const event = new Event(eventData);
      await event.save();

      res.status(201).json(event);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
},

  // Read events that are not pass the current date
  async getUpcomingEvents(_req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to midnight local time
      const futureEvents = await Event.find({ startDate: { $gte: today } }).sort({ startDate: 1 });
      res.status(200).json(futureEvents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  },
 
  // Read published events that are upcoming
  async getPublishedEvents(_req, res) {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // Set to midnight local time
      const publishedEvents = await Event.find({ startDate: { $gte: today }, status: 'published' }).sort({ startDate: 1 });
      res.status(200).json(publishedEvents);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
  },

  // Read events that are all passed 
  async getCompletedEvents(_req, res) {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set to midnight local time
        const completedEvents = await Event.find({ endDate: { $lt: today }, status: 'published' }).sort({ endDate: -1 });
        res.status(200).json(completedEvents);
      } catch (err) {
        res.status(500).json({ message: err.message });
      }
  },

  //Read single event by ID
  async getEvent(req, res) {
    try {
      const event = await Event.findById(req.params.id);
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.status(200).json(event);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Update event
  async updateEvent(req, res) {
    try {
      const { id } = req.params;
      const { title, description, location, startDate, endDate, status } = req.body;
      const eventData = { title, description, location, status };
      eventData.startDate = new Date(startDate);
      eventData.endDate = new Date(endDate);
      if (req.file) {
        eventData.imageUrl = `/uploads/events/${req.file.filename}`;
        eventData.imageName = req.file.originalname;
      }

      const updatedEvent = await Event.findByIdAndUpdate(id, eventData, { new: true });
      if (!updatedEvent) return res.status(404).json({ message: 'Not found' });
      res.status(200).json(updatedEvent);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async publishEvent(req, res) {
    try {
      const { id } = req.params;
      const updatedEvent = await Event.findByIdAndUpdate(id, { status: 'published' }, { new: true });
      if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });
      res.status(200).json(updatedEvent);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Delete event (following meeting minutes pattern)
  async deleteEvent(req, res) {
    try {
      const deletedEvent = await Event.findByIdAndDelete(req.params.id);
      if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });
      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};

