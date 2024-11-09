import React, { useState, useEffect } from 'react';

const VoucherForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    name: '',
    voucherCode: '',
    description: '',
    salePrice: '',
    salePercent: '',
    limitSalePrice: '',
    expiryDate: '',
    usingLimit: '',
    status: 0
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        voucherCode: initialData.voucherCode || '',
        description: initialData.description || '',
        salePrice: initialData.salePrice || '',
        salePercent: initialData.salePercent || '',
        limitSalePrice: initialData.limitSalePrice || '',
        expiryDate: initialData.expiryDate ? new Date(initialData.expiryDate).toISOString().split('T')[0] : '',
        usingLimit: initialData.usingLimit || '',
        status: initialData.status || 0
      });
    }
  }, [initialData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    // Basic validation
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.voucherCode.trim()) {
      newErrors.voucherCode = 'Code is required';
    }
    if (!formData.expiryDate) {
      newErrors.expiryDate = 'Expiry date is required';
    }
    if (formData.usingLimit < 0) {
      newErrors.usingLimit = 'Using limit cannot be negative';
    }
    if (formData.salePrice < 0) {
      newErrors.salePrice = 'Sale price cannot be negative';
    }
    if (formData.salePercent < 0 || formData.salePercent > 100) {
      newErrors.salePercent = 'Sale percent must be between 0 and 100';
    }
    if (formData.limitSalePrice < 0) {
      newErrors.limitSalePrice = 'Limit sale price cannot be negative';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      if (error.response?.data) {
        const apiResponse = error.response.data;
        setApiError(apiResponse.Message || 'An error occurred while saving the voucher');
      } else {
        setApiError('An unexpected error occurred');
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {apiError && (
        <div className="alert alert-danger mb-3">
          {apiError}
        </div>
      )}

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Voucher Name</label>
          <input
            type="text"
            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
            value={formData.name}
            onChange={(e) => {
              setFormData({ ...formData, name: e.target.value });
              setErrors({ ...errors, name: '' });
            }}
          />
          {errors.name && (
            <div className="invalid-feedback">{errors.name}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Voucher Code</label>
          <input
            type="text"
            className={`form-control ${errors.voucherCode || apiError ? 'is-invalid' : ''}`}
            value={formData.voucherCode}
            onChange={(e) => {
              setFormData({ ...formData, voucherCode: e.target.value });
              setErrors({ ...errors, voucherCode: '' });
              setApiError('');
            }}
          />
          {(errors.voucherCode || apiError) && (
            <div className="invalid-feedback">
              {errors.voucherCode || apiError}
            </div>
          )}
        </div>
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows="3"
        />
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Sale Price</label>
          <input
            type="number"
            className={`form-control ${errors.salePrice ? 'is-invalid' : ''}`}
            value={formData.salePrice}
            onChange={(e) => {
              setFormData({ ...formData, salePrice: e.target.value });
              setErrors({ ...errors, salePrice: '' });
            }}
            min="0"
          />
          {errors.salePrice && (
            <div className="invalid-feedback">{errors.salePrice}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Sale Percent (%)</label>
          <input
            type="number"
            className={`form-control ${errors.salePercent ? 'is-invalid' : ''}`}
            value={formData.salePercent}
            onChange={(e) => {
              setFormData({ ...formData, salePercent: e.target.value });
              setErrors({ ...errors, salePercent: '' });
            }}
            min="0"
            max="100"
          />
          {errors.salePercent && (
            <div className="invalid-feedback">{errors.salePercent}</div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Limit Sale Price</label>
          <input
            type="number"
            className={`form-control ${errors.limitSalePrice ? 'is-invalid' : ''}`}
            value={formData.limitSalePrice}
            onChange={(e) => {
              setFormData({ ...formData, limitSalePrice: e.target.value });
              setErrors({ ...errors, limitSalePrice: '' });
            }}
            min="0"
          />
          {errors.limitSalePrice && (
            <div className="invalid-feedback">{errors.limitSalePrice}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Using Limit</label>
          <input
            type="number"
            className={`form-control ${errors.usingLimit ? 'is-invalid' : ''}`}
            value={formData.usingLimit}
            onChange={(e) => {
              setFormData({ ...formData, usingLimit: e.target.value });
              setErrors({ ...errors, usingLimit: '' });
            }}
            min="0"
          />
          {errors.usingLimit && (
            <div className="invalid-feedback">{errors.usingLimit}</div>
          )}
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-3">
          <label className="form-label">Expiry Date</label>
          <input
            type="date"
            className={`form-control ${errors.expiryDate ? 'is-invalid' : ''}`}
            value={formData.expiryDate}
            onChange={(e) => {
              setFormData({ ...formData, expiryDate: e.target.value });
              setErrors({ ...errors, expiryDate: '' });
            }}
          />
          {errors.expiryDate && (
            <div className="invalid-feedback">{errors.expiryDate}</div>
          )}
        </div>

        <div className="col-md-6 mb-3">
          <label className="form-label">Status</label>
          <select
            className="form-select"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: Number(e.target.value) })}
          >
            <option value={0}>Active</option>
            <option value={1}>Inactive</option>
          </select>
        </div>
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

export default VoucherForm; 