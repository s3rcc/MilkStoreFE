import React from 'react';
import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PublicLayout = () => {
  const { auth, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      logout();
      navigate('/login');
    } catch (error) {
      console.error('Đăng xuất thất bại:', error);
    }
  };

  const renderAuthButtons = () => {
    if (!auth?.user) {
      return (
        <div className="d-flex gap-2">
          <Link to="/login" className="btn btn-outline-primary d-flex align-items-center">
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Đăng nhập
          </Link>
          <Link to="/register" className="btn btn-primary d-flex align-items-center">
            <i className="bi bi-person-plus me-2"></i>
            Đăng ký
          </Link>
        </div>
      );
    }

    const isAdminOrStaff = auth.user.roles.some(role => 
      ['Admin', 'Staff'].includes(role)
    );

    const isMember = auth.user.roles.includes('Member');

    return (
      <div className="d-flex align-items-center gap-3">
        {isAdminOrStaff && (
          <Link 
            to="/dashboard" 
            className="btn btn-outline-primary d-flex align-items-center"
          >
            <i className="bi bi-speedometer2 me-2"></i>
            Quản trị
          </Link>
        )}
        {isMember && (
          <Link 
            to="/cart" 
            className="btn btn-outline-primary d-flex align-items-center"
          >
            <i className="bi bi-cart3 me-2"></i>
            Giỏ hàng
          </Link>
        )}
        <div className="dropdown">
          <button 
            className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
            type="button"
            id="userDropdown"
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            <i className="bi bi-person-circle me-2"></i>
            {auth.user.email}
          </button>
          <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
            <li>
              <Link to="/profile" className="dropdown-item d-flex align-items-center">
                <i className="bi bi-person me-2"></i>
                Thông tin cá nhân
              </Link>
            </li>
            {isMember && (
              <>
                <li>
                  <Link to="/cart" className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-cart3 me-2"></i>
                    Giỏ hàng
                  </Link>
                </li>
                <li>
                  <Link to="/orders" className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-box-seam me-2"></i>
                    Đơn hàng của tôi
                  </Link>
                </li>
                <li>
                  <Link to="/preorders" className="dropdown-item d-flex align-items-center">
                    <i className="bi bi-clock-history me-2"></i>
                    Đặt hàng trước
                  </Link>
                </li>
              </>
            )}
            {isAdminOrStaff && (
              <li>
                <Link to="/dashboard" className="dropdown-item d-flex align-items-center">
                  <i className="bi bi-speedometer2 me-2"></i>
                  Quản trị
                </Link>
              </li>
            )}
            <li><hr className="dropdown-divider"/></li>
            <li>
              <button 
                className="dropdown-item text-danger d-flex align-items-center"
                onClick={handleLogout}
                type="button"
              >
                <i className="bi bi-box-arrow-right me-2"></i>
                Đăng xuất
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-light bg-light shadow-sm">
        <div className="container">
          <Link className="navbar-brand fw-bold d-flex align-items-center" to="/">
            <i className="bi bi-flower1 me-2"></i>
            Milk Store
          </Link>
          
          <button 
            className="navbar-toggler" 
            type="button" 
            data-bs-toggle="collapse" 
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" to="/products">
                  <i className="bi bi-box me-1"></i>
                  Sản phẩm
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" to="/posts">
                  <i className="bi bi-file-text me-1"></i>
                  Blog
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link d-flex align-items-center" to="/vouchers">
                  <i className="bi bi-ticket-perforated me-1"></i>
                  Voucher
                </Link>
              </li>
            </ul>

            <div className="d-flex align-items-center">
              {renderAuthButtons()}
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow-1">
        <Outlet />
      </main>

      <footer className="bg-light py-4 mt-auto">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h5 className="fw-bold mb-3 d-flex align-items-center">
                <i className="bi bi-flower1 me-2"></i>
                Milk Store
              </h5>
              <p className="text-muted mb-0">
                Cửa hàng sữa và các sản phẩm từ sữa chất lượng cao
              </p>
            </div>
            <div className="col-lg-4">
              <h6 className="fw-bold mb-3">Thông tin liên hệ</h6>
              <div className="text-muted">
                <p className="mb-2 d-flex align-items-center">
                  <i className="bi bi-geo-alt me-2"></i>
                  123 Đường Sữa, Quận 1, TP.HCM
                </p>
                <p className="mb-2 d-flex align-items-center">
                  <i className="bi bi-envelope me-2"></i>
                  contact@milkstore.com
                </p>
                <p className="mb-0 d-flex align-items-center">
                  <i className="bi bi-telephone me-2"></i>
                  (028) 3456-7890
                </p>
              </div>
            </div>
            <div className="col-lg-4">
              <h6 className="fw-bold mb-3">Theo dõi chúng tôi</h6>
              <div className="d-flex gap-3">
                <a href="#" className="text-muted fs-5" aria-label="Facebook">
                  <i className="bi bi-facebook"></i>
                </a>
                <a href="#" className="text-muted fs-5" aria-label="Twitter">
                  <i className="bi bi-twitter"></i>
                </a>
                <a href="#" className="text-muted fs-5" aria-label="Instagram">
                  <i className="bi bi-instagram"></i>
                </a>
              </div>
            </div>
          </div>
          <hr className="my-4" />
          <div className="text-center text-muted">
            <small>&copy; 2024 Milk Store. All rights reserved.</small>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout; 