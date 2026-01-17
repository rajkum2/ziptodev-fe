import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/layout/Header';
import { TopCategoryNav } from './components/footer/TopCategoryNav';
import { CartDrawer } from './components/cart/CartDrawer';
import { LoginModal } from './components/modals/LoginModal';
import { LocationModal } from './components/modals/LocationModal';
import { AddressModal, AddAddressModal } from './components/modals/AddressModal';
import { SearchOverlay } from './components/modals/SearchOverlay';
import { ToastContainer } from './components/ui/Toast';
import { ChatFab } from './components/chat/ChatFab';
import { HomePage } from './pages/HomePage';
import { CategoryPage } from './pages/CategoryPage';
import { ProductPage } from './pages/ProductPage';
import { SearchPage } from './pages/SearchPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { PaymentPage } from './pages/PaymentPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { OrderTrackingPage } from './pages/OrderTrackingPage';
import { OrdersPage } from './pages/OrdersPage';
import { AccountPage } from './pages/AccountPage';
import { HelpPage } from './pages/HelpPage';
import { PrivacyPage, TermsPage, RefundPolicyPage } from './pages/PolicyPages';
import { DeliveryAreasPage } from './pages/DeliveryAreasPage';
import { CareersPage } from './pages/CareersPage';
import { PressPage } from './pages/PressPage';
import { BlogPage } from './pages/BlogPage';
import { SellPage } from './pages/SellPage';
import { DeliverWithZiptoPage } from './pages/DeliverWithZiptoPage';
import { FranchisePage } from './pages/FranchisePage';
import { ResponsibleDisclosurePage } from './pages/ResponsibleDisclosurePage';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
    },
  },
});

function AppContent() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <TopCategoryNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/c/:categorySlug" element={<CategoryPage />} />
        <Route path="/p/:productSlug" element={<ProductPage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/orders/:orderId/success" element={<OrderSuccessPage />} />
        <Route path="/orders/:orderId" element={<OrderTrackingPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/account" element={<AccountPage />} />
        <Route path="/help" element={<HelpPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/refund-policy" element={<RefundPolicyPage />} />
        <Route path="/delivery-areas" element={<DeliveryAreasPage />} />
        <Route path="/careers" element={<CareersPage />} />
        <Route path="/press" element={<PressPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/sell" element={<SellPage />} />
        <Route path="/deliver-with-zipto" element={<DeliverWithZiptoPage />} />
        <Route path="/franchise" element={<FranchisePage />} />
        <Route path="/responsible-disclosure" element={<ResponsibleDisclosurePage />} />
      </Routes>
      <CartDrawer />
      <LoginModal />
      <LocationModal />
      <AddressModal />
      <AddAddressModal />
      <SearchOverlay />
      <ToastContainer />
      <ChatFab />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
