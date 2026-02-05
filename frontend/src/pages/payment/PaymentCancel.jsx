import React from 'react';
import { useNavigate } from 'react-router-dom';

const PaymentCancel = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl max-w-lg w-full text-center border border-gray-100 transform transition-all animate-fade-in-up">
                <div className="w-24 h-24 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <svg className="w-14 h-14" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </div>

                <h1 className="text-4xl font-extrabold text-gray-900 mb-2">Payment Cancelled</h1>
                <p className="text-gray-500 text-lg mb-8 italic">"Don't worry, no charges were made."</p>

                <div className="bg-orange-50 rounded-2xl p-6 mb-8 border border-orange-100">
                    <p className="text-orange-800 text-sm md:text-base leading-relaxed font-medium">
                        It looks like the payment process was interrupted. If you experienced any technical issues, our support team is here to help.
                    </p>
                </div>

                <div className="space-y-4">
                    <button
                        onClick={() => navigate(-1)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                        Try Again
                    </button>

                    <button
                        onClick={() => navigate('/pricing')}
                        className="w-full bg-white hover:bg-gray-50 text-gray-500 font-medium py-3 rounded-xl transition-all"
                    >
                        View Other Plans
                    </button>
                </div>

                <p className="mt-8 text-xs text-gray-400">
                    Need help? <a href="/contact" className="text-blue-600 hover:underline font-semibold">Contact Support</a>
                </p>
            </div>
        </div>
    );
};

export default PaymentCancel;
