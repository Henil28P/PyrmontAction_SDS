// /models/paymentModel.js
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, index: true },
    amount: { type: Number, required: true }, // store in cents (e.g., 1000 = $10)
    sessionId: { type: String, required: true, unique: true, index: true },
    status: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
      index: true,
    },
    paidAt: { type: Date },
    expiresAt: { type: Date },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);

