import React, { useState, useEffect } from 'react';
import CategoryForm from './CategoryForm';
import { toast } from 'react-hot-toast';
import { Modal } from 'bootstrap';
import { categoryService } from '../../services/api';

const CategoryManager = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formModal, setFormModal] = useState(null);

  useEffect(() => {
    const modal = new Modal(document.getElementById('categoryFormModal'));
    setFormModal(modal);
    fetchCategories();
  }, []);

  const handleShowForm = (category = null) => {
    setSelectedCategory(category);
    setShowForm(true);
    formModal?.show();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    formModal?.hide();
  };

  const handleCreate = async (formData) => {
    try {
      await categoryService.createCategory(formData);
      toast.success('Tạo danh mục thành công');
      handleCloseForm();
      fetchCategories();
    } catch (error) {
      console.error('Lỗi khi tạo danh mục:', error);
      throw error;
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      await categoryService.updateCategory(id, formData);
      toast.success('Cập nhật danh mục thành công');
      handleCloseForm();
      fetchCategories();
    } catch (error) {
      console.error('Lỗi khi cập nhật danh mục:', error);
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa danh mục này?')) {
      try {
        await categoryService.deleteCategory(id);
        toast.success('Xóa danh mục thành công');
        fetchCategories();
      } catch (error) {
        console.error('Lỗi khi xóa danh mục:', error);
        toast.error('Không thể xóa danh mục');
      }
    }
  };

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await categoryService.getCategories();
      if (Array.isArray(response.data)) {
        setCategories(response.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách danh mục:', error);
      setCategories([]);
      toast.error('Không thể tải danh sách danh mục');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Category Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => handleShowForm()}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : categories.length === 0 ? (
        <div className="alert alert-info">No categories found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Category Name</th>
                <th>Created At</th>
                <th>Last Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => (
                <tr key={category.id}>
                  <td>{category.categoryName}</td>
                  <td>{new Date(category.createdAt).toLocaleDateString()}</td>
                  <td>{new Date(category.lastUpdatedAt).toLocaleDateString()}</td>
                  <td>
                    <button
                      onClick={() => handleShowForm(category)}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(category.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="modal fade" id="categoryFormModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedCategory ? 'Edit Category' : 'Create New Category'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleCloseForm}
              ></button>
            </div>
            <div className="modal-body">
              {showForm && (
                <CategoryForm
                  onSubmit={selectedCategory ? 
                    (data) => handleUpdate(selectedCategory.id, data) : 
                    handleCreate}
                  initialData={selectedCategory}
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

export default CategoryManager; 