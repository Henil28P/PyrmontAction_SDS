// apps/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const { createCheckoutSession, confirmPayment } = require('../controllers/paymentController');

// POST /api/payments/create-checkout-session
router.post('/create-checkout-session', createCheckoutSession);

// POST /api/payments/confirm
router.post('/confirm', confirmPayment);

module.exports = router;
