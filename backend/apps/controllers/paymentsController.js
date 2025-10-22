// /controllers/paymentsController.js
const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/paymentModel');
const Member = require('../models/memberModel'); // if you have one

// 1️⃣ Create checkout session
exports.createCheckoutSession = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ error: 'Email is required' });

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: email,
      line_items: [
        {
          price_data: {
            currency: 'aud',
            product_data: {
              name: 'Pyrmont Action Membership',
              description: 'Annual membership payment',
            },
            unit_amount: 1000, // $10 AUD
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.FRONTEND_BASE_URL}/#/member-dashboard?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.FRONTEND_BASE_URL}/#/payment-cancelled`,
    });

    await Payment.create({
      email,
      amount: 1000,
      sessionId: session.id,
      status: 'pending',
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create session' });
  }
};

// 2️⃣ Stripe webhook handler — must use raw body middleware in app.js
exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const sessionId = session.id;
    const email = session.customer_email;
    const paidAt = new Date();
    const expiresAt = new Date(paidAt);
    expiresAt.setFullYear(expiresAt.getFullYear() + 1);

    try {
      // update payment
      await Payment.findOneAndUpdate(
        { sessionId },
        { status: 'paid', paidAt, expiresAt },
        { new: true }
      );

      // optional: update member expiry
      if (Member) {
        await Member.findOneAndUpdate(
          { email },
          {
            $set: {
              'membership.isActive': true,
              'membership.expiresAt': expiresAt,
              'membership.lastPaidAt': paidAt,
            },
          },
          { upsert: false }
        );
      }

      console.log(`✅ Payment confirmed for ${email}, expires ${expiresAt}`);
    } catch (e) {
      console.error('Post-payment update failed:', e);
    }
  }

  res.status(200).json({ received: true });
};

// 3️⃣ Verify endpoint (dashboard uses this)
exports.verifySession = async (req, res) => {
  try {
    const { session_id } = req.query;
    if (!session_id) return res.status(400).json({ error: 'session_id required' });

    const payment = await Payment.findOne({ sessionId: session_id });
    if (!payment) return res.status(404).json({ error: 'Not found' });

    res.json(payment);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Verification failed' });
  }
};

