const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentContoller');

// Route for creating checkout session
router.post('/create-checkout', paymentController.createCheckout);

// Route for Stripe webhook (raw body needed)
router.post('/webhook/stripe', express.raw({type: 'application/json'}), paymentController.handleWebhook);

module.exports = router;