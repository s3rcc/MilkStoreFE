import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const PublicLayout = ({ children }) => {
  const { auth } = useAuth();

  const renderAuthButtons = () => {
    // Đảm bảo roles luôn là mảng và có giá trị
    const roles = auth?.user?.roles || [];
    
    return (
      <div>
        {auth ? (
          // Người dùng đã đăng nhập
          <div>
            {roles.includes('Admin') && <button>Admin Panel</button>}
            {roles.includes('Member') && <button>Member Area</button>}
            <button onClick={() => console.log('Current auth:', auth)}>
              {auth.user.email}
            </button>
          </div>
        ) : (
          // Người dùng chưa đăng nhập
          <div>
            <button>Login</button>
            <button>Register</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <header>
        {renderAuthButtons()}
      </header>
      <main>
        {children}
      </main>
      <footer>
        {/* Footer content */}
      </footer>
    </div>
  );
};

export default PublicLayout; 