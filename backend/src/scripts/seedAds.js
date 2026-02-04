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
        categoryName: "Home Services",
        location: { city: "Bangalore", area: "Indiranagar", pincode: "560038" },
        points: ["Verified", "Response in 1hr"],
        planLevel: "BUSINESS" // High visibility
    },
    {
        title: "Luxury 3BHK Apartment",
        subtext: "Premium Gated Community • Ready to Move",
        description: "Experience luxury living with state-of-the-art amenities. Swimming pool, gym, 24/7 security.",
        categoryName: "Real Estate",
        location: { city: "Mumbai", area: "Bandra West", pincode: "400050" },
        points: ["Verified Property", "No Brokerage"],
        planLevel: "GROWTH"
    },
    {
        title: "50% OFF - Dental Checkup",
        subtext: "Limited Time Offer • Book Now",
        description: "Get a complete dental checkup including cleaning and polishing at half price! Expert dentists.",
        categoryName: "Health",
        location: { city: "Delhi", area: "Connaught Place", pincode: "110001" },
        points: ["Limited Slots", "Expert Care"],
        planLevel: "GROWTH"
    },
    {
        title: "Yoga Instructor",
        subtext: "Personal Training & Group Classes",
        description: "Achieve mindfulness and fitness with certified yoga sessions. Customized plans for weight loss.",
        categoryName: "Fitness",
        location: { city: "Pune", area: "Koregaon Park", pincode: "411001" },
        points: ["Certified", "Female Instructor"],
        planLevel: "BASIC"
    },
    {
        title: "Quick Mobile Repair",
        subtext: "Screen Replacement in 30 Mins",
        description: "Broken screen? Battery issues? We fix all smartphone models instantly. Genuine parts.",
        categoryName: "Electronics",
        location: { city: "Chennai", area: "T Nagar", pincode: "600017" },
        points: ["Warranty", "Doorstep"],
        planLevel: "BUSINESS"
    },
    {
        title: "Interior Designers",
        subtext: "Transform Your Home • Free Consultation",
        description: "Award-winning interior design firm specializing in modern homes. Check out our portfolio.",
        categoryName: "Home Decor",
        location: { city: "Hyderabad", area: "Banjara Hills", pincode: "500034" },
        points: ["Top Rated", "50+ Projects"],
        planLevel: "GROWTH"
    },
    {
        title: "Maths Tuition Class 10th",
        subtext: "Expert Faculty • Proven Results",
        description: "Boost your child's grades with our specialized math coaching. Small batches.",
        categoryName: "Education",
        location: { city: "Kolkata", area: "Salt Lake", pincode: "700091" },
        points: ["Free Demo", "Notes Included"],
        planLevel: "BASIC"
    },
    {
        title: "Wedding Photography",
        subtext: "Capture Your Special Moments",
        description: "Professional wedding photography and videography services. Pre-wedding shoots and cinematic films.",
        categoryName: "Events",
        location: { city: "Jaipur", area: "C Scheme", pincode: "302001" },
        points: ["Travels Globally", "High Quality"],
        planLevel: "BUSINESS"
    },
    {
        title: "Car Wash at Home",
        subtext: "Eco-friendly Products • Best Prices",
        description: "Get your car looking brand new with our doorstep car wash service. Interior cleaning and polishing.",
        categoryName: "Automotive",
        location: { city: "Ahmedabad", area: "Satellite", pincode: "380015" },
        points: ["Water Saving", "Foam Wash"],
        planLevel: "GROWTH"
    },
    {
        title: "Fresh Organic Veggies",
        subtext: "Farm to Table • 100% Chemical Free",
        description: "Order fresh, locally grown organic vegetables and fruits. Daily home delivery.",
        categoryName: "Food",
        location: { city: "Bangalore", area: "Whitefield", pincode: "560066" },
        points: ["NPOP Certified", "Fresh Daily"],
        planLevel: "BASIC"
    },
    // New Featured Data
    {
        title: "Grand Event Planners",
        subtext: "Weddings, Parties, Corporate Events",
        description: "Full-service event management company. We make your dream events come to life with perfection.",
        categoryName: "Events",
        location: { city: "Delhi", area: "Vasant Kunj", pincode: "110070" },
        points: ["500+ Events", "Creative Team"],
        planLevel: "BUSINESS"
    },
    {
        title: "Pro Electrician Services",
        subtext: "Wiring, Installation, Repairs",
        description: "Registered electricians for all household and commercial electrical needs. Safe and reliable.",
        categoryName: "Home Services",
        location: { city: "Mumbai", area: "Andheri East", pincode: "400069" },
        points: ["Licensed", "24/7 Service"],
        planLevel: "GROWTH"
    },
    {
        title: "Laptop & Mac Repair",
        subtext: "Chip Level Service • Data Recovery",
        description: "Expert repairs for all laptop brands. Screen replacement, motherboard repair, and software solutions.",
        categoryName: "Electronics",
        location: { city: "Bangalore", area: "Koramangala", pincode: "560034" },
        points: ["90 Day Warranty", "On-site Fix"],
        planLevel: "GROWTH"
    },
    {
        title: "CA & Tax Consultants",
        subtext: "GST, Income Tax, Company Reg",
        description: "Professional chartered accountants for businesses and individuals. hassle-free tax filing.",
        categoryName: "Business", // Mapping might fail if 'Business' category doesn't exist, will fallback
        location: { city: "Chennai", area: "Anna Nagar", pincode: "600040" },
        points: ["Expert Advice", "Confidential"],
        planLevel: "BUSINESS"
    },
    {
        title: "Gold Gym Membership Deal",
        subtext: "Annual Plan @ 40% OFF",
        description: "Join the best gym in town. World-class equipment, sauna, and personal trainers available.",
        categoryName: "Fitness",
        location: { city: "Hyderabad", area: "Jubilee Hills", pincode: "500033" },
        points: ["Free Trial", "AC Gym"],
        planLevel: "GROWTH"
    },
    {
        title: "Paws & Claws Pet Grooming",
        subtext: "Spa for your furry friends",
        description: "Professional pet styling, bathing, and nail clipping. We treat your pets with love and care.",
        categoryName: "Services", // Fallback category likely
        location: { city: "Pune", area: "Baner", pincode: "411045" },
        points: ["Pet Lovers", "Hygienic"],
        planLevel: "BUSINESS"
    },
    {
        title: "Quality Used Cars",
        subtext: "Certified Pre-owned Vehicles",
        description: "Buy or sell used cars at best prices. 100+ checkpoints quality inspection report provided.",
        categoryName: "Automotive",
        location: { city: "Kolkata", area: "Park Street", pincode: "700016" },
        points: ["Financing Available", "Warranty"],
        planLevel: "GROWTH"
    },
    {
        title: "Spanish Language Classes",
        subtext: "Learn from Native Speakers",
        description: "Online and offline batches for Spanish language learning. Certification provided upon completion.",
        categoryName: "Education",
        location: { city: "Jaipur", area: "Malviya Nagar", pincode: "302017" },
        points: ["Weekend Batches", "Study Material"],
        planLevel: "GROWTH"
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

        // 3. Clear existing ads
        await Ad.deleteMany({});
        console.log('Cleared existing ads');

        // 4. Create Ads
        const adsToInsert = [];

        // Helper to get random item
        const rand = (arr) => arr[Math.floor(Math.random() * arr.length)];

        // Add Original Sample Data first
        for (const adData of sampleAdsData) {
            let category = categories.find(c => c.name.toLowerCase().includes(adData.categoryName.toLowerCase())) || categories[0];

            adsToInsert.push({
                user: user._id,
                category: category._id,
                template: 'clean',
                planLevel: adData.planLevel,
                content: {
                    title: adData.title,
                    subtext: adData.subtext,
                    description: adData.description,
                    contactPhone: '919876543210'
                },
                location: {
                    city: adData.location.city,
                    area: adData.location.area,
                    pincode: adData.location.pincode
                },
                points: adData.points,
                status: 'active',
                views: Math.floor(Math.random() * 500) + 50
            });
        }

        // Generate 32 more filler ads to reach total 50
        const fillers = [
            { title: "AC Repair", cat: "Home Services", city: "Delhi", area: "Lajpat Nagar" },
            { title: "Guitar Lessons", cat: "Education", city: "Mumbai", area: "Juhu" },
            { title: "Keto Diet Plan", cat: "Health", city: "Bangalore", area: "HSR Layout" },
            { title: "Used Sofa Set", cat: "Home Decor", city: "Pune", area: "Viman Nagar" },
            { title: "Graphic Designer", cat: "Business", city: "Chennai", area: "Adyar" },
            { title: "Wedding Planner", cat: "Events", city: "Jaipur", area: "Civil Lines" },
            { title: "Car Battery", cat: "Automotive", city: "Kolkata", area: "Salt Lake" },
            { title: "Tiffin Service", cat: "Food", city: "Hyderabad", area: "Gachibowli" }
        ];

        for (let i = 0; i < 32; i++) {
            const base = rand(fillers);
            let category = categories.find(c => c.name.toLowerCase().includes(base.cat.toLowerCase())) || categories[0];
            const plan = rand(['BASIC', 'BASIC', 'BASIC', 'GROWTH', 'GROWTH', 'BUSINESS']); // Weighted towards Basic

            adsToInsert.push({
                user: user._id,
                category: category._id,
                template: 'clean',
                planLevel: plan,
                content: {
                    title: `${base.title} - Service ${i + 1}`,
                    subtext: "Best prices in town • Verified",
                    description: `Looking for ${base.title}? We offer the best quality and quick service in ${base.area}. Contact us today!`,
                    contactPhone: '919000000000'
                },
                location: {
                    city: base.city,
                    area: base.area,
                    pincode: "100000"
                },
                points: ["Reliable", "Affordable"],
                status: 'active',
                views: Math.floor(Math.random() * 200) + 10
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
