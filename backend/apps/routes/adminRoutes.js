const express = require('express');
const router = express.Router();
const Member = require('../models/memberModel');

// === Admin: Get all members with expiry filter ===
router.get('/members', async (req, res) => {
  try {
    const { q, status } = req.query;
    const query = {};

    // Search by name or email
    if (q) {
      query.$or = [
        { name: new RegExp(q, 'i') },
        { email: new RegExp(q, 'i') },
      ];
    }

    const members = await Member.find(query).select('name email membershipExpiry');

    const now = new Date();
    const filtered = members.filter((m) => {
      if (status === 'active') return m.membershipExpiry && new Date(m.membershipExpiry) >= now;
      if (status === 'expired') return !m.membershipExpiry || new Date(m.membershipExpiry) < now;
      return true;
    });

    res.json(filtered);
  } catch (error) {
    console.error('Failed to fetch members:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
