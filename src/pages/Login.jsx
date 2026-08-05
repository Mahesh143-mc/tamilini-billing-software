import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, ShieldCheck, Lock, User, ArrowRight, Sparkles } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const Login = () => {
  const navigate = useNavigate();
  const { setUser, showToast } = usePOS();

  const [username, setUsername] = useState('sundar@tamilini.com');
  const [password, setPassword] = useState('password123');

  const handleLogin = (e) => {
    e.preventDefault();
    setUser((prev) => ({ ...prev, isLoggedIn: true }));
    showToast('Logged in as Sundar Raman (Cashier/Admin)', 'success');
    navigate('/billing');
  };

  const handleQuickLogin = (role, name) => {
    setUser({
      name,
      role,
      branch: 'Chromepet Main Branch',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      isLoggedIn: true
    });
    showToast(`Quick logged in as ${name} (${role})`, 'success');
    navigate('/billing');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-dark via-purple-950 to-brand-dark flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dynamic Background Glow Blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-primary/30 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-brand-secondary/20 rounded-full blur-3xl animate-pulse"></div>

      {/* Glassmorphism Container */}
      <div className="relative w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-3xl shadow-2xl text-white z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-brand-primary via-brand-secondary to-brand-accent flex items-center justify-center text-white shadow-purple-lg ring-4 ring-white/10">
            <Coffee className="w-9 h-9" />
          </div>
          <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-white via-purple-100 to-purple-300 bg-clip-text text-transparent">
            Tamilini Bakery POS
          </h1>
          <p className="text-xs text-purple-200/80 font-medium">
            Smart Billing • Inventory • Sales Management
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">
              Email or Cashier ID
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-purple-300 absolute left-3.5 top-3.5" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs text-white placeholder-purple-300/50 focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30 transition-all"
                placeholder="cashier@tamilinibakery.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-purple-200 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-purple-300 absolute left-3.5 top-3.5" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-2xl text-xs text-white placeholder-purple-300/50 focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/30 transition-all"
                placeholder="••••••••"
              />
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-purple-200/80">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="rounded border-white/20 text-brand-primary accent-brand-primary" />
              <span>Remember Me</span>
            </label>
            <a href="#forgot" onClick={(e) => { e.preventDefault(); showToast('Demo Mode: Use quick login below', 'info'); }} className="hover:text-white underline">
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent hover:from-brand-hover hover:to-brand-primary text-white font-extrabold text-sm rounded-2xl shadow-purple-lg flex items-center justify-center space-x-2 transition-all transform active:scale-95 min-h-touch"
          >
            <span>Sign In to POS Terminal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* One-Click Quick Demo Login Shortcuts */}
        <div className="pt-4 border-t border-white/10 space-y-2">
          <p className="text-[11px] text-center text-purple-300/80 font-bold uppercase tracking-wider">
            Quick One-Click Demo Logins:
          </p>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickLogin('Cashier', 'Sundar (Cashier)')}
              className="py-2 px-3 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-xl border border-white/10 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Cashier Terminal</span>
            </button>
            <button
              onClick={() => handleQuickLogin('Store Manager', 'Ramesh (Manager)')}
              className="py-2 px-3 bg-white/10 hover:bg-white/20 text-xs font-semibold rounded-xl border border-white/10 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Store Manager</span>
            </button>
          </div>
        </div>

        <p className="text-[10px] text-center text-purple-300/60">
          Tamilini Bakery POS v2.4 • Enterprise Mobile SaaS Edition
        </p>
      </div>
    </div>
  );
};
