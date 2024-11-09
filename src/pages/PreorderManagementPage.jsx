import React, { useState, useEffect } from 'react';
import { Container, Table, Pagination, Form } from 'react-bootstrap';
import { preorderService, productService } from '../services/api';
import toast from 'react-hot-toast';

const PreorderManagementPage = () => {
  const [preorders, setPreorders] = useState([]);
  const [products, setProducts] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    pageSize: 10,
    status: ''
  });

  useEffect(() => {
    fetchPreorders();
  }, [currentPage, filters]);

  const fetchPreorders = async () => {
    try {
      setLoading(true);
      const response = await preorderService.getPreorders({
        pageIndex: currentPage,
        pageSize: filters.pageSize,
        status: filters.status || undefined
      });
      
      if (response.data.items) {
        setPreorders(response.data.items);
        setTotalPages(response.data.totalPages);
        
        // Fetch product details
        const productIds = response.data.items.map(item => item.productID);
        const uniqueProductIds = [...new Set(productIds)];
        
        const productPromises = uniqueProductIds.map(id => productService.getProduct(id));
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
      console.error('Error loading preorders:', error);
      toast.error('Could not load preorders');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4">
      <h2 className="mb-4">Preorder Management</h2>

      {/* Filters */}
      <div className="mb-4">
        <Form className="row g-3">
          <div className="col-md-3">
            <Form.Group>
              <Form.Label>Status</Form.Label>
              <Form.Select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
              >
                <option value="">All</option>
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
          </div>
        </Form>
      </div>

      {/* Preorders List */}
      {preorders.length === 0 ? (
        <div className="alert alert-info">
          No preorders found
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Preorder ID</th>
                  <th>User ID</th>
                  <th>Product</th>
                  <th>Created Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {preorders.map(preorder => (
                  <tr key={preorder.id}>
                    <td>{preorder.id}</td>
                    <td>{preorder.userID}</td>
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
                        'Loading...'
                      )}
                    </td>
                    <td>
                      {new Date(preorder.createdAt).toLocaleDateString('en-US')}
                    </td>
                    <td>
                      <span className={`badge ${
                        preorder.status === 'Pending' ? 'bg-warning' :
                        preorder.status === 'Completed' ? 'bg-success' :
                        'bg-danger'
                      }`}>
                        {preorder.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="justify-content-center mt-4">
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

export default PreorderManagementPage;