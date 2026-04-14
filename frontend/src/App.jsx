
    import React, { Suspense } from 'react';
    import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';
    import { motion, AnimatePresence } from 'framer-motion';
    import Header from '@/components/Header';
    import Footer from '@/components/Footer';
    import HomePage from '@/pages/HomePage';
    import LoginPage from '@/pages/LoginPage';
    import RegisterPage from '@/pages/RegisterPage';
    import { Toaster } from "@/components/ui/toaster";
    import { Loader2 } from 'lucide-react'; 
    import { NotificationProvider } from './context/NotificationContext';
    import { AuthProvider } from './context/AuthContext';

    const ProductsPage = React.lazy(() => import('@/pages/ProductsPage'));
    const ProductDetailPage = React.lazy(() => import('@/pages/ProductDetailPage'));
    const SellerProfilePage = React.lazy(() => import('@/pages/SellerProfilePage'));
    const CartPage = React.lazy(() => import('@/pages/CartPage'));
    const AccountSettingsPage = React.lazy(() => import('@/pages/AccountSettingsPage'));
    const NotificationsPage = React.lazy(() => import('@/pages/NotificationsPage'));
    const SellerDashboardPage = React.lazy(() => import('@/pages/SellerDashboardPage'));
    const ProductFormPage = React.lazy(() => import('@/pages/ProductFormPage'));
    const AdminPage = React.lazy(() => import('@/pages/AdminPage'));
    const InvoicesPage = React.lazy(() => import('@/pages/InvoicesPage'));
    const CheckoutPage = React.lazy(() => import('@/pages/CheckoutPage'));
    const OrderTrackingPage = React.lazy(() => import('@/pages/OrderTrackingPage'));
    const ManagePayoutMethodsPage = React.lazy(() => import('@/pages/ManagePayoutMethodsPage'));
    const SellerOrderDetailPage = React.lazy(() => import('@/pages/SellerOrderDetailPage'));
    const FavoritesPage = React.lazy(() => import('@/pages/FavoritesPage'));
    const ChatPage = React.lazy(() => import('@/pages/ChatPage'));

    const ForgetPasswordPage = React.lazy(() => import('@/pages/ForgotPasswordPage'));
    const ResetPasswordPage = React.lazy(() => import('@/pages/ResetPasswordPage'));

    const LoadingFallback = () => (
      <div className="flex-grow flex items-center justify-center">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );

    function AnimatedRoutes() {
      const location = useLocation();
      return (
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="flex-grow flex" 
          >
            <Suspense fallback={<LoadingFallback />}>
              <Routes location={location}>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgetPasswordPage />} />
                <Route path="/reset-password" element={<ResetPasswordPage />} />
                <Route path="/products" element={<ProductsPage />} />
                <Route path="/product/:productId" element={<ProductDetailPage />} />
                <Route path="/seller/:sellerId" element={<SellerProfilePage />} />
                <Route path="/cart" element={<CartPage />} />
                <Route path="/settings" element={<AccountSettingsPage />} />
                <Route path="/notifications" element={<NotificationsPage />} />
                <Route path="/favorites" element={<FavoritesPage />} />
                <Route path="/chat/:chatId" element={<ChatPage />} />
                <Route path="/chat" element={<ChatPage />} /> 

                <Route path="/dashboard" element={<SellerDashboardPage />} />
                <Route path="/dashboard/products/new" element={<ProductFormPage />} />
                <Route path="/dashboard/products/edit/:productId" element={<ProductFormPage />} />
                <Route path="/dashboard/billing/manage-payouts" element={<ManagePayoutMethodsPage />} />
                <Route path="/dashboard/order/:orderId" element={<SellerOrderDetailPage />} /> 
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/invoices" element={<InvoicesPage />} />
                <Route path="/checkout" element={<CheckoutPage />} />
                <Route path="/order/:orderId/track" element={<OrderTrackingPage />} />
                <Route path="/order/:orderId" element={<OrderTrackingPage />} />


              </Routes>
            </Suspense>
          </motion.div>
        </AnimatePresence>
      );
    }


    function App() {
      return (
        <Router future={{ v7_relativeSplatPath: true }}>
          <AuthProvider>
            <NotificationProvider>
              <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-grow flex"> 
                  <AnimatedRoutes />
                </main>
                <Footer />
                <Toaster />
              </div>
            </NotificationProvider>
          </AuthProvider>
        </Router>
      );
    }

    export default App;
