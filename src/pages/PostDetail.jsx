import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { postService } from '../services/api';

const PostDetail = () => {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await postService.getPost(id);
        if (response.data.data.items && response.data.data.items.length > 0) {
          setPost(response.data.data.items[0]);
        }
      } catch (error) {
        console.error('Lỗi khi tải bài viết:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning" role="alert">
          Không tìm thấy bài viết
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <article>
            <h1 className="mb-4">{post.title}</h1>

            <div className="mb-4 text-muted">
              <small>
                <i className="bi bi-calendar me-2"></i>
                {new Date(post.createdAt).toLocaleDateString('vi-VN')}
              </small>
            </div>

            <div className="content mb-5" 
              dangerouslySetInnerHTML={{ __html: post.content }} 
            />

            {post.products && post.products.length > 0 && (
              <section className="mt-5">
                <h3 className="mb-4">Sản phẩm trong bài viết</h3>
                <div className="row g-3">
                  {post.products.map((product) => (
                    <div key={product.id} className="col-md-4">
                      <div className="card h-100 shadow-sm">
                        <img
                          src={product.imageUrl || 'https://via.placeholder.com/300x200'}
                          className="card-img-top"
                          alt={product.productName}
                          style={{ height: '160px', objectFit: 'cover' }}
                        />
                        <div className="card-body p-3">
                          <h6 className="card-title mb-2">{product.productName}</h6>
                          <p className="card-text text-danger fw-bold mb-2">
                            {product.price.toLocaleString('vi-VN')}đ
                          </p>
                          <p className="card-text small text-muted mb-3" style={{ fontSize: '0.875rem' }}>
                            {product.description.length > 50 
                              ? `${product.description.substring(0, 50)}...` 
                              : product.description}
                          </p>
                          <Link 
                            to={`/products/${product.id}`} 
                            className="btn btn-sm btn-primary w-100"
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
          </article>
        </div>
      </div>
    </div>
  );
};

export default PostDetail; 