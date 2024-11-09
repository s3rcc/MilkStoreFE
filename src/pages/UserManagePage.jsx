import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { toast } from 'react-hot-toast';
import UserTable from '../components/User/UserTable';
import UserPagination from '../components/User/UserPagination';
import AddUserModal from '../components/User/AddUserModal';
import axiosInstance from '../utils/axiosConfig';

const UserManagePage = () => {
  const [users, setUsers] = useState([]);
  const [roles, setRoles] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [filters, setFilters] = useState({
    page: 1,
    pageSize: 10,
    SearchByName: '',
    SearchByPhoneNumber: '',
    SearchByEmail: '',
    sortBy: 'Name',
    sortOrder: 'asc',
    role: '',
    id: ''
  });

  // Fetch users
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get('/users', { 
        params: {
          page: filters.page,
          pageSize: filters.pageSize,
          SearchByName: filters.SearchByName || undefined,
          SearchByPhoneNumber: filters.SearchByPhoneNumber || undefined,
          SearchByEmail: filters.SearchByEmail || undefined,
          role: filters.role || undefined,
          sortBy: filters.sortBy,
          sortOrder: filters.sortOrder
        }
      });
      
      if (response.data?.data) {
        setUsers(response.data.data.items || []);
        setTotalPages(response.data.data.totalPages || 1);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Không thể tải danh sách người dùng');
      setUsers([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch roles
  const fetchRoles = async () => {
    try {
      const response = await axiosInstance.get('/role/get_roles');
      if (response.data?.data) {
        setRoles(response.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Không thể tải danh sách vai trò');
      setRoles([]);
    }
  };

  useEffect(() => {
    const initializePage = async () => {
      await fetchRoles();
      fetchUsers();
    };
    initializePage();
  }, []);

  useEffect(() => {
    if (roles !== null) {
      fetchUsers();
    }
  }, [filters, roles]);

  // Xử lý filter
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value,
      page: 1 // Reset về trang 1 khi filter thay đổi
    }));
  };

  // Xử lý phân trang
  const handlePageChange = (page) => {
    setFilters(prev => ({ ...prev, page }));
  };

  // Xử lý thêm user mới
  const handleAddSuccess = () => {
    fetchUsers();
    setShowAddModal(false);
    toast.success('Thêm người dùng thành công');
  };

  return (
    <Container fluid className="py-4">
      <Row className="mb-4 align-items-center">
        <Col>
          <h1 className="mb-0">Quản lý người dùng</h1>
        </Col>
        <Col xs="auto">
          <Button 
            variant="primary"
            onClick={() => setShowAddModal(true)}
          >
            <i className="bi bi-plus-circle me-2"></i>
            Thêm người dùng
          </Button>
        </Col>
      </Row>

      {/* Search filters */}
      <Row className="mb-4 g-3">
        <Col md={3}>
          <Form.Control
            placeholder="Tìm theo tên..."
            name="SearchByName"
            value={filters.SearchByName}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            placeholder="Tìm theo email..."
            name="SearchByEmail"
            value={filters.SearchByEmail}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={3}>
          <Form.Control
            placeholder="Tìm theo số điện thoại..."
            name="SearchByPhoneNumber"
            value={filters.SearchByPhoneNumber}
            onChange={handleFilterChange}
          />
        </Col>
        <Col md={3}>
          <Form.Select
            name="role"
            value={filters.role}
            onChange={handleFilterChange}
          >
            <option value="">Tất cả vai trò</option>
            {Array.isArray(roles) && roles.map(role => (
              <option key={role.roleId} value={role.roleName}>
                {role.roleName}
              </option>
            ))}
          </Form.Select>
        </Col>
      </Row>

      {/* User table */}
      <UserTable 
        users={users}
        isLoading={isLoading}
        onRefresh={fetchUsers}
      />

      {/* Pagination */}
      <UserPagination
        currentPage={filters.page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Add user modal */}
      {Array.isArray(roles) && (
        <AddUserModal
          show={showAddModal}
          onHide={() => setShowAddModal(false)}
          onSuccess={handleAddSuccess}
          roles={roles}
        />
      )}
    </Container>
  );
};

export default UserManagePage;