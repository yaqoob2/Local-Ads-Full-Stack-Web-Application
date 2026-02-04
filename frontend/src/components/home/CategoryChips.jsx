import React from 'react';

const CategoryChips = ({ categories = [], selectedCategory, onSelectCategory }) => {
    // Helper to get icon based on category name
    const getCategoryIcon = (name) => {
        const lowerName = (name || "").toLowerCase();
        if (lowerName.includes('ac') || lowerName.includes('cool')) return '❄️';
        if (lowerName.includes('appliance') || lowerName.includes('repair')) return '🛠️';
        if (lowerName.includes('baby') || lowerName.includes('child')) return '🍼';
        if (lowerName.includes('carpenter') || lowerName.includes('wood')) return '🪚';
        if (lowerName.includes('cater') || lowerName.includes('food') || lowerName.includes('cook')) return '🍽️';
        if (lowerName.includes('code') || lowerName.includes('soft') || lowerName.includes('web')) return '💻';
        if (lowerName.includes('clean') || lowerName.includes('maid')) return '🧹';
        if (lowerName.includes('electric')) return '⚡';
        if (lowerName.includes('paint')) return '🎨';
        if (lowerName.includes('pest')) return '🐜';
        if (lowerName.includes('photo') || lowerName.includes('camera')) return '📸';
        if (lowerName.includes('plumb')) return '🔧';
        if (lowerName.includes('tutor') || lowerName.includes('teach') || lowerName.includes('class')) return '📚';
        if (lowerName.includes('yoga') || lowerName.includes('gym') || lowerName.includes('fit')) return '🧘';
        if (lowerName.includes('beauty') || lowerName.includes('salon')) return '💇';
        if (lowerName.includes('drive') || lowerName.includes('taxi')) return '🚗';
        if (lowerName.includes('move') || lowerName.includes('pack')) return '📦';
        if (lowerName.includes('garden')) return '🌱';
        return '🔹'; // Default relevant icon
    };

    return (
        <div className="flex overflow-x-auto pb-4 gap-3 no-scrollbar mt-6">
            <button
                onClick={() => onSelectCategory('')}
                className={`flex items-center gap-2 px-6 py-3 rounded-full border whitespace-nowrap transition-all ${selectedCategory === ''
                    ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                    }`}
            >
                <span className="font-bold">All</span>
            </button>
            {categories.map((cat) => (
                <button
                    key={cat._id}
                    onClick={() => onSelectCategory(cat.name)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-full border whitespace-nowrap transition-all ${selectedCategory === cat.name
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                        }`}
                >
                    <span className="text-xl">{getCategoryIcon(cat.name)}</span>
                    <span className="font-medium">{cat.name}</span>
                </button>
            ))}
        </div>
    );
};

export default CategoryChips;
