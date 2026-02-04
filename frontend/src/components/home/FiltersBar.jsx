import React from 'react';

const cities = ["Delhi", "Mumbai", "Bengaluru", "Hyderabad", "Chennai", "Kolkata", "Ahmedabad", "Pune", "Surat", "Jaipur"];

const FiltersBar = ({ filters, onFilterChange, categories = [], onUseLocation }) => {
    return (
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 mb-6 transition-colors">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
                {/* Category Dropdown - 2 cols on desktop */}
                <div className="lg:col-span-2">
                    <select
                        value={filters.category}
                        onChange={(e) => onFilterChange('category', e.target.value)}
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-white transition-colors"
                    >
                        <option value="">All Categories</option>
                        {[...categories].sort((a, b) => a.name.localeCompare(b.name)).map((cat) => (
                            <option key={cat._id} value={cat.name}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* City Dropdown - 2 cols on desktop */}
                <div className="lg:col-span-2 relative">
                    <select
                        value={filters.city}
                        onChange={(e) => onFilterChange('city', e.target.value)}
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 dark:text-white appearance-none transition-colors"
                    >
                        <option value="">Select City</option>
                        {cities.map((city) => (
                            <option key={city} value={city.toLowerCase()}>{city}</option>
                        ))}
                    </select>
                    {/* Location Icon Button */}
                    <button
                        onClick={onUseLocation}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-600 rounded-full transition-colors"
                        title="Use my location"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </button>
                </div>

                {/* Pincode Input - 2 cols on desktop */}
                <div className="lg:col-span-2">
                    <input
                        type="text"
                        placeholder="Pincode"
                        value={filters.pincode}
                        onChange={(e) => onFilterChange('pincode', e.target.value)}
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 text-gray-700 dark:text-white transition-colors"
                    />
                </div>

                {/* Search Box - 4 cols on desktop */}
                <div className="md:col-span-2 lg:col-span-4">
                    <input
                        type="text"
                        placeholder="Search for services..."
                        value={filters.search}
                        onChange={(e) => onFilterChange('search', e.target.value)}
                        className="w-full h-12 px-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 dark:placeholder-gray-500 text-gray-700 dark:text-white transition-colors"
                    />
                </div>

                {/* Apply Button - 2 cols on desktop (Visual only as filtering is instant/reactive) */}
                <div className="md:col-span-2 lg:col-span-2">
                    <button className="w-full h-12 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white font-semibold rounded-lg shadow-md transition-colors">
                        Apply
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FiltersBar;
