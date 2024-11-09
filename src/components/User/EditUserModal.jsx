import React, { useState, useEffect } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import axiosInstance from '../../utils/axiosConfig';

const EditUserModal = ({ show, onHide, onSuccess, user }) => {
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    phoneNumber: '',
    balance: 0,
    password: '',
    shippingAddress: ''
  });

  const [originalData, setOriginalData] = useState(null);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (user) {
      const userData = {
        id: user.id,
        name: user.name || '',
        email: user.email || '',
        phoneNumber: user.phoneNumber || '',
        balance: user.balance || 0,
        password: '',
        shippingAddress: user.shippingAddress || ''
      };
      setFormData(userData);
      setOriginalData(userData);
      setErrors({});
    }
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Tên không được để trống';
    } else if (formData.name.length > 100) {
      newErrors.name = 'Tên không được quá dài';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email không được để trống';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }

    if (!formData.phoneNumber.trim()) {
      newErrors.phoneNumber = 'Số điện thoại không được để trống';
    } else if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
    }

    if (!formData.shippingAddress.trim()) {
      newErrors.shippingAddress = 'Địa chỉ không được để trống';
    }

    if (formData.password && !/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.])[A-Za-z\d@$!%*?&.]{8,16}$/.test(formData.password)) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự, 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt';
    }

    if (formData.balance < 0) {
      newErrors.balance = 'Số tiền phải từ 0 trở lên';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const updateData = {
        userId: user.id,
        name: formData.name.trim() || originalData.name,
        email: formData.email.trim() || originalData.email,
        phoneNumber: formData.phoneNumber.trim() || originalData.phoneNumber,
        shippingAddress: formData.shippingAddress.trim() || originalData.shippingAddress,
        balance: formData.balance !== null && formData.balance !== undefined 
          ? parseFloat(formData.balance) 
          : originalData.balance
      };

      if (formData.password && formData.password.trim()) {
        updateData.password = formData.password.trim();
      }

      const hasChanges = Object.keys(updateData).some(key => {
        if (key === 'userId') return false;
        if (key === 'password') return formData.password && formData.password.trim();
        if (key === 'balance') return updateData[key] !== originalData[key];
        return updateData[key] !== originalData[key];
      });

      if (!hasChanges) {
        toast.info('Không có thông tin nào được thay đổi');
        return;
      }

      console.log('User prop:', user);
      console.log('Original data:', originalData);
      console.log('Form data:', formData);
      console.log('Update data:', updateData);

      const response = await axiosInstance.patch(`/users/admin_update?userId=${user.id}`, updateData);

      if (response.data) {
        toast.success('Cập nhật người dùng thành công');
        onSuccess();
        handleClose();
      }
    } catch (error) {
      console.error('Error updating user:', error);
      if (error.response?.data?.errors) {
        const errorMessages = Object.values(error.response.data.errors)
          .flat()
          .join(', ');
        toast.error(errorMessages);
      } else {
        toast.error(error.response?.data?.message || 'Không thể cập nhật người dùng');
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'balance' ? parseFloat(value) || 0 : value
    }));
  };

  const handleClose = () => {
    setFormData({
      id: '',
      name: '',
      email: '',
      phoneNumber: '',
      balance: 0,
      password: '',
      shippingAddress: ''
    });
    setErrors({});
    setOriginalData(null);
    onHide();
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa người dùng</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Tên <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              isInvalid={!!errors.name}
              placeholder={originalData?.name}
            />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Email <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              placeholder={originalData?.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              isInvalid={!!errors.phoneNumber}
              placeholder={originalData?.phoneNumber}
            />
            <Form.Control.Feedback type="invalid">
              {errors.phoneNumber}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ <span className="text-danger">*</span></Form.Label>
            <Form.Control
              type="text"
              name="shippingAddress"
              value={formData.shippingAddress}
              onChange={handleChange}
              isInvalid={!!errors.shippingAddress}
              placeholder={originalData?.shippingAddress}
            />
            <Form.Control.Feedback type="invalid">
              {errors.shippingAddress}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Mật khẩu mới</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              isInvalid={!!errors.password}
            />
            <Form.Text className="text-muted">
              Để trống nếu không muốn thay đổi mật khẩu
            </Form.Text>
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Số dư</Form.Label>
            <Form.Control
              type="number"
              name="balance"
              value={formData.balance}
              onChange={handleChange}
              isInvalid={!!errors.balance}
              placeholder={originalData?.balance}
            />
            <Form.Control.Feedback type="invalid">
              {errors.balance}
            </Form.Control.Feedback>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Hủy
          </Button>
          <Button variant="primary" type="submit">
            Cập nhật
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditUserModal; 