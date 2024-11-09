import React, { useState } from 'react';
import { Table, Button, Modal } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import EditUserModal from './EditUserModal';
import axiosInstance from '../../utils/axiosConfig';

const UserTable = ({ users, isLoading, onRefresh }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleEdit = (user) => {
    setSelectedUser(user);
    setShowEditModal(true);
  };

  const handleEditSuccess = () => {
    setShowEditModal(false);
    onRefresh();
  };

  const handleDelete = (user) => {
    setSelectedUser(user);
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = async () => {
    try {
      const response = await axiosInstance.delete('/users', {
        params: { userId: selectedUser.id }
      });

      if (response.data) {
        toast.success('Xóa người dùng thành công');
        setShowDeleteModal(false);
        onRefresh();
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Không thể xóa người dùng');
      }
    }
  };

  // Kiểm tra xem user có phải là Admin không
  const isAdmin = (user) => {
    return user.roleName === 'Admin';
  };

  if (isLoading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <Table responsive hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Tên</th>
            <th>Email</th>
            <th>Số điện thoại</th>
            <th>Vai trò</th>
            <th>Số dư</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.phoneNumber}</td>
              <td>{user.roleName}</td>
              <td>{user.balance?.toLocaleString('vi-VN')} VNĐ</td>
              <td>
                {!isAdmin(user) ? (
                  <div className="d-flex gap-2">
                    <Button
                      variant="outline-primary"
                      size="sm"
                      onClick={() => handleEdit(user)}
                    >
                      <i className="bi bi-pencil-square me-1"></i>
                      Sửa
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleDelete(user)}
                    >
                      <i className="bi bi-trash me-1"></i>
                      Xóa
                    </Button>
                  </div>
                ) : (
                  <span className="text-muted fst-italic">
                    <i className="bi bi-shield-lock me-1"></i>
                    Admin
                  </span>
                )}
              </td>
            </tr>
          ))}
          {users.length === 0 && (
            <tr>
              <td colSpan="7" className="text-center">
                Không có dữ liệu
              </td>
            </tr>
          )}
        </tbody>
      </Table>

      {/* Edit Modal */}
      <EditUserModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        user={selectedUser}
        onSuccess={handleEditSuccess}
      />

      {/* Delete Confirmation Modal */}
      <Modal 
        show={showDeleteModal} 
        onHide={() => setShowDeleteModal(false)}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa người dùng này?</p>
          <p className="mb-0">
            <strong>Tên:</strong> {selectedUser?.name}<br />
            <strong>Email:</strong> {selectedUser?.email}
          </p>
          <p className="text-danger mt-3 mb-0">
            <i className="bi bi-exclamation-triangle-fill me-2"></i>
            Hành động này không thể hoàn tác!
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Xác nhận xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserTable;