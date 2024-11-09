import axios from 'axios';
import { API_BASE_URL } from '../config/api';

export const userService = {
  getProfile: async () => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    return await axios({
      method: 'GET',
      url: `${API_BASE_URL}/users/profile`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      },
      withCredentials: true
    });
  },

  updateProfile: async (data) => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    return await axios({
      method: 'PUT',
      url: `${API_BASE_URL}/users`,
      data: data,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      },
      withCredentials: true
    });
  }
}; 