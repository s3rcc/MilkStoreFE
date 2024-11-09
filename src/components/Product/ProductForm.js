import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import CategorySelector from '../Category/CategorySelector';
import toast from 'react-hot-toast';

const ProductForm = ({ onSubmit, initialData, onCancel }) => {
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    price: '',
    quantityInStock: '',
    categoryId: '',
    image: null,
    imageUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Set initial data when editing
  useEffect(() => {
    if (initialData) {
      console.log('Setting initial data:', initialData);
      setFormData({
        productName: initialData.productName || '',
        description: initialData.description || '',
        price: initialData.price?.toString() || '',
        quantityInStock: initialData.quantityInStock?.toString() || '',
        categoryId: initialData.categoryId || '',
        image: null,
        imageUrl: initialData.imageUrl || ''
      });
      setErrors({});
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData(prev => ({
        ...prev,
        [name]: files[0]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
    // Clear error when user types
    setErrors(prev => ({
      ...prev,
      [name]: ''
    }));
  };

  // Handle category selection
  const handleCategoryChange = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      categoryId: categoryId
    }));
    setErrors(prev => ({
      ...prev,
      categoryId: ''
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.productName?.trim()) {
      newErrors.productName = 'Vui lòng nhập tên sản phẩm';
    }
    
    if (!formData.description?.trim()) {
      newErrors.description = 'Vui lòng nhập mô tả';
    }
    
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Vui lòng nhập giá hợp lệ';
    }
    
    if (formData.quantityInStock === '' || Number(formData.quantityInStock) < 0) {
      newErrors.quantityInStock = 'Vui lòng nhập số lượng hợp lệ';
    }
    
    if (!formData.categoryId) {
      newErrors.categoryId = 'Vui lòng chọn danh mục';
    }
    
    // Only require image for new products
    if (!initialData && !formData.image) {
      newErrors.image = 'Vui lòng chọn ảnh sản phẩm';
    }

    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validateForm();
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setLoading(true);
      // Create FormData object
      const submitData = new FormData();
      submitData.append('productName', formData.productName);
      submitData.append('description', formData.description);
      submitData.append('price', formData.price);
      submitData.append('quantityInStock', formData.quantityInStock);
      submitData.append('categoryId', formData.categoryId);
      
      if (formData.image) {
        submitData.append('image', formData.image);
      } else if (initialData && formData.imageUrl) {
        submitData.append('imageUrl', formData.imageUrl);
        submitData.append('keepExistingImage', 'true');
      }

      await onSubmit(submitData);
    } catch (error) {
      console.error('Form submission error:', error);
      if (error.response?.data?.errors) {
        const apiErrors = {};
        Object.entries(error.response.data.errors).forEach(([key, value]) => {
          const formattedKey = key.charAt(0).toLowerCase() + key.slice(1);
          apiErrors[formattedKey] = Array.isArray(value) ? value[0] : value;
          toast.error(Array.isArray(value) ? value[0] : value);
        });
        setErrors(apiErrors);
      } else {
        toast.error(error.message || 'Có lỗi xảy ra');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group className="mb-3">
        <Form.Label>Tên sản phẩm</Form.Label>
        <Form.Control
          type="text"
          name="productName"
          value={formData.productName}
          onChange={handleInputChange}
          isInvalid={!!errors.productName}
        />
        <Form.Control.Feedback type="invalid">
          {errors.productName}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Mô tả</Form.Label>
        <Form.Control
          as="textarea"
          rows={3}
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          isInvalid={!!errors.description}
        />
        <Form.Control.Feedback type="invalid">
          {errors.description}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Giá</Form.Label>
        <Form.Control
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          isInvalid={!!errors.price}
        />
        <Form.Control.Feedback type="invalid">
          {errors.price}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Số lượng trong kho</Form.Label>
        <Form.Control
          type="number"
          name="quantityInStock"
          value={formData.quantityInStock}
          onChange={handleInputChange}
          isInvalid={!!errors.quantityInStock}
        />
        <Form.Control.Feedback type="invalid">
          {errors.quantityInStock}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Danh mục</Form.Label>
        <CategorySelector
          value={formData.categoryId}
          onChange={handleCategoryChange}
          isInvalid={!!errors.categoryId}
        />
        {errors.categoryId && (
          <div className="invalid-feedback d-block">
            {errors.categoryId}
          </div>
        )}
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>
          Ảnh sản phẩm 
          {!initialData && <span className="text-danger">*</span>}
        </Form.Label>
        {initialData && formData.imageUrl && (
          <div className="mb-2">
            <img 
              src={formData.imageUrl} 
              alt="Current product" 
              style={{ 
                width: '100px', 
                height: '100px', 
                objectFit: 'cover',
                marginRight: '10px'
              }}
            />
            <small className="text-muted d-block">Ảnh hiện tại</small>
          </div>
        )}
        <Form.Control
          type="file"
          name="image"
          onChange={handleInputChange}
          isInvalid={!!errors.image}
          accept="image/*"
        />
        <Form.Text className="text-muted">
          {initialData ? 'Chọn ảnh mới nếu muốn thay đổi' : 'Chọn ảnh sản phẩm'}
        </Form.Text>
        {errors.image && (
          <div className="invalid-feedback d-block">
            {errors.image}
          </div>
        )}
      </Form.Group>

      <div className="d-flex gap-2 justify-content-end">
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Hủy
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? (
            <>
              <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
              Đang xử lý...
            </>
          ) : initialData ? 'Cập nhật' : 'Thêm mới'}
        </Button>
      </div>
    </Form>
  );
};

export default ProductForm;