import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUsers, getPendingAds, getAllAds, getAdminStats } from '../../api/admin.api';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { useSocket } from '../../hooks/useSocket';

const AdminDashboard = () => {
    const socket = useSocket('admin');
    const [notifications, setNotifications] = useState([]);
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAds: 0,
        pendingAds: 0,
        activeAds: 0,
        usersWithSubs: 0
    });
    const [moneyStats, setMoneyStats] = useState({
        revenue: { total: 0, today: 0, last7Days: 0, last30Days: 0 },
        ads: { paid: 0, free: 0, total: 0, failedPayments: 0 },
        arpa: 0
    });
    const [chartData, setChartData] = useState({ line: [], bar: [] });
    const [loading, setLoading] = useState(true);

    const COLORS = ['#818CF8', '#34D399', '#FBBF24', '#F87171', '#A78BFA'];

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const [users, allAds, pendingAds, moneyKpis] = await Promise.all([
                    getUsers(),
                    getAllAds(),
                    getPendingAds(),
                    getAdminStats()
                ]);

                // --- Legacy KPI Stats ---
                setStats({
                    totalUsers: users.length,
                    totalAds: allAds.length,
                    pendingAds: pendingAds.length,
                    activeAds: allAds.filter(ad => ad.status?.toLowerCase() === 'active').length,
                    usersWithSubs: users.filter(u => u.subscription?.isActive).length
                });

                // --- Money KPIs ---
                setMoneyStats(moneyKpis);

                // --- Ad Submissions Over Time (7 Days) ---
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

                // --- Top Categories Bar Chart ---
                const adsByCategory = allAds.reduce((acc, ad) => {
                    const catName = typeof ad.category === 'object' ? ad.category.name : 'Uncategorized';
                    acc[catName] = (acc[catName] || 0) + 1;
                    return acc;
                }, {});

                const barData = Object.keys(adsByCategory).map(cat => ({
                    name: cat,
                    count: adsByCategory[cat]
                })).sort((a, b) => b.count - a.count).slice(0, 5);

                setChartData({ line: lineData, bar: barData });

            } catch (err) {
                console.error('Failed to load admin stats', err);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('adPaid', (data) => {
                const newLog = {
                    id: Date.now(),
                    msg: `New Payment: Ad "${data.title}" was just paid (₹${data.amount})`,
                    time: new Date().toLocaleTimeString()
                };
                setNotifications(prev => [newLog, ...prev].slice(0, 5));
            });
        }
    }, [socket]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link to="/" className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                        </Link>
                        <h1 className="text-xl font-black text-gray-900 tracking-tight uppercase">Admin Console</h1>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="px-3 py-1 bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-blue-100">Live Analytics</span>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Real-time Notifications */}
                {notifications.length > 0 && (
                    <div className="mb-8 space-y-3 animate-in fade-in slide-in-from-top-4 duration-500">
                        {notifications.map(n => (
                            <div key={n.id} className="bg-green-600 text-white p-4 rounded-2xl shadow-lg flex justify-between items-center bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-opacity-10">
                                <div className="flex items-center gap-3">
                                    <span className="p-2 bg-white/20 rounded-lg">🚀</span>
                                    <p className="font-bold text-sm tracking-tight">{n.msg}</p>
                                </div>
                                <span className="text-white/60 text-[10px] font-bold">{n.time}</span>
                            </div>
                        ))}
                    </div>
                )}

                {/* --- MONEY KPIs (Primary Focus) --- */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center text-xs shadow-lg shadow-blue-100">💰</span>
                            Money KPIs
                        </h2>
                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Updated just now</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {/* 30 Day Revenue */}
                        <div className="bg-white p-7 rounded-3xl shadow-xl shadow-blue-50/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-50 rounded-full opacity-50 transition-transform group-hover:scale-125"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Total Revenue (30d)</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-black text-blue-600">₹</span>
                                    <span className="text-3xl font-black text-gray-900 tracking-tighter">{moneyStats.revenue.last30Days.toLocaleString()}</span>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-[10px] font-black text-green-500 uppercase">Total: ₹{moneyStats.revenue.total.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Revenue Today */}
                        <div className="bg-white p-7 rounded-3xl shadow-xl shadow-green-50/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-green-50 rounded-full opacity-50 transition-transform group-hover:scale-125"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Revenue Today</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-black text-green-600">₹</span>
                                    <span className="text-3xl font-black text-gray-900 tracking-tighter">{moneyStats.revenue.today.toLocaleString()}</span>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                                    <span className="text-[10px] font-black text-gray-400 uppercase">Live Earnings</span>
                                </div>
                            </div>
                        </div>

                        {/* Paid vs Free Ads */}
                        <div className="bg-white p-7 rounded-3xl shadow-xl shadow-indigo-50/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-indigo-50 rounded-full opacity-50 transition-transform group-hover:scale-125"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Paid / Free Ads</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-3xl font-black text-gray-900 tracking-tighter">{moneyStats.ads.paid}</span>
                                    <span className="text-sm font-bold text-gray-300">/</span>
                                    <span className="text-xl font-bold text-gray-400 tracking-tighter">{moneyStats.ads.free}</span>
                                </div>
                                <div className="mt-4 flex flex-col gap-1">
                                    <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-indigo-500 rounded-full"
                                            style={{ width: `${(moneyStats.ads.paid / (moneyStats.ads.total || 1)) * 100}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-[10px] font-black text-indigo-500 uppercase">Conversion: {((moneyStats.ads.paid / (moneyStats.ads.total || 1)) * 100).toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>

                        {/* ARPA */}
                        <div className="bg-white p-7 rounded-3xl shadow-xl shadow-purple-50/50 border border-gray-100 relative overflow-hidden group hover:-translate-y-1 transition-all duration-300">
                            <div className="absolute -right-4 -top-4 w-24 h-24 bg-purple-50 rounded-full opacity-50 transition-transform group-hover:scale-125"></div>
                            <div className="relative z-10">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Average Revenue (ARPA)</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-black text-purple-600">₹</span>
                                    <span className="text-3xl font-black text-gray-900 tracking-tighter">{moneyStats.arpa}</span>
                                </div>
                                <div className="mt-4 flex items-center gap-2">
                                    <span className="text-[10px] font-black text-red-500 uppercase">{moneyStats.ads.failedPayments} Failed Payments</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- STANDARD KPIs (Navigable) --- */}
                <div className="mb-12">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-black text-gray-900 uppercase tracking-widest flex items-center gap-3">
                            <span className="w-8 h-8 rounded-xl bg-gray-900 text-white flex items-center justify-center text-xs shadow-lg shadow-gray-200">📊</span>
                            Platform Stats
                        </h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        <Link to="/admin/users" className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-blue-500 hover:shadow-lg transition-all group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Users</p>
                                    <p className="text-2xl font-black text-gray-900 mt-1">{stats.totalUsers}</p>
                                </div>
                                <span className="p-2 bg-gray-50 group-hover:bg-blue-50 text-gray-400 group-hover:text-blue-600 rounded-lg transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                </span>
                            </div>
                        </Link>

                        <Link to="/admin/all-ads" className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-indigo-500 hover:shadow-lg transition-all group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Ads</p>
                                    <p className="text-2xl font-black text-gray-900 mt-1">{stats.activeAds}</p>
                                </div>
                                <span className="p-2 bg-gray-50 group-hover:bg-indigo-50 text-gray-400 group-hover:text-indigo-600 rounded-lg transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </span>
                            </div>
                        </Link>

                        <Link to="/admin/ads-review" className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-orange-500 hover:shadow-lg transition-all group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Pending Review</p>
                                    <p className="text-2xl font-black text-orange-600 mt-1">{stats.pendingAds}</p>
                                </div>
                                <span className="p-2 bg-gray-50 group-hover:bg-orange-50 text-gray-400 group-hover:text-orange-600 rounded-lg transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                </span>
                            </div>
                        </Link>

                        <Link to="/admin/subscriptions" className="bg-white p-6 rounded-2xl border border-gray-100 hover:border-green-500 hover:shadow-lg transition-all group">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Plans</p>
                                    <p className="text-2xl font-black text-green-600 mt-1">{stats.usersWithSubs}</p>
                                </div>
                                <span className="p-2 bg-gray-50 group-hover:bg-green-50 text-gray-400 group-hover:text-green-600 rounded-lg transition-colors">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>

                {/* Charts Section Row 1 */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                    {/* Line Chart */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Ad Performance Trend</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={chartData.line} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" opacity={0.5} />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                    <YAxis allowDecimals={false} width={30} tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                    <Tooltip contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' }} />
                                    <Line type="monotone" dataKey="ads" stroke="#2563EB" strokeWidth={4} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 8, strokeWidth: 0 }} name="New Ads" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Bar Chart */}
                    <div className="bg-white p-8 rounded-3xl shadow-xl shadow-gray-200/40 border border-gray-100">
                        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-6">Top Performing Categories</h3>
                        <div className="h-72 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={chartData.bar} layout="vertical" margin={{ top: 5, right: 30, left: 40, bottom: 5 }}>
                                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E5E7EB" opacity={0.5} />
                                    <XAxis type="number" hide />
                                    <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 10, fontWeight: 'bold' }} axisLine={false} tickLine={false} />
                                    <Tooltip cursor={{ fill: '#F9FAFB' }} contentStyle={{ borderRadius: '16px', border: 'none' }} />
                                    <Bar dataKey="count" fill="#3B82F6" radius={[0, 8, 8, 0]} barSize={20}>
                                        {chartData.bar.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                        ))}
                                    </Bar>
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
