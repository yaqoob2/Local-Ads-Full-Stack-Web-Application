import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../../api/auth.api';
import { getMySubscriptions, cancelSubscription } from '../../api/subscription.api';

const UserProfile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const [userData, historyData] = await Promise.all([
                    getProfile(),
                    getMySubscriptions()
                ]);

                setUser({
                    ...userData,
                    displayName: (userData.profile?.fullName || userData.profile?.businessName || userData.username).toUpperCase(),
                    isSubscribed: !!userData.activeSubscription,
                    subscriptionPlan: userData.activeSubscription?.plan?.name || 'Free Plan'
                });
                setHistory(historyData);
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

    const handleCancelPlan = async () => {
        if (!window.confirm('Are you sure you want to cancel your active subscription? You will lose premium benefits.')) return;

        setCancelling(true);
        try {
            await cancelSubscription();
            // Refresh data
            const [userData, historyData] = await Promise.all([
                getProfile(),
                getMySubscriptions()
            ]);
            setUser({
                ...userData,
                displayName: (userData.profile?.fullName || userData.profile?.businessName || userData.username).toUpperCase(),
                isSubscribed: !!userData.activeSubscription,
                subscriptionPlan: userData.activeSubscription?.plan?.name || 'Free Plan'
            });
            setHistory(historyData);
            alert('Subscription cancelled successfully.');
        } catch (err) {
            console.error('Cancellation failed', err);
            alert('Failed to cancel subscription. Please contact support.');
        } finally {
            setCancelling(false);
        }
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

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-32 relative z-10">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden text-gray-900">
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
                                {/* Contact Card Info */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Email Address</h4>
                                        <p className="text-sm font-bold text-gray-900 truncate">{user.email}</p>
                                    </div>
                                    <div className="p-5 bg-gray-50 rounded-xl border border-gray-100">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Phone Number</h4>
                                        <p className="text-sm font-bold text-gray-900">{user.phone}</p>
                                    </div>
                                </div>

                                {/* Subscription Card */}
                                <div className="relative overflow-hidden p-8 bg-white rounded-3xl border border-gray-100 shadow-xl shadow-blue-50/50 group transition-all duration-500 hover:shadow-2xl hover:shadow-blue-100/50">
                                    <div className="absolute -right-4 -top-4 w-32 h-32 bg-blue-50 rounded-full opacity-50 transition-transform duration-700 group-hover:scale-150"></div>

                                    <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                        <div className="flex items-center gap-5">
                                            <div className="p-4 bg-blue-600 text-white rounded-2xl shadow-lg shadow-blue-200 transform transition-transform duration-500 group-hover:rotate-6">
                                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                                </svg>
                                            </div>
                                            <div>
                                                <h4 className="text-gray-400 text-xs font-bold uppercase tracking-widest mb-1">Membership Plan</h4>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-3xl font-black text-gray-900 tracking-tight uppercase">
                                                        {user.subscriptionPlan}
                                                    </span>
                                                    {user.isSubscribed && <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex flex-col items-end gap-2 text-right">
                                            {user.isSubscribed ? (
                                                <>
                                                    <div className="px-4 py-2 bg-green-50 text-green-700 rounded-xl text-xs font-bold uppercase tracking-tight border border-green-100">
                                                        Status: Active
                                                    </div>
                                                    <button
                                                        onClick={handleCancelPlan}
                                                        disabled={cancelling}
                                                        className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-tighter disabled:opacity-50 transition-colors"
                                                    >
                                                        {cancelling ? 'Cancelling...' : 'Cancel Subscription'}
                                                    </button>
                                                </>
                                            ) : (
                                                <button
                                                    onClick={() => navigate('/pricing')}
                                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold uppercase tracking-wide hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
                                                >
                                                    Upgrade Now
                                                </button>
                                            )}
                                        </div>
                                    </div>

                                    <div className="mt-8 relative h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-1000 ease-out" style={{ width: user.isSubscribed ? '100%' : '10%' }}></div>
                                    </div>
                                    <div className="flex justify-between mt-3">
                                        <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{user.isSubscribed ? 'Premium Access' : 'Limited Access'}</span>
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                                            {user.activeSubscription ? `Renews: ${new Date(user.activeSubscription.endDate).toLocaleDateString()}` : 'Free Forever'}
                                        </span>
                                    </div>
                                </div>

                                {/* Billing History Section */}
                                <div className="mt-8">
                                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                                        Billing & Subscription History
                                    </h3>

                                    <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
                                        <table className="min-w-full divide-y divide-gray-200">
                                            <thead className="bg-gray-50">
                                                <tr>
                                                    <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Date</th>
                                                    <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Plan</th>
                                                    <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Status</th>
                                                    <th className="px-6 py-3 text-left text-[10px] font-bold text-gray-500 uppercase tracking-widest">Price</th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-gray-100">
                                                {history.length > 0 ? history.map((sub) => (
                                                    <tr key={sub._id} className="hover:bg-gray-50/50 transition-colors">
                                                        <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-600">
                                                            {new Date(sub.createdAt).toLocaleDateString()}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-gray-900">
                                                            {sub.plan?.name || 'Starter'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap">
                                                            <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase ${sub.status === 'ACTIVE' ? 'bg-green-100 text-green-700' :
                                                                sub.status === 'CANCELLED' ? 'bg-yellow-100 text-yellow-700' :
                                                                    'bg-gray-100 text-gray-700'
                                                                }`}>
                                                                {sub.status}
                                                            </span>
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-xs font-bold text-blue-600">
                                                            ₹{sub.plan?.price || 0}
                                                        </td>
                                                    </tr>
                                                )) : (
                                                    <tr>
                                                        <td colSpan="4" className="px-6 py-10 text-center text-xs text-gray-400 italic">
                                                            No transaction history found.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
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
