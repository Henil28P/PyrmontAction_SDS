const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const JoinSession = require('../models/joinSessionModel');
const userController = require('./userController');

module.exports = {
    async createCheckout(req, res) {
        try {
            const { joinSessionID } = req.body;
            
            // Verify the join session exists
            const joinSession = await JoinSession.findById(joinSessionID);
            if (!joinSession) {
                return res.status(404).json({ message: 'Session not found or expired.' });
            }
            
            // Create Stripe checkout session
            const checkoutSession = await stripe.checkout.sessions.create({
                mode: 'payment',
                payment_method_types: ['card'],
                customer_email: joinSession.email,
                line_items: [{
                    price_data: {
                        currency: 'aud',
                        product_data: {
                            name: 'Membership Registration',
                            description: 'Annual membership fee',
                        },
                        unit_amount: 25 * 100, // $25.00 in cents
                    },
                    quantity: 1,
                }],
                metadata: {
                    joinSessionID: joinSessionID.toString(),
                },
                success_url: `${process.env.FRONTEND_BASE_URL}/login?status=success`,
                cancel_url: `${process.env.FRONTEND_BASE_URL}/join?status=cancelled&sessionID=${joinSessionID}`,
            });

            joinSession.sessionID = checkoutSession.id;
            await joinSession.save();
            
            return res.status(200).json({
                message: 'Checkout session created successfully.',
                checkoutUrl: checkoutSession.url
            });
            
        } catch (error) {
            console.error('Error creating checkout session:', error);
            return res.status(500).json({ 
                message: 'Failed to create checkout session.', 
                error: error.message 
            });
        }
    },

    async handleWebhook(req, res) {
        const sig = req.headers['stripe-signature'];
        let event;

        try {
            // Verify webhook signature
            event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET);
        } catch (err) {
            console.error('Webhook signature verification failed:', err.message);
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }

        // Handle the event
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const joinSessionID = session.metadata.joinSessionID;

            try {
                // Find the temporary join session
                const joinSession = await JoinSession.findById(joinSessionID);
                if (!joinSession) {
                    console.error('Join session not found:', joinSessionID);
                    return res.status(404).send('Join session not found');
                }
                if (joinSession.sessionID !== session.id) {
                    console.error('Session ID mismatch for join session:', joinSessionID);
                    return res.status(400).send('Session ID mismatch');
                }
                const customer = await stripe.customers.create({
                    email: joinSession.email,
                    name: `${joinSession.firstName} ${joinSession.lastName}`,
                });

                userController.createMember(joinSession, customer.id);

                await joinSession.deleteOne();
                
                console.log('Payment successful for:', joinSession.email);
            } catch (error) {
                console.error('Error processing successful payment:', error);
                return res.status(500).send('Error processing payment');
            }
        } else if (event.type === 'checkout.session.expired') {
            const session = event.data.object;
            const joinSessionID = session.metadata.joinSessionID;
            
            try {
                // Find and delete the temporary join session since checkout was cancelled/expired
                const joinSession = await JoinSession.findById(joinSessionID);
                if (joinSession) {
                    await joinSession.deleteOne();
                    console.log('Cleaned up expired join session for:', joinSession.email);
                } else {
                    console.log('Join session already cleaned up or not found:', joinSessionID);
                }
            } catch (error) {
                console.error('Error cleaning up expired join session:', error);
                return res.status(500).send('Error cleaning up session');
            }
        }

        res.status(200).send('Webhook handled');
    }
};