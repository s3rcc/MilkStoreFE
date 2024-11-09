import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminNavbar = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom">
      <div className="container-fluid px-4">
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <Link
                to="/dashboard/users"
                className={`nav-link ${currentPath === '/dashboard/users' ? 'active' : ''}`}
              >
                Users
              </Link>
            </li>
            <li className="nav-item">
              <Link
                to="/dashboard/users/manage"
                className={`nav-link ${currentPath === '/dashboard/users/manage' ? 'active' : ''}`}
              >
                Manage Users
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default AdminNavbar; 