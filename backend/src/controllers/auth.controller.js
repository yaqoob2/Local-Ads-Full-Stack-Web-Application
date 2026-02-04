const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { generateToken, generateRefreshToken } = require('../utils/jwt');
const jwt = require('jsonwebtoken');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    const { username, phone, email, password, fullName, businessName, city, area, pincode, role } = req.body;

    const userExists = await User.findOne({ $or: [{ email }, { username }, { phone }] });

    if (userExists) {
        res.status(400);
        throw new Error('User already exists (email, username, or phone)');
    }

    const user = await User.create({
        username,
        phone,
        email,
        password,
        role: role || 'ADVERTISER',
        profile: {
            fullName,
            businessName,
            city,
            area,
            pincode
        }
    });

    if (user) {
        res.status(201).json({
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profile: user.profile,
            token: generateToken(user._id),
            refreshToken: generateRefreshToken(user._id),
        });
    } else {
        res.status(400);
        throw new Error('Invalid user data');
    }
};

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    const { login, password } = req.body;

    // Allow login with username, email OR phone
    // We assume 'login' field contains either username, email or phone
    const user = await User.findOne({
        $or: [{ username: login }, { email: login }, { phone: login }]
    });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profile: user.profile,
            token: generateToken(user._id),
            refreshToken: generateRefreshToken(user._id),
        });
    } else {
        res.status(401);
        throw new Error('Invalid credentials');
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    // Fetch active subscription
    const subscription = await Subscription.findOne({
        user: req.user._id,
        status: 'ACTIVE',
        endDate: { $gt: new Date() }
    }).populate('plan');

    if (user) {
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            phone: user.phone,
            role: user.role,
            profile: user.profile,
            activeSubscription: subscription || null
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

// @desc    Refresh Token
// @route   POST /api/auth/refresh
// @access  Public
const refreshToken = async (req, res) => {
    const { token } = req.body;

    if (!token) {
        res.status(401);
        throw new Error('Not authorized, no token');
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Use generateToken again to issue a new access token
        const newAccessToken = generateToken(decoded.id);

        res.json({ token: newAccessToken });
    } catch (error) {
        res.status(401);
        throw new Error('Not authorized, token failed');
    }
};

module.exports = {
    registerUser,
    loginUser,
    getUserProfile,
    refreshToken
};
