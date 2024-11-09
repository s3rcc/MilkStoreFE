import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../config/api';
import toast from 'react-hot-toast';

const PaymentTopupCallback = () => {
  const [loading, setLoading] = useState(true);
  const [status, setStatus] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyTopup = async () => {
      try {
        // Lấy tất cả query params từ URL
        const queryParams = new URLSearchParams(location.search);
        
        // Gọi trực tiếp đến API endpoint
        const response = await axios.get(`${API_BASE_URL}/payment/ipn${location.search}`);
        console.log('Topup verification response:', response);
        console.log('TEST', location.search);

        if (response.data.code === 'Success') {
          setStatus('success');
          toast.success('Nạp tiền thành công!');
          navigate('/profile');
          //setTimeout(() => navigate('/profile'), 3000);
        } else {
          setStatus('error');
          toast.error('Nạp tiền thất bại');
          setTimeout(() => navigate('/topup'), 3000);
        }
      } catch (error) {
        console.error('Topup verification error:', error);
        setStatus('error');
        toast.error('Có lỗi xảy ra khi xác nhận nạp tiền');
        setTimeout(() => navigate('/topup'), 3000);
      } finally {
        setLoading(false);
      }
    };

    verifyTopup();
  }, [navigate, location]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Đang xử lý...</span>
          </div>
          <h4>Đang xác nhận nạp tiền...</h4>
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
            <h2 className="mb-3">Nạp tiền thành công!</h2>
            <p className="text-muted mb-4">
              Số dư của bạn đã được cập nhật.
            </p>
            <p className="text-muted">
              Đang chuyển hướng đến trang cá nhân...
            </p>
          </>
        ) : (
          <>
            <div className="display-1 text-danger mb-3">
              <i className="bi bi-x-circle"></i>
            </div>
            <h2 className="mb-3">Nạp tiền thất bại</h2>
            <p className="text-muted mb-4">
              Đã có lỗi xảy ra trong quá trình nạp tiền.
            </p>
            <p className="text-muted">
              Đang chuyển hướng về trang nạp tiền...
            </p>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentTopupCallback; 