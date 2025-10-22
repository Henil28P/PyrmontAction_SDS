// /routes/paymentsRoutes.js
const express = require('express');
const router = express.Router();
const paymentsController = require('../controllers/paymentsController');

router.post('/create-checkout-session', paymentsController.createCheckoutSession);
router.post('/webhook', express.raw({ type: 'application/json' }), paymentsController.webhook);
router.get('/verify', paymentsController.verifySession);

module.exports = router;
