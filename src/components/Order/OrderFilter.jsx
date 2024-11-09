import React from 'react';
import { Form, Row, Col } from 'react-bootstrap';

const OrderFilter = ({ filters, onFilterChange }) => {
  const orderStatuses = ['Pending', 'Confirmed', 'Cancelled', 'Delivering', 'Delivered', 'Returning', 'Refunded'];
  const paymentStatuses = ['Unpaid', 'Paid', 'Refunded'];

  return (
    <Form className="mb-4">
      <Row>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Mã đơn hàng</Form.Label>
            <Form.Control
              type="text"
              value={filters.id}
              onChange={(e) => onFilterChange({ id: e.target.value })}
              placeholder="Nhập mã đơn hàng"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Trạng thái đơn hàng</Form.Label>
            <Form.Select
              value={filters.orderStatus}
              onChange={(e) => onFilterChange({ orderStatus: e.target.value })}
            >
              <option value="">Tất cả</option>
              {orderStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group className="mb-3">
            <Form.Label>Trạng thái thanh toán</Form.Label>
            <Form.Select
              value={filters.paymentStatus}
              onChange={(e) => onFilterChange({ paymentStatus: e.target.value })}
            >
              <option value="">Tất cả</option>
              {paymentStatuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
    </Form>
  );
};

export default OrderFilter; 