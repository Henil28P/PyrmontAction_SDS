const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentContoller');

// Route for creating checkout session
router.post('/join-checkout', controller.createJoinCheckout);
router.post('/renew-checkout', controller.createRenewCheckout);

// Note: Stripe webhook route is handled directly in server.js before express.json() middleware

module.exports = router;