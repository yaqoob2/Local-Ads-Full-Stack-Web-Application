const mongoose = require('mongoose');
const Plan = require('../models/Plan');
const dotenv = require('dotenv');

dotenv.config();

const checkPlans = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        const plans = await Plan.find();
        console.log('Current Plans:');
        plans.forEach(p => {
            console.log(`${p.name}: ${p.price}`);
        });
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};
checkPlans();
