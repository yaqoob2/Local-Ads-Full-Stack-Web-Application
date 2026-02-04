const User = require('../models/User');
const generateToken = require('../utils/jwt');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;

        // Update profile fields if provided
        if (req.body.fullName) user.profile.fullName = req.body.fullName;
        if (req.body.businessName) user.profile.businessName = req.body.businessName;
        if (req.body.city) user.profile.city = req.body.city;
        if (req.body.area) user.profile.area = req.body.area;
        if (req.body.pincode) user.profile.pincode = req.body.pincode;
        if (req.body.state) user.profile.state = req.body.state;

        if (req.body.password) {
            user.password = req.body.password;
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            username: updatedUser.username,
            email: updatedUser.email,
            phone: updatedUser.phone,
            role: updatedUser.role,
            profile: updatedUser.profile,
            token: generateToken(updatedUser._id),
        });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
};

module.exports = {
    updateUserProfile,
};
