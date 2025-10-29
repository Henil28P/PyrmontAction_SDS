const router = require('express').Router();
const controller = require('../controllers/eventController');
const jwtAuth = require('../middlewares/jwtMiddleware');
const { upload } = require('../middlewares/fileUpload');

router.post('/', 
    jwtAuth.verifyToken, 
    jwtAuth.verifyRole(['admin', 'editor']), 
    upload.eventImage, 
    controller.createEvent
);

router.get('/upcoming', 
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.getUpcomingEvents
);

router.get('/published',
    controller.getPublishedEvents
);

router.get('/completed',
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.getCompletedEvents
);

router.get('/:id',
    controller.getEvent
);

router.put('/:id',
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    upload.eventImage,
    controller.updateEvent
);

router.put('/:id/publish',
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.publishEvent
);

router.delete('/:id',
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.deleteEvent
);

module.exports = router;
