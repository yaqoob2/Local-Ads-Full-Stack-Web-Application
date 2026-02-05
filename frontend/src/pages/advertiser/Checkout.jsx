import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { createSubscription, createStripeSubscriptionSession } from '../../api/subscription.api';
import LoadingButton from '../../components/LoadingButton';

// Hardcoded plans matching Pricing.jsx
const PLANS = [
    { _id: 'starter', name: 'Starter', price: 0, duration: 'Forever' },
    { _id: 'growth', name: 'Growth', price: 30, duration: 'Monthly' },
    { _id: 'business', name: 'Business', price: 100, duration: 'Monthly' }
];

const Checkout = () => {
    const { planId } = useParams();
    const navigate = useNavigate();

    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    useEffect(() => {
        const foundPlan = PLANS.find(p => p._id === planId);
        if (!foundPlan) {
            alert('Invalid Plan');
            navigate('/pricing');
            return;
        }
        setPlan(foundPlan);
        setLoading(false);
    }, [planId, navigate]);

    const handlePayment = async () => {
        setProcessing(true);
        try {
            if (plan.price === 0) {
                // Free plan - direct activation
                await createSubscription(planId);
                alert(`Successfully subscribed to ${plan.name} Plan!`);
                navigate('/advertiser/dashboard');
            } else {
                // Paid plan - Stripe Checkout Session
                const data = await createStripeSubscriptionSession(planId);
                if (data.url) {
                    window.location.href = data.url;
                } else {
                    throw new Error('Failed to get checkout URL from Stripe');
                }
            }
        } catch (err) {
            console.error(err);
            alert('Payment Failed: ' + (err.response?.data?.message || err.message || 'Unknown error'));
        } finally {
            setProcessing(false);
        }
    };

    if (loading || !plan) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
                    <p className="mt-2 text-sm text-gray-500">Review your order and proceed to secure payment.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Order Summary Header */}
                    <div className="bg-blue-600 px-8 py-6 text-white text-center">
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-widest mb-1">Selected Plan</p>
                        <h2 className="text-3xl font-black">{plan.name}</h2>
                    </div>

                    <div className="p-8">
                        <div className="space-y-6">
                            <div className="flex justify-between items-center py-4 border-b border-gray-50">
                                <span className="text-gray-500 font-medium">Subscription Duration</span>
                                <span className="text-gray-900 font-bold">{plan.duration}</span>
                            </div>

                            <div className="flex justify-between items-center py-4 border-b border-gray-50">
                                <span className="text-gray-500 font-medium">Subtotal</span>
                                <span className="text-gray-900 font-bold">₹{plan.price}</span>
                            </div>

                            <div className="flex justify-between items-center py-6">
                                <span className="text-xl font-bold text-gray-900">Total Amount</span>
                                <span className="text-3xl font-black text-blue-600">₹{plan.price}</span>
                            </div>

                            <div className="pt-4">
                                <LoadingButton
                                    onClick={handlePayment}
                                    loading={processing}
                                    variant="primary"
                                    className="w-full py-4 text-lg font-bold shadow-lg shadow-blue-200"
                                >
                                    Proceed to Payment
                                </LoadingButton>
                            </div>

                            <div className="flex flex-col items-center gap-4 mt-8 pt-6 border-t border-gray-50">
                                <div className="flex items-center gap-3 grayscale opacity-50">
                                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Powered by Stripe</span>
                                    <div className="h-5 w-px bg-gray-200"></div>
                                    <div className="flex gap-2">
                                        <div className="w-6 h-4 bg-gray-200 rounded-sm"></div>
                                        <div className="w-6 h-4 bg-gray-200 rounded-sm"></div>
                                        <div className="w-6 h-4 bg-gray-200 rounded-sm"></div>
                                    </div>
                                </div>
                                <p className="text-[10px] text-gray-400 text-center uppercase tracking-tighter">
                                    Your payment details are encrypted and securely processed by Stripe.
                                    LocalAds does not store your card information.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <button
                    onClick={() => navigate('/pricing')}
                    className="mt-8 flex items-center justify-center gap-2 w-full text-sm font-bold text-gray-400 hover:text-gray-600 transition-colors"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                    Back to Plans
                </button>
            </div>
        </div>
    );
};

export default Checkout;
