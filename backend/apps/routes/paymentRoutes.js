// apps/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createCheckoutSession, confirmPayment, getPaymentStatus } = require('../controllers/paymentController');

// POST /api/payments/create-checkout-session
router.post('/create-checkout-session', createCheckoutSession);

// POST /api/payments/confirm
router.post('/confirm', confirmPayment);
router.get('/status', getPaymentStatus);
module.exports = router;
