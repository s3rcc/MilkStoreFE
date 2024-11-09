import { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/api';
import axiosInstance from '../utils/axiosConfig';
import { decodeJWT } from '../utils/jwtUtils';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = () => {
      const storedAuth = localStorage.getItem('auth');
      if (storedAuth) {
        try {
          const parsedAuth = JSON.parse(storedAuth);
          
          // Decode token để verify và lấy thông tin
          const decodedToken = decodeJWT(parsedAuth.accessToken);
          
          if (!decodedToken?.nameid) {
            throw new Error('Invalid token: missing nameid');
          }

          // Đảm bảo roles luôn là mảng
          const roles = decodedToken.role ? 
            (Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role]) 
            : [];

          // Tạo auth object với cấu trúc chuẩn
          const standardizedAuth = {
            ...parsedAuth,
            user: {
              id: decodedToken.nameid,
              email: decodedToken.email,
              roles: roles
            }
          };

          // Sync UserID vào session
          sessionStorage.setItem('UserID', decodedToken.nameid);
          
          // Set auth state
          setAuth(standardizedAuth);
          
          // Set axios headers
          axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${parsedAuth.accessToken}`;
          axiosInstance.defaults.headers['X-User-Id'] = decodedToken.nameid;

          console.log('Auth restored:', {
            userId: decodedToken.nameid,
            email: decodedToken.email,
            roles: roles
          });
        } catch (error) {
          console.error('Error initializing auth:', error);
          localStorage.removeItem('auth');
          sessionStorage.removeItem('UserID');
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authService.login(credentials);
      
      if (response.data.statusCode === 'OK' && response.data.code === 'Success') {
        const authData = response.data.data;
        
        // Decode JWT token để lấy thông tin
        const decodedToken = decodeJWT(authData.accessToken);
        
        if (!decodedToken?.nameid) {
          throw new Error('Token không hợp lệ: thiếu nameid');
        }

        // Lưu UserID vào session
        const userId = decodedToken.nameid;
        sessionStorage.setItem('UserID', userId);
        
        // Gọi API profile ngay sau khi login để set session
        await axios({
          method: 'GET',
          url: `${API_BASE_URL}/users/profile`,
          headers: {
            'Authorization': `Bearer ${authData.accessToken}`,
            'X-User-Id': userId
          },
          withCredentials: true
        });

        // Log để debug
        console.log('Saved UserID to session:', {
          userId,
          decodedToken
        });

        // Đảm bảo roles luôn là mảng
        const roles = decodedToken.role ? 
          (Array.isArray(decodedToken.role) ? decodedToken.role : [decodedToken.role]) 
          : [];

        const fullAuthData = {
          ...authData,
          user: {
            id: decodedToken.nameid,
            email: decodedToken.email,
            roles: roles
          }
        };

        // Set auth state và localStorage
        setAuth(fullAuthData);
        localStorage.setItem('auth', JSON.stringify(fullAuthData));
        
        // Set axios headers
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${authData.accessToken}`;
        axiosInstance.defaults.headers['X-User-Id'] = decodedToken.nameid;

        console.log('Login successful:', {
          userId: decodedToken.nameid,
          email: decodedToken.email,
          roles: roles
        });

        return fullAuthData;
      } else {
        throw new Error(response.data.Message || 'Đăng nhập thất bại');
      }
    } catch (error) {
      console.error('Login error:', error);
      sessionStorage.removeItem('UserID');
      throw error;
    }
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('auth');
    sessionStorage.removeItem('UserID');
    delete axiosInstance.defaults.headers.common['Authorization'];
    delete axiosInstance.defaults.headers['X-User-Id'];
  };

  const refreshToken = async () => {
    try {
      const response = await authService.refreshToken({
        refreshToken: auth?.refreshToken
      });
      
      if (response.data.statusCode === 'OK' && response.data.code === 'Success') {
        const newAuthData = response.data.data;
        setAuth(newAuthData);
        localStorage.setItem('auth', JSON.stringify(newAuthData));
        return newAuthData;
      } else {
        throw new Error('Không thể làm mới token');
      }
    } catch (error) {
      logout();
      throw error;
    }
  };

  const confirmEmail = async (token) => {
    try {
      const response = await authService.verifyEmail({ token });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  const resendConfirmationEmail = async (email) => {
    try {
      const response = await authService.resendConfirmation({ email });
      return response.data;
    } catch (error) {
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ 
      auth, 
      login, 
      logout, 
      refreshToken, 
      confirmEmail,
      resendConfirmationEmail,
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 