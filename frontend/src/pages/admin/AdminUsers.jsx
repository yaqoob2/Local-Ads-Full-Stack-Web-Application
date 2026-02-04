import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, banUser, activateSubscription } from '../../api/admin.api';

const AdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    // Modal State
    const [isSubModalOpen, setSubModalOpen] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);
    const [subDuration, setSubDuration] = useState(365);
    const [subPlan, setSubPlan] = useState('');

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleBan = async (userId) => {
        if (!window.confirm('Are you sure you want to ban this user?')) return;
        try {
            await banUser(userId);
            loadUsers(); // Refresh list
        } catch (err) {
            alert('Failed to ban user');
        }
    };

    const openSubModal = (userId) => {
        setSelectedUserId(userId);
        setSubModalOpen(true);
    };

    const handleSubSubmit = async (e) => {
        e.preventDefault();
        try {
            await activateSubscription(selectedUserId, subPlan, Number(subDuration));
            alert('Subscription activated successfully');
            setSubModalOpen(false);
            loadUsers();
        } catch (err) {
            console.error(err);
            alert('Failed to activate subscription');
        }
    };

    const filteredUsers = users.filter(user =>
        (user.username || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.email || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <div className="p-8 text-center">Loading Users...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <Link to="/admin/dashboard" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Dashboard
            </Link>

            <h1 className="text-2xl font-bold mb-6">User Management</h1>

            {/* Search */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search users by name or email..."
                    className="w-full max-w-md px-4 py-2 border rounded-lg"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {/* Table */}
            <div className="bg-white shadow-sm rounded-lg overflow-hidden border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {filteredUsers.map(user => (
                            <tr key={user._id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0 h-10 w-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 font-bold text-lg uppercase">
                                            {(user.username || '?').charAt(0)}
                                        </div>
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.username}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {user.status === 'BANNED' ? (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Banned</span>
                                    ) : (
                                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                    <button
                                        onClick={() => openSubModal(user._id)}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        Manage Sub
                                    </button>
                                    <button
                                        onClick={() => handleBan(user._id)}
                                        className="text-red-600 hover:text-red-900"
                                    >
                                        Ban
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Subscription Modal */}
            {isSubModalOpen && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                        <h3 className="text-lg font-bold mb-4">Activate Subscription</h3>
                        <form onSubmit={handleSubSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Plan ID (from DB)</label>
                                <input
                                    type="text"
                                    required
                                    className="w-full border rounded px-3 py-2"
                                    value={subPlan}
                                    onChange={(e) => setSubPlan(e.target.value)}
                                    placeholder="e.g. 64f... (ObjectId)"
                                />
                                <p className="text-xs text-gray-500 mt-1">Check database for Plan ObjectIds</p>
                            </div>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
                                <input
                                    type="number"
                                    required
                                    className="w-full border rounded px-3 py-2"
                                    value={subDuration}
                                    onChange={(e) => setSubDuration(e.target.value)}
                                />
                            </div>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => setSubModalOpen(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                                >
                                    Activate
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminUsers;
