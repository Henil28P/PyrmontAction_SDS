// backend/apps/routes/adminMembersRoutes.js
const express = require('express');
const router = express.Router();
const { getAllMembers } = require('../controllers/adminMembersController');
const { verifyAdmin } = require('../middlewares/authMiddleware');

// Admin can fetch all members
router.get('/', verifyAdmin, getAllMembers);

module.exports = router;
