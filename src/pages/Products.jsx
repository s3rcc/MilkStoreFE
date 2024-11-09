import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService } from '../services/api';
import { Form, InputGroup, Row, Col, Card, Pagination, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const pageSize = 99;

  useEffect(() => {
    fetchProducts();
  }, [currentPage, searchQuery]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getProducts({
        pageIndex: currentPage,
        pageSize: pageSize,
        productname: searchQuery
      });

      console.log('Products response:', response);

      if (response.data?.items) {
        setProducts(response.data.items);
        const total = response.data.totalItems;
        setTotalPages(Math.ceil(total / pageSize));
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Không thể tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInput = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearch = () => {
    setSearchQuery(searchTerm);
    setCurrentPage(1);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h1 className="mb-4">Sản phẩm</h1>

      {/* Search bar */}
      <div className="mb-4">
        <InputGroup>
          <Form.Control
            placeholder="Tìm kiếm sản phẩm..."
            value={searchTerm}
            onChange={handleSearchInput}
            onKeyPress={handleKeyPress}
          />
          <Button variant="primary" onClick={handleSearch}>
            <i className="bi bi-search me-2"></i>
            Tìm kiếm
          </Button>
        </InputGroup>
      </div>

      {/* Product grid */}
      <Row xs={1} md={2} lg={4} className="g-4">
        {products.map(product => (
          <Col key={product.id}>
            <Card className="h-100">
              <Card.Img
                variant="top"
                src={product.imageUrl || 'https://via.placeholder.com/300x300'}
                alt={product.productName}
                style={{ height: '200px', objectFit: 'cover' }}
              />
              <Card.Body className="d-flex flex-column">
                <Card.Title>{product.productName}</Card.Title>
                <Card.Text className="text-muted mb-2">
                  {product.description?.substring(0, 100)}...
                </Card.Text>
                <div className="mt-auto">
                  <p className="text-danger fw-bold mb-2">
                    {product.price.toLocaleString('vi-VN')}đ
                  </p>
                  <Link 
                    to={`/products/${product.id}`}
                    className="btn btn-primary w-100"
                  >
                    Xem chi tiết
                  </Link>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
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
        </div>
      )}
    </div>
  );
};

export default Products;