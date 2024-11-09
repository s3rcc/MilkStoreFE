import React, { useState } from 'react';
import { Card, Table, Badge, Form, InputGroup } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import StatisticsService from '../../services/statisticsService';

const LowStockProducts = ({ data, onRefresh }) => {
  const [threshold, setThreshold] = useState(100);

  const handleThresholdChange = async (value) => {
    try {
      const newThreshold = parseInt(value);
      if (isNaN(newThreshold) || newThreshold < 0) {
        toast.error('Vui lòng nhập số lượng hợp lệ');
        return;
      }
      setThreshold(newThreshold);
      
      // Gọi API với threshold mới
      const response = await StatisticsService.fetchLowStockProducts(newThreshold);
      if (typeof onRefresh === 'function') {
        onRefresh(response);
      }
    } catch (error) {
      console.error('Error updating threshold:', error);
      toast.error('Không thể cập nhật danh sách');
    }
  };

  return (
    <Card className="h-100">
      <Card.Body>
        <Card.Title className="d-flex align-items-center justify-content-between mb-3">
          <div>
            <i className="bi bi-exclamation-triangle-fill text-warning me-2"></i>
            Sản phẩm sắp hết hàng
          </div>
          <Form.Group style={{ width: '150px' }}>
            <InputGroup size="sm">
              <InputGroup.Text>Ngưỡng</InputGroup.Text>
              <Form.Control
                type="number"
                value={threshold}
                onChange={(e) => handleThresholdChange(e.target.value)}
                min="0"
                style={{ maxWidth: '80px' }}
              />
            </InputGroup>
          </Form.Group>
        </Card.Title>
        <div className="table-responsive">
          <Table hover>
            <thead>
              <tr>
                <th>Mã SP</th>
                <th>Tên sản phẩm</th>
                <th className="text-end">Tồn kho</th>
                <th className="text-center">Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {data.map((product) => (
                <tr key={product.id}>
                  <td>SP{product.id}</td>
                  <td>{product.productName}</td>
                  <td className="text-end">
                    {new Intl.NumberFormat('vi-VN').format(product.quantityInStock)}
                  </td>
                  <td className="text-center">
                    {product.quantityInStock === 0 ? (
                      <Badge bg="danger">Hết hàng</Badge>
                    ) : product.quantityInStock <= threshold / 2 ? (
                      <Badge bg="warning">Sắp hết</Badge>
                    ) : (
                      <Badge bg="info">Cần nhập thêm</Badge>
                    )}
                  </td>
                </tr>
              ))}
              {data.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">
                    Không có sản phẩm nào dưới ngưỡng tồn kho
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

export default LowStockProducts; 