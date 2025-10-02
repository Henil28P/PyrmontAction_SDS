const router = require('express').Router();
const ctrl = require('./galleryController');
const { requireAuth, requireRole } = require('../middleware/roles');

// Public
router.get('/gallery', ctrl.getImages);

// Admin
router.post('/admin/gallery', requireAuth, requireRole('Admin'), ctrl.addImage);
router.delete('/admin/gallery/:id', requireAuth, requireRole('Admin'), ctrl.deleteImage);

module.exports = router;
