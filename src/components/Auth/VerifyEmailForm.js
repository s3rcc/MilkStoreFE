import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const VerifyEmailForm = () => {
  const [searchParams] = useSearchParams();
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { confirmEmail, resendConfirmationEmail } = useAuth();
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token) {
      handleConfirmEmail(token);
    }
  }, [token]);

  const handleConfirmEmail = async (confirmationToken) => {
    try {
      setLoading(true);
      setError('');
      await confirmEmail(confirmationToken);
      setSuccess('Email đã được xác thực thành công!');
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      setError('Xác thực email thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendEmail = async () => {
    if (!email) {
      setError('Không tìm thấy địa chỉ email.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      await resendConfirmationEmail(email);
      setSuccess('Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư của bạn.');
    } catch (error) {
      setError('Không thể gửi lại email xác thực. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100">
      <div className="row h-100 align-items-center justify-content-center">
        <div className="col-12 col-md-6 col-lg-4">
          <div className="card shadow">
            <div className="card-body p-4">
              <h2 className="text-center mb-4">Xác thực Email</h2>
              
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}

              {success && (
                <div className="alert alert-success" role="alert">
                  {success}
                </div>
              )}

              {loading ? (
                <div className="text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Đang xử lý...</span>
                  </div>
                </div>
              ) : (
                !success && (
                  <div className="text-center">
                    <p className="mb-3">
                      {token ? 'Đang xác thực email của bạn...' : 'Bạn chưa nhận được email xác thực?'}
                    </p>
                    {!token && (
                      <button
                        className="btn btn-primary"
                        onClick={handleResendEmail}
                        disabled={loading}
                      >
                        Gửi lại email xác thực
                      </button>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmailForm; 