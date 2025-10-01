const router = require('express').Router();
const controller = require('./contactController');
const verifyContactForm = require('../../middlewares/verifyContactForm');

router.post('/sendEmail', 
    verifyContactForm.inputValidation,
    controller.sendContactMail
);

module.exports = router;