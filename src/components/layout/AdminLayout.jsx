import React, { useState, useEffect } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import AdminNavbar from './AdminNavbar';
import axiosInstance from '../../utils/axiosConfig';
import { toast } from 'react-hot-toast';

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const menuItems = [
    { path: '/dashboard/users/manage', icon: 'bi bi-people', label: 'Users' },
    { path: '/dashboard', icon: 'bi-speedometer2', label: 'Dashboard' },
    { path: '/dashboard/gifts', icon: 'bi-gift', label: 'Manage Gifts' },
    { path: '/dashboard/products', icon: 'bi-box', label: 'Manage Products' },
    { path: '/dashboard/categories', icon: 'bi-grid', label: 'Manage Categories' },
    { path: '/dashboard/posts', icon: 'bi-file-text', label: 'Manage Posts' },
    { path: '/dashboard/vouchers', icon: 'bi-ticket-perforated', label: 'Manage Vouchers' },
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get('/users/profile');
        console.log('Profile response:', response); // Debug log
        if (response.data.statusCode === "OK" && response.data.data) {
          setUserProfile(response.data.data);
        } else {
          console.error('Invalid profile response:', response.data);
          toast.error('Không thể tải thông tin người dùng');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (error.response?.status === 401) {
          localStorage.clear();
          navigate('/login');
        } else {
          toast.error('Có lỗi xảy ra khi tải thông tin người dùng');
        }
      } finally {
        setIsLoading(false);
      }
    };

    if (localStorage.getItem('accessToken')) {
      fetchProfile();
    } else {
      navigate('/login');
    }
  }, [navigate]);

  const handleViewProfile = async () => {
    try {
      const response = await axiosInstance.get('/users/profile');
      console.log('View profile response:', response); // Debug log
      if (response.data.statusCode === "OK" && response.data.data) {
        setUserProfile(response.data.data);
        navigate('/dashboard/profile');
      } else {
        toast.error('Không thể tải thông tin người dùng');
      }
    } catch (error) {
      console.error('Error viewing profile:', error);
      toast.error('Có lỗi xảy ra khi tải thông tin người dùng');
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-light">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/dashboard">
            <i className="bi bi-shop me-2"></i>
            Milk Store Admin
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarContent"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarContent">
            <ul className="navbar-nav ms-auto">
              {userProfile && (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                  >
                    <i className="bi bi-person-circle me-1"></i>
                    {userProfile.name || userProfile.email}
                  </a>
                  <ul className="dropdown-menu dropdown-menu-end">
                    <li>
                      <button 
                        className="dropdown-item"
                        onClick={handleViewProfile}
                      >
                        <i className="bi bi-person me-2"></i>
                        Profile
                      </button>
                    </li>
                    <li><hr className="dropdown-divider" /></li>
                    <li>
                      <button 
                        className="dropdown-item text-danger"
                        onClick={() => {
                          localStorage.clear();
                          navigate('/login');
                        }}
                      >
                        <i className="bi bi-box-arrow-right me-2"></i>
                        Logout
                      </button>
                    </li>
                  </ul>
                </li>
              )}
            </ul>
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