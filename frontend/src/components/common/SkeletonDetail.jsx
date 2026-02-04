import React from 'react';

const SkeletonDetail = () => {
    return (
        <div className="min-h-screen bg-white pb-24 font-sans animate-pulse">
            {/* Header Skeleton */}
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-40">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="h-4 w-32 bg-gray-200 rounded"></div>
                <div className="w-10"></div>
            </div>

            <main className="max-w-3xl mx-auto p-6 md:p-8">
                {/* Hero Card Skeleton */}
                <div className="bg-gray-100 rounded-[40px] p-8 md:p-12 mb-8 h-80 flex flex-col justify-center">
                    <div className="h-10 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded w-1/2 mb-8"></div>

                    <div className="flex gap-3 mt-8">
                        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                        <div className="h-8 w-24 bg-gray-200 rounded-full"></div>
                    </div>
                </div>

                {/* Content Skeleton */}
                <div className="space-y-8 px-2">
                    <div className="space-y-4">
                        <div className="h-6 w-48 bg-gray-100 rounded"></div>
                        <div className="space-y-2">
                            <div className="h-4 w-full bg-gray-100 rounded"></div>
                            <div className="h-4 w-full bg-gray-100 rounded"></div>
                            <div className="h-4 w-3/4 bg-gray-100 rounded"></div>
                        </div>
                    </div>

                    <div className="h-px bg-gray-100 w-full my-8"></div>

                    <div className="bg-gray-50 rounded-3xl p-6 border border-gray-100 flex gap-4 h-32 items-center">
                        <div className="w-12 h-12 bg-gray-200 rounded-full flex-shrink-0"></div>
                        <div className="flex-1 space-y-3">
                            <div className="h-5 w-40 bg-gray-200 rounded"></div>
                            <div className="h-4 w-60 bg-gray-200 rounded"></div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default SkeletonDetail;
