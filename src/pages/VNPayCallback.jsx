import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { checkoutService } from '../services/api';

const VNPayCallback = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handlePaymentCallback = async () => {
      try {
        // Lấy thông tin từ URL params (VNPAY trả về)
        const vnp_ResponseCode = searchParams.get('vnp_ResponseCode');
        const vnp_TransactionNo = searchParams.get('vnp_TransactionNo');
        
        // Lấy thông tin từ session
        const userID = sessionStorage.getItem('UserID');
        const orderId = sessionStorage.getItem('pendingOrderId');
        
        if (!userID || !orderId) {
          throw new Error('Không tìm thấy thông tin đơn hàng');
        }

        // Gọi API để verify payment
        const response = await checkoutService.verifyVNPayPayment({
          userId: userID,
          orderId: orderId,
          vnpayTranNo: vnp_TransactionNo,
          responseCode: vnp_ResponseCode
        });

        if (response.data.code === 'Success') {
          toast.success('Thanh toán thành công');
          navigate('/orders');
        } else {
          toast.error('Thanh toán thất bại');
          navigate('/checkout');
        }
      } catch (error) {
        console.error('Payment verification error:', error);
        toast.error('Có lỗi xảy ra khi xác nhận thanh toán');
        navigate('/checkout');
      } finally {
        // Xóa thông tin đơn hàng tạm thời
        sessionStorage.removeItem('pendingOrderId');
        sessionStorage.removeItem('checkoutAmount');
        setProcessing(false);
      }
    };

    handlePaymentCallback();
  }, [searchParams, navigate]);

  if (processing) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang xử lý thanh toán...</span>
        </div>
        <p className="mt-3">Đang xử lý kết quả thanh toán, vui lòng đợi...</p>
      </div>
    );
  }

  return null;
};

export default VNPayCallback; 