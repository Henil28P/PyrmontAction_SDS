const router = require('express').Router();
const ctrl = require('./eventController');
const { requireAuth, requireRole } = require('../middleware/roles');

// Public
router.get('/events', ctrl.getPublic);
router.get('/events/:id', ctrl.getOnePublic);

// CMS/Admin
router.post('/cms/events', requireAuth, requireRole('ContentManager','Admin'), ctrl.create);
router.put('/cms/events/:id', requireAuth, requireRole('ContentManager','Admin'), ctrl.update);
router.patch('/cms/events/:id/publish', requireAuth, requireRole('Admin'), ctrl.publish);
router.delete('/cms/events/:id', requireAuth, requireRole('Admin'), ctrl.remove);

module.exports = router;
