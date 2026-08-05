import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  TrendingUp,
  Receipt,
  Users,
  DollarSign,
  AlertTriangle,
  ShoppingBag,
  PlusCircle,
  ArrowUpRight,
  Sparkles,
  Coffee,
  PieChart,
  BarChart3,
  Calendar,
  Clock,
  ArrowRight,
  ShieldCheck,
  ChevronRight
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { usePOS } from '../context/POSContext';

export const Dashboard = () => {
  const navigate = useNavigate();
  const { products, recentBills, expenses, customers } = usePOS();

  // Calculate key metrics
  const todaySalesTotal = recentBills.reduce((acc, b) => acc + (b.total || 0), 0);
  const todayBillsCount = recentBills.length;
  const todayExpensesTotal = expenses.reduce((acc, e) => acc + (e.amount || 0), 0);
  const netProfit = Math.max(0, todaySalesTotal - todayExpensesTotal);
  const lowStockCount = products.filter((p) => p.stock <= p.lowStockThreshold).length;

  // Chart Data: Hourly Sales Trend
  const hourlySalesData = [
    { hour: '08:00 AM', sales: 1200 },
    { hour: '10:00 AM', sales: 2800 },
    { hour: '12:00 PM', sales: 4500 },
    { hour: '02:00 PM', sales: 3200 },
    { hour: '04:00 PM', sales: 6800 },
    { hour: '06:00 PM', sales: 9400 },
    { hour: '08:00 PM', sales: 7100 },
    { hour: '10:00 PM', sales: 3900 },
  ];

  // Category Breakdown Data with Custom Gradients & Percentages
  const categoryData = [
    { name: 'Pastries & Cakes', sales: 14500, percent: 34, color: 'from-purple-600 to-indigo-600' },
    { name: 'Tea & Beverages', sales: 9800, percent: 23, color: 'from-blue-600 to-cyan-500' },
    { name: 'Savories & Puffs', sales: 8200, percent: 19, color: 'from-amber-500 to-orange-600' },
    { name: 'Sweets & Desserts', sales: 6400, percent: 15, color: 'from-emerald-500 to-teal-600' },
    { name: 'Breads & Buns', sales: 3900, percent: 9, color: 'from-fuchsia-600 to-pink-500' },
  ];

  return (
    <div className="space-y-6 pb-24 lg:pb-8 px-4 py-4 lg:px-8">
      {/* 🚀 1. HERO WELCOME BANNER (Clean High-Contrast Design) */}
      <div className="bg-white rounded-3xl p-6 sm:p-7 shadow-soft border-2 border-purple-200/90 flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        {/* Soft Background Blur Accents */}
        <div className="absolute -top-12 -left-12 w-56 h-56 bg-purple-200/50 rounded-full blur-2xl"></div>
        <div className="absolute -bottom-12 right-1/4 w-56 h-56 bg-indigo-100/50 rounded-full blur-2xl"></div>

        <div className="space-y-2 text-center md:text-left z-10 max-w-2xl">
          <div className="inline-flex items-center space-x-2 bg-purple-100/80 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-extrabold text-brand-primary border border-purple-200">
            <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
            <span>Tamilini Bakery SaaS Terminal • Live Store Feed</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900">
            Welcome back, Store Manager!
          </h1>
          <p className="text-sm sm:text-base text-slate-600 font-semibold">
            Today's gross bakery revenue is up <span className="text-emerald-600 font-black">+18.4%</span> compared to yesterday's sales.
          </p>
        </div>

        <button
          onClick={() => navigate('/billing')}
          className="z-10 py-3.5 px-6 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent hover:from-brand-hover hover:to-brand-primary text-white font-black text-sm sm:text-base rounded-2xl shadow-purple-glow flex items-center space-x-2.5 transition-all duration-200 transform hover:scale-[1.03] active:scale-95 border border-purple-300/30 shrink-0"
        >
          <Receipt className="w-5 h-5 text-amber-300" />
          <span>Open POS Billing Terminal</span>
          <ArrowRight className="w-5 h-5 ml-1" />
        </button>
      </div>

      {/* 📊 2. COLORFUL VIBRANT KPI STAT CARDS (3 per row for spacious layout) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Today's Sales Card */}
        <div className="bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-white p-5 rounded-3xl border-2 border-purple-200/80 shadow-soft hover:shadow-card-hover transition-all space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-700">Today's Sales</span>
            <div className="w-10 h-10 rounded-2xl bg-brand-primary text-white shadow-purple-glow flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            ₹{todaySalesTotal.toLocaleString('en-IN')}
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            <TrendingUp className="w-3.5 h-3.5" /> +14.2% today
          </span>
        </div>

        {/* Total Bills Card */}
        <div className="bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-white p-5 rounded-3xl border-2 border-blue-200/80 shadow-soft hover:shadow-card-hover transition-all space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-700">Total Bills</span>
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <Receipt className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {todayBillsCount}
          </p>
          <span className="inline-flex items-center gap-1 text-xs font-black px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
            <TrendingUp className="w-3.5 h-3.5" /> +6 orders/hr
          </span>
        </div>

        {/* Active Customers Card */}
        <div className="bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-white p-5 rounded-3xl border-2 border-indigo-200/80 shadow-soft hover:shadow-card-hover transition-all space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-700">Active Patrons</span>
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            {customers.length}
          </p>
          <span className="inline-block text-xs font-black px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-800 border border-indigo-300">
            84% Loyalty Tier
          </span>
        </div>

        {/* Today Expenses Card */}
        <div className="bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-white p-5 rounded-3xl border-2 border-rose-200/80 shadow-soft hover:shadow-card-hover transition-all space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-700">Today Expenses</span>
            <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            ₹{todayExpensesTotal.toLocaleString('en-IN')}
          </p>
          <span className="inline-block text-xs font-bold text-slate-600">
            Milk, Packaging, Power
          </span>
        </div>

        {/* Net Profit Margin Card */}
        <div className="bg-gradient-to-br from-emerald-500/10 via-emerald-500/5 to-white p-5 rounded-3xl border-2 border-emerald-200/80 shadow-soft hover:shadow-card-hover transition-all space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-700">Net Profit</span>
            <div className="w-10 h-10 rounded-2xl bg-emerald-600 text-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-emerald-700 tracking-tight">
            ₹{netProfit.toLocaleString('en-IN')}
          </p>
          <span className="inline-block text-xs font-black px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
            Est. 42% Net Margin
          </span>
        </div>

        {/* Low Stock Alert Card */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white p-5 rounded-3xl border-2 border-amber-200/80 shadow-soft hover:shadow-card-hover transition-all space-y-2 group">
          <div className="flex items-center justify-between">
            <span className="text-sm font-extrabold text-slate-700">Low Stock Alerts</span>
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white shadow-md flex items-center justify-center group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">
            {lowStockCount}
          </p>
          <span
            onClick={() => navigate('/inventory')}
            className="inline-block text-xs font-black text-amber-800 underline cursor-pointer hover:text-amber-900"
          >
            Reorder Suggested →
          </span>
        </div>
      </div>

      {/* 📈 3. ANALYTICS CHARTS SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Hourly Sales Area Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-purple-100 shadow-soft space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-purple-100 pb-4">
            <div>
              <h2 className="text-lg font-black text-slate-900">Hourly Sales Rush Trend</h2>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">Peak billing rush observed between 5:00 PM and 8:00 PM</p>
            </div>
            <span className="text-xs sm:text-sm font-extrabold px-3.5 py-1.5 rounded-xl bg-brand-light text-brand-primary border border-purple-200">
              Today Total: ₹42,800
            </span>
          </div>

          <div className="h-72 w-full pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlySalesData}>
                <defs>
                  <linearGradient id="purpleGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6D28D9" stopOpacity={0.45} />
                    <stop offset="95%" stopColor="#6D28D9" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis dataKey="hour" stroke="#64748B" fontSize={12} fontWeight={700} />
                <YAxis stroke="#64748B" fontSize={12} fontWeight={700} tickFormatter={(v) => `₹${v}`} />
                <Tooltip
                  formatter={(val) => [`₹${val}`, 'Hourly Sales']}
                  contentStyle={{ backgroundColor: '#2E1065', borderRadius: '16px', color: '#fff', border: 'none', fontWeight: 'bold' }}
                />
                <Area
                  type="monotone"
                  dataKey="sales"
                  stroke="#6D28D9"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#purpleGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Revenue Breakdown */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-purple-100 shadow-soft flex flex-col justify-between space-y-4">
          <div className="border-b border-purple-100 pb-3">
            <h2 className="text-lg font-black text-slate-900">Category Revenue Split</h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">Highest volume in Pastries & Coffee</p>
          </div>

          <div className="space-y-4">
            {categoryData.map((cat, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between items-center text-sm sm:text-base font-bold">
                  <span className="text-slate-800">{cat.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs font-black px-2 py-0.5 rounded-md bg-purple-100 text-brand-primary">
                      {cat.percent}%
                    </span>
                    <span className="font-black text-slate-900">₹{cat.sales.toLocaleString()}</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden p-0.5">
                  <div
                    className={`h-full rounded-full bg-gradient-to-r ${cat.color} transition-all duration-500`}
                    style={{ width: `${cat.percent * 2.5}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => navigate('/reports')}
            className="pt-3 border-t border-purple-100 flex items-center justify-between text-sm text-brand-primary font-black hover:underline group"
          >
            <span>View Full Financial Sales Matrix</span>
            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* 🛍️ 4. RECENT TRANSACTIONS & QUICK STORE SHORTCUTS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Bills Table */}
        <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-purple-100 shadow-soft space-y-4">
          <div className="flex items-center justify-between border-b border-purple-100 pb-3">
            <h2 className="text-lg font-black text-slate-900">Recent Customer Bills</h2>
            <button
              onClick={() => navigate('/reports')}
              className="text-xs sm:text-sm font-extrabold text-brand-primary hover:underline flex items-center gap-1"
            >
              <span>View All Logged Invoices</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="text-slate-500 uppercase text-xs font-extrabold border-b border-purple-100">
                  <th className="py-3 px-3">Invoice #</th>
                  <th className="py-3 px-3">Customer Name</th>
                  <th className="py-3 px-3">Payment Mode</th>
                  <th className="py-3 px-3 text-right">Amount</th>
                  <th className="py-3 px-3 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-bold">
                {recentBills.slice(0, 5).map((bill) => (
                  <tr key={bill.id} className="hover:bg-purple-50/50 transition-colors">
                    <td className="py-3.5 px-3 font-black text-brand-primary text-sm sm:text-base">{bill.id}</td>
                    <td className="py-3.5 px-3 text-slate-800">{bill.customerName}</td>
                    <td className="py-3.5 px-3 text-slate-700">{bill.paymentMode}</td>
                    <td className="py-3.5 px-3 text-right font-black text-slate-900 text-base">
                      ₹{bill.total}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      <span className="bg-emerald-100 text-emerald-800 text-xs font-extrabold px-3 py-1 rounded-full border border-emerald-300">
                        {bill.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Action Shortcuts */}
        <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-purple-100 shadow-soft space-y-4">
          <div className="border-b border-purple-100 pb-3">
            <h2 className="text-lg font-black text-slate-900">Quick Store Shortcuts</h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">One-touch triggers for cashier tasks</p>
          </div>

          <div className="grid grid-cols-2 gap-3.5">
            <button
              onClick={() => navigate('/billing')}
              className="p-4 bg-gradient-to-br from-purple-500/10 via-purple-500/5 to-white hover:from-purple-500/20 border-2 border-purple-200 rounded-2xl text-left space-y-3 group transition-all duration-200 transform hover:scale-[1.02] shadow-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-brand-primary text-white flex items-center justify-center shadow-purple-glow group-hover:scale-110 transition-transform">
                <Receipt className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900">New POS Bill</p>
                <p className="text-xs text-slate-600 font-medium">Fast barcode billing</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/products')}
              className="p-4 bg-gradient-to-br from-indigo-500/10 via-indigo-500/5 to-white hover:from-indigo-500/20 border-2 border-indigo-200 rounded-2xl text-left space-y-3 group transition-all duration-200 transform hover:scale-[1.02] shadow-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <PlusCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900">Add Product</p>
                <p className="text-xs text-slate-600 font-medium">Update menu catalog</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/expenses')}
              className="p-4 bg-gradient-to-br from-rose-500/10 via-rose-500/5 to-white hover:from-rose-500/20 border-2 border-rose-200 rounded-2xl text-left space-y-3 group transition-all duration-200 transform hover:scale-[1.02] shadow-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900">Log Expense</p>
                <p className="text-xs text-slate-600 font-medium">Milk, utilities, vendor</p>
              </div>
            </button>

            <button
              onClick={() => navigate('/customers')}
              className="p-4 bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-white hover:from-amber-500/20 border-2 border-amber-200 rounded-2xl text-left space-y-3 group transition-all duration-200 transform hover:scale-[1.02] shadow-sm"
            >
              <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-md group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <p className="text-base font-black text-slate-900">Add Customer</p>
                <p className="text-xs text-slate-600 font-medium">Issue loyalty points</p>
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
