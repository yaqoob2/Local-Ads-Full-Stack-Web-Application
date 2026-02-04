const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Plan = require('../models/Plan');
const Template = require('../models/Template');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const getIds = async () => {
    try {
        const category = await Category.findOne();
        const plan = await Plan.findOne();
        const template = await Template.findOne();

        console.log('---IDS_START---');
        console.log(JSON.stringify({
            categoryId: category ? category._id : null,
            planId: plan ? plan._id : null,
            templateId: template ? template._id : null
        }));
        console.log('---IDS_END---');
        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

getIds();
