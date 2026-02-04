const mongoose = require('mongoose');

const planSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        price: {
            type: Number,
            required: true,
        },
        durationInDays: {
            type: Number,
            required: true,
        },
        features: [
            {
                type: String,
            },
        ],
        maxActiveAds: {
            type: Number,
            default: 1,
        },
        boostWeight: {
            type: Number,
            default: 1,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    }
);

const Plan = mongoose.model('Plan', planSchema);

module.exports = Plan;
