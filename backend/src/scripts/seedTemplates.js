const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Category = require('../models/Category');
const Template = require('../models/Template');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const templatesData = [
    {
        name: 'Standard Listing',
        layoutKey: 'standard',
        description: 'Clean and simple design for maximum readability.',
        previewImage: 'https://via.placeholder.com/150'
    },
    {
        name: 'Urgent Notice',
        layoutKey: 'urgent',
        description: 'High-visibility design for urgent requirements.',
        previewImage: 'https://via.placeholder.com/150'
    },
    {
        name: 'Eco Friendly',
        layoutKey: 'eco',
        description: 'Green-themed design for sustainable services.',
        previewImage: 'https://via.placeholder.com/150'
    }
];

const seedTemplates = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        // Clear existing templates
        await Template.deleteMany({});
        console.log('Cleared existing templates');

        // Get all categories
        const categories = await Category.find();
        if (categories.length === 0) {
            console.error('No categories found! Run seedCategories.js first.');
            process.exit(1);
        }

        const templatesToInsert = [];

        // For each category, add the 3 standard templates
        // We will duplicate them for every category so they show up regardless of what user picks (if we were filtering)
        // But since we are NOT filtering in frontend currently, we technically only need 3 templates linked to ANY category.
        // However, to be future-proof, let's just add them to the first category, 
        // OR loop and add unique copies.

        // Let's just add the 3 templates linked to the FIRST category for now.
        // Since the frontend shows ALL templates (no filter), this will work.

        const firstCategory = categories[0];

        const finalTemplates = templatesData.map(t => ({
            ...t,
            category: firstCategory._id
        }));

        await Template.insertMany(finalTemplates);
        console.log(`Seeded ${finalTemplates.length} templates linked to category: ${firstCategory.name}`);

        process.exit();
    } catch (err) {
        console.error('Error seeding templates:', err);
        process.exit(1);
    }
};

seedTemplates();
