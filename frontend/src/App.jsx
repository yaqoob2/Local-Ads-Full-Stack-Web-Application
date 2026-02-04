import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/public/Home';
import Login from './pages/auth/Login';
import Signup from './pages/auth/Signup';
import Pricing from './pages/public/Pricing';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import AdDetails from './pages/public/AdDetails';
import Dashboard from './pages/advertiser/Dashboard';
import CreateAd from './pages/advertiser/CreateAd';
import MyAds from './pages/advertiser/MyAds';
import TemplatePreview from './components/TemplatePreview';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminAllAds from './pages/admin/AdminAllAds';
import AdminAdsReview from './pages/admin/AdminAdsReview';
import AdminUsers from './pages/admin/AdminUsers';
import PaymentMethods from './pages/advertiser/PaymentMethods';
import Checkout from './pages/advertiser/Checkout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import PrivacyPolicy from './pages/public/PrivacyPolicy';
import TermsConditions from './pages/public/TermsConditions';
import UserProfile from './pages/public/UserProfile';

// Placeholder for other routes
const NotFound = () => <div className="p-10 text-center text-red-500 font-bold">404 - Page Not Found</div>;


function App() {
  return (
    <Router>
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsConditions />} />

          {/* Protected Profile Route */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<UserProfile />} />
          </Route>

          <Route path="/ads/:id" element={<AdDetails />} />
          <Route path="/templates" element={<TemplatePreview />} />

          {/* Advertiser Routes - Protected */}
          <Route element={<ProtectedRoute allowedRoles={['ADVERTISER', 'ADMIN']} />}>
            <Route path="/advertiser/dashboard" element={<Dashboard />} />
            <Route path="/advertiser/create-ad" element={<CreateAd />} />
            <Route path="/advertiser/my-ads" element={<MyAds />} />
            <Route path="/advertiser/payments" element={<PaymentMethods />} />
            <Route path="/advertiser/checkout/:planId" element={<Checkout />} />
          </Route>

          {/* Admin Routes - Protected (Admin Only) */}
          <Route element={<ProtectedRoute allowedRoles={['ADMIN']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/ads-review" element={<AdminAdsReview />} />
            <Route path="/admin/all-ads" element={<AdminAllAds />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
