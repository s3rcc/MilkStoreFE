import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { updateOrderByStaff } from '../../services/api';

const OrderStatusModal = ({ show, order, onHide, onOrderUpdate }) => {
  const [formData, setFormData] = useState({
    orderStatus: '',
    paymentStatus: '',
    paymentMethod: '',
    shippingAddress: ''
  });

  const orderStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Delivering', 'Delivered', 'Returning', 'Refunded'];
  const paymentStatuses = ['Unpaid', 'Paid', 'Refunded'];
  const paymentMethods = ['UserWallet', 'Online', 'COD'];

  React.useEffect(() => {
    if (order) {
      setFormData({
        orderStatus: order.orderStatuss,
        paymentStatus: order.paymentStatuss,
        paymentMethod: order.paymentMethod,
        shippingAddress: order.shippingAddress
      });
    }
  }, [order]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateOrderByStaff(order.id, formData);
      onOrderUpdate();
      onHide();
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };

  if (!order) return null;

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Cập nhật đơn hàng #{order.id}</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Trạng thái đơn hàng</Form.Label>
            <Form.Select
              value={formData.orderStatus}
              onChange={(e) => setFormData({...formData, orderStatus: e.target.value})}
            >
              {orderStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Trạng thái thanh toán</Form.Label>
            <Form.Select
              value={formData.paymentStatus}
              onChange={(e) => setFormData({...formData, paymentStatus: e.target.value})}
            >
              {paymentStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Phương thức thanh toán</Form.Label>
            <Form.Select
              value={formData.paymentMethod}
              onChange={(e) => setFormData({...formData, paymentMethod: e.target.value})}
            >
              {paymentMethods.map(method => (
                <option key={method} value={method}>{method}</option>
              ))}
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Địa chỉ giao hàng</Form.Label>
            <Form.Control
              type="text"
              value={formData.shippingAddress}
              onChange={(e) => setFormData({...formData, shippingAddress: e.target.value})}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Đóng
          </Button>
          <Button variant="primary" type="submit">
            Lưu thay đổi
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default OrderStatusModal; 