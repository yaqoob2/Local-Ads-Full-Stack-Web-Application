import React from 'react';

const ErrorBox = ({ message }) => {
    if (!message) return null;

    return (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
            <div className="flex">
                <div className="ml-3">
                    <p className="text-sm text-red-700">
                        {message}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ErrorBox;
