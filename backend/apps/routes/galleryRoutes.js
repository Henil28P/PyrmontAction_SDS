const controller = require('../controllers/galleryController'); 
const router = require('express').Router();
const jwtAuth = require('../middlewares/jwtMiddleware');
const { upload } = require('../middlewares/fileUpload');

// Upload single gallery image
router.post('/',
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    upload.galleryImage,
    controller.uploadGalleryImage
);

// Read
router.get('/', controller.getGalleryImages);

// Update
router.put('/:id',
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    upload.galleryImage,
    controller.updateGalleryImage
);

// Delete
router.delete('/:id',
    jwtAuth.verifyToken,
    jwtAuth.verifyRole(['admin', 'editor']),
    controller.deleteGalleryImage
);

module.exports = router;
