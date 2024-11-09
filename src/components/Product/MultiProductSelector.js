import React, { useState, useEffect, useRef } from 'react';
import debounce from 'lodash/debounce';
import { productService } from '../../services/api';

const MultiProductSelector = ({ selectedProducts = [], onChange, error }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

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
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    fetchProducts();
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    setShowDropdown(true);
    debouncedFetch(term);
  };

  const handleSelect = (product) => {
    const isSelected = selectedProducts.some(p => p.id === product.id);
    let newSelected;
    
    if (isSelected) {
      newSelected = selectedProducts.filter(p => p.id !== product.id);
    } else {
      newSelected = [...selectedProducts, product];
    }
    
    onChange(newSelected);
  };

  const handleRemove = (productId) => {
    const newSelected = selectedProducts.filter(p => p.id !== productId);
    onChange(newSelected);
  };

  return (
    <div className="position-relative">
      <label className="form-label">Select Products</label>
      <div className="input-group" ref={inputRef}>
        <input
          type="text"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          placeholder="Search for products..."
          value={searchTerm}
          onChange={handleSearch}
          onFocus={() => setShowDropdown(true)}
        />
      </div>
      
      {error && <div className="invalid-feedback d-block">{error}</div>}

      {/* Selected Products */}
      {selectedProducts.length > 0 && (
        <div className="mt-2">
          {selectedProducts.map(product => (
            <span key={product.id} className="badge bg-primary me-2 mb-2">
              {product.productName}
              <button
                type="button"
                className="btn-close btn-close-white ms-2"
                style={{ fontSize: '0.5rem' }}
                onClick={() => handleRemove(product.id)}
              ></button>
            </span>
          ))}
        </div>
      )}

      {/* Dropdown */}
      {showDropdown && (
        <div 
          ref={dropdownRef}
          className="position-absolute w-100 mt-1 shadow bg-white rounded-2"
          style={{ 
            maxHeight: '200px', 
            overflowY: 'auto',
            zIndex: 1050
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
                  className={`list-group-item list-group-item-action ${
                    selectedProducts.some(p => p.id === product.id) ? 'active' : ''
                  }`}
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

export default MultiProductSelector; 