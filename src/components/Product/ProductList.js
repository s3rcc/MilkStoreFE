import React from 'react';

const ProductList = ({ products, loading, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="table-responsive">
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Ảnh</th>
            <th>Tên sản phẩm</th>
            <th>Mô tả</th>
            <th>Giá</th>
            <th>Số lượng</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map(product => (
            <tr key={product.id}>
              <td>
                <img 
                  src={product.imageUrl || 'https://via.placeholder.com/50x50'} 
                  alt={product.productName}
                  style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                />
              </td>
              <td>{product.productName}</td>
              <td>{product.description?.substring(0, 100)}...</td>
              <td>{product.price.toLocaleString('vi-VN')}đ</td>
              <td>{product.quantityInStock}</td>
              <td>
                <div className="btn-group">
                  <button
                    className="btn btn-sm btn-primary me-1"
                    onClick={() => onEdit(product)}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => onDelete(product.id)}
                  >
                    <i className="bi bi-trash"></i>
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProductList; 