const express = require('express');
const router = express.Router();
const controller = require('../controllers/paymentContoller');

// Route for creating checkout session
router.post('/create-checkout', controller.createCheckout);

// Note: Stripe webhook route is handled directly in server.js before express.json() middleware

module.exports = router;