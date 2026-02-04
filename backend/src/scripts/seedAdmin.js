const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/localadsconnect');
        console.log('MongoDB Connected...');

        const adminEmail = 'admin@adshub.com';
        const adminUser = await User.findOne({ email: adminEmail });

        if (adminUser) {
            console.log('Admin user already exists.');
            console.log(`Email: ${adminEmail}`);
            console.log('Password: admin123 (if not changed)');
        } else {
            const newAdmin = new User({
                username: 'admin',
                email: adminEmail,
                phone: '9999999999',
                password: 'admin', // Will be hashed
                role: 'ADMIN',
                profile: {
                    fullName: 'System Admin',
                    businessName: 'AdsHub Admin',
                    state: 'Delhi',
                    city: 'New Delhi',
                    area: 'Central',
                    pincode: '110001'
                }
            });

            await newAdmin.save();
            console.log('Admin user created successfully!');
            console.log('Username: admin');
            console.log('Email: admin@adshub.com');
            console.log('Password: admin');
        }

        process.exit();
    } catch (err) {
        console.error('Error creating admin:', err);
        process.exit(1);
    }
};

seedAdmin();
