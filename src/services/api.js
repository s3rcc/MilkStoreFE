import axiosInstance from '../utils/axiosConfig';
import { ENDPOINTS, API_BASE_URL } from '../config/api';
import axios from 'axios';

// Auth Services
export const authService = {
  login: async (data) => {
    return await axios({
      method: 'POST',
      url: `${API_BASE_URL}/auth/auth_account`,
      data: data,
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    });
  },
  register: (data) => axiosInstance.post('/auth/new_account', data),
  verifyEmail: async (data) => {
    return await axios({
      method: 'PATCH',
      url: `${API_BASE_URL}/auth/confirm_email`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    });
  },
  resendConfirmation: async (data) => {
    return await axios({
      method: 'PATCH',
      url: `${API_BASE_URL}/auth/resend_confirmation_email`,
      data: data,
      headers: {
        'Content-Type': 'application/json',
        'Accept': '*/*'
      }
    });
  },
  forgotPassword: (data) => axiosInstance.post('/auth/forgotpassword', data),
  verifyOTP: (data) => axiosInstance.patch('/auth/confirm_otp_resetpassword', data),
  resetPassword: (data) => axiosInstance.patch('/auth/resetpassword', data),
  changePassword: (data) => axiosInstance.patch('/auth/change_password', data),
  refreshToken: (data) => axiosInstance.post(ENDPOINTS.REFRESH_TOKEN, data)
};

// Product Services
export const productService = {
  getProducts: (params) => axiosInstance.get(ENDPOINTS.GET_PRODUCTS, { params }),
  
  getProduct: (id) => axiosInstance.get(ENDPOINTS.GET_PRODUCTS, { params: { id } }),
  
  createProduct: async (data) => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    return await axios({
      method: 'POST',
      url: `${API_BASE_URL}/products/upload`,
      data: data,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      }
    });
  },
  
  updateProduct: async (id, data) => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    return await axios({
      method: 'PUT',
      url: `${API_BASE_URL}/products/${id}`,
      data: data,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      }
    });
  },
  
  deleteProduct: async (id) => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    return await axios({
      method: 'DELETE',
      url: `${API_BASE_URL}/products/${id}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      }
    });
  }
};

// Category Services
export const categoryService = {
  getCategories: () => axiosInstance.get(ENDPOINTS.GET_CATEGORIES),
  createCategory: (data) => axiosInstance.post(ENDPOINTS.CREATE_CATEGORY, data),
  updateCategory: (id, data) => axiosInstance.put(`${ENDPOINTS.UPDATE_CATEGORY}/${id}`, data),
  deleteCategory: (id) => axiosInstance.delete(`${ENDPOINTS.DELETE_CATEGORY}/${id}`)
};

// Cart Services
export const cartService = {
  getCart: (params) => {
    const userId = sessionStorage.getItem('UserID');
    return axiosInstance.get(ENDPOINTS.GET_CART, { 
      params,
      headers: {
        'X-User-Id': userId
      },
      withCredentials: true
    });
  },
  addToCart: (data) => axiosInstance.post(ENDPOINTS.ADD_TO_CART, data),
  updateCartItem: (id, data) => axiosInstance.put(`/orderdetails/${id}`, {
    productID: data.productID,
    quantity: data.quantity
  }),
  deleteCartItem: (id) => axiosInstance.delete(`/orderdetails/${id}`)
};

// Post Services
export const postService = {
  getPosts: (params) => axiosInstance.get(ENDPOINTS.GET_POSTS, { params }),
  getPost: (id) => axiosInstance.get(ENDPOINTS.GET_POSTS, { params: { id } }),
  createPost: (data) => axiosInstance.post(ENDPOINTS.CREATE_POST, data),
  updatePost: (id, data) => axiosInstance.put(`${ENDPOINTS.UPDATE_POST}/${id}`, data),
  deletePost: (id) => axiosInstance.delete(`${ENDPOINTS.DELETE_POST}/${id}`)
};

// Gift Services
export const giftService = {
  getGifts: (params) => axiosInstance.get(ENDPOINTS.GET_GIFTS, { params }),
  createGift: (data) => axiosInstance.post(ENDPOINTS.CREATE_GIFT, data),
  updateGift: (id, data) => axiosInstance.put(`${ENDPOINTS.UPDATE_GIFT}/${id}`, data),
  deleteGift: (id) => axiosInstance.delete(`${ENDPOINTS.DELETE_GIFT}/${id}`)
};

// Voucher Services
export const voucherService = {
  getVouchers: (params) => axiosInstance.get(ENDPOINTS.GET_VOUCHERS, { params }),
  createVoucher: (data) => axiosInstance.post(ENDPOINTS.CREATE_VOUCHER, data),
  updateVoucher: (id, data) => axiosInstance.put(`${ENDPOINTS.UPDATE_VOUCHER}/${id}`, data),
  deleteVoucher: (id) => axiosInstance.delete(`${ENDPOINTS.DELETE_VOUCHER}/${id}`)
};

// User Services
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
  updateProfile: (data) => {
    const userId = sessionStorage.getItem('UserID');
    return axiosInstance.put(ENDPOINTS.UPDATE_PROFILE, data, {
      headers: {
        'X-User-Id': userId
      },
      withCredentials: true
    });
  },
  topup: async (amount) => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    try {
      const params = new URLSearchParams({
        amount: amount
      });

      const response = await axios({
        method: 'POST',
        url: `${API_BASE_URL}/checkout/topup?${params.toString()}`,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': '*/*'
        },
        withCredentials: true,
        data: ''
      });

      return response;
    } catch (error) {
      console.error('Topup error:', error);
      throw error;
    }
  },
  getUsers: async (params) => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    return await axios({
      method: 'GET',
      url: `${API_BASE_URL}/users`,
      params: params,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      },
      withCredentials: true
    });
  }
};

// Checkout Services
export const checkoutService = {
  checkout: async (data) => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    const userId = sessionStorage.getItem('UserID');
    
    if (!token || !userId) {
      throw new Error('Vui lòng đăng nhập lại');
    }

    // Đầu tiên, gọi API profile để set session
    await axios({
      method: 'GET',
      url: `${API_BASE_URL}/users/profile`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Id': userId
      },
      withCredentials: true
    });

    // Sau khi có session, gọi API checkout
    const params = new URLSearchParams({
      paymentMethod: data.paymentMethod,
      shippingAddress: data.shippingAddress
    });

    if (data.voucherCode) {
      params.append('voucherCode', data.voucherCode);
    }

    const response = await axios({
      method: 'POST',
      url: `${API_BASE_URL}/checkout?${params.toString()}`,
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-User-Id': userId,
        'Accept': '*/*'
      },
      withCredentials: true,
      data: ''
    });

    if (response.data.code === 'Success') {
      sessionStorage.setItem('checkout_token', token);
    }

    return response;
  }
};

// Payment Services
export const paymentService = {
  verifyPayment: async (params) => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    
    if (!token) {
      throw new Error('Không tìm thấy thông tin thanh toán');
    }
    
    return await axios({
      method: 'GET',
      url: `${API_BASE_URL}/payment/ipn`,
      params: params,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': '*/*'
      },
      withCredentials: true
    });
  }
};

// Order Services
export const orderService = {
  getOrders: (params) => axiosInstance.get(ENDPOINTS.GET_CART, { 
    params: {
      ...params,
      orderDetailStatus: params.orderDetailStatus || 'Ordered'
    }
  })
};

// Thêm các hàm API mới cho Order
export const getOrders = async (params) => {
  const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
  
  if (!token) {
    throw new Error('Không tìm thấy token xác thực');
  }

  return await axios({
    method: 'GET',
    url: `${API_BASE_URL}/order`,
    params: params,
    headers: {
      'accept': '*/*',
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'
    }
  });
};

export const updateOrderByStaff = async (id, data) => {
  const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
  
  if (!token) {
    throw new Error('Không tìm thấy token xác thực');
  }

  return await axios({
    method: 'PUT',
    url: `${API_BASE_URL}/order/updatebystaff${id}`,
    data: data,
    headers: {
      'accept': '*/*',
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'ngrok-skip-browser-warning': 'true'
    }
  });
};

export const deleteOrder = async (id) => {
  const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
  
  if (!token) {
    throw new Error('Không tìm thấy token xác thực');
  }

  return await axios({
    method: 'DELETE',
    url: `${API_BASE_URL}/order/${id}`,
    headers: {
      'accept': '*/*',
      'Authorization': `Bearer ${token}`,
      'ngrok-skip-browser-warning': 'true'
    }
  });
};

// Thêm PreOrder Services
export const preorderService = {
  createPreorder: async (productId) => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập để đặt hàng trước');
    }

    const userId = JSON.parse(localStorage.getItem('auth')).user.id;

    return await axios({
      method: 'POST',
      url: `${API_BASE_URL}/preorders`,
      data: {
        userID: userId,
        productID: productId,
        status: 'Pending'
      },
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
        'ngrok-skip-browser-warning': 'true'
      }
    });
  },

  getPreorders: async (params) => {
    const token = localStorage.getItem('auth') ? JSON.parse(localStorage.getItem('auth')).accessToken : null;
    
    if (!token) {
      throw new Error('Vui lòng đăng nhập để xem đơn đặt hàng trước');
    }

    return await axios({
      method: 'GET',
      url: `${API_BASE_URL}/preorders`,
      params: params,
      headers: {
        'accept': '*/*',
        'Authorization': `Bearer ${token}`,
        'ngrok-skip-browser-warning': 'true'
      }
    });
  }
};
 