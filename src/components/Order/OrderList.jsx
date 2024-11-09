import React, { useState } from 'react';
import { Table, Button, Pagination } from 'react-bootstrap';
import OrderStatusModal from './OrderStatusModal';
import { deleteOrder } from '../../services/api';

const OrderList = ({ orders = [], currentPage, totalPages, onPageChange, onOrdersChange }) => {
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const handleUpdateStatus = (order) => {
    setSelectedOrder(order);
    setShowStatusModal(true);
  };

  const handleDelete = async (orderId) => {
    if (window.confirm('Bạn có chắc muốn xóa đơn hàng này?')) {
      try {
        await deleteOrder(orderId);
        onOrdersChange();
      } catch (error) {
        console.error('Error deleting order:', error);
      }
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center p-4">
        <p>Không có đơn hàng nào</p>
      </div>
    );
  }

  return (
    <>
      <Table responsive striped bordered hover>
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Order Date</th>
            <th>Status</th>
            <th>Payment Status</th>
            <th>Total Amount</th>
            <th>Shipping Address</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.orderDate).toLocaleDateString('vi-VN')}</td>
              <td>{order.orderStatuss}</td>
              <td>{order.paymentStatuss}</td>
              <td>{order.totalAmount.toLocaleString('vi-VN')}đ</td>
              <td>{order.shippingAddress}</td>
              <td>
                <Button
                  variant="primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleUpdateStatus(order)}
                >
                  Update
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(order.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {totalPages > 1 && (
        <Pagination className="justify-content-center">
          <Pagination.First
            disabled={currentPage === 1}
            onClick={() => onPageChange(1)}
          />
          <Pagination.Prev
            disabled={currentPage === 1}
            onClick={() => onPageChange(currentPage - 1)}
          />
          {[...Array(totalPages)].map((_, idx) => (
            <Pagination.Item
              key={idx + 1}
              active={idx + 1 === currentPage}
              onClick={() => onPageChange(idx + 1)}
            >
              {idx + 1}
            </Pagination.Item>
          ))}
          <Pagination.Next
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(currentPage + 1)}
          />
          <Pagination.Last
            disabled={currentPage === totalPages}
            onClick={() => onPageChange(totalPages)}
          />
        </Pagination>
      )}

      <OrderStatusModal
        show={showStatusModal}
        order={selectedOrder}
        onHide={() => setShowStatusModal(false)}
        onOrderUpdate={onOrdersChange}
      />
    </>
  );
};

export default OrderList; 