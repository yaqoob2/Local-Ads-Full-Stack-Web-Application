import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const location = useLocation(); // Hook to detect route changes
    const navigate = useNavigate();

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userRole, setUserRole] = useState(null);

    const [isDark, setIsDark] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') === 'dark' ||
                (!localStorage.getItem('theme') && window.matchMedia('(prefers-color-scheme: dark)').matches);
        }
        return false;
    });

    // Check Auth on Mount & Route Change
    React.useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole');
        setIsAuthenticated(!!token);
        setUserRole(role);
    }, [location]);

    React.useEffect(() => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
        }
    }, [isDark]);

    const toggleTheme = () => setIsDark(!isDark);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        setIsAuthenticated(false);
        setUserRole(null);
        navigate('/login');
    };

    return (
        <nav className="sticky top-0 z-50 bg-white border-b border-gray-200 dark:bg-gray-900 dark:border-gray-800 transition-colors duration-300 rounded-b-2xl">
            <div className="max-w-7xl mx-auto px-4 h-[70px] flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2 h-full hover:opacity-90">
                    <img src="/logo.png" alt="AdsHub Icon" className="h-[40px] md:h-[68px] w-auto object-contain" />
                </Link>

                {/* Main Navigation (Desktop) */}
                <div className="hidden md:flex items-center space-x-8">
                    <Link to="/" className="text-gray-600 hover:text-blue-600 font-medium transition-colors dark:text-gray-300 dark:hover:text-blue-400">Home</Link>
                    <Link to="/about" className="text-gray-600 hover:text-blue-600 font-medium transition-colors dark:text-gray-300 dark:hover:text-blue-400">About Us</Link>
                    <Link to="/contact" className="text-gray-600 hover:text-blue-600 font-medium transition-colors dark:text-gray-300 dark:hover:text-blue-400">Contact Us</Link>
                    <Link to="/pricing" className="text-gray-600 hover:text-blue-600 font-medium transition-colors dark:text-gray-300 dark:hover:text-blue-400">Pricing</Link>
                    {/* Link to Admin or Dashboard if logged in */}
                    {isAuthenticated && userRole === 'ADMIN' && (
                        <Link to="/admin" className="text-gray-600 hover:text-blue-600 font-medium transition-colors dark:text-gray-300 dark:hover:text-blue-400">Admin Panel</Link>
                    )}
                    {isAuthenticated && userRole === 'ADVERTISER' && (
                        <Link to="/advertiser/dashboard" className="text-gray-600 hover:text-blue-600 font-medium transition-colors dark:text-gray-300 dark:hover:text-blue-400">Dashboard</Link>
                    )}

                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 md:gap-4">
                    {/* Theme Toggle */}
                    <button
                        onClick={toggleTheme}
                        className="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 transition-colors"
                        title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                    >
                        {isDark ? (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                        ) : (
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
                        )}
                    </button>

                    <div className="w-px h-6 bg-gray-200 hidden md:block dark:bg-gray-700"></div>

                    {isAuthenticated ? (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/profile"
                                className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 flex items-center justify-center transition-colors text-gray-600 dark:text-gray-300"
                                title="My Profile"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </Link>
                            <button
                                onClick={handleLogout}
                                className="bg-red-600 hover:bg-red-700 text-white text-xs md:text-sm font-bold px-4 py-2 rounded-full transition-all shadow-md"
                            >
                                Logout
                            </button>
                        </div>
                    ) : (
                        <>
                            <Link
                                to="/login"
                                className="text-gray-700 hover:text-gray-900 font-medium hidden md:block dark:text-gray-200 dark:hover:text-white"
                            >
                                Login
                            </Link>
                            <Link
                                to="/signup"
                                className="bg-gray-900 hover:bg-black text-white text-xs md:text-sm font-bold px-4 py-2 md:px-5 md:py-2.5 rounded-full transition-all transform hover:scale-105 active:scale-95 whitespace-nowrap dark:bg-blue-600 dark:hover:bg-blue-700"
                            >
                                Get Started
                            </Link>
                        </>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white focus:outline-none"
                    >
                        {isMenuOpen ? (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden absolute top-[70px] left-0 right-0 bg-white border-b border-gray-200 shadow-xl dark:bg-gray-900 dark:border-gray-800">
                    <div className="flex flex-col p-4 space-y-4">
                        <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium text-lg dark:text-gray-200">Home</Link>
                        {isAuthenticated && userRole === 'ADMIN' && (
                            <Link to="/admin" onClick={() => setIsMenuOpen(false)} className="text-blue-600 font-medium text-lg">Admin Panel</Link>
                        )}
                        {isAuthenticated && userRole === 'ADVERTISER' && (
                            <Link to="/advertiser/dashboard" onClick={() => setIsMenuOpen(false)} className="text-blue-600 font-medium text-lg">Dashboard</Link>
                        )}
                        <Link to="/about" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium text-lg dark:text-gray-200">About Us</Link>
                        <Link to="/contact" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium text-lg dark:text-gray-200">Contact Us</Link>
                        <Link to="/pricing" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium text-lg dark:text-gray-200">Pricing</Link>

                        <div className="h-px bg-gray-100 w-full dark:bg-gray-800"></div>

                        {isAuthenticated ? (
                            <button onClick={() => { handleLogout(); setIsMenuOpen(false); }} className="text-red-600 font-bold text-lg text-left">Logout</button>
                        ) : (
                            <Link to="/login" onClick={() => setIsMenuOpen(false)} className="text-gray-700 font-medium text-lg dark:text-gray-200">Login</Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
