import React, { useMemo } from 'react';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
}) => {

  const paginationRange = useMemo(() => {
    const siblingCount = 1;
    const totalPageNumbers = siblingCount + 5; 

    if (totalPages <= totalPageNumbers) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);

    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPages;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1);
      return [...leftRange, '...', totalPages];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = Array.from({ length: rightItemCount }, (_, i) => totalPages - rightItemCount + i + 1);
      return [firstPageIndex, '...', ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = Array.from({ length: rightSiblingIndex - leftSiblingIndex + 1 }, (_, i) => leftSiblingIndex + i);
      return [firstPageIndex, '...', ...middleRange, '...', lastPageIndex];
    }
    
    return [];
  }, [currentPage, totalPages]);

  const onNext = () => onPageChange(currentPage + 1);
  const onPrevious = () => onPageChange(currentPage - 1);

  const textButtonStyle = "flex items-center gap-1 px-2 py-1 text-sm font-medium text-gray-500 hover:text-gray-700 disabled:opacity-40 disabled:hover:text-gray-500 transition-colors disabled:cursor-not-allowed";
  const numberButtonStyle = "h-8 w-8 flex items-center justify-center rounded-full text-sm font-medium transition-colors mx-0.5";

  return (
    <div className="flex justify-center sm:justify-end items-center gap-4 mt-6 w-full select-none">
      
      <div className="flex sm:hidden items-center gap-6">
          <button onClick={onPrevious} disabled={currentPage === 1} className={textButtonStyle}>
             ← Previous
          </button>

          <button onClick={onNext} disabled={currentPage === totalPages} className={textButtonStyle}>
             Next →
          </button>
      </div>

      <div className="hidden sm:flex items-center gap-1">
        
        <button onClick={onPrevious} disabled={currentPage === 1} className={`${textButtonStyle} mr-2`}>
            ← Previous
        </button>

        {paginationRange.map((pageNumber, index) => {
           if (pageNumber === '...') {
             return <span key={index} className="px-1 text-gray-400">...</span>;
           }
           
           return (
            <button
                key={index}
                onClick={() => onPageChange(pageNumber)}
                className={`${numberButtonStyle} 
                ${currentPage === pageNumber 
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:bg-gray-100' 
                }`}
            >
                {pageNumber}
            </button>
            );
        })}

         <button onClick={onNext} disabled={currentPage === totalPages} className={`${textButtonStyle} ml-2`}>
             Next →
        </button>
      </div>

    </div>
  );
};

export default Pagination;