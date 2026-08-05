import React, { useState, useEffect } from 'react';
import {
  Boxes,
  AlertTriangle,
  RefreshCw,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  TrendingUp,
  PackageCheck,
  Clock,
  ArrowUpRight,
  Sparkles,
  Layers,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { Modal } from '../components/common/Modal';

export const Inventory = () => {
  const { products, setProducts, categories, showToast } = usePOS();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [stockFilter, setStockFilter] = useState('all'); // all | low | in_stock | out
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Responsive Pagination State (10 items on mobile, 20 items on desktop)
  const [isMobile, setIsMobile] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const ITEMS_PER_PAGE = isMobile ? 10 : 20;
  const [currentPage, setCurrentPage] = useState(1);

  // Custom Restock Modal State
  const [restockProduct, setRestockProduct] = useState(null);
  const [restockAmount, setRestockAmount] = useState(50);

  // Calculations
  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);
  const outOfStockProducts = products.filter((p) => p.stock <= 0);
  const inStockProducts = products.filter((p) => p.stock > p.lowStockThreshold);
  const totalStockValue = products.reduce((acc, p) => acc + p.stock * p.price, 0);
  const totalCostValue = products.reduce((acc, p) => acc + p.stock * (p.costPrice || 0), 0);

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tamilName && p.tamilName.includes(searchQuery)) ||
      p.barcode.includes(searchQuery);

    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;

    let matchesStatus = true;
    if (stockFilter === 'low') matchesStatus = p.stock > 0 && p.stock <= p.lowStockThreshold;
    if (stockFilter === 'out') matchesStatus = p.stock <= 0;
    if (stockFilter === 'in_stock') matchesStatus = p.stock > p.lowStockThreshold;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  // Reset page on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, stockFilter]);

  const handleQuickReorder = (productId, reorderQty = 50, productName = '') => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + reorderQty } : p))
    );
    showToast(`Successfully added +${reorderQty} stock to ${productName || 'product'}`, 'success');
  };

  const handleCustomRestockSubmit = (e) => {
    e.preventDefault();
    if (!restockProduct) return;
    const addQty = Number(restockAmount) || 0;
    if (addQty <= 0) {
      showToast('Please enter a valid positive restock quantity', 'warning');
      return;
    }
    handleQuickReorder(restockProduct.id, addQty, restockProduct.name);
    setRestockProduct(null);
  };

  return (
    <div className="space-y-4 pb-24 lg:pb-8 px-1.5 py-1.5 sm:px-4 lg:px-6">
      {/* 📱 Compact Mobile Header Bar (sm:hidden) */}
      <div className="sm:hidden bg-gradient-to-r from-brand-dark via-purple-950 to-brand-dark text-white p-3 rounded-2xl flex items-center justify-between shadow-md">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-brand-primary text-white flex items-center justify-center font-black">
            <Boxes className="w-4.5 h-4.5" />
          </div>
          <div>
            <h1 className="text-sm font-black leading-tight text-white">Stock Inventory</h1>
            <p className="text-[11px] text-purple-300 font-bold">{products.length} Items Listed</p>
          </div>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-purple-300 font-extrabold uppercase block">Stock Value</span>
          <span className="text-sm font-black text-amber-400">₹{totalStockValue.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Desktop Top Banner Header (hidden on mobile sm:flex) */}
      <div className="hidden sm:flex bg-white p-4 sm:p-5 rounded-3xl shadow-sm border border-purple-100 flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="w-11 h-11 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center font-black shadow-inner shrink-0">
            <Boxes className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-base sm:text-xl font-black text-slate-900 leading-tight">
              Inventory & Stock Management
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">
              Live bakery stock levels, low-stock alerts, valuation, and quick restock controls.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 w-full md:w-auto justify-between md:justify-end">
          <div className="bg-purple-50 border border-purple-200 px-4 py-2 rounded-2xl text-right">
            <span className="text-[11px] text-slate-500 font-black uppercase block tracking-wider">
              Total Stock Valuation
            </span>
            <span className="text-lg sm:text-2xl font-black text-brand-primary">
              ₹{totalStockValue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* KPI Metric Summary Cards (Hidden on mobile sm:grid) */}
      <div className="hidden sm:grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Stock Value Card (Click to Clear All Filters) */}
        <div
          onClick={() => {
            setStockFilter('all');
            setSelectedCategory('all');
            setSearchQuery('');
          }}
          className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-center justify-between ${
            stockFilter === 'all' && selectedCategory === 'all' && searchQuery === ''
              ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white border-purple-600 shadow-lg scale-[1.02]'
              : 'bg-white border-purple-100 shadow-soft text-slate-900 hover:border-purple-300'
          }`}
          title="Click to clear all filters and show all products"
        >
          <div>
            <p className={`text-xs font-extrabold uppercase ${stockFilter === 'all' && selectedCategory === 'all' && searchQuery === '' ? 'text-purple-100' : 'text-slate-500'}`}>
              Total Inventory
            </p>
            <h3 className="text-lg sm:text-2xl font-black mt-1">{products.length} Items</h3>
            <p className={`text-[11px] font-bold mt-0.5 ${stockFilter === 'all' && selectedCategory === 'all' && searchQuery === '' ? 'text-purple-100' : 'text-slate-500'}`}>
              Cost: ₹{totalCostValue.toLocaleString('en-IN')}
            </p>
          </div>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${stockFilter === 'all' && selectedCategory === 'all' && searchQuery === '' ? 'bg-white/20 text-white' : 'bg-purple-100 text-brand-primary'}`}>
            <Layers className="w-5 h-5" />
          </div>
        </div>

        {/* Low Stock Warning Card */}
        <div
          onClick={() => setStockFilter(stockFilter === 'low' ? 'all' : 'low')}
          className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-center justify-between ${
            stockFilter === 'low'
              ? 'bg-amber-500 text-white border-amber-600 shadow-lg scale-[1.02]'
              : 'bg-white border-amber-200 shadow-soft text-slate-900 hover:border-amber-400'
          }`}
        >
          <div>
            <p className={`text-xs font-extrabold uppercase ${stockFilter === 'low' ? 'text-amber-100' : 'text-slate-500'}`}>
              Low Stock Alerts
            </p>
            <h3 className="text-lg sm:text-2xl font-black mt-1">{lowStockProducts.length} Items</h3>
            <p className={`text-[11px] font-bold mt-0.5 ${stockFilter === 'low' ? 'text-white' : 'text-amber-600'}`}>
              At or below threshold
            </p>
          </div>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${stockFilter === 'low' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-600'}`}>
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Out of Stock Card */}
        <div
          onClick={() => setStockFilter(stockFilter === 'out' ? 'all' : 'out')}
          className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-center justify-between ${
            stockFilter === 'out'
              ? 'bg-rose-600 text-white border-rose-700 shadow-lg scale-[1.02]'
              : 'bg-white border-rose-100 shadow-soft text-slate-900 hover:border-rose-300'
          }`}
        >
          <div>
            <p className={`text-xs font-extrabold uppercase ${stockFilter === 'out' ? 'text-rose-100' : 'text-slate-500'}`}>
              Out of Stock
            </p>
            <h3 className="text-lg sm:text-2xl font-black mt-1">{outOfStockProducts.length} Items</h3>
            <p className={`text-[11px] font-bold mt-0.5 ${stockFilter === 'out' ? 'text-white' : 'text-rose-600'}`}>
              Immediate restock needed
            </p>
          </div>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${stockFilter === 'out' ? 'bg-white/20 text-white' : 'bg-rose-100 text-rose-600'}`}>
            <PackageCheck className="w-5 h-5" />
          </div>
        </div>

        {/* In Stock Healthy Card */}
        <div
          onClick={() => setStockFilter(stockFilter === 'in_stock' ? 'all' : 'in_stock')}
          className={`p-4 rounded-3xl border cursor-pointer transition-all flex items-center justify-between ${
            stockFilter === 'in_stock'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-lg scale-[1.02]'
              : 'bg-white border-emerald-100 shadow-soft text-slate-900 hover:border-emerald-300'
          }`}
        >
          <div>
            <p className={`text-xs font-extrabold uppercase ${stockFilter === 'in_stock' ? 'text-emerald-100' : 'text-slate-500'}`}>
              Sufficient Stock
            </p>
            <h3 className="text-lg sm:text-2xl font-black mt-1">{inStockProducts.length} Items</h3>
            <p className={`text-[11px] font-bold mt-0.5 ${stockFilter === 'in_stock' ? 'text-white' : 'text-emerald-600'}`}>
              Healthy stock levels
            </p>
          </div>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${stockFilter === 'in_stock' ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-600'}`}>
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* Warning Alert Banner for Low Stock */}
      {lowStockProducts.length > 0 && stockFilter === 'all' && (
        <div className="bg-amber-50 border border-amber-200 p-3 sm:p-4 rounded-3xl flex items-center justify-between text-amber-900 shadow-sm animate-fade-in">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-black shrink-0 shadow-sm">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
            <div>
              <h3 className="text-xs sm:text-sm font-black">
                {lowStockProducts.length} Items Require Stock Replenishment!
              </h3>
              <p className="text-[11px] sm:text-xs text-amber-800 font-bold">
                Restock low items now to avoid order rejections during busy sales hours.
              </p>
            </div>
          </div>
          <button
            onClick={() => setStockFilter('low')}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white text-xs font-black rounded-xl transition-all shadow-xs shrink-0"
          >
            View Low Stock
          </button>
        </div>
      )}

      {/* Search & Filter Control Bar */}
      <div className="bg-white p-3 rounded-3xl border border-purple-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center space-x-2 w-full md:w-auto flex-1 min-w-0">
          {/* Search Bar */}
          <div className="relative flex-1 md:w-80">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stock by item name or barcode..."
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-purple-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 focus:border-brand-primary focus:outline-none"
            />
          </div>

          {/* Custom Category Filter Dropdown Menu */}
          <div className="relative shrink-0 z-20">
            <button
              type="button"
              onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
              className="py-2.5 px-3.5 bg-purple-50 hover:bg-purple-100 border border-purple-200 text-brand-primary text-xs sm:text-sm font-black rounded-2xl flex items-center space-x-2 transition-all shadow-xs active:scale-95 cursor-pointer"
            >
              <Filter className="w-4 h-4 text-brand-primary" />
              <span>{selectedCategory === 'all' ? 'All Categories' : selectedCategory}</span>
              <ChevronDown
                className="w-4 h-4 text-brand-primary transition-transform duration-200"
                style={{ transform: isCategoryDropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
              />
            </button>

            {/* Custom Animated Popup Dropdown */}
            {isCategoryDropdownOpen && (
              <>
                {/* Backdrop Overlay */}
                <div
                  className="fixed inset-0 z-30"
                  onClick={() => setIsCategoryDropdownOpen(false)}
                />

                <div className="absolute right-0 mt-2 w-56 sm:w-64 bg-white rounded-2xl border border-purple-200 shadow-2xl z-40 overflow-hidden py-1.5 animate-slide-down">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedCategory('all');
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm font-black flex items-center justify-between transition-colors ${
                      selectedCategory === 'all'
                        ? 'bg-purple-100/80 text-brand-primary'
                        : 'text-slate-700 hover:bg-purple-50'
                    }`}
                  >
                    <span>All Categories ({categories.length})</span>
                    {selectedCategory === 'all' && <CheckCircle2 className="w-4 h-4 text-brand-primary" />}
                  </button>

                  <div className="border-t border-purple-100 my-1" />

                  {categories.map((cat) => {
                    const isSelected = selectedCategory === cat.name;
                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setSelectedCategory(cat.name);
                          setIsCategoryDropdownOpen(false);
                        }}
                        className={`w-full px-4 py-2.5 text-left text-xs sm:text-sm font-bold flex items-center justify-between transition-colors ${
                          isSelected
                            ? 'bg-purple-100/80 text-brand-primary font-black'
                            : 'text-slate-700 hover:bg-purple-50'
                        }`}
                      >
                        <span>{cat.name}</span>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-brand-primary" />}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stock Status Filter Buttons */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto scrollbar-none py-0.5 shrink-0">
          <button
            onClick={() => setStockFilter('all')}
            className={`px-3 py-2 rounded-2xl text-xs font-black transition-all shrink-0 ${
              stockFilter === 'all'
                ? 'bg-brand-primary text-white shadow-purple-glow'
                : 'bg-slate-100 text-slate-700 hover:bg-purple-50'
            }`}
          >
            All Items ({products.length})
          </button>
          <button
            onClick={() => setStockFilter('low')}
            className={`px-3 py-2 rounded-2xl text-xs font-black transition-all shrink-0 ${
              stockFilter === 'low'
                ? 'bg-amber-500 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-amber-50'
            }`}
          >
            Low Stock ({lowStockProducts.length})
          </button>
          <button
            onClick={() => setStockFilter('in_stock')}
            className={`px-3 py-2 rounded-2xl text-xs font-black transition-all shrink-0 ${
              stockFilter === 'in_stock'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-700 hover:bg-emerald-50'
            }`}
          >
            In Stock ({inStockProducts.length})
          </button>
        </div>
      </div>

      {/* Main Stock Table / Cards Container */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-soft overflow-hidden">
        {/* Mobile View: Premium Product Cards (md:hidden) */}
        <div className="md:hidden divide-y divide-purple-100">
          {paginatedProducts.map((p) => {
            const isLow = p.stock <= p.lowStockThreshold;
            const isOut = p.stock <= 0;
            const stockPercent = Math.min(100, Math.max(10, Math.round((p.stock / (p.lowStockThreshold * 3)) * 100)));

            return (
              <div key={p.id} className="p-3.5 space-y-3 bg-white hover:bg-purple-50/40 transition-colors">
                {/* Row 1: Image + English Name + Tamil Name + Category */}
                <div className="flex items-start space-x-3">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-14 h-14 rounded-2xl object-cover shrink-0 border-2 border-purple-100 shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-1">
                      <h4 className="font-black text-slate-900 text-base leading-snug truncate">
                        {p.name}
                      </h4>
                      <span className="bg-purple-100 text-brand-primary text-[11px] font-black px-2 py-0.5 rounded-lg border border-purple-200 shrink-0">
                        {p.category}
                      </span>
                    </div>
                    {p.tamilName && (
                      <p className="text-xs text-brand-primary font-black truncate mt-0.5">{p.tamilName}</p>
                    )}
                    <p className="text-xs text-slate-500 font-bold mt-1">
                      Price: <span className="text-slate-900 font-black">₹{p.price}</span> • Cost: <span className="text-slate-600 font-extrabold">₹{p.costPrice || 0}</span>
                    </p>
                  </div>
                </div>

                {/* Row 2: Stock Level Progress Bar & Status Pill */}
                <div className="bg-purple-50/60 p-2.5 rounded-2xl border border-purple-100 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-600 font-bold">Current Stock</span>
                    <span
                      className={`text-xs font-black px-2.5 py-0.5 rounded-full ${
                        isOut
                          ? 'bg-rose-600 text-white'
                          : isLow
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      }`}
                    >
                      {p.stock} {p.unit}s ({isOut ? 'EMPTY' : isLow ? 'LOW' : 'OK'})
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${
                        isOut ? 'bg-rose-600' : isLow ? 'bg-amber-500' : 'bg-emerald-500'
                      }`}
                      style={{ width: `${stockPercent}%` }}
                    />
                  </div>
                </div>

                {/* Row 3: Reorder Threshold & Touch Restock Buttons */}
                <div className="flex items-center justify-between pt-0.5 gap-2">
                  <span className="text-xs text-slate-500 font-bold">
                    Reorder: <span className="font-black text-slate-800">{p.lowStockThreshold} {p.unit}s</span>
                  </span>

                  <div className="flex items-center space-x-1.5 shrink-0">
                    <button
                      onClick={() => handleQuickReorder(p.id, 10, p.name)}
                      className="h-8 px-3 inline-flex items-center justify-center bg-purple-100 hover:bg-purple-200 text-brand-primary border border-purple-200 text-xs font-black rounded-xl transition-all active:scale-95 whitespace-nowrap shadow-xs"
                    >
                      +10
                    </button>
                    <button
                      onClick={() => handleQuickReorder(p.id, 50, p.name)}
                      className="h-8 px-3.5 inline-flex items-center justify-center bg-brand-primary hover:bg-brand-hover text-white text-xs font-black rounded-xl transition-all shadow-purple-glow active:scale-95 whitespace-nowrap"
                    >
                      +50 Restock
                    </button>
                    <button
                      onClick={() => {
                        setRestockProduct(p);
                        setRestockAmount(50);
                      }}
                      className="h-8 px-2.5 inline-flex items-center justify-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shrink-0 border border-emerald-600 whitespace-nowrap shadow-xs active:scale-95"
                      title="Custom Restock Amount"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Desktop View: Full HTML Table (hidden md:block) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-purple-50/80 text-slate-800 uppercase text-sm font-black tracking-wider border-b border-purple-200">
                <th className="py-4 px-4">Item Details</th>
                <th className="py-4 px-4">Category</th>
                <th className="py-4 px-4">Price / Cost</th>
                <th className="py-4 px-4">Stock Status & Progress</th>
                <th className="py-4 px-4 text-right">Quick Restock Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-extrabold">
              {paginatedProducts.map((p) => {
                const isLow = p.stock <= p.lowStockThreshold;
                const isOut = p.stock <= 0;
                const stockPercent = Math.min(100, Math.max(10, Math.round((p.stock / (p.lowStockThreshold * 3)) * 100)));

                return (
                  <tr key={p.id} className={`hover:bg-purple-50/40 transition-colors ${isOut ? 'bg-rose-50/40' : isLow ? 'bg-amber-50/30' : ''}`}>
                    {/* Item Details */}
                    <td className="py-4 px-4 flex items-center space-x-3.5">
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-purple-100 shadow-xs" />
                      <div>
                        <p className="font-black text-slate-900 text-base sm:text-lg leading-tight">{p.name}</p>
                        <p className="text-sm text-brand-primary font-black mt-0.5">{p.tamilName}</p>
                        <p className="text-xs text-slate-400 font-bold font-mono mt-0.5">Barcode: {p.barcode}</p>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-4 px-4">
                      <span className="bg-purple-100 text-brand-primary text-sm font-black px-3 py-1.5 rounded-xl border border-purple-200 shadow-xs">
                        {p.category}
                      </span>
                    </td>

                    {/* Financials */}
                    <td className="py-4 px-4">
                      <p className="font-black text-slate-900 text-base">₹{p.price}</p>
                      <p className="text-sm text-slate-500 font-extrabold mt-0.5">Cost: ₹{p.costPrice || '-'}</p>
                    </td>

                    {/* Stock Status Meter & Pill */}
                    <td className="py-4 px-4">
                      <div className="space-y-1.5 w-40">
                        <div className="flex items-center justify-between">
                          <span
                            className={`text-sm font-black px-3 py-1 rounded-full ${
                              isOut
                                ? 'bg-rose-600 text-white'
                                : isLow
                                ? 'bg-amber-500 text-white'
                                : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            }`}
                          >
                            {p.stock} {p.unit}s
                          </span>
                          <span className="text-xs font-black text-slate-600 uppercase">
                            {isOut ? 'Empty' : isLow ? 'Low' : 'OK'}
                          </span>
                        </div>
                        {/* Progress Meter Bar */}
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              isOut
                                ? 'bg-rose-600'
                                : isLow
                                ? 'bg-amber-500'
                                : 'bg-emerald-500'
                            }`}
                            style={{ width: `${stockPercent}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Quick Restock Action Buttons */}
                    <td className="py-3.5 px-4 text-right">
                      <div className="inline-flex items-center space-x-2 justify-end">
                        <button
                          onClick={() => handleQuickReorder(p.id, 10, p.name)}
                          className="h-9 px-3.5 inline-flex items-center justify-center bg-purple-50 hover:bg-purple-100 text-brand-primary border border-purple-200 font-black text-xs sm:text-sm rounded-xl transition-all active:scale-95 shadow-xs whitespace-nowrap"
                          title="Add 10 Units"
                        >
                          +10
                        </button>
                        <button
                          onClick={() => handleQuickReorder(p.id, 50, p.name)}
                          className="h-9 px-4 inline-flex items-center justify-center bg-brand-primary hover:bg-brand-hover text-white font-black text-xs sm:text-sm rounded-xl transition-all shadow-purple-glow active:scale-95 whitespace-nowrap"
                          title="Add 50 Units"
                        >
                          +50 Restock
                        </button>
                        <button
                          onClick={() => {
                            setRestockProduct(p);
                            setRestockAmount(50);
                          }}
                          className="h-9 px-3.5 inline-flex items-center justify-center space-x-1 bg-emerald-600 hover:bg-emerald-700 text-white border border-emerald-600 rounded-xl transition-all active:scale-95 text-xs sm:text-sm font-black shrink-0 whitespace-nowrap shadow-xs"
                          title="Custom Restock Amount"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          <span>Add</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination Control Bar (20 items per page) */}
      <div className="bg-white p-3.5 sm:p-4 rounded-3xl border border-purple-100 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="text-xs sm:text-sm font-bold text-slate-600">
          Showing <span className="font-black text-slate-900">{filteredProducts.length === 0 ? 0 : startIndex + 1}</span> to{' '}
          <span className="font-black text-slate-900">{Math.min(startIndex + ITEMS_PER_PAGE, filteredProducts.length)}</span> of{' '}
          <span className="font-black text-slate-900">{filteredProducts.length}</span> items
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3.5 py-2 rounded-2xl bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-brand-primary text-xs sm:text-sm font-black transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 flex items-center space-x-1"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          {/* Page Number Pills */}
          <div className="flex items-center space-x-1">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                type="button"
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl text-xs font-black transition-all ${
                  currentPage === page
                    ? 'bg-brand-primary text-white shadow-purple-glow scale-[1.05]'
                    : 'bg-white text-slate-700 hover:bg-purple-50 border border-slate-200'
                }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3.5 py-2 rounded-2xl bg-slate-100 text-slate-700 hover:bg-purple-100 hover:text-brand-primary text-xs sm:text-sm font-black transition-all disabled:opacity-40 disabled:cursor-not-allowed border border-slate-200 flex items-center space-x-1"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Custom Restock Modal */}
      {restockProduct && (
        <Modal
          isOpen={Boolean(restockProduct)}
          onClose={() => setRestockProduct(null)}
          title={`Restock ${restockProduct.name}`}
          icon={RefreshCw}
          maxWidth="max-w-md"
        >
          <form onSubmit={handleCustomRestockSubmit} className="space-y-4">
            <div className="bg-purple-50 p-3.5 rounded-2xl border border-purple-200 flex items-center space-x-3">
              <img
                src={restockProduct.image}
                alt={restockProduct.name}
                className="w-12 h-12 rounded-xl object-cover border border-purple-200"
              />
              <div>
                <h4 className="font-black text-slate-900 text-sm sm:text-base">{restockProduct.name}</h4>
                <p className="text-xs text-slate-600 font-bold">
                  Current Stock: <span className="font-black text-brand-primary">{restockProduct.stock} {restockProduct.unit}s</span>
                </p>
              </div>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1.5">
                Restock Quantity ({restockProduct.unit}s)
              </label>
              <input
                type="number"
                value={restockAmount}
                onChange={(e) => setRestockAmount(e.target.value)}
                className="w-full p-3 bg-slate-50 border border-purple-200 rounded-2xl text-base font-black text-slate-900 focus:border-brand-primary focus:outline-none"
                placeholder="Enter quantity to add..."
                autoFocus
              />
            </div>

            {/* Preset Amount Pills */}
            <div className="flex items-center space-x-2">
              {[10, 25, 50, 100, 200].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setRestockAmount(amt)}
                  className={`flex-1 py-2 text-xs font-black rounded-xl border transition-all ${
                    Number(restockAmount) === amt
                      ? 'bg-brand-primary text-white border-brand-primary shadow-purple-glow'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-purple-50'
                  }`}
                >
                  +{amt}
                </button>
              ))}
            </div>

            <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setRestockProduct(null)}
                className="px-4 py-2.5 bg-slate-100 text-slate-700 font-bold text-xs sm:text-sm rounded-xl hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-black text-xs sm:text-sm rounded-xl shadow-purple-glow flex items-center space-x-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Restock</span>
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
};
