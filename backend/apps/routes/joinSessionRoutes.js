const router = require('express').Router();
const controller = require('../controllers/joinSessionController');
const validation = require('../validations/userValidation');


router.post('/',
    validation.inputValidatorJoinUs, 
    controller.createJoinSession
);

router.delete('/:id', controller.deleteJoinSession);


module.exports = router;