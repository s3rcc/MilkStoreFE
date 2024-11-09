import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { Modal } from 'bootstrap';
import { useNavigate } from 'react-router-dom';
import UserTable from './UserTable';
import AddUserModal from './AddUserModal';
import EditUserModal from './EditUserModal';
import axiosInstance from '../../utils/axiosConfig';

const UserManager = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
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
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    const modal = new Modal(document.getElementById('userFormModal'));
    setFormModal(modal);
    fetchUsers();
    fetchRoles();
  }, [navigate]);

  const fetchUsers = async (pageIndex = 1) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get('/users/getuser', {
        params: {
          pageSize: pagination.pageSize,
          index: pageIndex
        }
      });
      
      if (response.data) {
        setUsers(response.data.items || []);
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
      if (error.response?.status === 401) {
        navigate('/login');
      } else {
        console.error('Error fetching users:', error);
        toast.error('Lỗi khi tải danh sách người dùng');
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get('/role/get_roles');
      setRoles(response.data);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Lỗi khi tải danh sách vai trò');
    }
  };

  const handleShowForm = (user = null) => {
    setSelectedUser(user);
    setShowForm(true);
    formModal?.show();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    formModal?.hide();
  };

  const handleCreate = async (formData) => {
    try {
      await axiosInstance.post('/users/add_user_with_role_async', formData);
      toast.success('Thêm người dùng thành công');
      handleCloseForm();
      fetchUsers();
    } catch (error) {
      console.error('Create user error:', error);
      toast.error('Lỗi khi thêm người dùng');
      throw error;
    }
  };

  const handleUpdate = async (id, userData) => {
    try {
      await axiosInstance.put('/users/user_update', userData);
      toast.success('Cập nhật thành công');
      handleCloseForm();
      fetchUsers();
    } catch (error) {
      console.error('Update user error:', error);
      toast.error('Lỗi khi cập nhật người dùng');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await axiosInstance.delete('/users/delete_one_user', {
          params: { id }
        });
        toast.success('Xóa người dùng thành công');
        fetchUsers();
      } catch (error) {
        console.error('Delete user error:', error);
        toast.error('Lỗi khi xóa người dùng');
      }
    }
  };

  const handlePageChange = (newPage) => {
    fetchUsers(newPage);
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>User Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => handleShowForm()}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New User
        </button>
      </div>

      <div className="card shadow-sm">
        <div className="card-body">
          <UserTable
            users={users}
            loading={loading}
            onEdit={handleShowForm}
            onDelete={handleDelete}
            pagination={pagination}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      <div className="modal fade" id="userFormModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedUser ? 'Edit User' : 'Create New User'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleCloseForm}
              ></button>
            </div>
            <div className="modal-body">
              {showForm && (
                selectedUser ? (
                  <EditUserModal
                    user={selectedUser}
                    onSubmit={(data) => handleUpdate(selectedUser.id, data)}
                    onCancel={handleCloseForm}
                  />
                ) : (
                  <AddUserModal
                    roles={roles}
                    onSubmit={handleCreate}
                    onCancel={handleCloseForm}
                  />
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManager; 