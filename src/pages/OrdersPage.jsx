import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { orderService } from '../services/api';
import { productService } from '../services/api';

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState({});
  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getOrders({
        page: 1,
        pageSize: 10,
        orderDetailStatus: 'Ordered'
      });

      if (response.data.code === 'Success') {
        console.log('Orders response:', response.data.data.items);
        setOrders(response.data.data.items);

        // Fetch product details for each cart item
        const productPromises = response.data.data.items.map(item =>
            productService.getProduct(item.productID)
          );
  
          const productResponses = await Promise.all(productPromises);
          const productMap = {};
          productResponses.forEach(res => {
            if (res.data.items?.[0]) {
              productMap[res.data.items[0].id] = res.data.items[0];
            }
          });
          setProducts(productMap);
      }
    } catch (error) {
      console.error('Lỗi khi tải đơn hàng:', error);
      toast.error('Không thể tải danh sách đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Đơn hàng đã đặt</h2>

      {orders.length === 0 ? (
        <div className="alert alert-info">
          Bạn chưa có đơn hàng nào.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle">
            <thead>
              <tr>
                <th style={{ width: '15%' }}>Mã đơn hàng</th>
                <th style={{ width: '40%' }}>Sản phẩm</th>
                <th style={{ width: '10%' }}>Số lượng</th>
                <th style={{ width: '15%' }}>Đơn giá</th>
                <th style={{ width: '15%' }}>Tổng tiền</th>
                <th style={{ width: '15%' }}>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => {
                const product = products[order.productID];
                console.log('Order item:', order);
                return (
                  <tr key={order.id}>
                    <td className="fw-bold">{order.orderID}</td>
                    <td>
                      <div className="d-flex align-items-center gap-3">
                        <img
                          src={product?.imageUrl}
                          alt={product?.productName}
                          className="rounded border"
                          style={{
                            width: '100px',
                            height: '100px',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://via.placeholder.com/100';
                          }}
                        />
                        <div className="flex-grow-1">
                          <div className="fw-bold fs-6 mb-1">{product?.productName}</div>
                          <div className="text-muted">
                            {product?.description?.length > 100 
                              ? `${product.description.substring(0, 100)}...` 
                              : product?.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="fw-bold text-center">{order.quantity}</td>
                    <td className="fw-bold">{order.unitPrice.toLocaleString('vi-VN')}đ</td>
                    <td className="fw-bold text-primary">{order.totalAmount.toLocaleString('vi-VN')}đ</td>
                    <td>
                      <Link 
                        to={`/products/${order.productID}`}
                        className="btn btn-outline-primary w-100"
                      >
                        <i className="bi bi-eye me-2"></i>
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrdersPage; 