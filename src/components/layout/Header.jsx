import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  Bell,
  ShoppingCart,
  Menu,
  Coffee,
  Sparkles
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const Header = ({ onOpenMobileDrawer }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, cart } = usePOS();
  
  const totalCartCount = cart.reduce((acc, i) => acc + i.qty, 0);

  // Derive short responsive page titles
  const getPageTitle = () => {
    switch (location.pathname) {
      case '/':
      case '/dashboard':
        return { short: 'Dashboard', full: 'Dashboard Overview' };
      case '/billing':
        return { short: 'POS Billing', full: 'Smart POS Billing' };
      case '/products':
        return { short: 'Products', full: 'Products & Menu Catalog' };
      case '/inventory':
        return { short: 'Inventory', full: 'Inventory & Stock Management' };
      case '/customers':
        return { short: 'Customers', full: 'Customer Directory & Loyalty' };
      case '/suppliers':
        return { short: 'Suppliers', full: 'Supplier & Vendor Portal' };
      case '/expenses':
        return { short: 'Expenses', full: 'Daily Expenses & Accounts' };
      case '/reports':
        return { short: 'Reports', full: 'Analytics & Sales Reports' };
      case '/settings':
        return { short: 'Settings', full: 'System & Shop Settings' };
      default:
        return { short: 'Tamilini POS', full: 'Tamilini Bakery POS' };
    }
  };

  const titleObj = getPageTitle();

  return (
    <header className="sticky top-0 z-30 bg-gradient-to-r from-brand-dark via-purple-950 to-brand-dark text-white border-b border-purple-900/60 px-3 py-2.5 sm:px-4 sm:py-3 lg:px-6 flex items-center justify-between shadow-lg">
      {/* Left: Mobile Drawer Button & Title */}
      <div className="flex items-center space-x-2 sm:space-x-3 min-w-0">
        <button
          onClick={onOpenMobileDrawer}
          className="lg:hidden p-2 rounded-xl text-purple-200 hover:text-white hover:bg-purple-900/60 focus:outline-none min-h-touch min-w-touch flex items-center justify-center transition-colors shrink-0"
          aria-label="Open Navigation Drawer"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex items-center space-x-2.5 min-w-0">
          <div className="hidden sm:flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-primary to-brand-accent text-white shadow-purple-glow border border-purple-400/30 shrink-0">
            <Coffee className="w-5.5 h-5.5" />
          </div>
          <div className="min-w-0">
            <h1 className="text-base sm:text-xl font-extrabold text-white tracking-tight truncate">
              <span className="sm:hidden">{titleObj.short}</span>
              <span className="hidden sm:inline">{titleObj.full}</span>
            </h1>
            <p className="text-xs text-purple-300 font-semibold hidden sm:block truncate">
              Chromepet Main Branch • Terminal 01
            </p>
          </div>
        </div>
      </div>

      {/* Right: Quick Actions & User Profile */}
      <div className="flex items-center space-x-2 sm:space-x-3 shrink-0">
        {/* Quick Billing Action Shortcut */}
        {location.pathname !== '/billing' && (
          <button
            onClick={() => navigate('/billing')}
            className="flex items-center space-x-1.5 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent hover:from-brand-hover hover:to-brand-primary text-white text-xs sm:text-sm font-black px-3 py-2 sm:px-4 sm:py-2.5 rounded-2xl shadow-purple-glow transition-all duration-200 transform hover:scale-[1.02] active:scale-95 border border-purple-400/30"
          >
            <ShoppingCart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            <span className="hidden sm:inline">Quick Billing</span>
            {totalCartCount > 0 && (
              <span className="bg-amber-400 text-brand-dark text-xs font-black px-2 py-0.5 rounded-full ml-0.5 shadow-sm">
                {totalCartCount}
              </span>
            )}
          </button>
        )}

        {/* Notifications Button */}
        <button
          className="relative p-2 sm:p-2.5 rounded-2xl text-purple-200 hover:text-white hover:bg-purple-900/60 transition-colors border border-purple-800/40"
          title="Notifications"
        >
          <Bell className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-amber-400 ring-2 ring-brand-dark"></span>
        </button>

        {/* User Profile Badge */}
        <div className="flex items-center space-x-2 pl-2 sm:pl-3 border-l border-purple-800/60">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full object-cover ring-2 ring-brand-primary"
          />
          <div className="hidden xl:block text-left">
            <p className="text-sm font-extrabold text-white leading-tight">{user.name}</p>
            <p className="text-xs text-purple-300 font-bold">{user.role}</p>
          </div>
        </div>
      </div>
    </header>
  );
};
