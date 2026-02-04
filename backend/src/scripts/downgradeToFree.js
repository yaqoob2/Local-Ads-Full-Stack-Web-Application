const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const downgradeUser = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Upgrade/Downgrade all non-admin users to Free (by cancelling active subs)
        const users = await User.find({ role: { $ne: 'ADMIN' } });

        if (users.length === 0) {
            console.log('No eligible users found.');
            process.exit();
        }

        console.log(`Found ${users.length} users to downgrade.`);

        for (const user of users) {
            // Deactivate old subscriptions
            await Subscription.updateMany(
                { user: user._id, status: 'ACTIVE' },
                { status: 'CANCELLED' }
            );
            console.log(`✅ Downgraded user: ${user.username} to Free Plan (No active subscription).`);
        }

        console.log('\nAll users downgraded successfully!');
        process.exit();

    } catch (err) {
        console.error('Error downgrading users:', err);
        process.exit(1);
    }
};

downgradeUser();
