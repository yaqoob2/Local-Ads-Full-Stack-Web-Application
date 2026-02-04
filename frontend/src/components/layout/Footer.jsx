import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="bg-gray-50 border-t border-gray-200 py-8 mt-auto">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-sm text-gray-500">
                    <Link to="/privacy" className="hover:text-gray-900">Privacy Policy</Link>
                    <Link to="/terms" className="hover:text-gray-900">Terms of Service</Link>
                    <Link to="/contact" className="hover:text-gray-900">Contact Us</Link>
                </div>
                <div className="text-center mt-4 text-xs text-gray-400">
                    © {new Date().getFullYear()} LocalAdsConnect. All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
