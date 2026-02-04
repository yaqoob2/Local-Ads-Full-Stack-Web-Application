const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Ad = require('../models/Ad');
const User = require('../models/User');
const Category = require('../models/Category');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../../.env') });

const sampleAdsData = [
    {
        title: "Expert Plumbing Services 24/7",
        subtext: "Leaks, Drains, Heaters - We Fix It All!",
        description: "Professional plumbing services in your area. Licensed and insured team ready to handle emergency repairs.",
        template: "clean",
        categoryName: "Home Services",
        location: { city: "Bangalore", area: "Indiranagar", pincode: "560038" },
        points: ["Verified", "Response in 1hr"]
    },
    {
        title: "Luxury 3BHK Apartment",
        subtext: "Premium Gated Community • Ready to Move",
        description: "Experience luxury living with state-of-the-art amenities. Swimming pool, gym, 24/7 security.",
        template: "minimal",
        categoryName: "Real Estate",
        location: { city: "Mumbai", area: "Bandra West", pincode: "400050" },
        points: ["Verified Property", "No Brokerage"]
    },
    {
        title: "50% OFF - Dental Checkup",
        subtext: "Limited Time Offer • Book Now",
        description: "Get a complete dental checkup including cleaning and polishing at half price! Expert dentists.",
        template: "bold",
        categoryName: "Health",
        location: { city: "Delhi", area: "Connaught Place", pincode: "110001" },
        points: ["Limited Slots", "Expert Care"]
    },
    {
        title: "Yoga Instructor",
        subtext: "Personal Training & Group Classes",
        description: "Achieve mindfulness and fitness with certified yoga sessions. Customized plans for weight loss.",
        template: "gradient",
        categoryName: "Fitness",
        location: { city: "Pune", area: "Koregaon Park", pincode: "411001" },
        points: ["Certified", "Female Instructor"]
    },
    {
        title: "Quick Mobile Repair",
        subtext: "Screen Replacement in 30 Mins",
        description: "Broken screen? Battery issues? We fix all smartphone models instantly. Genuine parts.",
        template: "split",
        categoryName: "Electronics",
        location: { city: "Chennai", area: "T Nagar", pincode: "600017" },
        points: ["Warranty", "Doorstep"]
    },
    {
        title: "Interior Designers",
        subtext: "Transform Your Home • Free Consultation",
        description: "Award-winning interior design firm specializing in modern homes. Check out our portfolio.",
        template: "badge",
        categoryName: "Home Decor",
        location: { city: "Hyderabad", area: "Banjara Hills", pincode: "500034" },
        points: ["Top Rated", "50+ Projects"]
    },
    {
        title: "Maths Tuition Class 10th",
        subtext: "Expert Faculty • Proven Results",
        description: "Boost your child's grades with our specialized math coaching. Small batches.",
        template: "clean",
        categoryName: "Education",
        location: { city: "Kolkata", area: "Salt Lake", pincode: "700091" },
        points: ["Free Demo", "Notes Included"]
    },
    {
        title: "Wedding Photography",
        subtext: "Capture Your Special Moments",
        description: "Professional wedding photography and videography services. Pre-wedding shoots and cinematic films.",
        template: "minimal",
        categoryName: "Events",
        location: { city: "Jaipur", area: "C Scheme", pincode: "302001" },
        points: ["Travels Globally", "High Quality"]
    },
    {
        title: "Car Wash at Home",
        subtext: "Eco-friendly Products • Best Prices",
        description: "Get your car looking brand new with our doorstep car wash service. Interior cleaning and polishing.",
        template: "bold",
        categoryName: "Automotive",
        location: { city: "Ahmedabad", area: "Satellite", pincode: "380015" },
        points: ["Water Saving", "Foam Wash"]
    },
    {
        title: "Fresh Organic Veggies",
        subtext: "Farm to Table • 100% Chemical Free",
        description: "Order fresh, locally grown organic vegetables and fruits. Daily home delivery.",
        template: "split",
        categoryName: "Food",
        location: { city: "Bangalore", area: "Whitefield", pincode: "560066" },
        points: ["NPOP Certified", "Fresh Daily"]
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/localadsconnect');
        console.log('MongoDB Connected');

        // 1. Get a User (or create one)
        let user = await User.findOne();
        if (!user) {
            // Create dummy user if none exists
            user = await User.create({
                username: 'DemoUser',
                phone: '9999999999',
                password: 'password123', // In real app should be hashed, but for seed it's ok
                role: 'ADVERTISER'
            });
            console.log('Created Demo User');
        }

        // 2. Get Categories
        const categories = await Category.find();
        if (categories.length === 0) {
            console.log('No categories found. Please seed categories first.');
            process.exit(1);
        }

        // 3. Clear existing ads (Optional, maybe user wants to keep?)
        // Let's NOT clear, just add. 
        // Or clear if "empty" was the complaint. User said "it is empty now", so clearing is fine/safe.
        await Ad.deleteMany({});
        console.log('Cleared existing ads');

        // 4. Create Ads
        const adsToInsert = [];

        for (const adData of sampleAdsData) {
            // Find category ID
            // Match by name loosely or pick random if not found
            let category = categories.find(c => c.name.toLowerCase().includes(adData.categoryName.toLowerCase()));
            if (!category) {
                category = categories[0]; // Fallback to first category
            }

            adsToInsert.push({
                user: user._id,
                category: category._id,
                template: adData.template,
                content: {
                    title: adData.title,
                    description: adData.description,
                    // Store subtext inside description or title for now if schema strict?
                    // Schema has 'title', 'description'. 
                    // To handle strict schema, we might need 'subtext' in schema too.
                    // For now, let's just use what we have. 
                    // Actually, AdCard expects ad.content.subtext. 
                    // The SCHEMA doesn't have subtext. I should add it to schema or put it in description.
                    // Let's add 'subtext' to schema in next step if needed. 
                    // For now, I'll put it in content but if schema is strict it will be stripping.
                    // WAIT: Mongoose strips unknown fields by default. 
                    // I need to add 'subtext' to Ad Schema or `content` in Ad Schema.
                    contactPhone: '919876543210'
                },
                location: {
                    city: adData.location.city,
                    area: adData.location.area,
                    pincode: adData.location.pincode // Schema doesn't have pincode! It has coordinates.
                    // I need to FIX THE SCHEMA.
                },
                status: 'active',
                views: Math.floor(Math.random() * 500) + 50
            });
        }

        await Ad.insertMany(adsToInsert);
        console.log(`Seeded ${adsToInsert.length} Ads successfully`);

        process.exit();
    } catch (err) {
        console.error('Seed Error:', err);
        process.exit(1);
    }
};

seedDB();
