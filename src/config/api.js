export const API_BASE_URL = 'https://localhost:7286/api';

export const ENDPOINTS = {
  // Auth
  LOGIN: '/auth/auth_account',
  REGISTER: '/auth/new_account',
  VERIFY_EMAIL: '/auth/confirm_email',
  RESEND_CONFIRMATION: '/auth/resend_confirmation_email',
  REFRESH_TOKEN: '/auth/refresh_token',
  
  // Products
  GET_PRODUCTS: '/products/getproduct%20&%20pagging',
  CREATE_PRODUCT: '/products/upload',
  UPDATE_PRODUCT: '/products', // + /{id}
  DELETE_PRODUCT: '/products', // + /{id}
  
  // Categories
  GET_CATEGORIES: '/category',
  CREATE_CATEGORY: '/category',
  UPDATE_CATEGORY: '/category', // + /{id}
  DELETE_CATEGORY: '/category', // + /{id}
  
  // Posts
  GET_POSTS: '/post',
  CREATE_POST: '/post',
  UPDATE_POST: '/post', // + /{id}
  DELETE_POST: '/post', // + /{id}
  
  // Orders & Cart
  GET_CART: '/orderdetails/get_personal_order_detail',
  ADD_TO_CART: '/orderdetails/add_to_cart',
  UPDATE_CART_ITEM: '/orderdetails', // + /{id}
  GET_ORDERS: '/orders',
  CREATE_ORDER: '/orders',
  UPDATE_ORDER: '/orders', // + /{id}
  
  // Gifts
  GET_GIFTS: '/gift',
  CREATE_GIFT: '/gift',
  UPDATE_GIFT: '/gift', // + /{id}
  DELETE_GIFT: '/gift', // + /{id}
  
  // Vouchers
  GET_VOUCHERS: '/voucher',
  CREATE_VOUCHER: '/voucher',
  UPDATE_VOUCHER: '/voucher', // + /{id}
  DELETE_VOUCHER: '/voucher', // + /{id}
  
  // User Profile
  GET_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users',
  CHANGE_PASSWORD: '/users/change-password',
  
  // Checkout endpoints
  CHECKOUT: '/checkout',
  
  // Payment endpoints
  PAYMENT_IPN: '/payment/ipn'
};

// Common API response codes
export const API_RESPONSE_CODES = {
  SUCCESS: 'Success',
  ERROR: 'Error',
  UNAUTHORIZED: 'Unauthorized',
  VALIDATION_ERROR: 'ValidationError'
}; 