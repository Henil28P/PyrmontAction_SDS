const userController = require('./userController')
const router = require('express').Router();
const userAuth = require('./userAuthentication')

router.post('/api/submitForm', function(req, res){
    userController.register(req, res, req.db);
})
    
router.post('/api/login', function(req, res){
    userController.login(req, res, req.db);
})

router.get('/api/admin', userAuth.verifyToken, function(req, res){
    userController.displayAdminDetails(req, res, req.db);
})

router.get('/api/members', userAuth.verifyToken, function(req, res){
    userController.displayMemberDetails(req, res, req.db);
})



module.exports = router;
