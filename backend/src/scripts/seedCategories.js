const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const categories = [
    { name: "Home Services", icon: "🛠️", slug: "home-services" },
    { name: "Real Estate", icon: "🏠", slug: "real-estate" },
    { name: "Health", icon: "⚕️", slug: "health" },
    { name: "Fitness", icon: "💪", slug: "fitness" },
    { name: "Electronics", icon: "🔌", slug: "electronics" },
    { name: "Home Decor", icon: "🛋️", slug: "home-decor" },
    { name: "Education", icon: "🎓", slug: "education" },
    { name: "Events", icon: "🎉", slug: "events" },
    { name: "Automotive", icon: "🚗", slug: "automotive" },
    { name: "Food", icon: "🍔", slug: "food" },
    { name: "Business", icon: "💼", slug: "business" },
    { name: "Services", icon: "🤝", slug: "services" }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/localadsconnect');
        console.log('MongoDB Connected');

        // Clear existing categories
        await Category.deleteMany({});
        console.log('Cleared existing categories');

        // Insert new categories
        await Category.insertMany(categories);
        console.log('Seeded Categories successfully');

        process.exit();
    } catch (err) {
        console.error('Error seeding categories:', err);
        process.exit(1);
    }
};

seedCategories();
