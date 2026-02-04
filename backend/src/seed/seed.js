const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Plan = require('../models/Plan');
const Template = require('../models/Template');
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Category.deleteMany();
        await Plan.deleteMany();
        await Template.deleteMany();

        const users = await User.create([
            {
                username: 'admin',
                phone: '1234567890',
                email: 'admin@example.com',
                password: 'password123',
                role: 'ADMIN',
                profile: {
                    fullName: 'Admin User',
                    city: 'Mumbai'
                }
            },
            {
                username: 'johndoe',
                phone: '0987654321',
                email: 'john@example.com',
                password: 'password123',
                role: 'USER',
                profile: {
                    fullName: 'John Doe',
                    city: 'Delhi'
                }
            },
            {
                username: 'shopkeeper',
                phone: '9876543210',
                email: 'shop@example.com',
                password: 'password123',
                role: 'ADVERTISER',
                profile: {
                    fullName: 'Ramesh Kumar',
                    businessName: 'Ramesh Electronics',
                    city: 'Bangalore',
                    area: 'Indiranagar',
                    pincode: '560038'
                }
            },
        ]);

        const categoriesData = [
            // Home & Maintenance
            { name: 'Plumber', group: 'Home & Maintenance' },
            { name: 'Electrician', group: 'Home & Maintenance' },
            { name: 'Carpenter', group: 'Home & Maintenance' },
            { name: 'Painter', group: 'Home & Maintenance' },
            { name: 'AC Repair & Service', group: 'Home & Maintenance' },
            { name: 'Appliance Repair', group: 'Home & Maintenance', description: 'Fridge, Washing Machine, TV' },
            { name: 'Home Cleaning', group: 'Home & Maintenance' },
            { name: 'Pest Control', group: 'Home & Maintenance' },

            // Education & Skills
            { name: 'Home Tutor', group: 'Education & Skills' },
            { name: 'Online Tutor', group: 'Education & Skills' },
            { name: 'Music Teacher', group: 'Education & Skills' },
            { name: 'Coding Classes', group: 'Education & Skills' },

            // Personal & Lifestyle
            { name: 'Salon / Beautician', group: 'Personal & Lifestyle' },
            { name: 'Fitness Trainer', group: 'Personal & Lifestyle' },
            { name: 'Photographer', group: 'Personal & Lifestyle' },
            { name: 'Event Planner', group: 'Personal & Lifestyle' },

            // Logistics & Property
            { name: 'Packers & Movers', group: 'Logistics & Property' },
            { name: 'Mechanic', group: 'Logistics & Property', description: 'Car / Bike' },
            { name: 'Real Estate', group: 'Logistics & Property', description: 'Rent / Sale' },
            { name: 'Space Listings', group: 'Logistics & Property', description: 'Shop / Office' },

            // Others
            { name: 'Gardening', group: 'Others' },
            { name: 'Security Services', group: 'Others' },
            { name: 'Babysitting', group: 'Others' },
            { name: 'Catering', group: 'Others' },
            { name: 'Tailoring', group: 'Others' },
            { name: 'Printing & Design', group: 'Others' }
        ];

        const categories = await Category.create(categoriesData);

        const plans = await Plan.create([
            {
                name: 'Starter', // Updated from 'Free'
                price: 0,
                durationInDays: 365,
                features: ['1 Active Ad', 'Basic Visibility', 'Standard Support'],
                maxActiveAds: 1,
                boostWeight: 1
            },
            {
                name: 'Growth', // New Plan
                price: 299,
                durationInDays: 30,
                features: ['5 Active Ads', 'Verified Badge', 'Priority Support', 'Ad Boost x2'],
                maxActiveAds: 5,
                boostWeight: 2
            },
            {
                name: 'Business', // Updated from 'Pro'
                price: 999,
                durationInDays: 30,
                features: ['Unlimited Ads', 'Top Placement', 'Dedicated Manager', 'Ad Boost x10', 'Analytics Dashboard'],
                maxActiveAds: 100,
                boostWeight: 10
            },
        ]);

        // Helper to find category ID by name
        const getCatId = (name) => categories.find(c => c.name === name)?._id;

        await Template.create([
            { name: 'Service Ad', layoutKey: 'BASIC_SERVICE', category: getCatId('Plumber') }, // Default for services
            { name: 'Property Ad', layoutKey: 'REAL_ESTATE_CARD', category: getCatId('Real Estate') },
            { name: 'Tutor Ad', layoutKey: 'BASIC_SERVICE', category: getCatId('Home Tutor') },
        ]);

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await User.deleteMany();
        await Category.deleteMany();
        await Plan.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`${error}`);
        process.exit(1);
    }
};

if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
