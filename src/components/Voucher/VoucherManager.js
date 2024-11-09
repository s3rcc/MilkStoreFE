import React, { useState, useEffect } from 'react';
import VoucherForm from './VoucherForm';
import { toast } from 'react-hot-toast';
import { Modal } from 'bootstrap';
import debounce from 'lodash/debounce';
import { voucherService } from '../../services/api';

const VoucherManager = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedVoucher, setSelectedVoucher] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formModal, setFormModal] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0,
    hasPreviousPage: false,
    hasNextPage: false
  });

  useEffect(() => {
    const modal = new Modal(document.getElementById('voucherFormModal'));
    setFormModal(modal);
    fetchVouchers();
  }, []);

  const handleShowForm = (voucher = null) => {
    setSelectedVoucher(voucher);
    setShowForm(true);
    formModal?.show();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    formModal?.hide();
  };

  const handleCreate = async (formData) => {
    try {
      const response = await voucherService.createVoucher(formData);
      if (response.data.code === 'Success') {
        toast.success('Tạo voucher thành công');
        handleCloseForm();
        fetchVouchers();
      }
    } catch (error) {
      console.error('Lỗi khi tạo voucher:', error);
      if (error.response?.data) {
        const apiError = error.response.data;
        toast.error(apiError.Message || 'Không thể tạo voucher');
      } else {
        toast.error('Đã có lỗi xảy ra khi tạo voucher');
      }
      throw error; // Ném lỗi để VoucherForm có thể xử lý
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      const response = await voucherService.updateVoucher(id, formData);
      if (response.data.code === 'Success') {
        toast.success('Cập nhật voucher thành công');
        handleCloseForm();
        fetchVouchers();
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật voucher:', error);
      if (error.response?.data) {
        const apiError = error.response.data;
        toast.error(apiError.Message || 'Không thể cập nhật voucher');
      } else {
        toast.error('Đã có lỗi xảy ra khi cập nhật voucher');
      }
      throw error; // Ném lỗi để VoucherForm có thể xử lý
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa voucher này?')) {
      try {
        await voucherService.deleteVoucher(id);
        toast.success('Xóa voucher thành công');
        fetchVouchers();
      } catch (error) {
        console.error('Lỗi khi xóa voucher:', error);
        toast.error('Không thể xóa voucher');
      }
    }
  };

  const fetchVouchers = async (pageIndex = 1, searchTerm = '') => {
    try {
      setLoading(true);
      const response = await voucherService.getVouchers({
        index: pageIndex,
        pageSize: pagination.pageSize,
        name: searchTerm
      });
      
      if (response.data?.data) {
        setVouchers(response.data.data.items || []);
        setPagination({
          currentPage: response.data.data.currentPage,
          pageSize: response.data.data.pageSize,
          totalPages: response.data.data.totalPages,
          totalItems: response.data.data.totalItems,
          hasPreviousPage: response.data.data.hasPreviousPage,
          hasNextPage: response.data.data.hasNextPage
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách voucher:', error);
      setVouchers([]);
      toast.error('Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchVouchers(newPage);
  };

  const handleSearch = debounce((term) => {
    fetchVouchers(1, term);
  }, 500);

  const getStatusBadgeClass = (status) => {
    return status === 0 ? 'bg-success' : 'bg-danger';
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Voucher Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => handleShowForm()}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New Voucher
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search vouchers..."
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Vouchers List */}
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : vouchers.length === 0 ? (
        <div className="alert alert-info">No vouchers found.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                <th>Name</th>
                <th>Code</th>
                <th>Sale Price</th>
                <th>Sale %</th>
                <th>Limit</th>
                <th>Used</th>
                <th>Expiry Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {vouchers.map((voucher) => (
                <tr key={voucher.id}>
                  <td>{voucher.name}</td>
                  <td><code>{voucher.voucherCode}</code></td>
                  <td>{voucher.salePrice}đ</td>
                  <td>{voucher.salePercent}%</td>
                  <td>{voucher.usingLimit}</td>
                  <td>{voucher.usedCount}</td>
                  <td>{new Date(voucher.expiryDate).toLocaleDateString()}</td>
                  <td>
                    <span className={`badge ${getStatusBadgeClass(voucher.status)}`}>
                      {voucher.status === 0 ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleShowForm(voucher)}
                      className="btn btn-sm btn-outline-primary me-2"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(voucher.id)}
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

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${!pagination.hasPreviousPage ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(pagination.currentPage - 1)}
                disabled={!pagination.hasPreviousPage}
              >
                Previous
              </button>
            </li>
            
            {[...Array(pagination.totalPages)].map((_, index) => (
              <li 
                key={index + 1}
                className={`page-item ${pagination.currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            
            <li className={`page-item ${!pagination.hasNextPage ? 'disabled' : ''}`}>
              <button
                className="page-link"
                onClick={() => handlePageChange(pagination.currentPage + 1)}
                disabled={!pagination.hasNextPage}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      )}

      {/* Modal Form */}
      <div className="modal fade" id="voucherFormModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedVoucher ? 'Edit Voucher' : 'Create New Voucher'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleCloseForm}
              ></button>
            </div>
            <div className="modal-body">
              {showForm && (
                <VoucherForm
                  onSubmit={selectedVoucher ? 
                    (data) => handleUpdate(selectedVoucher.id, data) : 
                    handleCreate}
                  initialData={selectedVoucher}
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

export default VoucherManager; 