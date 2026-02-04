import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { trackAdClick } from '../../api/ads.api';
import { motion } from 'framer-motion';

const SponsoredSpotlight = ({ ads = [] }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    // Auto-scroll logic
    useEffect(() => {
        if (ads.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % ads.length);
        }, 5000); // 5 seconds
        return () => clearInterval(interval);
    }, [ads.length]);

    const handleWhatsAppClick = async (e, ad) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await trackAdClick(ad._id, 'whatsapp');
        } catch (err) {
            console.error('Tracking failed', err);
        }
        const phone = ad.content?.whatsapp || ad.whatsapp || '';
        const text = `Hi, I saw your Sponsored Ad on AdsHub: ${ad.headline || ad.title}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    if (!ads || ads.length === 0) return null;

    const currentAd = ads[currentIndex];

    // Dynamic Gradient based on index to differentiate ads visually
    const gradients = [
        'from-blue-600 to-indigo-800',
        'from-purple-600 to-pink-700',
        'from-orange-500 to-red-600',
        'from-teal-600 to-emerald-800'
    ];
    const bgGradient = gradients[currentIndex % gradients.length];

    // Helper data access
    const headline = currentAd.headline || currentAd.content?.title || 'Featured Ad';
    const subtext = currentAd.subtext || currentAd.content?.subtext || 'Exclusive Offer';
    const locationStr = `${currentAd.location?.area || 'Area'} • ${currentAd.location?.pincode || 'Pincode'}`;
    const planName = currentAd.planLevel || currentAd.planName || "SPONSORED";

    return (
        <motion.div
            className="mb-8 relative group"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Link
                to={`/ads/${currentAd._id}`}
                onClick={() => trackAdClick(currentAd._id, 'view')}
                className={`block relative w-full h-[170px] md:h-[220px] rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all hover:-translate-y-1 bg-gradient-to-r ${bgGradient}`}
            >
                {/* Background decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

                <div className="relative z-10 h-full flex flex-col justify-center px-4 md:px-10 py-4 md:py-6 text-white">
                    {/* Top Badges */}
                    <div className="flex items-center gap-3 mb-2 md:mb-3">
                        <span className="bg-white/20 backdrop-blur-md text-white text-[10px] md:text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider border border-white/20">
                            Sponsored
                        </span>
                        <span className="bg-yellow-400 text-yellow-900 text-[10px] md:text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider shadow-sm">
                            {planName}
                        </span>
                    </div>

                    {/* Content */}
                    <h2 className="text-lg sm:text-2xl md:text-4xl font-black mb-1 md:mb-2 leading-tight line-clamp-2 md:line-clamp-1 pr-12 md:pr-0">
                        {headline}
                    </h2>
                    <p className="text-blue-100 text-xs sm:text-sm md:text-base font-medium mb-1 line-clamp-1">
                        {subtext}
                    </p>
                    <p className="text-white/70 text-[10px] sm:text-xs md:text-sm font-medium flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {locationStr}
                    </p>
                </div>

                {/* CTA Button (Absolute right bottom on desktop) */}
                <div className="absolute bottom-6 right-6 z-20 hidden md:block">
                    <button
                        onClick={(e) => handleWhatsAppClick(e, currentAd)}
                        className="bg-white text-green-700 hover:bg-green-50 font-bold py-3 px-6 rounded-full shadow-lg transition-colors flex items-center gap-2"
                    >
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.897.001-6.621 5.438-12.008 12.062-12.008 3.197 0 6.223 1.251 8.487 3.515 2.27 2.261 3.522 5.293 3.521 8.498-.002 6.632-5.467 11.954-12.115 11.954-2.028-.002-4.015-.561-5.789-1.597L.057 24zm6.652-3.882c1.767 1.054 3.791 1.621 5.86 1.623 6.13-.002 11.115-4.881 11.117-10.871-.001-2.895-1.134-5.631-3.193-7.674-2.053-2.046-4.782-3.176-7.696-3.177-6.115 0-11.088 4.887-11.09 10.932-.001 1.895.503 3.755 1.464 5.378l-1.547 5.652 5.085-1.332z" /></svg>
                        Chat now
                    </button>
                </div>
            </Link>

            {/* Mobile CTA Overlay - Small Icon Button */}
            <button
                onClick={(e) => handleWhatsAppClick(e, currentAd)}
                className="md:hidden absolute bottom-4 right-4 z-20 bg-white text-green-700 p-2 rounded-full shadow-lg hover:bg-gray-100"
            >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.897.001-6.621 5.438-12.008 12.062-12.008 3.197 0 6.223 1.251 8.487 3.515 2.27 2.261 3.522 5.293 3.521 8.498-.002 6.632-5.467 11.954-12.115 11.954-2.028-.002-4.015-.561-5.789-1.597L.057 24zm6.652-3.882c1.767 1.054 3.791 1.621 5.86 1.623 6.13-.002 11.115-4.881 11.117-10.871-.001-2.895-1.134-5.631-3.193-7.674-2.053-2.046-4.782-3.176-7.696-3.177-6.115 0-11.088 4.887-11.09 10.932-.001 1.895.503 3.755 1.464 5.378l-1.547 5.652 5.085-1.332z" /></svg>
            </button>

            {/* Dots Indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-20">
                {ads.map((_, idx) => (
                    <button
                        key={idx}
                        onClick={(e) => { e.preventDefault(); setCurrentIndex(idx); }}
                        className={`w-2 h-2 rounded-full transition-all ${idx === currentIndex ? 'bg-white w-6' : 'bg-white/40 hover:bg-white/60'}`}
                    />
                ))}
            </div>

            {/* Navigation Buttons (Left/Right) */}
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setCurrentIndex((prev) => (prev - 1 + ads.length) % ads.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
                aria-label="Previous Slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" /></svg>
            </button>
            <button
                onClick={(e) => {
                    e.preventDefault();
                    setCurrentIndex((prev) => (prev + 1) % ads.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/20 hover:bg-black/40 text-white p-2 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100 hidden md:flex"
                aria-label="Next Slide"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" /></svg>
            </button>
        </motion.div>
    );
};

export default SponsoredSpotlight;
