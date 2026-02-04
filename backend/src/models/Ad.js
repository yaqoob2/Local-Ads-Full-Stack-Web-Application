const mongoose = require('mongoose');

const adSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        category: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category',
            required: true,
        },
        template: {
            type: String,
            default: 'clean',
        },
        content: {
            title: String,
            subtext: String, // Added subtext
            description: String,
            images: [String],
            contactPhone: String,
            price: Number,
        },
        location: {
            city: String,
            area: String,
            pincode: String, // Added pincode
            coordinates: {
                lat: Number,
                lng: Number,
            },
        },
        planLevel: {
            type: String,
            enum: ['BASIC', 'GROWTH', 'BUSINESS'],
            default: 'BASIC'
        },
        points: [String], // Array of short tag strings like "Verified", "Top Rated"
        status: {
            type: String,
            enum: ['pending', 'toupdate', 'active', 'rejected', 'expired'],
            default: 'pending',
        },
        views: {
            type: Number,
            default: 0,
        },
        whatsappClicks: {
            type: Number,
            default: 0,
        },
        rejectionReason: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

// Indexes
adSchema.index({ 'content.title': 'text', 'content.description': 'text' });
adSchema.index({ 'location.city': 1, status: 1 });
adSchema.index({ 'location.pincode': 1, status: 1 });
adSchema.index({ category: 1, status: 1 });

const Ad = mongoose.model('Ad', adSchema);

module.exports = Ad;
