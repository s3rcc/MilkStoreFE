import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { postService } from '../services/api';

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchPosts(1);
  };

  const fetchPosts = async (page) => {
    try {
      setLoading(true);
      const response = await postService.getPosts({
        pageNumber: page,
        searchTerm: searchTerm,
        pageSize: 9
      });
      setPosts(response.data.data.items);
      setTotalPages(response.data.data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Lỗi khi tải bài viết:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  return (
    <div className="container py-5">
      <h1 className="text-center mb-4">Bài Viết</h1>
      
      <form onSubmit={handleSearch} className="mb-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button type="submit" className="btn btn-primary">
                <i className="bi bi-search me-1"></i>
                Tìm kiếm
              </button>
            </div>
          </div>
        </div>
      </form>

      {loading ? (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row g-4">
            {posts.map((post) => (
              <div key={post.id} className="col-md-4">
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{post.title}</h5>
                    <p className="card-text text-muted small">
                      <i className="bi bi-calendar me-2"></i>
                      {new Date(post.createdAt).toLocaleDateString('vi-VN')}
                    </p>
                    <p className="card-text">{post.content.substring(0, 150)}...</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <Link to={`/posts/${post.id}`} className="btn btn-primary">
                        Xem chi tiết
                      </Link>
                      <span className="text-muted small">
                        {post.products.length} sản phẩm liên quan
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {totalPages > 1 && (
            <nav className="mt-4">
              <ul className="pagination justify-content-center">
                {[...Array(totalPages)].map((_, index) => (
                  <li 
                    key={index}
                    className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => fetchPosts(index + 1)}
                    >
                      {index + 1}
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};

export default Posts; 