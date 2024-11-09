import React from 'react';
import { Card, Table } from 'react-bootstrap';

const TopSellingProducts = ({ data }) => {
  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title className="mb-3">Top Sản phẩm bán chạy</Card.Title>
        <div className="table-responsive">
          <Table hover>
            <thead>
              <tr>
                <th>#</th>
                <th>Tên sản phẩm</th>
                <th className="text-end">Số lượng đã bán</th>
              </tr>
            </thead>
            <tbody>
              {data.map((product, index) => (
                <tr key={product.productId}>
                  <td>
                    {index + 1 === 1 && <i className="bi bi-trophy-fill text-warning me-1"></i>}
                    {index + 1 === 2 && <i className="bi bi-trophy-fill text-secondary me-1"></i>}
                    {index + 1 === 3 && <i className="bi bi-trophy-fill text-danger me-1"></i>}
                    {index + 1}
                  </td>
                  <td>
                    {product.productName || 'Đang tải...'}
                  </td>
                  <td className="text-end">
                    {new Intl.NumberFormat('vi-VN').format(product.totalSold)}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="3" className="text-center">
                    Không có dữ liệu
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TopSellingProducts; 