const mongoose = require('mongoose');

const subscriptionSchema = mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        plan: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Plan',
            required: true,
        },
        startDate: {
            type: Date,
            default: Date.now,
        },
        endDate: {
            type: Date,
            required: true,
        },
        status: {
            type: String,
            enum: ['ACTIVE', 'EXPIRED', 'CANCELLED'],
            default: 'ACTIVE',
        },
        paymentId: {
            type: String,
        },
        activatedBy: {
            type: String,
            enum: ['ADMIN', 'PAYMENT'],
            default: 'ADMIN',
        },
    },
    {
        timestamps: true,
    }
);

// Index for fast lookups
subscriptionSchema.index({ user: 1, status: 1, endDate: -1 });

const Subscription = mongoose.model('Subscription', subscriptionSchema);

module.exports = Subscription;
