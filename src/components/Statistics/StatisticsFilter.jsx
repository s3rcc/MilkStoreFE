import React, { useState } from 'react';
import { Form, Row, Col, Button } from 'react-bootstrap';
import { format } from 'date-fns';

const StatisticsFilter = ({ onFilterChange }) => {
  const [filters, setFilters] = useState({
    day: '',
    month: '',
    year: new Date().getFullYear(),
    startDate: '',
    endDate: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilterChange(filters);
  };

  return (
    <Form onSubmit={handleSubmit} className="bg-white p-3 rounded shadow-sm mb-4">
      <Row className="g-3">
        <Col md={2}>
          <Form.Group>
            <Form.Label>Ngày</Form.Label>
            <Form.Control
              type="number"
              name="day"
              value={filters.day}
              onChange={handleChange}
              min="1"
              max="31"
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Tháng</Form.Label>
            <Form.Control
              type="number"
              name="month"
              value={filters.month}
              onChange={handleChange}
              min="1"
              max="12"
            />
          </Form.Group>
        </Col>
        <Col md={2}>
          <Form.Group>
            <Form.Label>Năm</Form.Label>
            <Form.Control
              type="number"
              name="year"
              value={filters.year}
              onChange={handleChange}
              min="2000"
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Từ ngày</Form.Label>
            <Form.Control
              type="date"
              name="startDate"
              value={filters.startDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={3}>
          <Form.Group>
            <Form.Label>Đến ngày</Form.Label>
            <Form.Control
              type="date"
              name="endDate"
              value={filters.endDate}
              onChange={handleChange}
            />
          </Form.Group>
        </Col>
        <Col md={12} className="text-end">
          <Button type="submit" variant="primary">
            Áp dụng
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default StatisticsFilter;