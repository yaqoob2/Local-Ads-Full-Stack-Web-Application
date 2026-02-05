const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Plan = require('../models/Plan');
const Template = require('../models/Template');
const Ad = require('../models/Ad'); // Add Ad model
const connectDB = require('../config/db');

dotenv.config();
connectDB();

const importData = async () => {
    try {
        await User.deleteMany();
        await Category.deleteMany();
        await Plan.deleteMany();
        await Template.deleteMany();
        await Ad.deleteMany(); // Clear Ads

        // Users
        const users = await User.create([
            {
                username: 'admin',
                phone: '1234567890',
                email: 'admin@example.com',
                password: 'password123',
                role: 'ADMIN',
                profile: { fullName: 'Admin User', city: 'Mumbai' }
            },
            {
                username: 'johndoe',
                phone: '0987654321',
                email: 'john@example.com',
                password: 'password123',
                role: 'USER',
                profile: { fullName: 'John Doe', city: 'Delhi' }
            },
            {
                username: 'raj_electronics',
                phone: '9876543210',
                email: 'shop@example.com',
                password: 'password123',
                role: 'ADVERTISER',
                profile: {
                    fullName: 'Rajesh Kumar',
                    businessName: 'Raj Electronics',
                    city: 'Bangalore',
                    area: 'Indiranagar',
                    pincode: '560038'
                }
            },
            {
                username: 'expert_tutors',
                phone: '9870000000',
                email: 'tutor@example.com',
                password: 'password123',
                role: 'ADVERTISER',
                profile: { fullName: 'Sneha Gupta', businessName: 'Expert Tutors', city: 'Mumbai', area: 'Bandra', pincode: '400050' }
            },
            {
                username: 'daily_movers',
                phone: '8888888888',
                email: 'movers@example.com',
                password: 'password123',
                role: 'ADVERTISER',
                profile: { fullName: 'Amit Singh', businessName: 'Daily Movers', city: 'Delhi', area: 'Dwarka', pincode: '110075' }
            }
        ]);

        // Categories
        const categoriesData = [
            { name: 'Plumber', group: 'Home & Maintenance' },
            { name: 'Electrician', group: 'Home & Maintenance' },
            { name: 'Carpenter', group: 'Home & Maintenance' },
            { name: 'Painter', group: 'Home & Maintenance' },
            { name: 'AC Repair & Service', group: 'Home & Maintenance' },
            { name: 'Appliance Repair', group: 'Home & Maintenance' },
            { name: 'Home Cleaning', group: 'Home & Maintenance' },
            { name: 'Pest Control', group: 'Home & Maintenance' },
            { name: 'Home Tutor', group: 'Education & Skills' },
            { name: 'Online Tutor', group: 'Education & Skills' },
            { name: 'Music Teacher', group: 'Education & Skills' },
            { name: 'Salon / Beautician', group: 'Personal & Lifestyle' },
            { name: 'Fitness Trainer', group: 'Personal & Lifestyle' },
            { name: 'Photographer', group: 'Personal & Lifestyle' },
            { name: 'Event Planner', group: 'Personal & Lifestyle' },
            { name: 'Packers & Movers', group: 'Logistics & Property' },
            { name: 'Real Estate', group: 'Logistics & Property' },
        ];
        const categories = await Category.create(categoriesData);

        // Helper to find Category ID
        const getCat = (name) => categories.find(c => c.name === name)?._id;

        // Plans
        const plans = await Plan.create([
            { name: 'Starter', price: 0, durationInDays: 365, features: ['1 Ad'], maxActiveAds: 1, boostWeight: 1 },
            { name: 'Growth', price: 30, durationInDays: 30, features: ['5 Ads', 'Verified'], maxActiveAds: 5, boostWeight: 2 },
            { name: 'Business', price: 100, durationInDays: 30, features: ['Unlimited', 'Top'], maxActiveAds: 100, boostWeight: 10 },
        ]);

        // Templates (simplified for seed)
        const templates = await Template.create([
            { name: 'Generic Service', layoutKey: 'BASIC_SERVICE', category: getCat('Plumber') }
        ]);

        // --- NEW SEED ADS ---
        // Note: Ad schema uses 'user' (not 'advertiser') and 'active' (not 'APPROVED')
        const adsData = [
            {
                user: users[2]._id, // Raj Electronics
                category: getCat('Electrician'),
                content: {
                    title: 'Expert Electrician Services',
                    description: 'Professional electrician for all home wiring, fan installation, and repairs. 24/7 service available.',
                    price: 500,
                    contactPhone: '9876543210',
                    images: ['https://images.unsplash.com/photo-1621905251189-08b45d6a269e?q=80&w=2069&auto=format&fit=crop'],
                },
                location: { city: 'Bangalore', area: 'Indiranagar', pincode: '560038' },
                status: 'active',
                planLevel: 'BASIC'
            },
            {
                user: users[2]._id,
                category: getCat('AC Repair & Service'),
                content: {
                    title: 'Summer AC Cleaning & Gas Filling',
                    description: 'Get your AC ready for summer! Deep cleaning, gas refilling, and quick repairs. Best price guarantee.',
                    price: 1200,
                    contactPhone: '9876543210',
                    images: ['https://images.unsplash.com/photo-1621905252507-b35492cc79b4?q=80&w=2069&auto=format&fit=crop'],
                },
                location: { city: 'Bangalore', area: 'Koramangala', pincode: '560034' },
                status: 'active',
                planLevel: 'BASIC'
            },
            {
                user: users[3]._id, // Expert Tutors
                category: getCat('Home Tutor'),
                content: {
                    title: 'Math & Science Tutor (Class 8-12)',
                    description: 'Experienced tutor with 10 years experience. Specialized in CBSE/ICSE board exams. Personal attention guaranteed.',
                    price: 800,
                    contactPhone: '9870000000',
                    images: ['https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=1974&auto=format&fit=crop'],
                },
                location: { city: 'Mumbai', area: 'Bandra West', pincode: '400050' },
                status: 'active',
                planLevel: 'GROWTH'
            },
            {
                user: users[3]._id,
                category: getCat('Music Teacher'),
                content: {
                    title: 'Guitar Lessons for Beginners',
                    description: 'Learn guitar from scratch. Online and offline classes available. First demo class free!',
                    price: 1500,
                    contactPhone: '9870000000',
                    images: ['https://images.unsplash.com/photo-1510915361894-db8b60106cb1?q=80&w=2070&auto=format&fit=crop'],
                },
                location: { city: 'Mumbai', area: 'Andheri', pincode: '400053' },
                status: 'active',
                planLevel: 'BASIC'
            },
            {
                user: users[4]._id, // Daily Movers
                category: getCat('Packers & Movers'),
                content: {
                    title: 'Safe & Fast House Shifting',
                    description: 'Hassle-free house shifting in Delhi NCR. We provide packing, loading, unloading, and insurance.',
                    price: 5000,
                    contactPhone: '8888888888',
                    images: ['https://images.unsplash.com/photo-1600518464441-9154a4dea21b?q=80&w=1974&auto=format&fit=crop'],
                },
                location: { city: 'Delhi', area: 'Dwarka', pincode: '110075' },
                status: 'active',
                planLevel: 'BUSINESS',
                points: ['Featured', 'Insured']
            },
            {
                user: users[4]._id,
                category: getCat('Plumber'),
                content: {
                    title: 'Emergency Plumber',
                    description: 'Leaking pipe? Clogged drain? Call us for instant plumbing services anywhere in Delhi.',
                    price: 300,
                    contactPhone: '8888888888',
                    images: ['https://images.unsplash.com/photo-1585704032915-c3400ca199e7?q=80&w=2070&auto=format&fit=crop'],
                },
                location: { city: 'Delhi', area: 'South Ext', pincode: '110049' },
                status: 'active',
                planLevel: 'BASIC'
            },
            {
                user: users[2]._id,
                category: getCat('Home Cleaning'),
                content: {
                    title: 'Deep Home Cleaning Services',
                    description: 'Complete home deep cleaning before festivals. Sofa cleaning, bathroom cleaning, and kitchen cleaning.',
                    price: 2500,
                    contactPhone: '9876543210',
                    images: ['https://images.unsplash.com/photo-1581578731117-104f8a3d46a8?q=80&w=1974&auto=format&fit=crop'],
                },
                location: { city: 'Bangalore', area: 'Whitefield', pincode: '560066' },
                status: 'active',
                planLevel: 'GROWTH'
            },
            {
                user: users[3]._id,
                category: getCat('Photographer'),
                content: {
                    title: 'Professional Wedding Photography',
                    description: 'Capturing your best moments. Pre-wedding, Wedding, and Event photography packages available.',
                    price: 25000,
                    contactPhone: '9870000000',
                    images: ['https://images.unsplash.com/photo-1605915321558-7dc5a16d123d?q=80&w=1925&auto=format&fit=crop'],
                },
                location: { city: 'Mumbai', area: 'Juhu', pincode: '400049' },
                status: 'active',
                planLevel: 'BUSINESS',
                points: ['Bestseller']
            }
        ];

        await Ad.create(adsData);

        console.log('Data Imported with Ads!');
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
        await Template.deleteMany();
        await Ad.deleteMany();

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
