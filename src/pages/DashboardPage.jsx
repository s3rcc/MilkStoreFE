import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import StatisticsFilter from '../components/Statistics/StatisticsFilter';
import RevenueStats from '../components/Statistics/RevenueStats';
import EmployeeRevenueChart from '../components/Statistics/EmployeeRevenueChart';
import ProductRevenueChart from '../components/Statistics/ProductRevenueChart';
import CategoryRevenueChart from '../components/Statistics/CategoryRevenueChart';
import TopSellingProducts from '../components/Statistics/TopSellingProducts';
import LowStockProducts from '../components/Statistics/LowStockProducts';
import StatisticsService from '../services/statisticsService';
import { toast } from 'react-hot-toast';

const DashboardPage = () => {
  const [revenue, setRevenue] = useState(0);
  const [employeeRevenue, setEmployeeRevenue] = useState([]);
  const [productRevenue, setProductRevenue] = useState([]);
  const [categoryRevenue, setCategoryRevenue] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleFilterChange = async (filters) => {
    try {
      setIsLoading(true);

      // Gom nhóm các API có cùng params
      const revenuePromises = [
        StatisticsService.fetchRevenueStats(filters),
        StatisticsService.fetchRevenueByEmployee(filters),
        StatisticsService.fetchRevenueByProduct(filters),
        StatisticsService.fetchRevenueByCategory(filters)
      ];

      const [
        revenueResponse,
        employeeResponse,
        productResponse,
        categoryResponse
      ] = await Promise.all(revenuePromises);

      // Xử lý response
      if (typeof revenueResponse === 'number') setRevenue(revenueResponse);
      if (Array.isArray(employeeResponse)) setEmployeeRevenue(employeeResponse);
      if (Array.isArray(productResponse)) setProductRevenue(productResponse);
      if (Array.isArray(categoryResponse)) setCategoryRevenue(categoryResponse);

      // Fetch top selling products riêng vì có params khác
      const topProductsResponse = await StatisticsService.fetchTopSellingProducts({
        topN: 10,
        startDate: filters.startDate,
        endDate: filters.endDate
      });
      if (Array.isArray(topProductsResponse)) {
        setTopProducts(topProductsResponse);
      }

      // Fetch low stock products không phụ thuộc filter
      const lowStockResponse = await StatisticsService.fetchLowStockProducts(100);
      if (Array.isArray(lowStockResponse)) {
        setLowStockProducts(lowStockResponse);
      }

    } catch (error) {
      console.error('Error fetching statistics:', error);
      toast.error('Không thể tải dữ liệu thống kê');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const currentDate = new Date();
    handleFilterChange({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth() + 1
    });
  }, []);

  return (
    <Container fluid className="py-4">
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <h4 className="card-title mb-4">Bộ lọc thống kê</h4>
          <StatisticsFilter onFilterChange={handleFilterChange} />
        </Card.Body>
      </Card>

      {isLoading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <Row className="g-4 mb-4">
            <Col lg={3} md={6}>
              <div className="h-100">
                <RevenueStats revenue={revenue} />
              </div>
            </Col>
            <Col lg={4} md={6}>
              <div className="h-100">
                <TopSellingProducts data={topProducts} />
              </div>
            </Col>
            <Col lg={5} md={12}>
              <div className="h-100">
                <LowStockProducts data={lowStockProducts} />
              </div>
            </Col>
          </Row>

          <Row className="g-4">
            <Col md={12} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="text-muted mb-3">Doanh thu theo nhân viên</h5>
                  <EmployeeRevenueChart data={employeeRevenue} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={12} className="mb-4">
              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="text-muted mb-3">Doanh thu theo sản phẩm</h5>
                  <ProductRevenueChart data={productRevenue} />
                </Card.Body>
              </Card>
            </Col>
            <Col md={12}>
              <Card className="shadow-sm">
                <Card.Body>
                  <h5 className="text-muted mb-3">Doanh thu theo danh mục</h5>
                  <CategoryRevenueChart data={categoryRevenue} />
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default DashboardPage;