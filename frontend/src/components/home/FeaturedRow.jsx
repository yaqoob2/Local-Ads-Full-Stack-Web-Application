import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { trackAdClick } from '../../api/ads.api';
import { motion } from 'framer-motion';

const FeaturedRow = ({ ads = [] }) => {
    const scrollRef = useRef(null);

    if (!ads || ads.length === 0) return null;

    const handleWhatsAppClick = async (e, ad) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            await trackAdClick(ad._id, 'whatsapp');
        } catch (err) {
            console.error('Tracking failed', err);
        }
        const phone = ad.content?.whatsapp || ad.whatsapp || '';
        const text = `Hi, I saw your Featured Ad on AdsHub: ${ad.headline || ad.title}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span className="text-2xl">⚡</span> Featured Listings
                </h2>
                {/* Optional navigation arrows could go here */}
            </div>

            <div
                ref={scrollRef}
                className="flex overflow-x-auto gap-4 pb-4 -mx-4 px-4 scrollbar-hide snap-x"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
                {ads.map((ad) => {
                    // Data extraction
                    const headline = ad.headline || ad.content?.title;
                    const category = (ad.category && typeof ad.category === 'object') ? ad.category.name : (ad.category || 'Service');
                    const locationStr = `${ad.location?.area || 'Area'} • ${ad.location?.pincode || 'Pin'}`;

                    // Distinct border color for visual flair
                    const borderColors = ['border-pink-200', 'border-purple-200', 'border-blue-200', 'border-orange-200'];
                    const borderColor = borderColors[Math.floor(Math.random() * borderColors.length)];

                    return (
                        <Link
                            key={ad._id}
                            to={`/ads/${ad._id}`}
                            onClick={() => trackAdClick(ad._id, 'view')}
                            className={`flex flex-col flex-shrink-0 w-[240px] bg-white rounded-2xl p-4 border-2 ${borderColor} hover:shadow-lg transition-all snap-start`}
                        >
                            <span className="self-start bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded mb-2">
                                {category}
                            </span>

                            <h3 className="font-bold text-gray-900 text-lg leading-snug mb-2 line-clamp-2 h-[3.25rem]">
                                {headline}
                            </h3>

                            <div className="mt-auto pt-2">
                                <p className="text-gray-500 text-xs mb-3 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                    {locationStr}
                                </p>

                                <button
                                    onClick={(e) => handleWhatsAppClick(e, ad)}
                                    className="w-full bg-green-50 hover:bg-green-100 text-green-700 font-bold py-2 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors"
                                >
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.897.001-6.621 5.438-12.008 12.062-12.008 3.197 0 6.223 1.251 8.487 3.515 2.27 2.261 3.522 5.293 3.521 8.498-.002 6.632-5.467 11.954-12.115 11.954-2.028-.002-4.015-.561-5.789-1.597L.057 24zm6.652-3.882c1.767 1.054 3.791 1.621 5.86 1.623 6.13-.002 11.115-4.881 11.117-10.871-.001-2.895-1.134-5.631-3.193-7.674-2.053-2.046-4.782-3.176-7.696-3.177-6.115 0-11.088 4.887-11.09 10.932-.001 1.895.503 3.755 1.464 5.378l-1.547 5.652 5.085-1.332z" /></svg>
                                    Chat
                                </button>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
};

export default FeaturedRow;
