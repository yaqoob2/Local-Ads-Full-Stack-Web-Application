import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getMyAds, deleteAd } from '../../api/ads.api';

const StatusBadge = ({ status }) => {
    switch (status) {
        case 'approved':
            return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wide">Approved</span>;
        case 'PAID':
            return <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold uppercase tracking-wide">Paid</span>;
        case 'FAILED':
            return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold uppercase tracking-wide">Payment Failed</span>;
        case 'under_review':
            return <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-semibold uppercase tracking-wide">Under Review</span>;
        case 'removed':
            return <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-xs font-semibold uppercase tracking-wide">Removed</span>;
        case 'expired':
            return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold uppercase tracking-wide">Expired</span>;
        default:
            return <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold uppercase tracking-wide">{status}</span>;
    }
};

const MyAds = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchMyAds = async () => {
        try {
            const data = await getMyAds();
            setAds(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to fetch my ads', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMyAds();
    }, []);

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this ad? This action cannot be undone.')) {
            try {
                await deleteAd(id);
                // Optimistic UI update or refetch
                setAds(ads.filter(ad => ad._id !== id));
            } catch (err) {
                console.error('Failed to delete ad', err);
                alert('Failed to delete ad. Please try again.');
            }
        }
    };

    if (loading) return <div className="p-10 text-center">Loading...</div>;

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Link to="/advertiser/dashboard" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </Link>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-2xl font-bold text-gray-900">My Ads</h1>
                <Link to="/advertiser/create-ad" className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                    + Create New Ad
                </Link>
            </div>

            <div className="space-y-4">
                {ads.map((ad) => (
                    <div key={ad._id} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-6 transition-all hover:shadow-md">
                        {/* Left: Info */}
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <StatusBadge status={ad.status} />
                                <span className="text-xs text-gray-400 font-medium">
                                    {ad.createdAt ? `Posted on ${new Date(ad.createdAt).toLocaleDateString()}` : ''}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 leading-tight">
                                {ad.headline}
                            </h3>
                        </div>

                        {/* Middle: Stats */}
                        <div className="flex items-center gap-6 sm:px-6 sm:border-x border-gray-100">
                            <div className="text-center">
                                <p className="text-xs text-gray-500 font-medium uppercase">Views</p>
                                <p className="text-xl font-bold text-gray-900">{ad.views || 0}</p>
                            </div>
                            <div className="text-center">
                                <p className="text-xs text-gray-500 font-medium uppercase">Clicks</p>
                                <p className="text-xl font-bold text-gray-900">{ad.clicks || 0}</p>
                            </div>
                        </div>

                        {/* Right: Actions */}
                        <div className="flex items-center gap-3">
                            {ad.status === 'expired' ? (
                                <button
                                    onClick={() => alert('Renewal feature coming soon!')}
                                    className="px-4 py-2 bg-orange-100 text-orange-700 hover:bg-orange-200 rounded-lg text-sm font-bold transition-colors"
                                >
                                    Renew Now
                                </button>
                            ) : (
                                <>
                                    {(ad.paymentStatus === 'PENDING' || ad.paymentStatus === 'FAILED') && ad.planLevel !== 'BASIC' && (
                                        <button
                                            onClick={async () => {
                                                try {
                                                    const { createStripeSession } = await import('../../api/payment.api');
                                                    const data = await createStripeSession(ad._id);
                                                    if (data.url) {
                                                        window.location.href = data.url;
                                                    } else if (data.success) {
                                                        alert(data.message);
                                                        fetchMyAds();
                                                    }
                                                } catch (err) {
                                                    console.error('Payment error:', err);
                                                    alert('Failed to initiate payment');
                                                }
                                            }}
                                            className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-lg text-sm font-bold transition-colors shadow-sm"
                                        >
                                            Pay & Publish
                                        </button>
                                    )}
                                    <Link
                                        to="/advertiser/create-ad"
                                        state={{ edit: true, adData: ad }}
                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="Edit Ad"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(ad._id)}
                                        className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Ad"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ))}

                {ads.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                        <p className="text-gray-500 mb-4">You haven't posted any ads yet.</p>
                        <Link to="/advertiser/create-ad" className="text-blue-600 font-bold hover:underline">
                            Create your first ad
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyAds;
