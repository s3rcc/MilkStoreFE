import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { voucherService } from '../services/api';
import toast from 'react-hot-toast';

const UserVoucherPage = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    try {
      setLoading(true);
      const response = await voucherService.getVouchers({
        pageSize: 100, // Lấy nhiều voucher
        status: 0 // Chỉ lấy voucher đang active
      });
      
      if (response.data?.data) {
        // Lọc voucher còn hạn sử dụng và còn số lượng
        const activeVouchers = response.data.data.items.filter(voucher => {
          const isValid = new Date(voucher.expiryDate) > new Date();
          const hasRemaining = voucher.usedCount < voucher.usingLimit;
          return isValid && hasRemaining;
        });
        setVouchers(activeVouchers);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách voucher:', error);
      toast.error('Không thể tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyVoucher = (voucherCode) => {
    navigator.clipboard.writeText(voucherCode)
      .then(() => {
        toast.success('Đã sao chép mã voucher');
      })
      .catch(() => {
        toast.error('Không thể sao chép mã voucher');
      });
  };

  const calculateDaysRemaining = (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const diffTime = expiry - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h2 className="mb-4">Voucher khả dụng</h2>
      
      {vouchers.length === 0 ? (
        <div className="alert alert-info">
          Hiện không có voucher nào khả dụng
        </div>
      ) : (
        <Row xs={1} md={2} lg={3} className="g-4">
          {vouchers.map((voucher) => {
            const daysRemaining = calculateDaysRemaining(voucher.expiryDate);
            const remainingUses = voucher.usingLimit - voucher.usedCount;
            
            return (
              <Col key={voucher.id}>
                <Card className="h-100 shadow-sm">
                  <Card.Body>
                    <Card.Title>{voucher.name}</Card.Title>
                    <div className="mb-3">
                      <code className="fs-5 bg-light px-2 py-1 rounded">
                        {voucher.voucherCode}
                      </code>
                    </div>
                    
                    <Card.Text>
                      {voucher.description}
                    </Card.Text>
                    
                    <ul className="list-unstyled mb-3">
                      {voucher.salePrice > 0 && (
                        <li className="text-danger">
                          <i className="bi bi-tag-fill me-2"></i>
                          Giảm {voucher.salePrice.toLocaleString('vi-VN')}đ
                        </li>
                      )}
                      {voucher.salePercent > 0 && (
                        <li className="text-danger">
                          <i className="bi bi-percent me-2"></i>
                          Giảm {voucher.salePercent}%
                        </li>
                      )}
                      {voucher.limitSalePrice > 0 && (
                        <li>
                          <i className="bi bi-info-circle me-2"></i>
                          Giảm tối đa {voucher.limitSalePrice.toLocaleString('vi-VN')}đ
                        </li>
                      )}
                      <li>
                        <i className="bi bi-clock me-2"></i>
                        Còn {daysRemaining} ngày
                      </li>
                      <li>
                        <i className="bi bi-people me-2"></i>
                        Còn {remainingUses} lượt sử dụng
                      </li>
                    </ul>

                    <Button 
                      variant="primary" 
                      className="w-100"
                      onClick={() => handleCopyVoucher(voucher.voucherCode)}
                    >
                      <i className="bi bi-clipboard me-2"></i>
                      Sao chép mã
                    </Button>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      )}
    </Container>
  );
};

export default UserVoucherPage; 