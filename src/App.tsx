import React from 'react';
import { EcommerceProvider, useEcommerce } from './context/EcommerceContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AuthPage } from './pages/AuthPage';
import { CustomerAccountPage } from './pages/CustomerAccountPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { QuickCartDrawer } from './components/common/QuickCartDrawer';
import { SearchModal } from './components/common/SearchModal';
import { QuickViewModal } from './components/common/QuickViewModal';
import { ToastContainer } from './components/common/ToastContainer';

const MainContent: React.FC = () => {
  const { currentPage } = useEcommerce();

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#1A1A1A]">
      {/* 1. Global Navigation Bar */}
      <Navbar />

      {/* 2. Dynamic Page View */}
      <main className="flex-1">
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'shop' && <ShopPage />}
        {currentPage === 'product-details' && <ProductDetailsPage />}
        {currentPage === 'cart' && <CartPage />}
        {currentPage === 'checkout' && <CheckoutPage />}
        {currentPage === 'auth' && <AuthPage />}
        {currentPage === 'account' && <CustomerAccountPage />}
        {currentPage === 'admin' && <AdminDashboardPage />}
      </main>

      {/* 3. Global Luxury Footer */}
      <Footer />

      {/* 4. Global Interactive Overlays */}
      <QuickCartDrawer />
      <SearchModal />
      <QuickViewModal />
      <ToastContainer />
    </div>
  );
};

export default function App() {
  return (
    <EcommerceProvider>
      <MainContent />
    </EcommerceProvider>
  );
}
