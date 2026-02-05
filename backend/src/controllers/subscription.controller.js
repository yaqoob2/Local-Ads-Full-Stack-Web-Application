const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');

// @desc    Get all plans
// @route   GET /api/subscription/plans
// @access  Public
const getPlans = async (req, res) => {
    const plans = await Plan.find({});
    res.json(plans);
};

// @desc    Create subscription (Mock)
// @route   POST /api/subscription
// @access  Private
const createSubscription = async (req, res) => {
    if (!req.body || !req.body.planId) {
        return res.status(400).json({ message: 'Plan ID is required in request body' });
    }

    const { planId } = req.body;

    // Try to find by ID first, then by name (case-insensitive)
    let plan;
    if (planId.match(/^[0-9a-fA-F]{24}$/)) {
        plan = await Plan.findById(planId);
    }

    if (!plan) {
        plan = await Plan.findOne({ name: { $regex: new RegExp(`^${planId}$`, 'i') } });
    }

    if (!plan) {
        return res.status(404).json({ message: 'Plan not found' });
    }

    // Calculate end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationInDays);

    const subscription = await Subscription.create({
        user: req.user._id || req.user.id,
        plan: plan._id,
        endDate,
        status: 'ACTIVE',
        activatedBy: 'ADMIN', // MVP: Admin activates or we simulate auto-activation for free plans
    });

    res.status(201).json(subscription);
};

// @desc    Get my subscription history (Billing)
// @route   GET /api/subscription/my-history
// @access  Private
const getMySubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({ user: req.user._id || req.user.id })
            .populate('plan')
            .sort({ createdAt: -1 });
        res.json(subscriptions);
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

// @desc    Cancel active subscription
// @route   POST /api/subscription/cancel
// @access  Private
const cancelSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({
            user: req.user._id || req.user.id,
            status: 'ACTIVE',
            endDate: { $gt: new Date() }
        });

        if (!subscription) {
            return res.status(404).json({ message: 'No active subscription found to cancel' });
        }

        subscription.status = 'CANCELLED';
        await subscription.save();

        res.json({ message: 'Subscription cancelled successfully', subscription });
    } catch (err) {
        res.status(500).json({ message: 'Server Error', error: err.message });
    }
};

module.exports = {
    getPlans,
    createSubscription,
    getMySubscriptions,
    cancelSubscription
};
