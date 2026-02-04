const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Ad = require('../models/Ad');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const checkCount = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Loose match for the user
        const user = await User.findOne({
            $or: [
                { username: { $regex: 'yaqoob', $options: 'i' } },
                { email: { $regex: 'yaqoob', $options: 'i' } }
            ]
        });

        if (!user) {
            console.log('User not found.');
            process.exit();
        }

        const count = await Ad.countDocuments({
            user: user._id,
            status: { $in: ['active', 'pending'] }
        });

        console.log(`User: ${user.username}`);
        console.log(`Current Active/Pending Ads: ${count}`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

checkCount();
