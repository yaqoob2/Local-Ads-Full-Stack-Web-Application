import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAllSubscriptions } from '../../api/admin.api';

const AdminSubscriptions = () => {
    const [subscriptions, setSubscriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubscriptions = async () => {
            try {
                const data = await getAllSubscriptions();
                setSubscriptions(data);
            } catch (err) {
                console.error('Failed to fetch subscriptions', err);
                setError('Failed to load subscriptions. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchSubscriptions();
    }, []);

    const getStatusStyle = (status) => {
        switch (status) {
            case 'ACTIVE': return 'bg-green-100 text-green-700 border-green-200';
            case 'CANCELLED': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
            case 'EXPIRED': return 'bg-red-100 text-red-700 border-red-200';
            default: return 'bg-gray-100 text-gray-700 border-gray-200';
        }
    };

    if (loading) return <div className="p-10 text-center">Loading Subscriptions...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-gray-900">
            <Link to="/admin" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </Link>

            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Subscription Management</h1>
                    <p className="text-gray-500">Monitor all advertiser plans and billing status.</p>
                </div>
                <div className="bg-blue-50 px-4 py-2 rounded-xl border border-blue-100">
                    <span className="text-blue-700 font-bold">{subscriptions.length}</span>
                    <span className="text-blue-600 ml-2 text-sm font-medium">Total Records</span>
                </div>
            </div>

            {error && (
                <div className="bg-red-50 text-red-700 p-4 rounded-xl border border-red-100 mb-8">
                    {error}
                </div>
            )}

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Plan</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Expiry</th>
                            <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">Activated Via</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {subscriptions.map((sub) => (
                            <tr key={sub._id} className="hover:bg-gray-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-sm mr-3">
                                            {sub.user?.username?.charAt(0).toUpperCase() || '?'}
                                        </div>
                                        <div>
                                            <div className="text-sm font-bold text-gray-900">{sub.user?.username || 'Unknown'}</div>
                                            <div className="text-xs text-gray-500">{sub.user?.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-sm font-semibold text-gray-700">{sub.plan?.name || 'Starter'}</span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">
                                    ${sub.plan?.price || 0}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 inline-flex text-xs leading-5 font-bold rounded-full border ${getStatusStyle(sub.status)}`}>
                                        {sub.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    {new Date(sub.endDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                        {sub.activatedBy || 'SYSTEM'}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {subscriptions.length === 0 && (
                    <div className="p-12 text-center text-gray-500 italic">
                        No subscription records found.
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminSubscriptions;
