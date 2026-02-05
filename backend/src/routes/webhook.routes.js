const express = require('express');
const router = express.Router();
const Ad = require('../models/Ad');
const { emitToAdmin } = require('../utils/socket');

// Use express.raw() for Stripe signature verification
router.post('/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature'];
    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error(`Webhook Error: ${err.message}`);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    if (event.type === 'checkout.session.completed') {
        const session = event.data.object;
        const { adId, planId, userId, type } = session.metadata;

        if (type === 'PLAN_SUBSCRIPTION' || planId) {
            // Handle Plan Subscription
            const Plan = require('../models/Plan');
            const Subscription = require('../models/Subscription');
            const User = require('../models/User');

            const plan = await Plan.findById(planId);
            const user = await User.findById(userId);

            if (plan && user) {
                const endDate = new Date();
                endDate.setDate(endDate.getDate() + plan.durationInDays);

                await Subscription.create({
                    user: user._id,
                    plan: plan._id,
                    endDate,
                    status: 'ACTIVE',
                    activatedBy: 'STRIPE',
                    stripeSessionId: session.id,
                    stripePaymentIntentId: session.payment_intent
                });

                console.log(`Stripe: Plan ${plan.name} activated for User ${userId}`);
            }
        } else if (adId) {
            // Handle Individual Ad Payment
            const ad = await Ad.findById(adId).populate('user');
            if (ad && ad.paymentStatus !== 'PAID') {
                ad.paymentStatus = 'PAID';
                ad.published = true;
                ad.paidAt = new Date();
                ad.stripePaymentIntentId = session.payment_intent;
                await ad.save();

                // Notify Admin
                emitToAdmin('adPaid', {
                    adId: ad._id,
                    title: ad.content?.title || ad.headline,
                    amount: ad.amount,
                    user: ad.user,
                });

                console.log(`Stripe: Payment confirmed for Ad ${adId}`);
            }
        }
    }

    res.json({ received: true });
});

module.exports = router;
