import React, { useState, useEffect } from 'react';
import { productService } from '../../services/api';

const GiftList = ({ 
  gifts = [], 
  loading, 
  onEdit, 
  onDelete, 
  pagination,
  onPageChange 
}) => {
  const [productNames, setProductNames] = useState({});

  // Fetch product names for all product IDs
  useEffect(() => {
    const fetchProductNames = async () => {
      const uniqueProductIds = [...new Set(gifts.map(gift => gift.productId))];
      const names = {};

      for (const productId of uniqueProductIds) {
        try {
          const response = await productService.getProduct(productId);
          if (response.data?.items?.[0]) {
            names[productId] = response.data.items[0].productName;
          }
        } catch (error) {
          console.error('Lỗi khi tải tên sản phẩm:', error);
          names[productId] = 'Sản phẩm không xác định';
        }
      }

      setProductNames(names);
    };

    if (gifts.length > 0) {
      fetchProductNames();
    }
  }, [gifts]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!gifts || gifts.length === 0) {
    return <div className="alert alert-info">Không có quà tặng nào được tìm thấy.</div>;
  }

  return (
    <div>
      <div className="table-responsive">
        <table className="table table-striped table-hover">
          <thead>
            <tr>
              <th>Gift Name</th>
              <th>Points</th>
              <th>Product</th>
              <th>Created At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {gifts.map((gift) => (
              <tr key={gift.id}>
                <td>{gift.giftName}</td>
                <td>{gift.point}</td>
                <td>{productNames[gift.productId] || 'Loading...'}</td>
                <td>{new Date(gift.createdAt).toLocaleDateString()}</td>
                <td>
                  <button
                    onClick={() => onEdit(gift)}
                    className="btn btn-sm btn-outline-primary me-2"
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    onClick={() => onDelete(gift.id)}
                    className="btn btn-sm btn-outline-danger"
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <nav aria-label="Gift list pagination" className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${!pagination.hasPreviousPage ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
              >
                Previous
              </button>
            </li>
            
            {[...Array(pagination.totalPages)].map((_, index) => (
              <li 
                key={index + 1} 
                className={`page-item ${pagination.currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => onPageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${!pagination.hasNextPage ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => onPageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default GiftList; 