import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { POSProvider } from './context/POSContext';
import { Header } from './components/layout/Header';
import { Sidebar } from './components/layout/Sidebar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { SlideDrawer } from './components/layout/SlideDrawer';
import { ToastContainer } from './components/common/ToastContainer';

import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { Billing } from './pages/Billing';
import { Products } from './pages/Products';
import { Inventory } from './pages/Inventory';
import { Customers } from './pages/Customers';
import { Suppliers } from './pages/Suppliers';
import { Expenses } from './pages/Expenses';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

const LayoutWrapper = () => {
  const location = useLocation();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);

  // If on login page, don't show main header/sidebar/bottomnav
  if (location.pathname === '/login') {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="min-h-screen bg-surface-bg flex text-slate-800">
      {/* Desktop & Tablet Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header onOpenMobileDrawer={() => setIsMobileDrawerOpen(true)} />

        <main className="flex-1 overflow-x-hidden">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/billing" element={<Billing />} />
            <Route path="/products" element={<Products />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/expenses" element={<Expenses />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>

        {/* Mobile Fixed Bottom Navigation */}
        <MobileBottomNav />

        {/* Mobile Slide-Out Drawer */}
        <SlideDrawer
          isOpen={isMobileDrawerOpen}
          onClose={() => setIsMobileDrawerOpen(false)}
        />

        {/* Toast Notifications */}
        <ToastContainer />
      </div>
    </div>
  );
};

export function App() {
  return (
    <POSProvider>
      <BrowserRouter>
        <LayoutWrapper />
      </BrowserRouter>
    </POSProvider>
  );
}

export default App;
