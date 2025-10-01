const projectController = require('./projectController');
const router = require('express').Router();

router.get('/open', projectController.openProjects);
router.get('/closed', projectController.closedProjects);
router.get('/:id', projectController.getProject);

module.exports = router;
