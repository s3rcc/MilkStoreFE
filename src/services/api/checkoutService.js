import axios from 'axios';
import { API_BASE_URL } from '../../config/api';

const checkout = async (checkoutData) => {
  // Lấy token từ localStorage
  const auth = localStorage.getItem('auth');
  if (!auth) {
    throw new Error('Vui lòng đăng nhập lại');
  }

  const { accessToken } = JSON.parse(auth);

  try {
    // Validate paymentMethod và shippingAddress
    const validPaymentMethods = ['UserWallet', 'Online', 'COD'];
    const validShippingAddresses = ['InStore', 'UserAddress'];

    if (!validPaymentMethods.includes(checkoutData.paymentMethod)) {
      throw new Error('Phương thức thanh toán không hợp lệ');
    }

    if (!validShippingAddresses.includes(checkoutData.shippingAddress)) {
      throw new Error('Địa chỉ giao hàng không hợp lệ');
    }

    // Gọi API checkout
    const params = new URLSearchParams({
      paymentMethod: checkoutData.paymentMethod,
      shippingAddress: checkoutData.shippingAddress
    });

    // Xử lý voucherCode là một mảng
    if (checkoutData.voucherCode) {
      params.append('voucherCode', JSON.stringify([checkoutData.voucherCode]));
    }

    const response = await axios({
      method: 'POST',
      url: `${API_BASE_URL}/checkout?${params.toString()}`,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': '*/*'
      },
      withCredentials: true
    });

    return response;
  } catch (error) {
    console.error('Checkout error:', error);
    throw error;
  }
};

export const checkoutService = {
  checkout
}; 