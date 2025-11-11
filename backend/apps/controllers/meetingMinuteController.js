const MeetingMinute = require('../models/meetingMinuteModel');

module.exports = {
  // *** Create ***
  // Handle file upload and create meeting minute
  async createMeeting(req, res) {   
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    try {
      const { title, note, status } = req.body;
      const meetingData = { title, note, status };

      // If file was uploaded, process it
      if (req.file) {
        // Add file info to meeting minute
        meetingData.fileUrl = `/uploads/meeting-minutes/${req.file.filename}`;
        meetingData.filename = req.file.originalname;
      }

      const meeting = new MeetingMinute(meetingData);
      await meeting.save();

      res.status(201).json(meeting);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // *** Read ***
  // List published
  async getPublishedMeeting(_req, res) {
    try {
      const publishedMinutes = await MeetingMinute.find({ status: 'published' }).sort({ createdAt: -1 });
      res.json(publishedMinutes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // List all
  async getAllMeetings(_req, res) {
    try {
      const allMinutes = await MeetingMinute.find().sort({ createdAt: -1 });
      res.json(allMinutes);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Update
  // Publish
  async publishMeeting(req, res) {
    try {
      const meeting = await MeetingMinute.findByIdAndUpdate(
        req.params.id,
        { status: 'published' },
        { new: true }
      );
      if (!meeting) return res.status(404).json({ message: 'Not found' });
      res.json(meeting);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Update an existing meeting minute
  async updateMeeting(req, res) {
    try {
      console.log('Update request body:', req.body);
      const updatedMeeting = await MeetingMinute.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      
      console.log('Updated meeting:', updatedMeeting);
      if (!updatedMeeting) return res.status(404).json({ message: 'Not found' });
      res.json(updatedMeeting);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  },

  async updateMeetingWithFile(req, res) {   
    console.log('Request body:', req.body);
    console.log('Uploaded file:', req.file);
    try {
      const { title, note, status } = req.body;
      const meetingData = { title, note, status };

      // If file was uploaded, process it
      if (req.file) {
        // Add file info to meeting minute
        meetingData.fileUrl = `/uploads/meeting-minutes/${req.file.filename}`;
        meetingData.filename = req.file.originalname;
      }

      const updatedMeeting = await MeetingMinute.findByIdAndUpdate(req.params.id, meetingData, { new: true });
      res.status(200).json(updatedMeeting);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Upload file to existing meeting minute
  async uploadFile(req, res) {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
      const meeting = await MeetingMinute.findById(req.params.id);
      
      if (!meeting) {
        return res.status(404).json({ message: 'Meeting minute not found' });
      }

      meeting.fileUrl = `/uploads/meeting-minutes/${req.file.filename}`;
      meeting.filename = req.file.originalname;

      await meeting.save();

      res.status(200).json({
        meeting, message: 'File uploaded successfully'
      });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  // Delete
  async deleteMeeting(req, res) {
    try {
      const deletedMeeting = await MeetingMinute.findByIdAndDelete(req.params.id);
      if (!deletedMeeting) return res.status(404).json({ message: 'Meeting not found' });
      res.status(200).json({ message: 'Meeting deleted successfully' });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },
};
