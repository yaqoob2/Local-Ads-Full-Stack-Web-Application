const Subscription = require('../models/Subscription');
const User = require('../models/User');
const Ad = require('../models/Ad');

// ... (existing imports)

// @desc    Manually Activate Subscription (Admin)
// @route   POST /api/admin/subscriptions/activate
// @access  Private/Admin
const activateSubscription = async (req, res) => {
    const { userId, planId, durationInDays } = req.body;

    // Validate inputs
    if (!userId || !planId) {
        res.status(400);
        throw new Error('User ID and Plan ID are required');
    }

    // Calculate end date
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + (durationInDays || 365));

    // Check if user already has active subscription? 
    // For MVP, we just create a new one or update existing. 
    // Let's expire old ones first to be clean.
    await Subscription.updateMany(
        { user: userId, status: 'ACTIVE' },
        { status: 'EXPIRED' }
    );

    const subscription = await Subscription.create({
        user: userId,
        plan: planId,
        endDate,
        status: 'ACTIVE',
        activatedBy: 'ADMIN'
    });

    res.status(201).json(subscription);
};


// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getUsers = async (req, res) => {
    const users = await User.find({});
    res.json(users);
};

// @desc    Get all ads (including pending/rejected)
// @route   GET /api/admin/ads
// @access  Private/Admin
const getAllAdsAdmin = async (req, res) => {
    const ads = await Ad.find({})
        .populate('user', 'username phone profile')
        .populate('category', 'name')
        .sort({ createdAt: -1 });
    res.json(ads);
};

// @desc    Get pending ads (Daily Review)
// @route   GET /api/admin/ads/pending
// @access  Private/Admin
const getPendingAds = async (req, res) => {
    const ads = await Ad.find({ status: 'pending' })
        .populate('user', 'username phone profile')
        .populate('category', 'name')
        .sort({ createdAt: 1 }); // Oldest first for review
    res.json(ads);
};

// @desc    Update ad status (Approve/Reject)
// @route   PUT /api/admin/ads/:id/status
// @access  Private/Admin
const updateAdStatus = async (req, res) => {
    const { status, reason } = req.body;
    const ad = await Ad.findById(req.params.id);

    if (ad) {
        ad.status = status;
        if (status === 'rejected' && reason) {
            ad.rejectionReason = reason;
        }
        const updatedAd = await ad.save();
        res.json(updatedAd);
    } else {
        res.status(404);
        throw new Error('Ad not found');
    }
};

// @desc    Ban User
// @route   PUT /api/admin/users/:id/ban
// @access  Private/Admin
const banUser = async (req, res) => {
    const user = await User.findById(req.params.id);

    if (user) {
        user.status = 'BANNED';
        await user.save();
        res.json({ message: `User ${user.username} has been banned` });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};



module.exports = {
    getUsers,
    getAllAdsAdmin,
    getPendingAds,
    updateAdStatus,
    banUser,
    activateSubscription
};
