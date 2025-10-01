const router = require('express').Router();
const { upload } = require('./upload');
const ctrl = require('./meetingMinutesController');
const { requireAuth, requireRole } = require('../middleware/roles');

// Public
router.get('/minutes', ctrl.listPublic);
router.get('/minutes/:id/download', ctrl.downloadPublic);

// Admin
router.post('/admin/minutes/upload', requireAuth, requireRole('Admin'),
  upload.single('pdf'), ctrl.uploadPrivate);

router.patch('/admin/minutes/:id/publish', requireAuth, requireRole('Admin'), ctrl.publish);
router.delete('/admin/minutes/:id', requireAuth, requireRole('Admin'), ctrl.remove);

module.exports = router;
