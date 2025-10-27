import express from 'express';
import Member from '../models/member.model.js';
import { requireAdmin } from '../middleware/auth.js';

const router = express.Router();

router.get('/members', requireAdmin, async (req, res) => {
  const { status, q } = req.query;
  const filter = {};

  if (q) {
    filter.$or = [{ name: new RegExp(q, 'i') }, { email: new RegExp(q, 'i') }];
  }

  if (status === 'active') {
    filter.membershipExpiry = { $gte: new Date() };
  } else if (status === 'expired') {
    filter.$or = [{ membershipExpiry: { $lt: new Date() } }, { membershipExpiry: null }];
  }

  const members = await Member.find(filter).sort({ membershipExpiry: -1 }).lean();
  res.json(members);
});

export default router;
