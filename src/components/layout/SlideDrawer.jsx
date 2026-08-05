import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  X,
  LayoutDashboard,
  Receipt,
  Package,
  Boxes,
  Users,
  Truck,
  DollarSign,
  BarChart3,
  Settings,
  Coffee,
  Sparkles
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const SlideDrawer = ({ isOpen, onClose }) => {
  const { user } = usePOS();

  if (!isOpen) return null;

  const drawerItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { path: '/billing', label: 'Billing POS', icon: Receipt },
    { path: '/products', label: 'Products & Menu', icon: Package },
    { path: '/inventory', label: 'Inventory Management', icon: Boxes },
    { path: '/customers', label: 'Customer Directory', icon: Users },
    { path: '/suppliers', label: 'Suppliers & Vendors', icon: Truck },
    { path: '/expenses', label: 'Daily Expenses', icon: DollarSign },
    { path: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { path: '/settings', label: 'System Settings', icon: Settings },
  ];

  return (
    <div className="fixed inset-0 z-50 lg:hidden flex">
      {/* Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Slide Content */}
      <div className="relative w-4/5 max-w-xs bg-brand-dark text-white min-h-full flex flex-col z-10 shadow-2xl animate-slide-right">
        {/* Header */}
        <div className="p-4 border-b border-purple-900/60 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-primary to-brand-accent flex items-center justify-center text-white">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-extrabold tracking-wide">TAMILINI POS</h2>
              <p className="text-[10px] text-purple-300">Smart Bakery Management</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-purple-300 hover:text-white rounded-lg hover:bg-purple-900/50 min-h-touch min-w-touch flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-3 bg-purple-900/40 border-b border-purple-900/40 flex items-center space-x-3">
          <img
            src={user.avatar}
            alt={user.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-brand-primary"
          />
          <div>
            <p className="text-xs font-bold text-slate-100">{user.name}</p>
            <p className="text-[10px] text-purple-300">{user.branch}</p>
          </div>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {drawerItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center space-x-3 px-3.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-semibold shadow-purple-glow'
                      : 'text-purple-200/80 hover:text-white hover:bg-purple-900/50'
                  }`
                }
              >
                <Icon className="w-5 h-5 shrink-0" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-purple-900/60 text-center">
          <p className="text-[10px] text-purple-400">
            Tamilini Bakery POS v2.4 • Production Ready
          </p>
        </div>
      </div>
    </div>
  );
};
