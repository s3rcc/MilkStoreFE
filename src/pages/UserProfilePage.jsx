import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';
import axiosInstance from '../utils/axiosConfig';

const UserProfilePage = () => {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/users/profile');
      if (response.data.statusCode === "OK" && response.data.data) {
        setProfile(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast.error('Không thể tải thông tin người dùng');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">
          Không thể tải thông tin người dùng
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h4 className="mb-0">Thông tin cá nhân</h4>
            </div>
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong>Tên:</strong>
                </div>
                <div className="col-sm-9">
                  {profile.name}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong>Email:</strong>
                </div>
                <div className="col-sm-9">
                  {profile.email}
                </div>
              </div>
              <div className="row mb-3">
                <div className="col-sm-3">
                  <strong>Số dư:</strong>
                </div>
                <div className="col-sm-9">
                  {profile.balance?.toLocaleString()} VND
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage; 