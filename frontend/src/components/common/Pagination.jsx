import React from 'react';

const Pagination = ({ itemsPerPage, totalItems, paginate, currentPage }) => {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (pageNumbers.length <= 1) return null;

    return (
        <nav className="flex justify-center mt-8">
            <ul className="flex items-center space-x-2">
                {/* Previous Button */}
                <li>
                    <button
                        onClick={() => paginate(currentPage - 1)}
                        disabled={currentPage === 1}
                        className={`px-3 py-2 leading-tight border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage === 1 ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-white text-gray-500'}`}
                    >
                        Previous
                    </button>
                </li>

                {/* Page Numbers */}
                {pageNumbers.map(number => (
                    <li key={number}>
                        <button
                            onClick={() => paginate(number)}
                            className={`px-3 py-2 leading-tight border border-gray-300 rounded-lg hover:bg-red-100 hover:text-red-700 ${currentPage === number ? 'bg-red-50 text-red-600 border-red-300 font-bold' : 'bg-white text-gray-500'}`}
                        >
                            {number}
                        </button>
                    </li>
                ))}

                {/* Next Button */}
                <li>
                    <button
                        onClick={() => paginate(currentPage + 1)}
                        disabled={currentPage === pageNumbers.length}
                        className={`px-3 py-2 leading-tight border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-700 ${currentPage === pageNumbers.length ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-white text-gray-500'}`}
                    >
                        Next
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
