const Stripe = require('stripe');
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
const Payment = require('../models/paymentModel');
require('dotenv').config();

exports.createCheckoutSession = async (req, res) => {
    try {
      const { email } = req.body;
  
      console.log("=== DEBUG START ===");
      console.log("Email:", email);
      console.log("Stripe key loaded:", !!process.env.STRIPE_SECRET_KEY);
      console.log("Stripe key starts with:", process.env.STRIPE_SECRET_KEY?.slice(0, 10));
      console.log("=== DEBUG END ===");
  
      if (!email) {
        return res.status(400).json({ error: 'Email is required' });
      }
  
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
              unit_amount: 1000, // 10 AUD
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${process.env.FRONTEND_BASE_URL}/#/member-dashboard`,
        cancel_url: `${process.env.FRONTEND_BASE_URL}/#/member-dashboard`,
      });
  
      await Payment.create({
        email,
        amount: 10,
        sessionId: session.id,
        status: 'pending',
      });
  
      res.json({ url: session.url });
    } catch (error) {
      console.error("Stripe session error:", error.message);
      res.status(500).json({ error: "Unable to create checkout session" });
    }
  };
  
