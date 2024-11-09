import React, { useState, useEffect } from 'react';

const CategoryForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    categoryName: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        categoryName: initialData.categoryName || ''
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.categoryName.trim()) {
      newErrors.categoryName = 'Category name is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Category Name</label>
        <input
          type="text"
          className={`form-control ${errors.categoryName ? 'is-invalid' : ''}`}
          value={formData.categoryName}
          onChange={(e) => {
            setFormData({ ...formData, categoryName: e.target.value });
            setErrors({ ...errors, categoryName: '' });
          }}
        />
        {errors.categoryName && (
          <div className="invalid-feedback">{errors.categoryName}</div>
        )}
      </div>

      <div className="modal-footer px-0 pb-0">
        <button type="button" className="btn btn-secondary" onClick={onCancel}>
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          {initialData ? 'Update' : 'Create'}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm; 