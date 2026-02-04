import React from 'react';
import TemplateClean from './ads/templates/TemplateClean';

const TemplatePreview = () => {
    // Dummy Data for Preview
    const sampleData = {
        headline: "Expert Home Plumbing Services",
        subtext: "Available 24/7 • 15 Years Experience",
        description: "We fix leaks, install heaters, and handle emergency pipe repairs. Fast, reliable, and affordable services in your local area. Call us for a free quote today!",
        category: "Home Services",
        area: "Downtown",
        pincode: "560001",
        whatsappNumber: "919999999999",
        isSponsored: true,
        planLevel: "PREMIUM"
    };

    // Since we consolidated to one "Clean" template that adapts its color dynamically
    // We will just show one preview or maybe a few examples with different headlines to show color shift?
    // Let's show a few examples to demonstrate the dynamic pastel logic.

    const examples = [
        { ...sampleData, headline: "Expert Plumbing", category: "Home Services" },
        { ...sampleData, headline: "Luxury 3BHK Flat", category: "Real Estate" },
        { ...sampleData, headline: "Yoga Classes", category: "Health" },
        { ...sampleData, headline: "Wedding Photography", category: "Events" }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Ad Style Preview
                    </h2>
                    <p className="mt-4 text-xl text-gray-500">
                        All ads now use our signature "Pastel Card" design.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {examples.map((ad, idx) => (
                        <div key={idx} className="flex flex-col">
                            <div className="mb-3 flex justify-between items-center">
                                <h3 className="text-lg font-medium text-gray-900">Example {idx + 1}</h3>
                                <span className="text-xs text-gray-400 font-mono">Dynamic Color</span>
                            </div>
                            <div className="h-[320px] w-full">
                                <TemplateClean {...ad} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TemplatePreview;
