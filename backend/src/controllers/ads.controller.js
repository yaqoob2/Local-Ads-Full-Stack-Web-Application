const Ad = require('../models/Ad');

const Subscription = require('../models/Subscription');

// @desc    Create a new ad
// @route   POST /api/ads
// @access  Private
const createAd = async (req, res) => {
    const { category, template, content, location } = req.body;

    // 1. Check Active Subscription
    const activeSub = await Subscription.findOne({
        user: req.user._id,
        status: 'ACTIVE',
        endDate: { $gt: new Date() }
    }).populate('plan');

    let maxAds = 2; // Default for free/no plan (Increased to 2)
    if (activeSub && activeSub.plan) {
        maxAds = activeSub.plan.maxActiveAds;
    }

    // 2. Count Current Active Ads
    const currentAdsCount = await Ad.countDocuments({
        user: req.user._id,
        status: { $in: ['active', 'pending'] } // Pending also counts towards limit
    });

    if (currentAdsCount >= maxAds) {
        res.status(400);
        throw new Error('limit reached, please upgrade your plan for more positngs and exclusive benifits');
    }

    const ad = new Ad({
        user: req.user._id,
        category,
        template,
        content,
        location,
        status: 'pending',
    });

    const createdAd = await ad.save();
    res.status(201).json(createdAd);
};

// @desc    Get all ads (with filters)
// @route   GET /api/ads
// @access  Public
// @desc    Get all ads (with filters)
// @route   GET /api/ads
// @access  Public
const getAds = async (req, res) => {
    // Increased default page size to 50 to support Rich Home Page (Spotlight + Featured + Grid)
    const pageSize = Number(req.query.pageSize) || 50;
    const page = Number(req.query.pageNumber) || 1;

    const keyword = req.query.keyword
        ? { $text: { $search: req.query.keyword } }
        : {};

    const categoryFilter = req.query.category ? { category: req.query.category } : {};
    const statusFilter = { status: 'active' }; // Only show active ads publicly

    const count = await Ad.countDocuments({ ...keyword, ...categoryFilter, ...statusFilter });
    const ads = await Ad.find({ ...keyword, ...categoryFilter, ...statusFilter })
        .populate('category', 'name')
        .limit(pageSize)
        .skip(pageSize * (page - 1));

    res.json({ ads, page, pages: Math.ceil(count / pageSize) });
};

// @desc    Get ad by ID
// @route   GET /api/ads/:id
// @access  Public
const getAdById = async (req, res) => {
    const ad = await Ad.findById(req.params.id)
        .populate('user', 'username phone profile')
        .populate('category', 'name');

    if (ad) {
        // Increment view count
        ad.views = ad.views + 1;
        await ad.save();
        res.json(ad);
    } else {
        res.status(404);
        throw new Error('Ad not found');
    }
};

// @desc    Delete ad
// @route   DELETE /api/ads/:id
// @access  Private
const deleteAd = async (req, res) => {
    const ad = await Ad.findById(req.params.id);

    if (ad) {
        if (ad.user.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
            res.status(401);
            throw new Error('Not authorized');
        }
        await ad.deleteOne();
        res.json({ message: 'Ad removed' });
    } else {
        res.status(404);
        throw new Error('Ad not found');
    }
};

// @desc    Get my ads
// @route   GET /api/ads/myads
// @access  Private
const getMyAds = async (req, res) => {
    const ads = await Ad.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(ads);
};

// @desc    Track Ad Clicks (WhatsApp/Call)
// @route   PUT /api/ads/:id/click
// @access  Public
const trackClick = async (req, res) => {
    const { type } = req.body; // Expect { type: 'whatsapp' } or 'call'
    const ad = await Ad.findById(req.params.id);

    if (ad) {
        if (type === 'whatsapp') {
            ad.whatsappClicks = (ad.whatsappClicks || 0) + 1;
        }
        // Future: Add other tracked types here

        await ad.save();
        res.json({ message: 'Click tracked', clicks: ad.whatsappClicks });
    } else {
        res.status(404);
        throw new Error('Ad not found');
    }
};

module.exports = {
    createAd,
    getAds,
    getAdById,
    deleteAd,
    getMyAds,
    trackClick
};
