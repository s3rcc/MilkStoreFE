import React from 'react';
import { Routes, Route, Navigate, BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import HomePage from './pages/HomePage';
import DashboardPage from './pages/DashboardPage';
import UserManagePage from './pages/UserManagePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import AdminLayout from './components/layout/AdminLayout';
import UserProfilePage from './pages/UserProfilePage';
import PublicLayout from './components/layout/PublicLayout';
import GiftPage from './pages/GiftPage';
import ProductPage from './pages/ProductPage';
import CategoryPage from './pages/CategoryPage';
import PostPage from './pages/PostPage';
import VoucherPage from './pages/VoucherPage';
import OrderManagementPage from './pages/OrderManagementPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ProfilePage from './pages/ProfilePage';
import { AuthProvider } from './contexts/AuthContext';
import PrivateRoute from './components/Auth/PrivateRoute';
import Posts from './pages/Posts';
import PostDetail from './pages/PostDetail';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import PaymentCallback from './pages/PaymentCallback';
import OrdersPage from './pages/OrdersPage';
import TopupPage from './pages/TopupPage';
import PaymentTopupCallback from './pages/PaymentTopupCallback';
import PaymentRedirect from './pages/PaymentRedirect';
import PreorderPage from './pages/PreorderPage';
import UserVoucherPage from './pages/UserVoucherPage';
import PreorderManagementPage from './pages/PreorderManagementPage';

const App = () => {
  return (
    <div className="min-vh-100 bg-light">
      <AuthProvider>
        <BrowserRouter>
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 3000,
              style: {
                zIndex: 9999,
                minWidth: '250px',
                top: '20px',
                right: '20px'
              }
            }}
          />
          
          <Routes>
            {/* Public Routes with Navbar */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/verify-email" element={<VerifyEmailPage />} />
              
              {/* Protected User Routes (with Navbar) */}
              <Route element={<PrivateRoute allowedRoles={['Member', 'Staff', 'Admin']} />}>
                <Route path="/profile" element={<ProfilePage />} />
              </Route>
              <Route path="/posts" element={<Posts />} />
              <Route path="/posts/:id" element={<PostDetail />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              <Route element={<PrivateRoute allowedRoles={['Member']} />}>
                <Route path="/cart" element={<CartPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/orders" element={<OrdersPage />} />
                <Route path="/preorders" element={<PreorderPage />} />
                <Route path="/topup" element={<TopupPage />} />
                <Route path="/payment/topup/callback" element={<PaymentTopupCallback />} />
              </Route>
              <Route path="/payment/callback" element={<PaymentCallback />} />
              <Route path="/vouchers" element={<UserVoucherPage />} />
            </Route>

            {/* Protected Admin/Staff Routes (without Navbar) */}
            <Route element={<PrivateRoute allowedRoles={['Staff', 'Admin']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/dashboard/users/manage" element={<UserManagePage />} />
                <Route path="/dashboard/orders" element={<OrderManagementPage />} />
                <Route path="/dashboard/preorders" element={<PreorderManagementPage />} />
                <Route path="/dashboard/gifts" element={<GiftPage />} />
                <Route path="/dashboard/products" element={<ProductPage />} />
                <Route path="/dashboard/categories" element={<CategoryPage />} />
                <Route path="/dashboard/posts" element={<PostPage />} />
                <Route path="/dashboard/vouchers" element={<VoucherPage />} />
              </Route>
            </Route>

            {/* Route xử lý callback từ VNPay */}
            <Route path="/api/payment/ipn" element={<PaymentRedirect />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </div>
  );
};

export default App;
