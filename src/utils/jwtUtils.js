export const decodeJWT = (token) => {
  try {
    if (!token) return null;
    
    // Lấy phần payload của token (phần thứ 2 sau khi split theo dấu chấm)
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // Decode base64 để lấy payload
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Lỗi khi decode JWT:', error);
    return null;
  }
}; 