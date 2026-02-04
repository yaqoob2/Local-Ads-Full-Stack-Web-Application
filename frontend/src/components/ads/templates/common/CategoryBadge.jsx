import React from 'react';

const CategoryBadge = ({ category, className = "" }) => {
    return (
        <span
            className={`
                inline-block px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wide
                bg-blue-100 text-blue-700 border border-blue-200
                ${className}
            `}
        >
            {category || "Service"}
        </span>
    );
};

export default CategoryBadge;
