import React from 'react';

const LoadingButton = ({
    onClick,
    loading = false,
    children,
    className = "",
    disabled = false,
    variant = "primary" // primary, success, danger
}) => {
    const variants = {
        primary: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200",
        success: "bg-green-600 hover:bg-green-700 text-white shadow-green-200",
        danger: "bg-red-600 hover:bg-red-700 text-white shadow-red-200"
    };

    const baseClasses = "w-full font-bold py-4 rounded-xl shadow-lg transition-all transform hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2";

    return (
        <button
            onClick={onClick}
            disabled={loading || disabled}
            className={`${baseClasses} ${variants[variant] || variants.primary} ${className}`}
        >
            {loading ? (
                <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Processing...</span>
                </>
            ) : (
                children
            )}
        </button>
    );
};

export default LoadingButton;
