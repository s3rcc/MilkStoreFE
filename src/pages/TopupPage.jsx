import React, { useState } from 'react';
import { userService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const TopupPage = () => {
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const { auth } = useAuth();
  const navigate = useNavigate();

  const handleTopup = async (e) => {
    e.preventDefault();
    
    if (!amount || amount < 10000) {
      toast.error('Số tiền nạp tối thiểu là 10,000đ');
      return;
    }

    try {
      setLoading(true);

      if (!auth?.accessToken) {
        toast.error('Vui lòng đăng nhập lại');
        navigate('/login');
        return;
      }

      const response = await userService.topup(amount);
      console.log('Topup response:', response);

      if (response.data.code === 'Success') {
        const paymentUrl = response.data.message;
        if (!paymentUrl) {
          throw new Error('Không tìm thấy URL thanh toán');
        }

        // Chuyển hướng đến trang thanh toán VNPay
        window.location.href = paymentUrl;
        toast.success('Đang chuyển đến trang thanh toán...');
      } else {
        throw new Error(response.data.Message || 'Nạp tiền thất bại');
      }
    } catch (error) {
      console.error('Topup error:', error);
      toast.error(error.response?.data?.Message || error.message || 'Không thể thực hiện nạp tiền');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Nạp tiền</h2>
              
              <form onSubmit={handleTopup}>
                <div className="mb-4">
                  <label className="form-label">Số tiền muốn nạp</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="Nhập số tiền"
                      min="10000"
                      step="1000"
                      required
                    />
                    <span className="input-group-text">VNĐ</span>
                  </div>
                  <small className="text-muted">Số tiền tối thiểu: 10,000đ</small>
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Đang xử lý...
                    </>
                  ) : (
                    'Nạp tiền'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopupPage; 