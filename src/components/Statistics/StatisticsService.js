import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

export const StatisticsService = {
  getEmployeeRevenue: async (params) => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    return await axios({
      method: 'GET',
      url: `${API_BASE_URL}/statistics/employee-revenue`,
      params: params,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      }
    });
  },

  getProductCategoryRevenue: async (params) => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    return await axios({
      method: 'GET',
      url: `${API_BASE_URL}/statistics/category-revenue`,
      params: params,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      }
    });
  },

  getTopSellingProducts: async (params) => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    return await axios({
      method: 'GET',
      url: `${API_BASE_URL}/statistics/top-selling`,
      params: params,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      }
    });
  },

  getLowStockProducts: async (params) => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    return await axios({
      method: 'GET',
      url: `${API_BASE_URL}/statistics/low-stock`,
      params: params,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      }
    });
  }
}; 