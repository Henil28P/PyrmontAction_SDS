const router = require('express').Router();
const controller = require('../controllers/joinSessionController');

router.delete('/:id', controller.deleteJoinSession);


module.exports = router;