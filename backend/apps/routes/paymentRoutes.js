const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentContoller');
const jwtAuth = require('../middlewares/jwtMiddleware');

// Route for creating checkout session
router.post('/join-checkout', controller.createJoinCheckout);

// Route for creating renew checkout session
// Requires authentication for user identification
router.get(
    '/renew-checkout/', 
    jwtAuth.verifyToken,
    controller.createRenewCheckout
);

module.exports = router;