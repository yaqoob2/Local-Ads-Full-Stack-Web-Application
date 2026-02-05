const express = require('express');
const router = express.Router();
const {
    getPlans,
    createSubscription,
    getMySubscriptions,
    cancelSubscription,
} = require('../controllers/subscription.controller');
const { protect } = require('../middleware/auth');

/**
 * @swagger
 * tags:
 *   name: Subscription
 *   description: Plans and Subscriptions
 */

/**
 * @swagger
 * /api/subscription/plans:
 *   get:
 *     summary: Get all subscription plans
 *     tags: [Subscription]
 *     responses:
 *       200:
 *         description: List of plans
 */
router.get('/plans', getPlans);

/**
 * @swagger
 * /api/subscription:
 *   post:
 *     summary: Create a new subscription
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [planId]
 *             properties:
 *               planId: { type: string }
 *     responses:
 *       201:
 *         description: Subscription created
 */
router.post('/', protect, createSubscription);

/**
 * @swagger
 * /api/subscription/stripe/create-checkout-session:
 *   post:
 *     summary: Create a Stripe Checkout Session for a Plan
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 */
router.post('/stripe/create-checkout-session', protect, async (req, res) => {
    try {
        console.log('--- STRIPE SUBSCRIPTION REQUEST START ---');
        console.log('Body:', req.body);
        console.log('User:', req.user ? req.user._id : 'No User');

        const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
        const Plan = require('../models/Plan');
        const { planId } = req.body;

        // Find plan by ID or Name
        let plan;
        if (planId.match(/^[0-9a-fA-F]{24}$/)) {
            plan = await Plan.findById(planId);
        }
        if (!plan) {
            plan = await Plan.findOne({ name: { $regex: new RegExp(`^${planId}$`, 'i') } });
        }

        if (!plan) return res.status(404).json({ message: 'Plan not found' });

        // Free plan - handle direct activation
        if (plan.price === 0) {
            // Re-use the existing logic or return a flag for frontend to call createSubscription
            return res.json({ success: true, message: 'Free plan, use standard activation' });
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            customer_email: req.user.email,
            line_items: [{
                price_data: {
                    currency: 'usd',
                    product_data: {
                        name: `${plan.name} Subscription Plan`,
                        description: (plan.features || []).join(', '),
                    },
                    unit_amount: plan.price * 100, // INR uses 2 decimal places (Paise)
                },
                quantity: 1,
            }],
            mode: 'payment',
            success_url: `${frontendUrl}/payment-success?session_id={CHECKOUT_SESSION_ID}&planId=${plan._id}`,
            cancel_url: `${frontendUrl}/payment-cancel`,
            metadata: {
                userId: (req.user._id || req.user.id).toString(),
                planId: plan._id.toString(),
                type: 'PLAN_SUBSCRIPTION'
            }
        });

        res.json({ url: session.url });
    } catch (err) {
        console.error('--- STRIPE PLAN ERR START ---');
        console.error('Error Object:', err);
        console.error('Stack Trace:', err.stack);
        console.error('--- STRIPE PLAN ERR END ---');
        res.status(500).json({ message: 'Failed to create subscription payment', error: err.message });
    }
});

/**
 * @swagger
 * /api/subscription/my-history:
 *   get:
 *     summary: Get my subscription history
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 */
router.get('/my-history', protect, getMySubscriptions);

/**
 * @swagger
 * /api/subscription/cancel:
 *   post:
 *     summary: Cancel active subscription
 *     tags: [Subscription]
 *     security:
 *       - bearerAuth: []
 */
router.post('/cancel', protect, cancelSubscription);

module.exports = router;
