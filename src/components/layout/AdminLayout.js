import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';

const AdminLayout = () => {
  const location = useLocation();
  const menuItems = [
    { path: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/dashboard/users/manage', icon: 'bi-people', label: 'Quản lý người dùng' },
    { path: '/dashboard/orders', icon: 'bi-cart-check', label: 'Quản lý đơn hàng' },
    { path: '/dashboard/preorders', icon: 'bi-clock-history', label: 'Quản lý đặt trước' },
    { path: '/dashboard/gifts', icon: 'bi-gift', label: 'Quản lý quà tặng' },
    { path: '/dashboard/products', icon: 'bi-box', label: 'Quản lý sản phẩm' },
    { path: '/dashboard/categories', icon: 'bi-grid', label: 'Quản lý danh mục' },
    { path: '/dashboard/posts', icon: 'bi-file-text', label: 'Quản lý bài viết' },
    { path: '/dashboard/vouchers', icon: 'bi-ticket-perforated', label: 'Quản lý voucher' },
  ];

  return (
    <div className="min-vh-100 bg-light">
      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            <i className="bi bi-shop me-2"></i>
            Milk Store Admin
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#sidebarMenu"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="ms-auto">
            <Link to="/" className="btn btn-outline-light">
              <i className="bi bi-house-door me-1"></i>
              Back to Home
            </Link>
          </div>
        </div>
      </nav>

      <div className="container-fluid">
        <div className="row">
          {/* Sidebar */}
          <nav 
            id="sidebarMenu"
            className="col-md-3 col-lg-2 d-md-block bg-white shadow-sm sidebar collapse" 
            style={{ 
              position: 'fixed', 
              top: '56px', 
              bottom: 0,
              paddingTop: '20px',
              overflowY: 'auto'
            }}
          >
            <div className="position-sticky">
              <ul className="nav flex-column">
                {menuItems.map((item) => (
                  <li className="nav-item" key={item.path}>
                    <Link 
                      to={item.path}
                      className={`nav-link d-flex align-items-center py-3 border-bottom ${
                        location.pathname === item.path ? 'active bg-light' : ''
                      }`}
                    >
                      <i className={`bi ${item.icon} me-2`} style={{ fontSize: '1.2rem' }}></i>
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </nav>

          {/* Main Content */}
          <main 
            className="col-md-9 ms-sm-auto col-lg-10 px-md-4"
            style={{ 
              marginTop: '56px',
              paddingTop: '20px',
              minHeight: 'calc(100vh - 56px)'
            }}
          >
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;