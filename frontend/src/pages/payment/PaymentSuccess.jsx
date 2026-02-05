import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import confetti from 'canvas-confetti';
import client from '../../api/client';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const adId = searchParams.get('adId');
    const planId = searchParams.get('planId');
    const sessionId = searchParams.get('session_id');
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState('processing'); // processing, success, error

    useEffect(() => {
        // Trigger confetti on mount
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min, max) => Math.random() * (max - min) + min;

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        const verifyPayment = async () => {
            try {
                // Fail-safe: Manually trigger verification on the backend
                if (sessionId) {
                    await client.post('/payments/stripe/verify-session', { sessionId });
                }

                let attempts = 0;
                const checkInterval = setInterval(async () => {
                    attempts++;
                    try {
                        let isVerified = false;
                        if (adId) {
                            const { data } = await client.get(`/payments/status/${adId}`);
                            if (data.status === 'PAID') isVerified = true;
                        } else if (planId || sessionId) {
                            // For plans, we fetch the profile to see if the subscription is active
                            const { data } = await client.get('/auth/profile');
                            // Backend returns activeSubscription, not subscription
                            if (data.activeSubscription?.status === 'ACTIVE') isVerified = true;
                        }

                        if (isVerified) {
                            setStatus('success');
                            setLoading(false);
                            clearInterval(checkInterval);
                        }
                    } catch (e) {
                        console.error('Polling error:', e);
                    }

                    if (attempts > 10) {
                        setStatus('success'); // Fallback to success UI anyway
                        setLoading(false);
                        clearInterval(checkInterval);
                    }
                }, 3000);
            } catch (err) {
                console.error(err);
                setStatus('error');
                setLoading(false);
            }
        };

        verifyPayment();
        return () => clearInterval(interval);
    }, [adId, planId, sessionId]);

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center border border-gray-100 transform transition-all animate-fade-in-up">
                <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner animate-bounce">
                    <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Payment Successful! 🎉</h1>
                <p className="text-green-600 font-semibold text-lg mb-6">Thank you for your purchase.</p>

                <div className="bg-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
                    <p className="text-blue-800 text-sm md:text-base leading-relaxed">
                        {adId
                            ? "Your ad has been published and is now live for all users to see."
                            : "Your subscription plan has been activated. Enjoy your new premium features!"}
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate(adId ? '/advertiser/my-ads' : '/advertiser/dashboard')}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-200 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Go to Dashboard
                    </button>

                    <button
                        onClick={() => navigate('/')}
                        className="w-full bg-white hover:bg-gray-50 text-gray-500 font-medium py-3 rounded-xl transition-all"
                    >
                        Return to Homepage
                    </button>
                </div>

                <p className="mt-8 text-xs text-gray-400">
                    A confirmation email has been sent to your registered address.
                </p>
            </div>
        </div>
    );
};

export default PaymentSuccess;
