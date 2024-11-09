import React from 'react';
import { Card } from 'react-bootstrap';

const RevenueStats = ({ revenue }) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title>Tổng doanh thu</Card.Title>
        <h3 className="mt-3 mb-0">
          {revenue?.toLocaleString('vi-VN', {
            style: 'currency',
            currency: 'VND'
          }) || '0 VND'}
        </h3>
      </Card.Body>
    </Card>
  );
};

export default RevenueStats; 