import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Modal, Button } from 'react-bootstrap';
import toast from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { productService, cartService, preorderService } from '../services/api';

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const { auth } = useAuth();
  const [showPreorderModal, setShowPreorderModal] = useState(false);

  useEffect(() => {
    const fetchProductAndRelated = async () => {
      try {
        setLoading(true);
        const productRes = await productService.getProduct(id);
        
        if (productRes.data.items && productRes.data.items.length > 0) {
          const productDetail = productRes.data.items[0];
          setProduct(productDetail);
          
          const relatedRes = await productService.getProducts({
            categoryname: productDetail.categoryName,
            pageSize: 4,
            pageIndex: 1
          });
          
          const filteredRelated = relatedRes.data.items.filter(p => p.id !== id);
          setRelatedProducts(filteredRelated);
        }
      } catch (error) {
        console.error('Lỗi khi tải thông tin sản phẩm:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductAndRelated();
  }, [id]);

  const handleAddToCart = async () => {
    if (!auth?.user) {
      toast.error('Vui lòng đăng nhập để thêm vào giỏ hàng');
      return;
    }

    if (auth.user.roles.some(role => ['Staff', 'Admin'].includes(role))) {
      toast.error('không thể thêm sản phẩm vào giỏ hàng');
      return;
    }

    try {
      const response = await cartService.addToCart({
        productID: id,
        quantity: quantity
      });

      if (response.data.code === 'Success') {
        toast.success('Đã thêm vào giỏ hàng');
      }
    } catch (error) {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      toast.error('Không thể thêm vào giỏ hàng');
    }
  };

  const handlePreorderClick = () => {
    if (!auth?.user) {
      toast.error('Vui lòng đăng nhập để đặt hàng trước');
      return;
    }
    setShowPreorderModal(true);
  };

  const handlePreorder = async () => {
    try {
      const response = await preorderService.createPreorder(id);
      if (response.data.code === 'Success') {
        toast.success('Đã đặt hàng trước thành công');
        setShowPreorderModal(false);
      }
    } catch (error) {
      console.error('Lỗi khi đặt hàng trước:', error);
      toast.error('Không thể đặt hàng trước');
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

  if (!product) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Không tìm thấy sản phẩm
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row mb-5">
        <div className="col-md-6">
          <img
            src={product.imageUrl || 'https://via.placeholder.com/600x600'}
            alt={product.productName}
            className="img-fluid rounded"
          />
        </div>
        <div className="col-md-6">
          <h1 className="mb-3">{product.productName}</h1>
          <p className="text-danger h3 mb-3">
            {product.price.toLocaleString('vi-VN')}đ
          </p>
          <div className="mb-4">
            <h5>Mô tả sản phẩm:</h5>
            <p>{product.description}</p>
          </div>
          <div className="mb-3">
            <p className="mb-0">
              <strong>Số lượng còn lại:</strong> {product.quantityInStock}
            </p>
          </div>
          <div className="mb-3">
            <div className="d-flex align-items-center gap-3">
              <div className="input-group" style={{ width: '150px' }}>
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                >
                  <i className="bi bi-dash"></i>
                </button>
                <input 
                  type="number" 
                  className="form-control text-center"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Math.min(product.quantityInStock, parseInt(e.target.value) || 1)))}
                  min="1"
                  max={product.quantityInStock}
                />
                <button 
                  className="btn btn-outline-secondary" 
                  type="button"
                  onClick={() => setQuantity(prev => Math.min(product.quantityInStock, prev + 1))}
                >
                  <i className="bi bi-plus"></i>
                </button>
              </div>
            </div>
          </div>
          <div className="d-grid gap-2">
            {auth?.user?.roles.some(role => ['Staff', 'Admin'].includes(role)) ? (
              <button 
                className="btn btn-secondary btn-lg"
                disabled
              >
                <i className="bi bi-cart-plus me-2"></i>
                không thể mua hàng
              </button>
            ) : (
              <>
                <button 
                  className="btn btn-primary btn-lg"
                  disabled={product.quantityInStock === 0}
                  onClick={handleAddToCart}
                >
                  <i className="bi bi-cart-plus me-2"></i>
                  {product.quantityInStock === 0 ? 'Hết hàng' : 'Thêm vào giỏ hàng'}
                </button>
                
                {product.quantityInStock === 0 && (
                  <button 
                    className="btn btn-outline-primary btn-lg"
                    onClick={handlePreorderClick}
                  >
                    <i className="bi bi-clock-history me-2"></i>
                    Đặt hàng trước
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <Modal show={showPreorderModal} onHide={() => setShowPreorderModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận đặt hàng trước</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có muốn đặt hàng trước sản phẩm này?</p>
          <p>Chúng tôi sẽ gửi thông tin của sản phẩm qua email: <strong>{auth?.user?.email}</strong></p>
          <div className="mt-3">
            <h6>Thông tin sản phẩm:</h6>
            <ul className="list-unstyled">
              <li><strong>Tên sản phẩm:</strong> {product.productName}</li>
              <li><strong>Giá:</strong> {product.price.toLocaleString('vi-VN')}đ</li>
            </ul>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPreorderModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handlePreorder}>
            Xác nhận đặt hàng trước
          </Button>
        </Modal.Footer>
      </Modal>

      {relatedProducts.length > 0 && (
        <section>
          <h3 className="mb-4">Sản phẩm liên quan</h3>
          <div className="row g-4">
            {relatedProducts.map((relatedProduct) => (
              <div key={relatedProduct.id} className="col-md-3">
                <div className="card h-100">
                  <img
                    src={relatedProduct.imageUrl || 'https://via.placeholder.com/300x300'}
                    className="card-img-top"
                    alt={relatedProduct.productName}
                    style={{ height: '200px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h5 className="card-title">{relatedProduct.productName}</h5>
                    <p className="card-text text-danger fw-bold">
                      {relatedProduct.price.toLocaleString('vi-VN')}đ
                    </p>
                    <Link 
                      to={`/products/${relatedProduct.id}`} 
                      className="btn btn-primary w-100"
                    >
                      Xem chi tiết
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ProductDetail;