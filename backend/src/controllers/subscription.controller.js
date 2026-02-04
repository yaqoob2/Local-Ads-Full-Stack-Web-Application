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
    const { planId } = req.body;
    const plan = await Plan.findById(planId);

    if (!plan) {
        res.status(404);
        throw new Error('Plan not found');
    }

    // Calculate end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + plan.durationInDays);

    const subscription = await Subscription.create({
        user: req.user._id,
        plan: planId,
        endDate,
        status: 'ACTIVE',
        activatedBy: 'ADMIN', // MVP: Admin activates or we simulate auto-activation for free plans
    });

    res.status(201).json(subscription);
};

module.exports = {
    getPlans,
    createSubscription,
};
