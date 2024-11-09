import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { userService, checkoutService, paymentService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';


const CheckoutPage = () => {
  const navigate = useNavigate();
  const { auth } = useAuth();
  const [loading, setLoading] = useState(false);
  const [profileLoading, setProfileLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    shippingAddress: ''
  });
  const [voucherCode, setVoucherCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('Online');

  // Fetch user profile
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (!auth?.accessToken) {
          console.error('Không có access token');
          toast.error('Vui lòng đăng nhập lại');
          navigate('/login');
          return;
        }

        const response = await userService.getProfile();
        
        // Log response để debug
        console.log('Profile API response:', response);

        if (response?.data?.code === 'Success' && response?.data?.data) {
          const profileData = response.data.data;
          
          // Log profile data để debug
          console.log('Profile data received:', profileData);

          // Cập nhật state
          setUserProfile(profileData);
          
          // Cập nhật form data với dữ liệu từ profile
          // Kiểm tra tất cả các trường địa chỉ có thể có
          const shippingAddress = profileData.shippingAddress || 
                                profileData.address || 
                                profileData.deliveryAddress || 
                                '';
          
          setFormData({
            name: profileData.name || '',
            email: profileData.email || '',
            phoneNumber: profileData.phoneNumber || '',
            shippingAddress: shippingAddress
          });

          // Log form data để debug
          console.log('Form data set:', {
            name: profileData.name,
            email: profileData.email,
            phoneNumber: profileData.phoneNumber,
            shippingAddress: shippingAddress,
            originalAddress: {
              shippingAddress: profileData.shippingAddress,
              address: profileData.address,
              deliveryAddress: profileData.deliveryAddress
            }
          });

        } else {
          console.error('Invalid profile response:', response);
          throw new Error('Không thể tải thông tin người dùng');
        }
      } catch (error) {
        console.error('Lỗi khi tải profile:', error);
        handleAuthError(error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, [auth, navigate]);

  // Utility function to handle auth errors
  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      toast.error('Phiên đăng nhập đã hết hạn');
      sessionStorage.removeItem('UserID');
      navigate('/login');
    } else {
      toast.error('Không thể tải thông tin người dùng');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdateProfile = async () => {
    try {
      setLoading(true);
      if (!auth?.accessToken) {
        toast.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return false;
      }

      // Chuẩn bị dữ liệu cập nhật
      // Gửi cả shippingAddress và address để đảm bảo
      const updateData = {
        ...formData,
        address: formData.shippingAddress,
        shippingAddress: formData.shippingAddress,
        deliveryAddress: formData.shippingAddress
      };

      console.log('Sending update data:', updateData);

      const response = await userService.updateProfile(updateData);
      
      if (response?.data?.code === 'Success') {
        toast.success('Cập nhật thông tin thành công');
        return true;
      } else {
        throw new Error('Không thể cập nhật thông tin');
      }
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
      } else {
        toast.error('Không thể cập nhật thông tin');
      }
      return false;
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    if (!formData.shippingAddress) {
      toast.error('Vui lòng nhập địa chỉ giao hàng');
      return;
    }

    try {
      setLoading(true);

      if (!auth?.accessToken) {
        toast.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      // Update profile first
      const profileUpdated = await handleUpdateProfile();
      if (!profileUpdated) return;

      // Proceed with checkout
      const checkoutData = {
        paymentMethod,
        voucherCode: voucherCode || undefined,
        shippingAddress: 'UserAddress'
      };

      const response = await checkoutService.checkout(checkoutData);
      console.log('Checkout response:', response);

      if (response.data.code === 'Success') {
        if (paymentMethod === 'Online') {
          // Lấy URL thanh toán từ response
          const paymentUrl = response.data.message;
          if (!paymentUrl) {
            throw new Error('Không tìm thấy URL thanh toán');
          }

          // Lưu orderId vào sessionStorage để verify sau này
          if (response.data.data?.orderId) {
            sessionStorage.setItem('pendingOrderId', response.data.data.orderId);
          }

          // Chuyển hướng đến trang thanh toán VNPay
          window.location.href = paymentUrl;
          toast.success('Đang chuyển đến trang thanh toán...');
        } else {
          // Nếu thanh toán COD hoặc Wallet, verify ngay
          try {
            const verifyResponse = await paymentService.verifyPayment({
              orderId: response.data.data?.orderId,
              paymentMethod: paymentMethod
            });

            if (verifyResponse.data.code === 'Success') {
              toast.success('Đặt hàng thành công');
              navigate('/orders');
            } else {
              throw new Error(verifyResponse.data.Message || 'Xác nhận thanh toán thất bại');
            }
          } catch (verifyError) {
            console.error('Verify payment error:', verifyError);
            toast.error('Không thể xác nhận thanh toán');
            // Vẫn chuyển về trang orders vì đơn hàng đã được tạo
            navigate('/orders');
          }
        }
      } else {
        throw new Error(response.data.Message || 'Đặt hàng thất bại');
      }
    } catch (error) {
      console.error('Chi tiết lỗi thanh toán:', error);
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn');
        navigate('/login');
      } else {
        toast.error(error.response?.data?.Message || error.message || 'Không thể thực hiện thanh toán');
      }
    } finally {
      setLoading(false);
    }
  };

  if (profileLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-md-8">
          <div className="card mb-4">
            <div className="card-body">
              <h5 className="card-title mb-4">Thông tin giao hàng</h5>
              
              <div className="mb-3">
                <label className="form-label">Họ tên</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Số điện thoại</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Địa chỉ giao hàng</label>
                <textarea
                  className="form-control"
                  name="shippingAddress"
                  value={formData.shippingAddress}
                  onChange={handleInputChange}
                  rows="3"
                  required
                ></textarea>
              </div>
            </div>
          </div>

          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Phương thức thanh toán</h5>
              
              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="online"
                  value="Online"
                  checked={paymentMethod === 'Online'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label className="form-check-label" htmlFor="online">
                  Thanh toán online (VNPAY)
                </label>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="wallet"
                  value="UserWallet"
                  checked={paymentMethod === 'UserWallet'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label className="form-check-label" htmlFor="wallet">
                  Thanh toán bằng số dư tài khoản (Số dư: {userProfile?.balance.toLocaleString('vi-VN')}đ)
                </label>
              </div>

              <div className="form-check mb-3">
                <input
                  className="form-check-input"
                  type="radio"
                  name="paymentMethod"
                  id="cod"
                  value="COD"
                  checked={paymentMethod === 'COD'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <label className="form-check-label" htmlFor="cod">
                  Thanh toán khi nhận hàng (COD)
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <h5 className="card-title mb-4">Đơn hàng</h5>
              
              <div className="mb-3">
                <label className="form-label">Mã giảm giá</label>
                <input
                  type="text"
                  className="form-control"
                  value={voucherCode}
                  onChange={(e) => setVoucherCode(e.target.value)}
                  placeholder="Nhập mã giảm giá (nếu có)"
                  maxLength={6}
                />
              </div>

              <button
                className="btn btn-primary w-100"
                onClick={handleCheckout}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Đang xử lý...
                  </>
                ) : (
                  'Thanh toán'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default CheckoutPage; 