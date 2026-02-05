const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const Ad = require('../models/Ad');
const Card = require('../models/Card');
const { emitToAdmin } = require('../utils/socket');

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: Payment method and transaction management
 */

/**
 * @swagger
 * /api/payments/cards:
 *   post:
 *     summary: Add a new payment card
 *     description: Save a credit/debit card for the authenticated user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - cardHolderName
 *               - cardNumber
 *               - expiryDate
 *               - cvv
 *             properties:
 *               cardHolderName:
 *                 type: string
 *               cardNumber:
 *                 type: string
 *               expiryDate:
 *                 type: string
 *                 example: "12/25"
 *               cvv:
 *                 type: string
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Card added successfully
 *       400:
 *         description: Missing fields
 *       500:
 *         description: Server error
 */
router.post('/cards', protect, async (req, res) => {
    try {
        const { cardHolderName, cardNumber, expiryDate, cvv, type } = req.body;

        // Basic validation
        if (!cardHolderName || !cardNumber || !expiryDate || !cvv) {
            return res.status(400).json({ message: 'Please enter all fields' });
        }

        const newCard = new Card({
            user: req.user.id,
            cardHolderName,
            cardNumber,
            expiryDate,
            cvv,
            type: type || 'Card'
        });

        const card = await newCard.save();
        res.json(card);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @swagger
 * /api/payments/cards:
 *   get:
 *     summary: Get user cards
 *     description: Retrieve all saved payment cards for the authenticated user
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of cards
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   cardHolderName:
 *                     type: string
 *                   cardNumber:
 *                     type: string
 *                   type:
 *                     type: string
 *                   expiryDate:
 *                     type: string
 *       500:
 *         description: Server error
 */
router.get('/cards', protect, async (req, res) => {
    try {
        const cards = await Card.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(cards);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

/**
 * @swagger
 * /api/payments/stripe/create-checkout-session:
 *   post:
 *     summary: Create a Stripe Checkout Session for an Ad
 *     tags: [Payments]
 *     security:
 *       - bearerAuth: []
 */
router.post('/stripe/create-checkout-session', protect, async (req, res) => {
    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const { adId } = req.body;
        const ad = await Ad.findById(adId).populate('user');

        if (!ad) return res.status(404).json({ message: 'Ad not found' });
        if (ad.user._id.toString() !== req.user.id) return res.status(401).json({ message: 'Not authorized' });

        // Pricing logic
        let amount = 0;
        if (ad.planLevel === 'GROWTH') amount = 30;
        if (ad.planLevel === 'BUSINESS') amount = 100;

        if (amount === 0) {
            ad.paymentStatus = 'PAID';
            ad.published = true;
            ad.paidAt = new Date();
            await ad.save();
            return res.json({ success: true, message: 'Ad published (Free/Basic)' });
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: ad.user.email,
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${ad.planLevel} Plan - ${ad.content?.title || 'Ad Listing'}`,
                    },
                    unit_amount: amount * 100, // INR uses 2 decimal places (Paise)
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&adId=${ad._id}`,
            cancel_url: `${frontendUrl}/payment-cancel`,
            metadata: {
                adId: ad._id.toString(),
                planLevel: ad.planLevel
            }
        });

        ad.stripeSessionId = session.id;
        ad.amount = amount;
        await ad.save();

        res.json({ url: session.url });
    } catch (err) {
        console.error('--- STRIPE SESSION ERR START ---');
        console.error('Error Object:', err);
        console.error('Stack Trace:', err.stack);
        console.error('--- STRIPE SESSION ERR END ---');
        res.status(500).json({ message: 'Failed to create payment', error: err.message });
    }
});

/**
 * @swagger
 * /api/payments/status/{adId}:
 *   get:
 *     summary: Check payment status of an Ad
 *     tags: [Payments]
 */
router.get('/status/:adId', protect, async (req, res) => {
    try {
        const ad = await Ad.findById(req.params.adId);
        if (!ad) return res.status(404).json({ message: 'Ad not found' });

        res.json({
            status: ad.paymentStatus,
            published: ad.published,
        });
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
});

/**
 * @swagger
 * /api/payments/stripe/verify-session:
 *   post:
 *     summary: Manually verify a Stripe Checkout Session (Fail-safe)
 *     tags: [Payments]
 */
router.post('/stripe/verify-session', protect, async (req, res) => {
    try {
        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const { sessionId } = req.body;

        if (!sessionId) return res.status(400).json({ message: 'Session ID is required' });

        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status === 'paid') {
            const { adId, planId, userId, type } = session.metadata;

            // 1. Handle Plan Subscription
            if (type === 'PLAN_SUBSCRIPTION' || planId) {
                const Plan = require('../models/Plan');
                const Subscription = require('../models/Subscription');
                const User = require('../models/User');

                const existingSub = await Subscription.findOne({ stripeSessionId: sessionId });
                if (!existingSub) {
                    const plan = await Plan.findById(planId);
                    if (plan) {
                        const endDate = new Date();
                        endDate.setDate(endDate.getDate() + plan.durationInDays);

                        await Subscription.create({
                            user: userId || req.user.id,
                            plan: plan._id,
                            endDate,
                            status: 'ACTIVE',
                            activatedBy: 'STRIPE',
                            stripeSessionId: session.id,
                            stripePaymentIntentId: session.payment_intent
                        });
                        console.log(`Manually activated plan ${plan.name} for user ${userId}`);
                    }
                }
            }
            // 2. Handle Individual Ad Payment
            else if (adId) {
                const ad = await Ad.findById(adId);
                if (ad && ad.paymentStatus !== 'PAID') {
                    ad.paymentStatus = 'PAID';
                    ad.published = true;
                    ad.paidAt = new Date();
                    ad.stripePaymentIntentId = session.payment_intent;
                    ad.stripeSessionId = session.id;
                    await ad.save();
                    console.log(`Manually confirmed payment for ad ${adId}`);
                }
            }

            return res.json({ success: true, message: 'Payment verified and status updated.' });
        }

        res.status(400).json({ success: false, message: 'Payment not completed.' });
    } catch (err) {
        console.error('Verify Session Error:', err);
        res.status(500).json({ message: 'Verification failed', error: err.message });
    }
});

module.exports = router;
