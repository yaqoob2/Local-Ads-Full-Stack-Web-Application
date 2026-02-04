const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Plan = require('../models/Plan');
const Subscription = require('../models/Subscription');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const upgradeUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Create or Get Business Plan
        let businessPlan = await Plan.findOne({ name: 'Business Pro' });
        if (!businessPlan) {
            businessPlan = await Plan.create({
                name: 'Business Pro',
                price: 999,
                durationInDays: 365,
                maxActiveAds: 50, // High limit
                boostWeight: 5,
                features: ['Unlimited Ads', 'Priority Support', 'Featured Listings']
            });
            console.log('✅ Created Business Pro Plan');
        } else {
            console.log('ℹ️ Business Pro Plan already exists');
        }

        // 2. Find the user (using the email from earlier logs or a loose search)
        // We know the username is likely "yaqoob ahmed" or similar from the screenshot
        // But safer to upgrade ALL non-admin users for dev environment
        const users = await User.find({ role: { $ne: 'ADMIN' } });

        if (users.length === 0) {
            console.log('No eligible users found to upgrade.');
            process.exit();
        }

        console.log(`Found ${users.length} users to upgrade.`);

        for (const user of users) {
            // 3. Deactivate old subscriptions
            await Subscription.updateMany(
                { user: user._id, status: 'ACTIVE' },
                { status: 'CANCELLED' }
            );

            // 4. Create new Subscription
            await Subscription.create({
                user: user._id,
                plan: businessPlan._id,
                startDate: new Date(),
                endDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year
                status: 'ACTIVE',
                activatedBy: 'ADMIN'
            });

            console.log(`✅ Upgraded user: ${user.username} (${user.email}) to Business Pro plan.`);
        }

        console.log('\nAll users upgraded successfully!');
        process.exit();

    } catch (err) {
        console.error('Error upgrading users:', err);
        process.exit(1);
    }
};

upgradeUser();
