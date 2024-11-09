import React, { useState } from 'react';
import { productService } from '../../services/api';
import ProductForm from './ProductForm';
import ProductList from './ProductList';
import { Modal } from 'bootstrap';
import { Form, InputGroup, Pagination, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';

const ProductManager = ({ products, loading, onProductsChange, currentPage, totalPages, onPageChange }) => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formModal, setFormModal] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  React.useEffect(() => {
    const modal = new Modal(document.getElementById('productFormModal'));
    setFormModal(modal);
  }, []);

  const handleShowForm = (product = null) => {
    console.log('Selected product for edit:', product);
    setSelectedProduct(product);
    setShowForm(true);
    formModal?.show();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedProduct(null);
    formModal?.hide();
  };

  const handleSearch = () => {
    if (onProductsChange) {
      onProductsChange(searchTerm);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleCreate = async (formData) => {
    try {
      const response = await productService.createProduct(formData);
      console.log('Create product response:', response);
      
      if (response.data.code === 'Success') {
        toast.success('Thêm sản phẩm thành công');
        handleCloseForm();
        if (onProductsChange) onProductsChange();
      } else {
        throw new Error(response.data.Message || 'Không thể thêm sản phẩm');
      }
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.Message || error.message || 'Không thể thêm sản phẩm');
      throw error;
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      console.log('Updating product with data:', { id, formData });
      const response = await productService.updateProduct(id, formData);
      console.log('Update product response:', response);
      
      if (response.data.code === 'Success') {
        toast.success('Cập nhật sản phẩm thành công');
        handleCloseForm();
        if (onProductsChange) onProductsChange();
      } else {
        throw new Error(response.data.Message || 'Không thể cập nhật sản phẩm');
      }
    } catch (error) {
      console.error('Error updating product:', error);
      toast.error(error.response?.data?.Message || error.message || 'Không thể cập nhật sản phẩm');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        const response = await productService.deleteProduct(id);
        
        if (response.data.code === 'Success') {
          toast.success('Xóa sản phẩm thành công');
          if (onProductsChange) onProductsChange();
        } else {
          throw new Error(response.data.Message || 'Không thể xóa sản phẩm');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        toast.error(error.response?.data?.Message || error.message || 'Không thể xóa sản phẩm');
      }
    }
  };

  return (
    <div className="container-fluid py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Quản lý sản phẩm</h2>
        <button 
          className="btn btn-primary"
          onClick={() => handleShowForm()}
        >
          Thêm sản phẩm
        </button>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <InputGroup>
          <Form.Control
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <Button variant="primary" onClick={handleSearch}>
            <i className="bi bi-search me-2"></i>
            Tìm kiếm
          </Button>
        </InputGroup>
      </div>

      <ProductList 
        products={products}
        loading={loading}
        onEdit={handleShowForm}
        onDelete={handleDelete}
      />

      {/* Modal Form */}
      <div className="modal fade" id="productFormModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedProduct ? 'Cập nhật sản phẩm' : 'Thêm sản phẩm mới'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleCloseForm}
              ></button>
            </div>
            <div className="modal-body">
              {showForm && (
                <ProductForm
                  onSubmit={selectedProduct ? 
                    (data) => handleUpdate(selectedProduct.id, data) : 
                    handleCreate}
                  initialData={selectedProduct}
                  onCancel={handleCloseForm}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;