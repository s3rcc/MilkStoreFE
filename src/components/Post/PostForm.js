import React, { useState, useEffect } from 'react';
import MultiProductSelector from '../Product/MultiProductSelector';

const PostForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    selectedProducts: []
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        selectedProducts: initialData.products || []
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.content.trim()) {
      newErrors.content = 'Content is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Chuẩn bị dữ liệu theo đúng format API yêu cầu
    const submitData = {
      title: formData.title,
      content: formData.content,
      productIDs: formData.selectedProducts.map(p => p.id)
    };

    try {
      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input
          type="text"
          className={`form-control ${errors.title ? 'is-invalid' : ''}`}
          value={formData.title}
          onChange={(e) => {
            setFormData({ ...formData, title: e.target.value });
            setErrors({ ...errors, title: '' });
          }}
        />
        {errors.title && (
          <div className="invalid-feedback">{errors.title}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Content</label>
        <textarea
          className={`form-control ${errors.content ? 'is-invalid' : ''}`}
          value={formData.content}
          onChange={(e) => {
            setFormData({ ...formData, content: e.target.value });
            setErrors({ ...errors, content: '' });
          }}
          rows="5"
        />
        {errors.content && (
          <div className="invalid-feedback">{errors.content}</div>
        )}
      </div>

      <div className="mb-3">
        <MultiProductSelector
          selectedProducts={formData.selectedProducts}
          onChange={(products) => {
            setFormData({ ...formData, selectedProducts: products });
          }}
        />
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

export default PostForm; 