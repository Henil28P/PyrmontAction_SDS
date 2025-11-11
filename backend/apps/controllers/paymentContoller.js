const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const JoinSession = require('../models/joinSessionModel');
const User = require('../models/userModel');
const userController = require('./userController');
const joinSessionController = require('./joinSessionController');

module.exports = {
    async createJoinCheckout(req, res) {
        const joinSession = await joinSessionController.createJoinSession(req.body);

        // Check if createJoinSession returned an error
        if (joinSession.status && joinSession.message) {
            return res.status(joinSession.status).json({ message: joinSession.message });
        }

        try {
            // Call createJoinSession to handle session creation and validation

            // Create Stripe checkout session
            const checkoutSession = await stripe.checkout.sessions.create({
                mode: 'payment',
                payment_method_types: ['card'],
                customer_email: req.body.email,
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
                payment_intent_data: {
                    receipt_email: req.body.email, // Send receipt to customer email
                },
                metadata: {
                    type: 'join',
                    joinSessionID: joinSession._id.toString(),
                },
                success_url: `${process.env.FRONTEND_BASE_URL}/login?status=success`,
                cancel_url: `${process.env.FRONTEND_BASE_URL}/joinus?status=cancelled&sessionID=${joinSession._id}`,
            });

            // Save the Stripe session ID to the join session
            joinSession.sessionID = checkoutSession.id;
            await joinSession.save();

            return res.status(200).json({
                message: 'Checkout session created successfully.',
                checkoutUrl: checkoutSession.url
            });

        } catch (error) {
            console.error('Error creating checkout session:', error);
            await joinSession.deleteOne();
            return res.status(500).json({ 
                message: 'Failed to create checkout session.', 
                error: error.message 
            });
        }
    },

    async createRenewCheckout(req, res) {
        try {
            // Verify the user session exists
            const user = await User.findById(req.user._id);
            if (!user) {
                return res.status(404).json({ message: 'User not found or expired.' });
            }
            
            // Create Stripe customer if it doesn't exist
            if (!user.stripeCustomerID) {
                console.log('Creating new Stripe customer for user:', user.email);
                const customer = await stripe.customers.create({
                    email: user.email,
                    name: `${user.firstName} ${user.lastName}`,
                    metadata: {
                        userID: user._id.toString()
                    }
                });
                user.stripeCustomerID = customer.id;
                await user.save();
                console.log('Stripe customer created:', customer.id);
            }
            
            // Create Stripe checkout session
            const checkoutSession = await stripe.checkout.sessions.create({
                mode: 'payment',
                payment_method_types: ['card'],
                customer: user.stripeCustomerID,
                line_items: [{
                    price_data: {
                        currency: 'aud',
                        product_data: {
                            name: 'Annual Membership Renewal',
                            description: 'Current Membership expires on '+ (new Date(user.memberExpiryDate)).toLocaleDateString('en-AU'),
                        },
                        unit_amount: 25 * 100, // $25.00 in cents
                    },
                    quantity: 1,
                }],
                payment_intent_data: {
                    receipt_email: user.email, // Send receipt to customer email
                },
                metadata: {
                    type: 'renew',
                    userID: user._id.toString(),
                },
                success_url: `${process.env.FRONTEND_BASE_URL}/dashboard/member?status=success`,
                cancel_url: `${process.env.FRONTEND_BASE_URL}/dashboard/member?status=cancelled`,
            });
      
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

        const session = event.data.object;
        // Handle the event
        if (event.type === 'checkout.session.completed' && session.metadata.type === 'join') {
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
        } else if (event.type === 'checkout.session.completed' && session.metadata.type === 'renew') {
            const userID = session.metadata.userID;
            try {
                // Find the user
                const user = await User.findById(userID);
                if (!user) {
                    console.error('User not found:', userID);
                    return res.status(404).send('User not found');
                }
                if (user.stripeCustomerID !== session.customer) {
                    console.error('Customer ID mismatch for user:', userID);
                    return res.status(400).send('Customer ID mismatch');
                }

                // Calculate new expiry date and update user object
                const expiryDate = user.memberExpiryDate ? user.memberExpiryDate : new Date();
                user.memberExpiryDate = userController.calculateMemberExpiryDate(expiryDate);
                await user.save();

                console.log('Renewal successful for:', user.email);
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