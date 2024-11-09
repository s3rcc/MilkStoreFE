import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productService, postService } from '../services/api';

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch 3 sản phẩm mới nhất
        const productsResponse = await productService.getProducts({
          pageIndex: 1,
          pageSize: 3
        });

        // Fetch 3 bài viết mới nhất với cấu trúc API mới
        const postsResponse = await postService.getPosts({
          index: 1,
          pageSize: 3
        });

        if (productsResponse.data?.items) {
          setFeaturedProducts(productsResponse.data.items);
        }

        if (postsResponse.data?.data?.items) {
          setLatestPosts(postsResponse.data.data.items);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <div className="position-relative">
        <img 
          src="/img/baby.jpg"
          alt="Baby drinking milk" 
          className="w-100"
          style={{ 
            height: '600px',
            objectFit: 'cover'
          }}
        />
        <div 
          className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
        >
          <div className="container text-white">
            <div className="col-md-8">
              <h1 className="display-4 fw-bold mb-4">
                Chất lượng tốt nhất cho bé yêu của bạn
              </h1>
              <p className="lead mb-4">
                Sản phẩm sữa và dinh dưỡng chất lượng cao, 
                đảm bảo an toàn cho sự phát triển của bé
              </p>
              <Link to="/products" className="btn btn-primary btn-lg">
                Khám phá ngay
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products Section */}
      <section className="py-5">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Sản phẩm nổi bật</h2>
            <Link to="/products" className="btn btn-outline-primary">
              Xem tất cả
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>

          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
              </div>
            ) : (
              featuredProducts.map(product => (
                <div key={product.id} className="col-md-4">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={product.imageUrl || 'https://via.placeholder.com/300x300'}
                      className="card-img-top"
                      alt={product.productName}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{product.productName}</h5>
                      <p className="card-text text-danger fw-bold">
                        {product.price.toLocaleString('vi-VN')}đ
                      </p>
                      <Link 
                        to={`/products/${product.id}`}
                        className="btn btn-primary w-100"
                      >
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Latest Posts Section */}
      <section className="py-5 bg-light">
        <div className="container">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="mb-0">Bài viết mới nhất</h2>
            <Link to="/posts" className="btn btn-outline-primary">
              Xem tất cả
              <i className="bi bi-arrow-right ms-2"></i>
            </Link>
          </div>

          <div className="row g-4">
            {loading ? (
              <div className="col-12 text-center">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Đang tải...</span>
                </div>
              </div>
            ) : (
              latestPosts.map(post => (
                <div key={post.id} className="col-md-4">
                  <div className="card h-100 shadow-sm">
                    <div className="card-body">
                      <h5 className="card-title">{post.title}</h5>
                      <p className="card-text text-muted">
                        {post.content?.substring(0, 100)}...
                      </p>
                      {post.products && post.products.length > 0 && (
                        <div className="mb-3">
                          <small className="text-muted">Sản phẩm liên quan:</small>
                          <div className="d-flex flex-wrap gap-2 mt-2">
                            {post.products.map(product => (
                              <Link
                                key={product.id}
                                to={`/products/${product.id}`}
                                className="badge bg-light text-dark text-decoration-none"
                              >
                                {product.productName}
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                      <Link 
                        to={`/posts/${post.id}`}
                        className="btn btn-outline-primary w-100"
                      >
                        Đọc thêm
                      </Link>
                    </div>
                    <div className="card-footer text-muted">
                      <small>
                        <i className="bi bi-calendar me-2"></i>
                        {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                      </small>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
