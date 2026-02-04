import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, getPendingAds, getAllAds } from '../../api/admin.api';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAds: 0,
        pendingAds: 0,
        activeAds: 0,
        usersWithSubs: 0
    });
    const [chartData, setChartData] = useState({ line: [], bar: [], status: [], role: [] });
    const [loading, setLoading] = useState(true);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];
    const STATUS_COLORS = ['#10B981', '#F59E0B', '#EF4444']; // Green, Yellow, Red
    const ROLE_COLORS = ['#3B82F6', '#8B5CF6']; // Blue, Purple

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [users, allAds, pendingAds] = await Promise.all([
                    getUsers(),
                    getAllAds(),
                    getPendingAds()
                ]);

                // --- KPI Stats ---
                const subbedUsers = users.filter(u => u.subscription?.isActive).length;

                setStats({
                    totalUsers: users.length,
                    totalAds: allAds.length,
                    pendingAds: pendingAds.length,
                    activeAds: allAds.filter(ad => ad.status === 'active').length,
                    usersWithSubs: subbedUsers
                });

                // --- Line Chart Data: Ads Creation Over Time ---
                const adsByDate = allAds.reduce((acc, ad) => {
                    const date = new Date(ad.createdAt).toLocaleDateString('en-CA');
                    acc[date] = (acc[date] || 0) + 1;
                    return acc;
                }, {});

                const sortedDates = Object.keys(adsByDate).sort().slice(-7);
                const lineData = sortedDates.map(date => ({
                    date: date,
                    ads: adsByDate[date]
                }));


                // --- Bar Chart Data: Ads by Category ---
                const adsByCategory = allAds.reduce((acc, ad) => {
                    const catName = typeof ad.category === 'object' ? ad.category.name : 'Uncategorized';
                    acc[catName] = (acc[catName] || 0) + 1;
                    return acc;
                }, {});

                const barData = Object.keys(adsByCategory).map(cat => ({
                    name: cat,
                    count: adsByCategory[cat]
                })).sort((a, b) => b.count - a.count).slice(0, 5);


                // --- Pie Chart 1: Ad Status Distribution ---
                const statusCounts = allAds.reduce((acc, ad) => {
                    const status = ad.status || 'unknown';
                    acc[status] = (acc[status] || 0) + 1;
                    return acc;
                }, {});
                const statusData = Object.keys(statusCounts).map(status => ({
                    name: status.charAt(0).toUpperCase() + status.slice(1),
                    value: statusCounts[status]
                }));

                // --- Pie Chart 2: User Role Distribution ---
                const roleCounts = users.reduce((acc, user) => {
                    const role = user.role || 'USER';
                    acc[role] = (acc[role] || 0) + 1;
                    return acc;
                }, {});
                const roleData = Object.keys(roleCounts).map(role => ({
                    name: role,
                    value: roleCounts[role]
                }));

                setChartData({ line: lineData, bar: barData, status: statusData, role: roleData });

            } catch (err) {
                console.error('Failed to load admin stats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) return <div className="p-10 text-center">Loading Analytics...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Link to="/" className="inline-flex items-center text-gray-500 hover:text-blue-600 mb-6 transition-colors font-medium">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back to Home
            </Link>

            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Admin Analytics Dashboard</h1>
                <div className="text-sm text-gray-500">Overview of platform performance</div>
            </div>

            {/* KPI Cards (Clickable) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                <Link to="/admin/users" className="block group">
                    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase group-hover:text-blue-600 transition-colors">Total Users</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalUsers}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link to="/admin/all-ads" className="block group">
                    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase group-hover:text-indigo-600 transition-colors">Total Ads</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.totalAds}</p>
                                <span className="text-xs text-green-600 font-medium">{stats.activeAds} Active</span>
                            </div>
                            <div className="p-3 bg-indigo-100 rounded-lg text-indigo-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link to="/admin/ads-review" className="block group">
                    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase group-hover:text-orange-600 transition-colors">Pending Submissions</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.pendingAds}</p>
                            </div>
                            <div className="p-3 bg-orange-100 rounded-lg text-orange-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>
                    </div>
                </Link>

                <Link to="/admin/users" className="block group">
                    <div className="bg-white rounded-xl shadow border border-gray-100 p-6 transition-all hover:shadow-md hover:-translate-y-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm font-medium text-gray-500 uppercase group-hover:text-green-600 transition-colors">Active Subscriptions</p>
                                <p className="text-3xl font-bold text-gray-900 mt-1">{stats.usersWithSubs || 0}</p>
                                <p className="text-xs text-gray-400 mt-1">Premium Users</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-lg text-green-600">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                            </div>
                        </div>
                    </div>
                </Link>
            </div>

            {/* Charts Section Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

                {/* Line Chart */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Ad Submissions (7 Days)</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={chartData.line} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                                <YAxis allowDecimals={false} width={30} tick={{ fontSize: 12 }} />
                                <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                                <Legend />
                                <Line type="monotone" dataKey="ads" stroke="#4F46E5" strokeWidth={3} activeDot={{ r: 8 }} name="New Ads" />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Bar Chart */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Top Categories</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData.bar} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                                <XAxis type="number" allowDecimals={false} hide />
                                <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 12 }} />
                                <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '8px' }} />
                                <Bar dataKey="count" fill="#8884d8" radius={[0, 4, 4, 0]}>
                                    {chartData.bar.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Charts Section Row 2 - New Pie Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
                {/* Pie Chart: Ad Status */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Ad Status Distribution</h3>
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData.status}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.status.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Pie Chart: User Roles */}
                <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">User Roles Distribution</h3>
                    <div className="h-64 w-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={chartData.role}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {chartData.role.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={ROLE_COLORS[index % ROLE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
