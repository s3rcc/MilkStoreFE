import React from 'react';

const RevenueChart = ({ revenueStats }) => {
  // Format số tiền
  const formattedRevenue = new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    maximumFractionDigits: 0
  }).format(revenueStats || 0);

  return (
    <div className="card h-100">
      <div className="card-body d-flex flex-column align-items-center justify-content-center">
        <h6 className="card-title text-muted mb-3">Doanh thu tổng thể</h6>
        <div className="display-4 fw-bold text-primary">
          {formattedRevenue}
        </div>
      </div>
    </div>
  );
};

export default RevenueChart; 