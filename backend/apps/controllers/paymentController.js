// apps/controllers/paymentController.js
const Stripe = require('stripe');
const Payment = require('../models/paymentModel');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// Create Checkout Session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: { name: 'Pyrmont Action Membership' },
            unit_amount: 2500, // $25.00 in cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.FRONTEND_BASE_URL}/member-dashboard?paid=true`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/member-dashboard`,
    });

    // Save payment record
    await Payment.create({
      sessionId: session.id,
      email,
      amount: 2500,
      currency: 'aud',
      status: 'pending',
    });

    res.json({ id: session.id, url: session.url });
  } catch (error) {
    console.error('Error creating Stripe session:', error);
    res.status(500).json({ error: 'Unable to create Stripe session' });
  }
};

// Confirm payment manually (no webhook needed)
exports.confirmPayment = async (req, res) => {
  try {
    const { session_id } = req.body;
    if (!session_id) return res.status(400).json({ error: 'session_id required' });

    const session = await stripe.checkout.sessions.retrieve(session_id);
    const paymentStatus = session.payment_status;
    const email =
      session.customer_details?.email || session.metadata?.email || 'unknown';

    await Payment.findOneAndUpdate(
      { sessionId: session_id },
      { status: paymentStatus },
      { new: true }
    );

    res.json({
      ok: paymentStatus === 'paid',
      email,
      status: paymentStatus,
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ error: 'Unable to confirm payment' });
  }
};
