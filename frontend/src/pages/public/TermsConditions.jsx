import React from 'react';

const TermsConditions = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-12">
            <h1 className="text-3xl font-bold mb-6">Terms and Conditions</h1>
            <div className="prose dark:prose-invert">
                <p className="mb-4">Last updated: {new Date().toLocaleDateString()}</p>

                <h2 className="text-xl font-semibold mt-6 mb-3">1. Agreement to Terms</h2>
                <p className="mb-4">
                    By accessing or using our services, you agree to be bound by these Terms. If you disagree with any part of the terms, then you may not access the service.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3">2. Accounts</h2>
                <p className="mb-4">
                    When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3">3. Content</h2>
                <p className="mb-4">
                    Our Service allows you to post, link, store, share and otherwise make available certain information, text, graphics, videos, or other material. You are responsible for the Content that you post to the Service, including its legality, reliability, and appropriateness.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3">4. Intellectual Property</h2>
                <p className="mb-4">
                    The Service and its original content (excluding Content provided by users), features and functionality are and will remain the exclusive property of LocalAdsConnect and its licensors.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3">5. Termination</h2>
                <p className="mb-4">
                    We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                </p>

                <h2 className="text-xl font-semibold mt-6 mb-3">6. Changes</h2>
                <p className="mb-4">
                    We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion.
                </p>
            </div>
        </div>
    );
};

export default TermsConditions;
