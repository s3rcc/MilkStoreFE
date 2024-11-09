import React, { useState, useEffect } from 'react';
import ProductSelector from '../Product/ProductSelector';

const GiftForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    point: '',
    giftName: '',
    productId: '',
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        point: initialData.point,
        giftName: initialData.giftName,
        productId: initialData.productId || '',
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const newErrors = {};
    if (!formData.giftName.trim()) {
      newErrors.giftName = 'Gift name is required';
    }
    if (!formData.productId) {
      newErrors.productId = 'Product selection is required';
    }
    if (formData.point <= 0) {
      newErrors.point = 'Points must be greater than 0';
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
        <label className="form-label">Gift Name</label>
        <input
          type="text"
          className={`form-control ${errors.giftName ? 'is-invalid' : ''}`}
          value={formData.giftName}
          onChange={(e) => {
            setFormData({ ...formData, giftName: e.target.value });
            setErrors({ ...errors, giftName: '' });
          }}
        />
        {errors.giftName && (
          <div className="invalid-feedback">{errors.giftName}</div>
        )}
      </div>

      <div className="mb-3">
        <label className="form-label">Points</label>
        <input
          type="number"
          className={`form-control ${errors.point ? 'is-invalid' : ''}`}
          value={formData.point}
          onChange={(e) => {
            setFormData({ ...formData, point: e.target.value });
            setErrors({ ...errors, point: '' });
          }}
          min="0"
        />
        {errors.point && (
          <div className="invalid-feedback">{errors.point}</div>
        )}
      </div>

      <div className="mb-3">
        <ProductSelector
          value={formData.productId}
          onChange={(productId) => {
            setFormData({ ...formData, productId });
            setErrors({ ...errors, productId: '' });
          }}
          error={errors.productId}
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

export default GiftForm; 