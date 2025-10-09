// apps/models/paymentModel.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    sessionId: { type: String, required: true },
    email: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'aud' },
    status: { type: String, default: 'pending' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
