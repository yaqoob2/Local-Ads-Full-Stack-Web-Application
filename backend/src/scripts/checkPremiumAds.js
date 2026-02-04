const mongoose = require('mongoose');
const Ad = require('../models/Ad');
const dotenv = require('dotenv');

dotenv.config();

const check = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const count = await Ad.countDocuments({ planLevel: { $in: ['GROWTH', 'BUSINESS'] } });
        console.log('Premium Ads Count:', count);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
check();
