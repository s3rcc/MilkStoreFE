import React, { useState, useEffect } from 'react';
import PostForm from './PostForm';
import { toast } from 'react-hot-toast';
import { Modal } from 'bootstrap';
import debounce from 'lodash/debounce';
import { postService } from '../../services/api';

const PostManager = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [formModal, setFormModal] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    pageSize: 10,
    totalPages: 1,
    totalItems: 0
  });

  useEffect(() => {
    const modal = new Modal(document.getElementById('postFormModal'));
    setFormModal(modal);
    fetchPosts();
  }, []);

  const handleShowForm = (post = null) => {
    setSelectedPost(post);
    setShowForm(true);
    formModal?.show();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    formModal?.hide();
  };

  const handleCreate = async (formData) => {
    try {
      await postService.createPost(formData);
      toast.success('Tạo bài viết thành công');
      handleCloseForm();
      fetchPosts();
    } catch (error) {
      console.error('Lỗi khi tạo bài viết:', error);
      toast.error(error.response?.data?.message || 'Không thể tạo bài viết');
      throw error;
    }
  };

  const handleUpdate = async (id, formData) => {
    try {
      await postService.updatePost(id, formData);
      toast.success('Cập nhật bài viết thành công');
      handleCloseForm();
      fetchPosts();
    } catch (error) {
      console.error('Lỗi khi cập nhật bài viết:', error);
      toast.error(error.response?.data?.message || 'Không thể cập nhật bài viết');
      throw error;
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài viết này?')) {
      try {
        await postService.deletePost(id);
        toast.success('Xóa bài viết thành công');
        fetchPosts();
      } catch (error) {
        console.error('Lỗi khi xóa bài viết:', error);
        toast.error('Không thể xóa bài viết');
      }
    }
  };

  const fetchPosts = async (pageIndex = 1, searchTerm = '') => {
    try {
      setLoading(true);
      const response = await postService.getPosts({
        name: searchTerm,
        index: pageIndex,
        pageSize: pagination.pageSize
      });
      
      if (response.data?.statusCode === 'OK') {
        const { data } = response.data;
        setPosts(data.items || []);
        setPagination({
          currentPage: data.currentPage,
          pageSize: data.pageSize,
          totalPages: data.totalPages,
          totalItems: data.totalItems
        });
      }
    } catch (error) {
      console.error('Lỗi khi tải danh sách bài viết:', error);
      toast.error('Không thể tải danh sách bài viết');
      setPosts([]);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (newPage) => {
    fetchPosts(newPage);
  };

  const handleSearch = debounce((term) => {
    fetchPosts(1, term);
  }, 500);

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>Post Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => handleShowForm()}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Add New Post
        </button>
      </div>

      {/* Search */}
      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search posts..."
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      {/* Posts List */}
      {loading ? (
        <div className="text-center py-4">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : posts.length === 0 ? (
        <div className="alert alert-info">No posts found.</div>
      ) : (
        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          {posts.map((post) => (
            <div key={post.id} className="col">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text text-truncate">{post.content}</p>
                  {post.products && post.products.length > 0 && (
                    <div className="mt-2">
                      <h6 className="text-muted">Related Products:</h6>
                      <div className="d-flex flex-wrap gap-1">
                        {post.products.map(product => (
                          <span key={product.id} className="badge bg-secondary">
                            {product.productName}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="mt-2">
                    <small className="text-muted">
                      Created: {new Date(post.createdAt).toLocaleDateString()}
                    </small>
                    <br />
                    <small className="text-muted">
                      Last Updated: {new Date(post.lastUpdatedAt).toLocaleDateString()}
                    </small>
                  </div>
                </div>
                <div className="card-footer bg-transparent">
                  <div className="d-flex justify-content-end gap-2">
                    <button
                      onClick={() => handleShowForm(post)}
                      className="btn btn-sm btn-outline-primary"
                    >
                      <i className="bi bi-pencil"></i>
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="btn btn-sm btn-outline-danger"
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <nav className="mt-4">
          <ul className="pagination justify-content-center">
            {[...Array(pagination.totalPages)].map((_, index) => (
              <li 
                key={index + 1}
                className={`page-item ${pagination.currentPage === index + 1 ? 'active' : ''}`}
              >
                <button
                  className="page-link"
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      )}

      {/* Modal Form */}
      <div className="modal fade" id="postFormModal" tabIndex="-1">
        <div className="modal-dialog modal-lg">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">
                {selectedPost ? 'Edit Post' : 'Create New Post'}
              </h5>
              <button 
                type="button" 
                className="btn-close" 
                onClick={handleCloseForm}
              ></button>
            </div>
            <div className="modal-body">
              {showForm && (
                <PostForm
                  onSubmit={selectedPost ? 
                    (data) => handleUpdate(selectedPost.id, data) : 
                    handleCreate}
                  initialData={selectedPost}
                  onCancel={handleCloseForm}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostManager; 