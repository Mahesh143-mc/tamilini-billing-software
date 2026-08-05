import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Receipt,
  Package,
  Boxes,
  Settings,
  ShoppingCart
} from 'lucide-react';
import { usePOS } from '../../context/POSContext';

export const MobileBottomNav = () => {
  const { cart } = usePOS();
  const totalCartCount = cart.reduce((acc, i) => acc + i.qty, 0);

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-purple-100 px-3 py-1.5 flex items-center justify-around shadow-2xl lg:hidden">
      {/* 1. Dashboard */}
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-touch min-h-touch text-[11px] font-medium transition-colors ${
            isActive ? 'text-brand-primary font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>Dashboard</span>
      </NavLink>

      {/* 2. Products */}
      <NavLink
        to="/products"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-touch min-h-touch text-[11px] font-medium transition-colors ${
            isActive ? 'text-brand-primary font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <Package className="w-5 h-5 mb-0.5" />
        <span>Products</span>
      </NavLink>

      {/* 3. HERO FLOATING BILLING BUTTON (Center) */}
      <NavLink
        to="/billing"
        className="relative -top-4 flex flex-col items-center group"
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-brand-primary via-brand-secondary to-brand-accent text-white shadow-purple-lg flex items-center justify-center border-4 border-white transform active:scale-90 transition-transform duration-150">
          <ShoppingCart className="w-6 h-6 animate-bounce-short" />
          {totalCartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-amber-500 text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-white">
              {totalCartCount}
            </span>
          )}
        </div>
        <span className="text-[11px] font-extrabold text-brand-primary mt-0.5">Billing</span>
      </NavLink>

      {/* 4. Inventory */}
      <NavLink
        to="/inventory"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-touch min-h-touch text-[11px] font-medium transition-colors ${
            isActive ? 'text-brand-primary font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <Boxes className="w-5 h-5 mb-0.5" />
        <span>Inventory</span>
      </NavLink>

      {/* 5. Settings */}
      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center justify-center min-w-touch min-h-touch text-[11px] font-medium transition-colors ${
            isActive ? 'text-brand-primary font-bold' : 'text-slate-500 hover:text-slate-800'
          }`
        }
      >
        <Settings className="w-5 h-5 mb-0.5" />
        <span>Settings</span>
      </NavLink>
    </nav>
  );
};
