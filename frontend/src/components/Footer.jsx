import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-800 text-white mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm">© 2026 LocalConnect Ads. All rights reserved.</p>
                    </div>
                    <div className="space-x-4 text-sm">
                        <a href="#" className="hover:text-gray-300">Privacy</a>
                        <a href="#" className="hover:text-gray-300">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
