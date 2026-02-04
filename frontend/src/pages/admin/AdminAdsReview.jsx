import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPendingAds, updateAdStatus } from '../../api/admin.api';
import AdCard from '../../components/home/AdCard';

const AdminAdsReview = () => {
    const [ads, setAds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState(null); // id of ad being processed
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const [selectedAdId, setSelectedAdId] = useState(null);
    const [rejectReason, setRejectReason] = useState('');
    const [toast, setToast] = useState({ message: '', type: '' });

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            const data = await getPendingAds();
            setAds(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error('Failed to load pending ads', err);
        } finally {
            setLoading(false);
        }
    };

    const showToast = (message, type = 'success') => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: '', type: '' }), 3000);
    };

    const handleApprove = async (id) => {
        setActionLoading(id);
        try {
            await updateAdStatus(id, 'active');
            setAds(prev => prev.filter(ad => ad._id !== id));
            showToast('Ad Approved Successfully', 'success');
        } catch (err) {
            console.error('Approval failed', err);
            showToast('Failed to approve ad', 'error');
        } finally {
            setActionLoading(null);
        }
    };

    const openRejectModal = (id) => {
        setSelectedAdId(id);
        setRejectReason('');
        setRejectModalOpen(true);
    };

    const handleRejectSubmit = async () => {
        if (!selectedAdId || !rejectReason.trim()) return;

        setActionLoading(selectedAdId);
        try {
            await updateAdStatus(selectedAdId, 'rejected', rejectReason);
            setAds(prev => prev.filter(ad => ad._id !== selectedAdId));
            showToast('Ad Rejected', 'success');
            setRejectModalOpen(false);
        } catch (err) {
            console.error('Rejection failed', err);
            showToast('Failed to reject ad', 'error');
        } finally {
            setActionLoading(null);
            setSelectedAdId(null);
        }
    };

    if (loading) return <div className="p-10 text-center">Loading pending ads...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Link to="/admin/dashboard" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </Link>
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Ads For Review ({ads.length})</h1>

            {/* Toast Notification */}
            {toast.message && (
                <div className={`fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all ${toast.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
                    {toast.message}
                </div>
            )}

            {ads.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <p className="text-gray-500 text-lg">No pending ads to review today! 🎉</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {ads.map((ad) => (
                        <div key={ad._id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row">
                            {/* Ad Preview Section */}
                            <div className="md:w-1/3 min-w-[300px] border-r border-gray-100 bg-gray-50 p-4 flex items-center justify-center">
                                <div className="w-full max-w-xs pointer-events-none transform scale-90 origin-center">
                                    <AdCard ad={ad} />
                                </div>
                            </div>

                            {/* Details & Actions Section */}
                            <div className="flex-1 p-6 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center gap-2 mb-4">
                                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-bold rounded uppercase">
                                            {ad.status}
                                        </span>
                                        <span className="text-sm text-gray-500">
                                            Submitted by {ad.user?.username || 'Unknown'} on {new Date(ad.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-6">
                                        <div>
                                            <span className="font-semibold block text-gray-900">Category:</span>
                                            {typeof ad.category === 'object' ? ad.category.name : ad.category}
                                        </div>
                                        <div>
                                            <span className="font-semibold block text-gray-900">Location:</span>
                                            <span className="capitalize">{ad.location?.area}, {ad.location?.city}</span> ({ad.location?.pincode})
                                        </div>
                                        <div>
                                            <span className="font-semibold block text-gray-900">Template:</span>
                                            {ad.template}
                                        </div>
                                        <div>
                                            <span className="font-semibold block text-gray-900">WhatsApp:</span>
                                            {ad.content?.contactPhone || ad.whatsappNumber || "N/A"}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <h4 className="font-bold text-gray-900 text-sm mb-1">Headline</h4>
                                        <p className="mb-3 font-medium text-gray-800">{ad.content?.title || ad.headline}</p>

                                        <h4 className="font-bold text-gray-900 text-sm mb-1">Description</h4>
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{ad.content?.description || ad.description}</p>
                                    </div>
                                </div>

                                <div className="flex gap-4 mt-6 pt-6 border-t border-gray-100">
                                    <button
                                        onClick={() => openRejectModal(ad._id)}
                                        disabled={actionLoading === ad._id}
                                        className="flex-1 px-4 py-2 border border-red-300 text-red-700 font-bold rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => handleApprove(ad._id)}
                                        disabled={actionLoading === ad._id}
                                        className="flex-1 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 flex justify-center items-center"
                                    >
                                        {actionLoading === ad._id ? 'Processing...' : 'Approve Ad'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Rejection Modal */}
            {rejectModalOpen && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl transform transition-all scale-100">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Reject Ad</h3>
                        <p className="text-gray-500 text-sm mb-4">Please provide a reason for rejection. This will be visible to the advertiser.</p>

                        <textarea
                            className="w-full h-32 border border-gray-300 rounded-lg p-3 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none mb-6"
                            placeholder="e.g., Content violates policy, Misleading headline..."
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => setRejectModalOpen(false)}
                                className="px-4 py-2 text-gray-600 font-medium hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleRejectSubmit}
                                disabled={!rejectReason.trim()}
                                className="px-6 py-2 bg-red-600 text-white font-bold rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Confirm Rejection
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminAdsReview;
