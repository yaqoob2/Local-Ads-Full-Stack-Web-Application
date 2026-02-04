import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getAdById, trackAdClick } from '../../api/ads.api';
import SkeletonDetail from '../../components/common/SkeletonDetail';

const AdDetails = () => {
    const { id } = useParams();
    const [ad, setAd] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchAd = async () => {
            try {
                const data = await getAdById(id);
                setAd(data);
            } catch (err) {
                console.error('Error fetching ad:', err);
                setError('Ad not found or has been removed.');
            } finally {
                // Artificial delay to show off the skeleton (remove in production if needed)
                setTimeout(() => {
                    setLoading(false);
                }, 800);
            }
        };
        fetchAd();
    }, [id]);

    const handleWhatsAppClick = async (e) => {
        e.preventDefault();
        try {
            await trackAdClick(ad._id, 'whatsapp');
        } catch (err) {
            console.error('Tracking failed', err);
        }

        const phone = ad.content?.whatsapp || ad.whatsapp || '';
        const text = `Hi, I am interested in your service: ${ad.headline || (ad.content && ad.content.headline)}`;
        window.open(`https://wa.me/${phone}?text=${encodeURIComponent(text)}`, '_blank');
    };

    if (loading) return <SkeletonDetail />;
    if (error || !ad) return <div className="min-h-screen flex items-center justify-center p-4 text-center"><h2 className="text-2xl font-bold">{error}</h2></div>;

    // Derived Data
    const headline = ad.headline || (ad.content && ad.content.headline);
    const description = ad.description || (ad.content && ad.content.description);
    const subtext = ad.subtext || (ad.content && ad.content.subtext);
    const categoryName = (ad.category && typeof ad.category === 'object') ? ad.category.name : (ad.category || 'Service');
    const area = ad.location?.area || ad.area;
    const city = ad.location?.city || ad.city;
    const pincode = ad.location?.pincode || ad.pincode;

    // Pastel Theme Logic (Same as TemplateClean)
    const colors = [
        { bg: 'bg-blue-50', text: 'text-blue-900', pill: 'bg-blue-100 text-blue-800', border: 'border-blue-100' },
        { bg: 'bg-orange-50', text: 'text-orange-900', pill: 'bg-orange-100 text-orange-800', border: 'border-orange-100' },
        { bg: 'bg-purple-50', text: 'text-purple-900', pill: 'bg-purple-100 text-purple-800', border: 'border-purple-100' },
        { bg: 'bg-green-50', text: 'text-green-900', pill: 'bg-green-100 text-green-800', border: 'border-green-100' },
        { bg: 'bg-pink-50', text: 'text-pink-900', pill: 'bg-pink-100 text-pink-800', border: 'border-pink-100' },
    ];
    const index = (headline?.length || 0) % colors.length;
    const theme = colors[index];

    return (
        <div className="min-h-screen bg-white pb-24 font-sans">
            {/* Minimal Header */}
            <div className={`px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40`}>
                <Link to="/" className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
                    <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 19l-7-7 7-7" />
                    </svg>
                </Link>
                <span className="text-sm font-bold text-gray-500 uppercase tracking-widest">{categoryName}</span>
                <div className="w-10"></div> {/* Spacer for center alignment */}
            </div>

            <main className="max-w-3xl mx-auto p-6 md:p-8">
                {/* Hero Card Area */}
                <div className={`${theme.bg} rounded-[40px] p-8 md:p-12 mb-8`}>
                    <h1 className={`text-3xl md:text-5xl font-black ${theme.text} mb-4 leading-tight`}>
                        {headline}
                    </h1>
                    {subtext && (
                        <p className={`text-lg md:text-xl font-medium ${theme.text} opacity-80 mb-8`}>
                            {subtext}
                        </p>
                    )}

                    <div className="flex flex-wrap gap-3">
                        <span className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide bg-white shadow-sm ${theme.text}`}>
                            {city}
                        </span>
                        <span className={`px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide bg-white shadow-sm ${theme.text}`}>
                            {pincode}
                        </span>
                        <span className="px-5 py-2 rounded-full text-sm font-bold uppercase tracking-wide bg-white shadow-sm text-gray-600 flex items-center gap-1">
                            <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                            Verified
                        </span>
                    </div>
                </div>

                {/* Content Area */}
                <div className="space-y-8 px-2">
                    <section>
                        <h3 className="text-xl font-bold text-gray-900 mb-4">About this Service</h3>
                        <p className="text-gray-600 text-lg leading-relaxed whitespace-pre-wrap">
                            {description}
                        </p>
                    </section>

                    <div className="h-px bg-gray-100 w-full my-8"></div>

                    <section className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex items-start gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0 flex items-center justify-center text-2xl">
                            📍
                        </div>
                        <div>
                            <h4 className="text-lg font-bold text-gray-900 mb-1">Service Location</h4>
                            <p className="text-gray-600 font-medium">{area}, {city}</p>
                            <p className="text-gray-500 text-sm">Pincode: {pincode}</p>
                        </div>
                    </section>
                </div>
            </main>

            {/* Sticky Action Footer */}
            <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 z-50">
                <div className="max-w-3xl mx-auto flex items-center justify-between gap-4">
                    <div className="hidden sm:block">
                        <p className="text-sm text-gray-400 font-medium">Interested?</p>
                        <p className="text-gray-900 font-bold">Contact Provider</p>
                    </div>
                    <button
                        onClick={handleWhatsAppClick}
                        className="flex-1 sm:flex-none sm:w-auto bg-green-500 hover:bg-green-600 text-white font-bold text-lg py-4 px-8 rounded-full transition-transform active:scale-95 shadow-xl shadow-green-100 flex items-center justify-center gap-2"
                    >
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.897.001-6.621 5.438-12.008 12.062-12.008 3.197 0 6.223 1.251 8.487 3.515 2.27 2.261 3.522 5.293 3.521 8.498-.002 6.632-5.467 11.954-12.115 11.954-2.028-.002-4.015-.561-5.789-1.597L.057 24zm6.652-3.882c1.767 1.054 3.791 1.621 5.86 1.623 6.13-.002 11.115-4.881 11.117-10.871-.001-2.895-1.134-5.631-3.193-7.674-2.053-2.046-4.782-3.176-7.696-3.177-6.115 0-11.088 4.887-11.09 10.932-.001 1.895.503 3.755 1.464 5.378l-1.547 5.652 5.085-1.332z" /></svg>
                        Chat on WhatsApp
                    </button>
                    <button className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AdDetails;
