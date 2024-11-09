import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import { productService } from '../../services/api';

const ProductSelector = ({ value, onChange, error }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchProducts = async (search = '') => {
    try {
      setLoading(true);
      const response = await productService.getProducts({
        pageIndex: 1,
        pageSize: 10,
        productname: search
      });
      
      if (response.data?.items) {
        setProducts(response.data.items);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách sản phẩm:', error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedFetch = debounce((term) => {
    fetchProducts(term);
  }, 300);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (value) {
      const product = products.find(p => p.id === value);
      setSelectedProduct(product);
    }
  }, [value, products]);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowDropdown(true);
    debouncedFetch(term);
  };

  const handleSelect = (product) => {
    setSelectedProduct(product);
    onChange(product.id);
    setShowDropdown(false);
    setSearchTerm('');
  };

  return (
    <div className="position-relative">
      <label className="form-label">Product</label>
      <div className="input-group" ref={inputRef}>
        <input
          type="text"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          placeholder="Search for products..."
          value={searchTerm || (selectedProduct?.productName || '')}
          onChange={handleSearch}
          onFocus={() => setShowDropdown(true)}
        />
        {selectedProduct && (
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => {
              setSelectedProduct(null);
              onChange('');
              setSearchTerm('');
            }}
          >
            <i className="bi bi-x"></i>
          </button>
        )}
      </div>
      
      {error && <div className="invalid-feedback d-block">{error}</div>}

      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="position-absolute w-100 mt-1 shadow bg-white rounded-2"
          style={{ 
            maxHeight: '200px', 
            overflowY: 'auto',
            zIndex: 1050 // Đảm bảo dropdown hiển thị trên modal
          }}
        >
          {loading ? (
            <div className="p-2 text-center">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : products.length > 0 ? (
            <div className="list-group list-group-flush">
              {products.map((product) => (
                <button
                  key={product.id}
                  type="button"
                  className="list-group-item list-group-item-action"
                  onClick={() => handleSelect(product)}
                >
                  <div className="d-flex align-items-center">
                    {product.imageUrl && (
                      <img 
                        src={product.imageUrl} 
                        alt={product.productName}
                        className="me-2"
                        style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                      />
                    )}
                    <div>
                      <div className="fw-bold">{product.productName}</div>
                      <small className="text-muted">
                        Price: ${product.price} | Stock: {product.quantityInStock}
                      </small>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-2 text-center text-muted">
              No products found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductSelector; 