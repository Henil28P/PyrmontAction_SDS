// backend/apps/controllers/adminMembersController.js
const Member = require('../models/memberModel');

exports.getAllMembers = async (req, res) => {
  try {
    const { q, status } = req.query;
    const filter = {};

    if (q) {
      filter.$or = [
        { name: { $regex: q, $options: 'i' } },
        { email: { $regex: q, $options: 'i' } },
      ];
    }

    const members = await Member.find(filter);

    const result = members.map((m) => {
      const expiry = m.membership?.expiresAt;
      const isActive = expiry && new Date(expiry) > new Date();
      return {
        _id: m._id,
        name: m.name,
        email: m.email,
        membershipExpiry: expiry,
        status: isActive ? 'active' : 'expired',
      };
    });

    const filtered = status && status !== 'all'
      ? result.filter((m) => m.status === status)
      : result;

    res.json(filtered);
  } catch (err) {
    console.error('Error fetching members:', err);
    res.status(500).json({ error: 'Failed to load members' });
  }
};
