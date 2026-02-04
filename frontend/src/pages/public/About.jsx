import React from 'react';

const About = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">About Us</h1>
            <div className="prose prose-lg mx-auto text-gray-600">
                <p className="mb-4">
                    Welcome to <strong>LocalAds Connect</strong>. We are dedicated to bridging the gap between local service providers and the community. Our mission is to make local advertising accessible, affordable, and effective for everyone.
                </p>
                <p className="mb-4">
                    Whether you are a plumber, a tutor, or a small business owner, LocalAds Connect provides a platform to showcase your services to the people who need them most—your neighbors.
                </p>
                <p>
                    We believe in the power of community and the importance of supporting local businesses. Join us in building a stronger, more connected local economy.
                </p>
            </div>

            <div className="mt-12 grid md:grid-cols-3 gap-8 text-center">
                <div className="p-6 bg-blue-50 rounded-xl">
                    <h3 className="text-xl font-bold text-blue-900 mb-2">Community First</h3>
                    <p className="text-sm">We prioritize local connections and community growth.</p>
                </div>
                <div className="p-6 bg-green-50 rounded-xl">
                    <h3 className="text-xl font-bold text-green-900 mb-2">Verified Ads</h3>
                    <p className="text-sm">We ensure quality and trust through ad moderation.</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-xl">
                    <h3 className="text-xl font-bold text-purple-900 mb-2">Simple Pricing</h3>
                    <p className="text-sm">Transparent and affordable plans for every budget.</p>
                </div>
            </div>
        </div>
    );
};

export default About;
