import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Pagination } from 'react-bootstrap';
import { preorderService, productService } from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

const PreorderPage = () => {
  const [preorders, setPreorders] = useState([]);
  const [products, setProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const { auth } = useAuth();
  const pageSize = 10;

  useEffect(() => {
    fetchPreorders();
  }, [currentPage]);

  const fetchPreorders = async () => {
    try {
      setLoading(true);
      const response = await preorderService.getPreorders({
        pageIndex: currentPage,
        pageSize: pageSize
      });
      
      if (response.data.items) {
        // Lọc preorder theo userId hiện tại
        const userPreorders = response.data.items.filter(
          preorder => preorder.userID === auth.user.id
        );
        setPreorders(userPreorders);
        setTotalPages(response.data.totalPages);
        
        // Lấy thông tin sản phẩm cho mỗi preorder
        const productIds = userPreorders.map(item => item.productID);
        const productPromises = productIds.map(id => productService.getProduct(id));
        const productResponses = await Promise.all(productPromises);
        
        const productMap = {};
        productResponses.forEach(res => {
          if (res.data.items && res.data.items.length > 0) {
            const product = res.data.items[0];
            productMap[product.id] = product;
          }
        });
        
        setProducts(productMap);
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách đặt hàng trước:', error);
      toast.error('Không thể tải danh sách đặt hàng trước');
    } finally {
      setLoading(false);
    }
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
      <h2 className="mb-4">Danh sách đặt hàng trước</h2>
      
      {preorders.length === 0 ? (
        <div className="alert alert-info">
          Bạn chưa có sản phẩm nào được đặt trước
        </div>
      ) : (
        <>
          <Table responsive striped bordered hover>
            <thead>
              <tr>
                <th>Mã đặt hàng</th>
                <th>Sản phẩm</th>
                <th>Trạng thái</th>
              </tr>
            </thead>
            <tbody>
              {preorders.map(preorder => (
                <tr key={preorder.id}>
                  <td>{preorder.id}</td>
                  <td>
                    {products[preorder.productID] ? (
                      <div className="d-flex align-items-center">
                        <img 
                          src={products[preorder.productID].imageUrl} 
                          alt={products[preorder.productID].productName}
                          style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                          className="me-2"
                        />
                        <div>
                          <div>{products[preorder.productID].productName}</div>
                          <div className="text-danger">
                            {products[preorder.productID].price.toLocaleString('vi-VN')}đ
                          </div>
                        </div>
                      </div>
                    ) : (
                      'Đang tải...'
                    )}
                  </td>
                  <td>
                    <span className="badge bg-warning">
                      {preorder.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>

          {totalPages > 1 && (
            <Pagination className="justify-content-center">
              <Pagination.First
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(1)}
              />
              <Pagination.Prev
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
              />
              {[...Array(totalPages)].map((_, idx) => (
                <Pagination.Item
                  key={idx + 1}
                  active={idx + 1 === currentPage}
                  onClick={() => setCurrentPage(idx + 1)}
                >
                  {idx + 1}
                </Pagination.Item>
              ))}
              <Pagination.Next
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
              />
              <Pagination.Last
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(totalPages)}
              />
            </Pagination>
          )}
        </>
      )}
    </Container>
  );
};

export default PreorderPage;