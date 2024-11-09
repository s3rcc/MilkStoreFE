import React, { useState, useEffect } from 'react';
import { Container } from 'react-bootstrap';
import OrderList from '../components/Order/OrderList';
import OrderFilter from '../components/Order/OrderFilter';
import { getOrders } from '../services/api';

const OrderManagementPage = () => {
  const [orders, setOrders] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState({
    id: '',
    orderStatus: '',
    paymentStatus: '',
    pageSize: 10
  });

  const handleFilterChange = (newFilters) => {
    setFilters(prev => ({...prev, ...newFilters}));
    setCurrentPage(1);
  };

  const fetchOrders = async () => {
    try {
      console.log('Fetching orders with params:', {
        ...filters,
        index: currentPage
      });

      const response = await getOrders({
        ...filters,
        index: currentPage
      });

      console.log('API Response:', response);

      if (response?.data?.data) {
        setOrders(response.data.data.items);
        setTotalPages(response.data.data.totalPages);
        console.log('Orders set:', response.data.data.items);
      } else {
        console.log('No orders data in response');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [filters, currentPage]);

  console.log('Current orders state:', orders);

  return (
    <Container fluid className="p-4">
      <h2 className="mb-4">Manage Order</h2>
      <OrderFilter 
        filters={filters} 
        onFilterChange={handleFilterChange}
      />
      <OrderList 
        orders={orders}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        onOrdersChange={fetchOrders}
      />
    </Container>
  );
};

export default OrderManagementPage; 