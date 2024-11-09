import React from 'react';

const UserPagination = ({ currentPage, pageSize, totalItems, onPageChange, onPageSizeChange }) => {
  return (
    <div className="d-flex justify-content-between align-items-center mt-3">
      <div className="d-flex align-items-center gap-2">
        <select
          className="form-select form-select-sm"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
        <span className="text-muted">
          Hiển thị {pageSize} / {totalItems || 0} kết quả
        </span>
      </div>
      <nav>
        <ul className="pagination pagination-sm mb-0">
          {totalItems && Array.from({ length: Math.ceil(totalItems / pageSize) }).map((_, index) => (
            <li
              key={index}
              className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
            >
              <button
                className="page-link"
                onClick={() => onPageChange(index + 1)}
              >
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default UserPagination; 