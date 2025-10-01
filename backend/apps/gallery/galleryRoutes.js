const galleryController = require('./galleryController') 
const router = require('express').Router();

router.get('/', galleryController.getAllGalleryImage)



module.exports = router;
