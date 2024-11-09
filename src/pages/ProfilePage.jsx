import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { authService, userService } from '../services/api';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { auth } = useAuth();
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      if (response.data.code === 'Success') {
        setProfileData(response.data.data);
      }
    } catch (error) {
      console.error('Lỗi khi tải thông tin cá nhân:', error);
      toast.error('Không thể tải thông tin cá nhân');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Mật khẩu mới và xác nhận mật khẩu không khớp');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Mật khẩu mới phải có ít nhất 6 ký tự');
      return;
    }

    try {
      setLoading(true);
      await authService.changePassword({
        oldPassword: passwordData.oldPassword,
        newPassword: passwordData.newPassword
      });

      toast.success('Đổi mật khẩu thành công');
      setShowChangePasswordModal(false);
      setPasswordData({
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      toast.error(error.response?.data?.message || 'Đổi mật khẩu thất bại');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !profileData) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title mb-4">Thông tin cá nhân</h2>
              
              <div className="mb-3">
                <label className="form-label fw-bold">Họ tên</label>
                <p className="mb-0">{profileData?.name}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Email</label>
                <p className="mb-0">{profileData?.email}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Số điện thoại</label>
                <p className="mb-0">{profileData?.phoneNumber}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Địa chỉ giao hàng</label>
                <p className="mb-0">{profileData?.shippingAddress || 'Chưa cập nhật'}</p>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Số dư tài khoản</label>
                <div className="d-flex align-items-center gap-3">
                  <p className="mb-0">{profileData?.balance.toLocaleString('vi-VN')}đ</p>
                  <Link 
                    to="/topup"
                    className="btn btn-success btn-sm"
                  >
                    <i className="bi bi-plus-circle me-2"></i>
                    Nạp tiền
                  </Link>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label fw-bold">Vai trò</label>
                <p className="mb-0">{auth.user.roles.join(', ')}</p>
              </div>

              <div className="mt-4">
                <button 
                  className="btn btn-primary"
                  onClick={() => setShowChangePasswordModal(true)}
                >
                  <i className="bi bi-key me-2"></i>
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modal đổi mật khẩu */}
      <div 
        className={`modal fade ${showChangePasswordModal ? 'show' : ''}`} 
        tabIndex="-1"
        style={{ display: showChangePasswordModal ? 'block' : 'none' }}
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Đổi mật khẩu</h5>
              <button 
                type="button" 
                className="btn-close"
                onClick={() => setShowChangePasswordModal(false)}
                disabled={loading}
              ></button>
            </div>
            <form onSubmit={handlePasswordChange}>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="oldPassword" className="form-label">Mật khẩu hiện tại</label>
                  <input
                    type="password"
                    className="form-control"
                    id="oldPassword"
                    name="oldPassword"
                    value={passwordData.oldPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      oldPassword: e.target.value
                    }))}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
                  <input
                    type="password"
                    className="form-control"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                    required
                    minLength={6}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu mới</label>
                  <input
                    type="password"
                    className="form-control"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))}
                    required
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => setShowChangePasswordModal(false)}
                  disabled={loading}
                >
                  Hủy
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary d-flex align-items-center"
                  disabled={loading}
                >
                  {loading && (
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  )}
                  Xác nhận
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {showChangePasswordModal && (
        <div 
          className="modal-backdrop fade show"
          onClick={() => !loading && setShowChangePasswordModal(false)}
        ></div>
      )}
    </div>
  );
};

export default ProfilePage; 