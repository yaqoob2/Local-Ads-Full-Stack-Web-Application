const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Ad = require('../models/Ad');

dotenv.config();

const seedPremiumAds = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // 1. Get a User (or create one if empty)
        let user = await User.findOne({ email: 'premium_test@example.com' });
        if (!user) {
            user = await User.create({
                username: 'Premium Advertiser',
                email: 'premium_test@example.com',
                password: 'password123',
                role: 'ADVERTISER',
                phone: '9876543210'
            });
            console.log('Created test user: Premium Advertiser');
        }

        // 2. Get Categories
        const categories = await Category.find();
        if (categories.length === 0) {
            console.error('No categories found. Run seedCategories.js first.');
            process.exit(1);
        }

        // Pick random categories
        const realEstate = categories.find(c => c.name.includes('Real')) || categories[0];
        const services = categories.find(c => c.name.includes('Service')) || categories[1] || categories[0];

        // 3. Define Ads
        const adsData = [
            {
                user: user._id,
                category: realEstate._id,
                template: 'modern',
                planLevel: 'GROWTH',
                status: 'active',
                content: {
                    title: 'Luxury 3BHK Apartment in City Center',
                    subtext: 'Dream Home Awaits',
                    description: 'Experience luxury living in the heart of the city. Amenities include swimming pool, gym, and 24/7 security. Ready to move in.',
                    price: 150000,
                    contactPhone: '9876543210',
                    images: [
                        'https://images.unsplash.com/photo-1545324418-cc1a3d2b2b17?w=800&q=80',
                        'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'
                    ]
                },
                location: {
                    city: 'Metropolis',
                    area: 'Downtown',
                    pincode: '10001',
                    coordinates: { lat: 40.7128, lng: -74.0060 }
                },
                points: ['Verified Owner', 'Ready to Move']
            },
            {
                user: user._id,
                category: services._id,
                template: 'creative',
                planLevel: 'BUSINESS',
                status: 'active',
                content: {
                    title: 'Professional Interior Design Services',
                    subtext: 'Transform Your Space',
                    description: 'Award-winning interior design team specialized in modern and sustainable home makeovers. Book a consultation today.',
                    price: 500,
                    contactPhone: '9876543210',
                    images: [
                        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80',
                        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=800&q=80'
                    ]
                },
                location: {
                    city: 'Metropolis',
                    area: 'West End',
                    pincode: '10002',
                    coordinates: { lat: 40.75, lng: -73.99 }
                },
                points: ['Top Rated', '50+ Projects', 'Certified Pros', 'Best Value']
            }
        ];

        // 4. Insert Ads
        await Ad.insertMany(adsData);
        console.log('✅ Successfully seeded Growth and Business ads with banners!');

        process.exit();

    } catch (error) {
        console.error('Error seeding ads:', error);
        process.exit(1);
    }
};

seedPremiumAds();
