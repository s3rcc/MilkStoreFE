import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { paymentService } from '../services/api';
import toast from 'react-hot-toast';

const PaymentCallback = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        // Lấy tất cả query params từ URL
        const queryParams = new URLSearchParams(location.search);
        const params = {};
        for (let [key, value] of queryParams.entries()) {
          params[key] = value;
        }

        console.log('Payment callback params:', params);

        // Gọi API để verify payment
        const response = await paymentService.verifyPayment(params);
        console.log('Payment verification response:', response);

        if (response.data.code === 'Success') {
          setStatus('success');
          toast.success('Thanh toán thành công!');
          setTimeout(() => navigate('/orders'), 3000);
        } else {
          setStatus('error');
          toast.error('Thanh toán thất bại');
          setTimeout(() => navigate('/cart'), 3000);
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        setStatus('error');
        toast.error('Có lỗi xảy ra khi xác nhận thanh toán');
        setTimeout(() => navigate('/cart'), 3000);
      } finally {
        setLoading(false);
      }
    };

    verifyPayment();
  }, [navigate, location]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Đang xử lý...</span>
          </div>
          <h4>Đang xác nhận thanh toán...</h4>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        {status === 'success' ? (
          <>
            <div className="display-1 text-success mb-3">
              <i className="bi bi-check-circle"></i>
            </div>
            <h2 className="mb-3">Thanh toán thành công!</h2>
            <p className="text-muted mb-4">
              Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đang được xử lý.
            </p>
            <p className="text-muted">
              Đang chuyển hướng đến trang đơn hàng...
            </p>
          </>
        ) : (
          <>
            <div className="display-1 text-danger mb-3">
              <i className="bi bi-x-circle"></i>
            </div>
            <h2 className="mb-3">Thanh toán thất bại</h2>
            <p className="text-muted mb-4">
              Đã có lỗi xảy ra trong quá trình thanh toán.
            </p>
            <p className="text-muted">
              Đang chuyển hướng về giỏ hàng...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentCallback; 