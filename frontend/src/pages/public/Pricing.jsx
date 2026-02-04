import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createSubscription } from '../../api/subscription.api'; // Removed getPlans import since we are hardcoding

const Pricing = () => {
    const navigate = useNavigate();

    // Standard Plans Data (Hardcoded to ensure immediate update)
    const PLANS = [
        {
            _id: 'starter',
            name: 'Starter',
            price: 0,
            duration: 'Month',
            features: ['1 Active Ad', 'Basic Visibility', 'Standard Support'],
            buttonText: 'Start for Free',
            recommended: false
        },
        {
            _id: 'growth',
            name: 'Growth',
            price: 30,
            duration: 'Monthly',
            features: ['5 Active Ads', 'Verified Badge', 'Priority Support'],
            buttonText: 'Upgrade Now',
            recommended: true
        },
        {
            _id: 'business',
            name: 'Business',
            price: 100,
            duration: 'Monthly',
            features: ['Unlimited Ads', 'Top Placement', 'Dedicated Manager', 'Ad Boost x10', 'Analytics Dashboard'],
            buttonText: 'Go Enterprise',
            recommended: false
        }
    ];

    const [plans] = useState(PLANS);
    const [processing, setProcessing] = useState(false);

    const handleSubscribe = (planId) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { state: { from: `/advertiser/checkout/${planId}` } });
            return;
        }
        navigate(`/advertiser/checkout/${planId}`);
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-16">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl">
                    Simple, Transparent Pricing
                </h1>
                <p className="mt-4 text-xl text-gray-500">
                    Choose the plan that's right for your business.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                {plans.map((plan) => (
                    <div key={plan._id} className={`bg-white rounded-2xl shadow-xl border overflow-hidden flex flex-col hover:scale-105 transition-transform duration-300 relative ${plan.recommended ? 'border-blue-500 ring-2 ring-blue-500 scale-105 z-10' : 'border-gray-100'}`}>
                        {plan.recommended && (
                            <div className="absolute top-0 right-0 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg uppercase tracking-wider">
                                Recommended
                            </div>
                        )}
                        <div className="p-8 flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4">{plan.name}</h3>
                            <div className="flex items-baseline mb-8">
                                <span className="text-5xl font-extrabold tracking-tight text-gray-900">
                                    ₹{plan.price}
                                </span>
                                <span className="ml-1 text-xl font-medium text-gray-500">/{plan.duration}</span>
                            </div>

                            <ul className="space-y-4 mb-8">
                                {(plan.features || []).map((feature, i) => (
                                    <li key={i} className="flex items-center text-gray-600">
                                        <svg className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                        </svg>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="p-8 bg-gray-50 border-t border-gray-100">
                            <button
                                onClick={() => handleSubscribe(plan._id)}
                                disabled={processing}
                                className={`w-full font-bold py-3 px-4 rounded-xl transition-colors shadow-lg disabled:opacity-70 disabled:cursor-not-allowed ${plan.recommended
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200'
                                    : 'bg-white hover:bg-gray-50 text-blue-600 border border-blue-200'
                                    }`}
                            >
                                {processing ? 'Processing...' : plan.buttonText}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Pricing;
