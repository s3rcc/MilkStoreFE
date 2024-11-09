import React, { useState, useEffect } from 'react';
import GiftForm from './GiftForm';
import GiftList from './GiftList';
import { toast } from 'react-hot-toast';
import { Modal } from 'bootstrap';
import { giftService } from '../../services/api';

const GiftManager = () => {
  const [gifts, setGifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGift, setSelectedGift] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formModal, setFormModal] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 5,
    totalPages: 1,
    totalItems: 0,
    hasPreviousPage: false,
    hasNextPage: false
  });

  useEffect(() => {
    const modal = new Modal(document.getElementById('giftFormModal'));
    setFormModal(modal);
    fetchGifts();
  }, []);

  const handleShowForm = (gift = null) => {
    setSelectedGift(gift);
    setShowForm(true);
    formModal?.show();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    formModal?.hide();
  };

  const handleCreate = async (data) => {
    try {
      await giftService.createGift(data);
      toast.success('Tạo quà tặng thành công');
      handleCloseForm();
      fetchGifts();
    } catch (error) {
      const errorMessage = error.response?.data?.Message || 'Không thể tạo quà tặng';
      toast.error(errorMessage);
      console.error('Lỗi khi tạo quà tặng:', error.response?.data);
    }
  };

  const handleUpdate = async (id, data) => {
    try {
      await giftService.updateGift(id, data);
      toast.success('Cập nhật quà tặng thành công');
      handleCloseForm();
      fetchGifts();
    } catch (error) {
      const errorMessage = error.response?.data?.Message || 'Không thể cập nhật quà tặng';
      toast.error(errorMessage);
      console.error('Lỗi khi cập nhật quà tặng:', error.response?.data);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa quà tặng này?')) {
      try {
        await giftService.deleteGift(id);
        toast.success('Xóa quà tặng thành công');
        fetchGifts();
      } catch (error) {
        const errorMessage = error.response?.data?.Message || 'Không thể xóa quà tặng';
        toast.error(errorMessage);
        console.error('Lỗi khi xóa quà tặng:', error.response?.data);
      }
    }
  };

  const fetchGifts = async (pageIndex = 1) => {
    try {
      setLoading(true);
      const response = await giftService.getGifts({
        PageIndex: pageIndex,
        PageSize: pagination.pageSize
      });
      
      if (response.data) {
        setGifts(response.data.items || []);
        setPagination({
          currentPage: response.data.currentPage,
          pageSize: response.data.pageSize,
          totalPages: response.data.totalPages,
          totalItems: response.data.totalItems,
          hasPreviousPage: response.data.hasPreviousPage,
          hasNextPage: response.data.hasNextPage
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách quà tặng:', error);
      toast.error('Không thể tải danh sách quà tặng');
      setGifts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchGifts(newPage);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Gift Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => handleShowForm()}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New Gift
        </button>
      </div>

      <GiftList
        gifts={gifts}
        loading={loading}
        onEdit={handleShowForm}
        onDelete={handleDelete}
        pagination={pagination}
        onPageChange={handlePageChange}
      />

      {/* Modal Form */}
      <div className="modal fade" id="giftFormModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedGift ? 'Edit Gift' : 'Create New Gift'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleCloseForm}
              ></button>
            </div>
            <div className="modal-body">
              {showForm && (
                <GiftForm
                  onSubmit={selectedGift ? 
                    (data) => handleUpdate(selectedGift.id, data) : 
                    handleCreate}
                  initialData={selectedGift}
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

export default GiftManager; 