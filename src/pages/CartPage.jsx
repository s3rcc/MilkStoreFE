import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { cartService, productService } from '../services/api';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(true);
  const [quantities, setQuantities] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  useEffect(() => {
    const initialQuantities = {};
    cartItems.forEach(item => {
      initialQuantities[item.id] = item.quantity;
    });
    setQuantities(initialQuantities);
  }, [cartItems]);

  const fetchCartItems = async () => {
    try {
      const response = await cartService.getCart({
        orderDetailStatus: 'InCart'
      });

      if (response.data.code === 'Success') {
        setCartItems(response.data.data.items);

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
      console.error('Lỗi khi tải giỏ hàng:', error);
      toast.error('Không thể tải giỏ hàng');
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = async (itemId) => {
    const newQuantity = quantities[itemId];
    const item = cartItems.find(item => item.id === itemId);

    if (!item) return;

    if (newQuantity < 1) {
      toast.error('Số lượng phải lớn hơn 0');
      return;
    }

    try {
      setLoading(true);
      await cartService.updateCartItem(itemId, {
        productID: item.productID,
        quantity: newQuantity
      });
      
      await fetchCartItems();
      toast.success('Cập nhật số lượng thành công');
    } catch (error) {
      console.error('Lỗi khi cập nhật số lượng:', error);
      toast.error('Không thể cập nhật số lượng');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) {
      try {
        setLoading(true);
        await cartService.deleteCartItem(itemId);
        await fetchCartItems();
        toast.success('Đã xóa sản phẩm khỏi giỏ hàng');
      } catch (error) {
        console.error('Lỗi khi xóa sản phẩm:', error);
        toast.error('Không thể xóa sản phẩm');
      } finally {
        setLoading(false);
      }
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

  if (cartItems.length === 0) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="bi bi-cart3 display-1 text-muted mb-4"></i>
          <h2>Giỏ hàng trống</h2>
          <p className="text-muted">Hãy thêm sản phẩm vào giỏ hàng của bạn</p>
          <Link to="/products" className="btn btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Giỏ hàng</h2>
      
      {cartItems.length === 0 ? (
        <div className="text-center">
          <p>Giỏ hàng trống</p>
          <Link to="/products" className="btn btn-primary">
            Tiếp tục mua sắm
          </Link>
        </div>
      ) : (
        <>
          <div className="table-responsive">
            <table className="table align-middle">
              <thead>
                <tr>
                  <th>Sản phẩm</th>
                  <th>Số lượng</th>
                  <th>Đơn giá</th>
                  <th>Tổng tiền</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map(item => {
                  const product = products[item.productID];
                  return (
                    <tr key={item.id}>
                      <td>
                        <div className="d-flex align-items-center gap-3">
                          <img
                            src={product?.imageUrl}
                            alt={product?.productName}
                            style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                            className="rounded"
                          />
                          <div>
                            <h6 className="mb-0">{product?.productName}</h6>
                            <small className="text-muted">
                              {product?.description?.substring(0, 100)}...
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="d-flex align-items-center gap-2">
                          <input
                            type="number"
                            className="form-control"
                            style={{ width: '80px' }}
                            value={quantities[item.id] || ''}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (!isNaN(value)) {
                                setQuantities(prev => ({
                                  ...prev,
                                  [item.id]: value
                                }));
                              }
                            }}
                            min="1"
                          />
                          <button
                            className="btn btn-outline-primary"
                            onClick={() => handleQuantityChange(item.id)}
                            disabled={loading || quantities[item.id] === item.quantity}
                          >
                            <i className="bi bi-arrow-clockwise"></i>
                          </button>
                        </div>
                      </td>
                      <td>{item.unitPrice.toLocaleString('vi-VN')}đ</td>
                      <td>{item.totalAmount.toLocaleString('vi-VN')}đ</td>
                      <td>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => handleRemoveItem(item.id)}
                          disabled={loading}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="d-flex justify-content-end mt-4">
            <div className="text-end">
              <h5>Tổng tiền: {cartItems.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString('vi-VN')}đ</h5>
              <button 
                className="btn btn-primary mt-2"
                onClick={() => navigate('/checkout')}
                disabled={loading}
              >
                Thanh toán
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default CartPage; 