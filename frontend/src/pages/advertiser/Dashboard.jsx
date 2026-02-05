import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getProfile } from '../../api/auth.api';
import { getMyAds } from '../../api/ads.api';

const Dashboard = () => {
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalAds: 0,
        totalViews: 0,
        whatsappClicks: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Parallel fetch for speed
                const [userData, adsData] = await Promise.all([
                    getProfile(),
                    getMyAds()
                ]);

                setUser(userData);

                // Compute stats from ads
                // Assuming adsData is an array of ads
                const ads = Array.isArray(adsData) ? adsData : [];

                const totalViews = ads.reduce((sum, ad) => sum + (ad.views || 0), 0);
                // Clicks might be on ad.clicks or ad.metrics.whatsappClicks depending on schema
                // Checking previous mock: ad.clicks. Re-checking backend schema would be ideal but defaulting to safely accessing
                const totalClicks = ads.reduce((sum, ad) => sum + (ad.clicks || ad.metrics?.whatsappClicks || 0), 0);

                setStats({
                    totalAds: ads.length,
                    totalViews,
                    whatsappClicks: totalClicks
                });

            } catch (err) {
                console.error('Failed to load dashboard data', err);
                // Optionally handle error state
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Back Navigation */}
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
            </Link>

            {/* Top Greeting & Plan */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                    <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
                        Welcome back, <span className="uppercase">{user?.profile?.fullName || user?.username || 'Advocate'}</span>! 👋
                    </h1>
                    <p className="text-gray-500 mt-1 font-medium">Control your ads and monitor performance from one place.</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center gap-3">
                        <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold tracking-wide uppercase transition-all shadow-sm ${user?.activeSubscription
                            ? 'bg-purple-100 text-purple-700 border border-purple-200'
                            : 'bg-gray-100 text-gray-600 border border-gray-200'
                            }`}>
                            <span className="mr-2">⭐</span>
                            {user?.activeSubscription?.plan?.name || 'Free Plan'}
                        </span>

                        {!user?.activeSubscription && (
                            <Link
                                to="/pricing"
                                className="text-blue-600 hover:text-blue-700 font-bold text-sm bg-blue-50 px-4 py-1.5 rounded-full border border-blue-100 transition-all hover:bg-blue-100"
                            >
                                Upgrade Now
                            </Link>
                        )}
                    </div>
                    {user?.activeSubscription && (
                        <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest">
                            Expires: {new Date(user.activeSubscription.endDate).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric'
                            })}
                        </p>
                    )}
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {/* Total Ads */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 rounded-lg bg-blue-50 text-blue-600 mr-4 text-2xl">
                        📢
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Ads</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalAds}</p>
                    </div>
                </div>

                {/* Total Views */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 rounded-lg bg-indigo-50 text-indigo-600 mr-4 text-2xl">
                        👁️
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Total Views</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.totalViews}</p>
                    </div>
                </div>

                {/* WhatsApp Clicks */}
                <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex items-center">
                    <div className="p-3 rounded-lg bg-green-50 text-green-600 mr-4 text-2xl">
                        💬
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">WhatsApp Clicks</p>
                        <p className="text-2xl font-bold text-gray-900">{stats.whatsappClicks}</p>
                    </div>
                </div>
            </div>

            {/* Usage/Action Cards */}
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Create Ad Card */}
                <Link to="/advertiser/create-ad" className="group block">
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 shadow-md hover:shadow-lg transition-all transform hover:-translate-y-1 text-white h-full flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold mb-1">Create New Ad</h3>
                            <p className="text-blue-100 text-sm">Post a new service listing in seconds.</p>
                        </div>
                        <div className="bg-white/20 p-3 rounded-full">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                    </div>
                </Link>

                {/* My Ads Card */}
                <Link to="/advertiser/my-ads" className="group block">
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:border-blue-200 hover:shadow-md transition-all transform hover:-translate-y-1 h-full flex items-center justify-between">
                        <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">Manage My Ads</h3>
                            <p className="text-gray-500 text-sm">View, edit, or promote your existing ads.</p>
                        </div>
                        <div className="bg-gray-50 p-3 rounded-full group-hover:bg-blue-50 transition-colors">
                            <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default Dashboard;
