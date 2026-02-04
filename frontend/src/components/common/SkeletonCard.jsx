import React from 'react';

const SkeletonCard = () => {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col animate-pulse">
            {/* Top Bar (Badge) */}
            <div className="p-4 pb-2 flex justify-between">
                <div className="h-4 w-20 bg-gray-200 rounded"></div>
                <div className="h-4 w-16 bg-gray-200 rounded"></div>
            </div>

            {/* Content Body */}
            <div className="px-4 py-2 flex-grow">
                {/* Headline */}
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>

                {/* Subtext */}
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>

                {/* Description lines */}
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>

                {/* Location */}
                <div className="mt-4 flex gap-2">
                    <div className="h-3 w-3 bg-gray-200 rounded-full"></div>
                    <div className="h-3 w-24 bg-gray-200 rounded"></div>
                </div>
            </div>

            {/* Footer / Button */}
            <div className="p-4 bg-gray-50 mt-auto border-t border-gray-100">
                <div className="h-10 bg-gray-200 rounded-lg w-full"></div>
            </div>
        </div>
    );
};

export default SkeletonCard;
