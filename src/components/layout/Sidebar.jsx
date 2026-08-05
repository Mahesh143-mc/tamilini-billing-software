import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Package,
  Boxes,
  Users,
  Truck,
  DollarSign,
  BarChart3,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Coffee,
  Sparkles
} from 'lucide-react';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { path: '/billing', label: 'Billing POS', icon: Receipt, badge: 'HOT' },
    { path: '/products', label: 'Products & Menu', icon: Package, badge: null },
    { path: '/inventory', label: 'Inventory', icon: Boxes, badge: 'Alerts' },
    { path: '/customers', label: 'Customers', icon: Users, badge: null },
    { path: '/suppliers', label: 'Suppliers', icon: Truck, badge: null },
    { path: '/expenses', label: 'Expenses', icon: DollarSign, badge: null },
    { path: '/reports', label: 'Reports & Analytics', icon: BarChart3, badge: null },
    { path: '/settings', label: 'Settings', icon: Settings, badge: null },
  ];

  return (
    <aside
      className={`hidden lg:flex flex-col bg-brand-dark text-slate-100 sticky top-0 h-screen shrink-0 transition-all duration-300 z-40 ${
        collapsed ? 'w-20' : 'w-72'
      } shadow-2xl border-r border-purple-900/50`}
    >
      {/* Brand Header */}
      <div className="p-4 border-b border-purple-900/60 flex items-center justify-between shrink-0">
        <div
          onClick={() => {
            if (collapsed) setCollapsed(false);
          }}
          className="flex items-center space-x-3 overflow-hidden cursor-pointer"
          title={collapsed ? "Expand Sidebar" : "Tamilini POS"}
        >
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-primary via-brand-secondary to-brand-accent flex items-center justify-center text-white shadow-purple-glow shrink-0">
            <Coffee className="w-6 h-6 animate-pulse" />
          </div>
          {!collapsed && (
            <div className="flex flex-col">
              <span className="text-xl font-black tracking-wider bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
                TAMILINI
              </span>
              <span className="text-xs text-purple-300 font-extrabold tracking-tight uppercase">
                Bakery POS System
              </span>
            </div>
          )}
        </div>

        {/* Collapse Toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex p-2 rounded-xl bg-purple-900/40 text-purple-300 hover:text-white hover:bg-purple-800/60 transition-colors"
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3.5 py-4 space-y-2 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => {
                if (collapsed) {
                  setCollapsed(false);
                } else if (location.pathname === item.path) {
                  setCollapsed(true);
                }
              }}
              title={collapsed ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center space-x-3.5 px-4 py-3.5 rounded-2xl text-base font-bold transition-all duration-200 group ${
                  isActive
                    ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-purple-glow font-black scale-[1.02]'
                    : 'text-purple-200/90 hover:text-white hover:bg-purple-900/60'
                }`
              }
            >
              <Icon className="w-5.5 h-5.5 shrink-0 transition-transform group-hover:scale-110" />
              {!collapsed && (
                <div className="flex-1 flex items-center justify-between">
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        item.badge === 'HOT'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse'
                          : 'bg-purple-800 text-purple-200'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer Banner & Logout */}
      <div className="p-3.5 border-t border-purple-900/60 space-y-2 shrink-0">
        {!collapsed && (
          <div className="bg-purple-900/40 border border-purple-800/50 rounded-2xl p-3 text-xs text-purple-200">
            <div className="flex items-center space-x-1.5 text-purple-200 font-bold mb-0.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span className="text-xs font-extrabold">Tamilini Enterprise</span>
            </div>
            <p className="text-xs text-purple-300/80">
              v2.4 • Smart Cloud Sync Ready
            </p>
          </div>
        )}

        <button
          onClick={() => navigate('/login')}
          className={`w-full flex items-center ${
            collapsed ? 'justify-center' : 'justify-start space-x-3'
          } px-3.5 py-3 rounded-xl text-purple-200 hover:text-rose-300 hover:bg-rose-950/40 transition-colors text-sm font-bold`}
          title="Switch User / Logout"
        >
          <LogOut className="w-5 h-5 text-rose-400 shrink-0" />
          {!collapsed && <span className="text-sm font-bold">Switch User / Logout</span>}
        </button>
      </div>
    </aside>
  );
};
