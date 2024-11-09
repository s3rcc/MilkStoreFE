import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const PrivateRoute = ({ allowedRoles }) => {
  const { auth, loading } = useAuth();
  const location = useLocation();

  console.log('PrivateRoute check:', {
    auth,
    allowedRoles,
    userRoles: auth?.user?.roles
  });

  if (loading) {
    console.log('PrivateRoute: Loading...');
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!auth?.accessToken) {
    console.log('PrivateRoute: No auth token, redirecting to login');
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const userRoles = auth?.user?.roles || [];
  const hasRequiredRole = allowedRoles.some(role => userRoles.includes(role));
  
  console.log('PrivateRoute role check:', {
    userRoles,
    allowedRoles,
    hasRequiredRole
  });

  if (!hasRequiredRole) {
    console.log('PrivateRoute: User does not have required role');
    return <Navigate to="/" replace />;
  }

  console.log('PrivateRoute: Access granted');
  return <Outlet />;
};

export default PrivateRoute; 