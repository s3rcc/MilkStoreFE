// Lưu thông tin authentication
export const setAuthData = (data) => {
  if (!data) return;
  
  localStorage.setItem('accessToken', data.accessToken);
  localStorage.setItem('refreshToken', data.refreshToken);
  localStorage.setItem('tokenType', data.tokenType);
  localStorage.setItem('authType', data.authType);
  localStorage.setItem('expiresIn', data.expiresIn);
  
  if (data.user) {
    localStorage.setItem('user', JSON.stringify({
      email: data.user.email,
      roles: data.user.roles
    }));
  }
};

// Lấy thông tin authentication
export const getAuthData = () => {
  return {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    tokenType: localStorage.getItem('tokenType'),
    authType: localStorage.getItem('authType'),
    expiresIn: localStorage.getItem('expiresIn'),
    user: JSON.parse(localStorage.getItem('user') || '{}')
  };
};

// Xóa thông tin authentication
export const clearAuthData = () => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('tokenType');
  localStorage.removeItem('authType');
  localStorage.removeItem('expiresIn');
  localStorage.removeItem('user');
};

// Kiểm tra user đã đăng nhập chưa
export const isAuthenticated = () => {
  const auth = getAuthData();
  return !!auth.accessToken;
};

// Kiểm tra user có role Admin không
export const isAdmin = () => {
  const auth = getAuthData();
  return auth.user?.roles?.includes('Admin') || false;
}; 