import React from "react";

const PaginationControls = ({
  pagination,
  currentPage,
  loading,
  onPageChange,
}) => {
  if (!pagination) return null;

  const hasTotalPatients = pagination.total > 0;
  const isNextButtonDisabled =
    !pagination.totalPages || currentPage === pagination.totalPages || loading;
  const isPreviousButtonDisabled = currentPage === 1 || loading;

  const pageNumbers = Array.from(
    { length: pagination.totalPages || 0 },
    (_, index) => index + 1
  );
  const startIndex = (pagination.page - 1) * pagination.limit + 1;
  const endIndex = Math.min(
    pagination.page * pagination.limit,
    pagination.total
  );

  return (
    <div className="pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={isPreviousButtonDisabled}
      >
        Previous
      </button>

      {pageNumbers.map((page) => (
        <button
          key={page}
          className={page === currentPage ? "active" : ""}
          onClick={() => onPageChange(page)}
          disabled={loading}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={isNextButtonDisabled}
      >
        Next
      </button>

      <div className="pagination-info">
        {hasTotalPatients ? (
          <>
            Showing {startIndex}-{endIndex} of {pagination.total}
          </>
        ) : (
          "No patients to display"
        )}
      </div>
    </div>
  );
};

export default PaginationControls;
