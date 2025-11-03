const router = require('express').Router();
const controller = require('../controllers/joinSessionController');
const validation = require('../validations/userValidation');


router.post('/',
    validation.inputValidatorJoinUs, 
    controller.join
);


module.exports = router;