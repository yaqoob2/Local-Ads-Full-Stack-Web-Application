const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const ensureAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const adminEmail = 'admin@example.com';
        const adminPassword = 'password123';

        let admin = await User.findOne({ email: adminEmail });

        if (admin) {
            console.log('Admin user found. Updating password...');
            admin.password = adminPassword; // Pre-save hook will hash this
            admin.role = 'ADMIN';
            await admin.save();
            console.log('✅ Admin password verified/reset.');
        } else {
            console.log('Admin user not found. Creating new admin...');
            admin = await User.create({
                username: 'admin',
                email: adminEmail,
                phone: '9999999999',
                password: adminPassword,
                role: 'ADMIN',
                profile: {
                    fullName: 'Super Admin',
                    city: 'Headquarters'
                }
            });
            console.log('✅ Admin user created.');
        }

        console.log('\n-----------------------------------');
        console.log('Admin Credentials:');
        console.log(`Email:    ${adminEmail}`);
        console.log(`Password: ${adminPassword}`);
        console.log('-----------------------------------');

        process.exit();
    } catch (err) {
        console.error('Error ensuring admin:', err);
        process.exit(1);
    }
};

ensureAdmin();
