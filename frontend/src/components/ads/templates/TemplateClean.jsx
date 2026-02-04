import React from 'react';
import WhatsAppButton from './common/WhatsAppButton';

const TemplateClean = ({
    headline,
    subtext,
    description,
    category,
    area,
    pincode,
    whatsappNumber,
    tags = [],
    onWhatsAppClick
}) => {
    // Generate a consistent pastel color based on the headline or category length
    const colors = [
        {
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            pill: 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-200',
            hover: 'hover:bg-blue-100 dark:hover:bg-blue-900/30',
            icon: 'text-blue-900 dark:text-blue-300'
        },
        {
            bg: 'bg-orange-50 dark:bg-orange-900/20',
            pill: 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-200',
            hover: 'hover:bg-orange-100 dark:hover:bg-orange-900/30',
            icon: 'text-orange-900 dark:text-orange-300'
        },
        {
            bg: 'bg-purple-50 dark:bg-purple-900/20',
            pill: 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-200',
            hover: 'hover:bg-purple-100 dark:hover:bg-purple-900/30',
            icon: 'text-purple-900 dark:text-purple-300'
        },
        {
            bg: 'bg-green-50 dark:bg-green-900/20',
            pill: 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-200',
            hover: 'hover:bg-green-100 dark:hover:bg-green-900/30',
            icon: 'text-green-900 dark:text-green-300'
        },
        {
            bg: 'bg-pink-50 dark:bg-pink-900/20',
            pill: 'bg-pink-100 text-pink-800 dark:bg-pink-900/50 dark:text-pink-200',
            hover: 'hover:bg-pink-100 dark:hover:bg-pink-900/30',
            icon: 'text-pink-900 dark:text-pink-300'
        },
    ];

    const index = (headline?.length || 0) % colors.length;
    const theme = colors[index];

    const handleWhatsAppClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        // Call parent tracking handler if provided
        if (onWhatsAppClick) {
            onWhatsAppClick(e);
        }

        const cleanNumber = whatsappNumber?.replace(/\D/g, '') || '';
        window.open(`https://wa.me/${cleanNumber}`, '_blank');
    };

    return (
        <div className={`${theme.bg} rounded-[32px] p-8 h-full flex flex-col transition-transform duration-300 hover:scale-[1.02] relative group`}>
            {/* Header Content */}
            <div className="mb-6">
                <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
                    {headline}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm font-medium leading-relaxed mb-4 line-clamp-3">
                    {description || subtext}
                </p>

                {/* Tags / Pills */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {tags && tags.length > 0 ? tags.map((tag, i) => (
                        <span key={i} className={`${theme.pill} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide`}>
                            {tag}
                        </span>
                    )) : (
                        <>
                            <span className={`${theme.pill} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide`}>{category}</span>
                            <span className={`${theme.pill} px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide`}>{area}</span>
                        </>
                    )}
                </div>
            </div>

            {/* Spacer */}
            <div className="flex-1"></div>

            {/* Footer / Action Bar */}
            <div className="flex items-center justify-between mt-6 pt-4">
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                    Explore
                </span>

                <div className="flex gap-3">
                    {/* WhatsApp Button - Same size/style as arrow */}
                    <button
                        onClick={handleWhatsAppClick}
                        className="bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center shadow-sm cursor-pointer transition-colors border border-transparent hover:border-green-200 dark:border-gray-700"
                        title="Chat on WhatsApp"
                    >
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.015-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                        </svg>
                    </button>

                    {/* Arrow Button */}
                    <div className="bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 w-10 h-10 rounded-full flex items-center justify-center shadow-sm cursor-pointer transition-colors">
                        <svg className={`w-5 h-5 ${theme.icon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TemplateClean;
