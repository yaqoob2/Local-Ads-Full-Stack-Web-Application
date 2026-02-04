import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../api/auth.api';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = await getProfile();
                setUser({
                    ...userData,
                    // Uppercase name as requested
                    displayName: (userData.profile?.fullName || userData.profile?.businessName || userData.username).toUpperCase(),
                    // Show active if they have a sub OR if they are an advertiser (auto-active for demo)
                    isSubscribed: !!userData.activeSubscription || userData.role === 'ADVERTISER',
                    subscriptionPlan: userData.activeSubscription?.plan?.name || (userData.role === 'ADVERTISER' ? 'Growth' : 'Free')
                });
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setError("Failed to load profile. Please try logging in again.");
                if (err.response && err.response.status === 401) {
                    navigate('/login');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUserProfile();
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/login');
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                <div className="text-red-500 text-xl font-bold mb-2">Error</div>
                <p className="text-gray-600 mb-4">{error}</p>
                <button onClick={() => navigate('/login')} className="text-blue-600 hover:underline">Go to Login</button>
            </div>
        </div>
    );

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header / Hero Section */}
            <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-indigo-700 h-64 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <svg className="h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                        <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                    </svg>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="md:flex">
                        {/* Sidebar / User Identity */}
                        <div className="md:w-1/3 bg-gray-900 text-white p-8 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

                            <div className="relative z-10 mb-6">
                                <div className="w-32 h-32 rounded-full border-4 border-white/20 bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-5xl font-bold shadow-2xl">
                                    {user.displayName.charAt(0)}
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold tracking-tight mb-2 relative z-10">{user.displayName}</h2>
                            <p className="text-blue-200 uppercase tracking-widest text-xs font-semibold mb-8 relative z-10">{user.role}</p>

                            <button
                                onClick={handleLogout}
                                className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg backdrop-blur-sm transition-all duration-200 text-sm font-medium flex items-center justify-center gap-2 group"
                            >
                                <svg className="w-4 h-4 text-red-400 group-hover:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                Sign Out
                            </button>
                        </div>

                        {/* Main Content */}
                        <div className="md:w-2/3 p-8 md:p-12">
                            <div className="flex items-center justify-between mb-8">
                                <h3 className="text-xl font-bold text-gray-800 border-b-2 border-blue-500 pb-1">Profile Details</h3>
                                {user.isSubscribed && (
                                    <span className="px-4 py-1.5 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide flex items-center gap-2 shadow-sm">
                                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                        Account Active
                                    </span>
                                )}
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {/* Contact Card */}
                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Email Address</h4>
                                            <p className="text-lg font-medium text-gray-900">{user.email}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-shadow duration-300">
                                    <div className="flex items-start gap-4">
                                        <div className="p-3 bg-indigo-100 text-indigo-600 rounded-lg">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-1">Phone Number</h4>
                                            <p className="text-lg font-medium text-gray-900">{user.phone}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Subscription Card */}
                                <div className="p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl text-white shadow-lg transform transition-transform duration-300 hover:scale-[1.02]">
                                    <div className="flex justify-between items-center mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
                                                <svg className="w-6 h-6 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                            </div>
                                            <h4 className="text-lg font-bold">Current Plan</h4>
                                        </div>
                                        <span className="text-2xl font-bold text-yellow-400">{user.subscriptionPlan}</span>
                                    </div>
                                    <div className="w-full bg-white/10 rounded-full h-1.5 mb-2">
                                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 h-1.5 rounded-full" style={{ width: '75%' }}></div>
                                    </div>
                                    <p className="text-xs text-white/60 text-right">Plan is active and running</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
