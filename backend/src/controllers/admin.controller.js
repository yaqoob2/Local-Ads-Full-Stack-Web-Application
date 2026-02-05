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

// @desc    Get all subscriptions for admin oversight
// @route   GET /api/admin/subscriptions
// @access  Private/Admin
const getAllSubscriptionsAdmin = async (req, res) => {
    const subscriptions = await Subscription.find({})
        .populate('user', 'username email phone')
        .populate('plan', 'name price durationInDays')
        .sort({ createdAt: -1 });
    res.json(subscriptions);
};

// @desc    Get Admin Dashboard Stats (KPIs)
// @route   GET /api/admin/stats
// @access  Private/Admin
const getAdminDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const todayStart = new Date(now.setHours(0, 0, 0, 0)).getTime();
        const sevenDaysAgo = todayStart - 7 * 24 * 60 * 60 * 1000;
        const thirtyDaysAgo = todayStart - 30 * 24 * 60 * 60 * 1000;

        // Plan Prices for Fallback (Use strings or any casing found in DB)
        const planPrices = {
            'BASIC': 0, 'basic': 0,
            'GROWTH': 30, 'growth': 30,
            'BUSINESS': 100, 'business': 100
        };

        const allAds = await Ad.find({});
        const allSubs = await Subscription.find({ status: 'ACTIVE' }).populate('plan');

        // Helper to get ad value robustly
        const getAdVal = (ad) => {
            if (ad.amount) return ad.amount;
            const level = (ad.planLevel || ad.plan || 'BASIC').toUpperCase();
            return planPrices[level] || 0;
        };

        // Categorize Ads
        const paidAds = allAds.filter(ad => {
            const isPaid = ad.paymentStatus === 'PAID';
            const isHigh = ['GROWTH', 'BUSINESS'].includes((ad.planLevel || ad.plan || '').toUpperCase());
            const isActive = ad.status?.toLowerCase() === 'active';
            return isPaid || (isHigh && isActive);
        });

        const freeAds = allAds.filter(ad => {
            const isBasic = (ad.planLevel || ad.plan || 'BASIC').toUpperCase() === 'BASIC';
            const isActive = ad.status?.toLowerCase() === 'active';
            return isBasic && isActive;
        });

        // REVENUE CALCULATION
        let adRevTotal = 0;
        let adRevToday = 0;
        let adRev7d = 0;
        let adRev30d = 0;

        paidAds.forEach(ad => {
            const val = getAdVal(ad);
            const ts = new Date(ad.paidAt || ad.createdAt).getTime();
            adRevTotal += val;
            if (ts >= todayStart) adRevToday += val;
            if (ts >= sevenDaysAgo) adRev7d += val;
            if (ts >= thirtyDaysAgo) adRev30d += val;
        });

        let subRevTotal = 0;
        let subRevToday = 0;
        let subRev7d = 0;
        let subRev30d = 0;

        allSubs.forEach(sub => {
            const val = sub.plan?.price || 0;
            const ts = new Date(sub.createdAt).getTime();
            subRevTotal += val;
            if (ts >= todayStart) subRevToday += val;
            if (ts >= sevenDaysAgo) subRev7d += val;
            if (ts >= thirtyDaysAgo) subRev30d += val;
        });

        const totalRevenue = adRevTotal + subRevTotal;
        const revenueToday = adRevToday + subRevToday;
        const revenue7d = adRev7d + subRev7d;
        const revenue30d = adRev30d + subRev30d;

        // ARPA should be Total Platform Revenue / Total Ads
        const arpa = allAds.length > 0 ? (totalRevenue / allAds.length).toFixed(2) : 0;

        res.json({
            revenue: {
                total: totalRevenue,
                today: revenueToday,
                last7Days: revenue7d,
                last30Days: revenue30d
            },
            ads: {
                paid: paidAds.length,
                free: freeAds.length,
                total: allAds.length,
                failedPayments: allAds.filter(a => a.paymentStatus === 'FAILED').length
            },
            arpa: arpa.toString()
        });
    } catch (err) {
        console.error('Stats Error:', err);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getUsers,
    getAllAdsAdmin,
    getPendingAds,
    updateAdStatus,
    banUser,
    activateSubscription,
    getAllSubscriptionsAdmin,
    getAdminDashboardStats
};
