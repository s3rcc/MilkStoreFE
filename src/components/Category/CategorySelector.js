import React, { useState, useEffect, useRef } from 'react';
import { categoryService } from '../../services/api';

const CategorySelector = ({ value, onChange, error }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories();
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách danh mục:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
          inputRef.current && !inputRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    fetchCategories();
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (value && categories.length > 0) {
      const category = categories.find(c => c.id === value);
      setSelectedCategory(category);
    }
  }, [value, categories]);

  return (
    <div className="position-relative">
      <label className="form-label">Category</label>
      <div className="input-group" ref={inputRef}>
        <input
          type="text"
          className={`form-control ${error ? 'is-invalid' : ''}`}
          placeholder="Click to select category..."
          value={selectedCategory?.categoryName || ''}
          onChange={() => {}} // Readonly input
          onClick={() => setShowDropdown(true)}
          readOnly
        />
        {selectedCategory && (
          <button
            className="btn btn-outline-secondary"
            type="button"
            onClick={() => {
              setSelectedCategory(null);
              onChange('');
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
            zIndex: 1050
          }}
        >
          {loading ? (
            <div className="p-2 text-center">
              <div className="spinner-border spinner-border-sm" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : categories.length > 0 ? (
            <div className="list-group list-group-flush">
              {categories.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  className={`list-group-item list-group-item-action ${
                    selectedCategory?.id === category.id ? 'active' : ''
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    onChange(category.id);
                    setShowDropdown(false);
                  }}
                >
                  <div className="fw-bold">{category.categoryName}</div>
                  <small className="text-muted">
                    Created: {new Date(category.createdAt).toLocaleDateString()}
                  </small>
                </button>
              ))}
            </div>
          ) : (
            <div className="p-2 text-center text-muted">
              No categories found
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CategorySelector; 