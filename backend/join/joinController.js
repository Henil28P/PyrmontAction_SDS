const bcrypt = require("bcrypt");
const Stripe = require("stripe");
const RegistrationIntent = require("../models/RegistrationIntent");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: "2024-06-20" });

exports.startJoin = async (req, res) => {
  try {
    const { email, password, firstName, lastName, mobilePhone, streetName, city, state, postcode } = req.body || {};
    if (!email || !password) return res.status(400).json({ message: "Email & password required" });

    // quick log to verify env in runtime (safe truncation)
    console.log("JOIN start",
      { DEMO_MODE: process.env.DEMO_MODE, PRICE_ID: process.env.PRICE_ID, hasKey: !!process.env.STRIPE_SECRET_KEY }
    );

    const passwordHash = await bcrypt.hash(password, 12);
    const intent = await RegistrationIntent.create({
      email, passwordHash, firstName, lastName, mobilePhone, streetName, city, state, postcode,
      status: "awaiting_payment"
    });

    // DEMO shortcut
    if (String(process.env.DEMO_MODE).toLowerCase() === "true") {
      const successUrl = `${process.env.JOIN_URL}?status=success&intentId=${intent._id}`;
      return res.json({ url: successUrl });
    }

    // Real Stripe Checkout
    if (!process.env.STRIPE_SECRET_KEY || !process.env.PRICE_ID) {
      return res.status(500).json({ message: "Stripe not configured" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer_email: email,
      line_items: [{ price: process.env.PRICE_ID, quantity: 1 }],
      metadata: { intentId: intent._id.toString(), email },
      success_url: `${process.env.JOIN_URL}?status=success&sid={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.JOIN_URL}?status=cancel`,
    });

    res.json({ url: session.url });
  } catch (e) {
    console.error("join/start error:", e);
    res.status(500).json({ message: "Unable to start join" });
  }
};
