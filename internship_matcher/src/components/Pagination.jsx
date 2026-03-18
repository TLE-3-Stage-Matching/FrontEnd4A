import React from 'react';
import './Pagination.css';

/**
 * A reusable pagination component.
 * @param {number} currentPage - The currently active page.
 * @param {number} totalPages - The total number of pages.
 * @param {function} onPageChange - Function to call when a page number is clicked.
 */
const Pagination = ({currentPage, totalPages, onPageChange}) => {
    if (totalPages <= 1) {
        return null; // Don't render pagination if there's only one page
    }

    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
    }

    return (
        <nav className="pagination-container" aria-label="Paginering">
            <ul className="pagination-list">
                {/* Previous Page Button */}
                <li className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                        onClick={() => onPageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        aria-label="Ga naar vorige pagina"
                    >
                        &larr; Vorige
                    </button>
                </li>

                {/* Page Number Buttons */}
                {pageNumbers.map(number => (
                    <li key={number} className={`pagination-item ${currentPage === number ? 'active' : ''}`}>
                        <button
                            onClick={() => onPageChange(number)}
                            aria-current={currentPage === number ? 'page' : undefined}
                        >
                            {number}
                        </button>
                    </li>
                ))}

                {/* Next Page Button */}
                <li className={`pagination-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                        onClick={() => onPageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        aria-label="Ga naar volgende pagina"
                    >
                        Volgende &rarr;
                    </button>
                </li>
            </ul>
        </nav>
    );
};

export default Pagination;
