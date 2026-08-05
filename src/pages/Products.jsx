import React, { useState, useRef, useEffect } from 'react';
import {
  Search,
  Plus,
  Grid,
  List,
  Edit,
  Trash2,
  Package,
  Barcode,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  FolderTree,
  Check
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { Modal } from '../components/common/Modal';

export const Products = () => {
  const { products, categories, addProduct, updateProduct, deleteProduct } = usePOS();

  const [viewMode, setViewMode] = useState('grid'); // grid | table
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categoryRowRef = useRef(null);

  // Pagination State (10 items per page)
  const ITEMS_PER_PAGE = 10;
  const [currentPage, setCurrentPage] = useState(1);

  // Category Modal State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');

  const scrollCategoryRow = (direction) => {
    if (categoryRowRef.current) {
      categoryRowRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth'
      });
    }
  };

  // Reset page to 1 whenever filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProd, setEditingProd] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    tamilName: '',
    category: 'Tea & Coffee',
    price: '',
    costPrice: '',
    stock: '',
    unit: 'piece',
    gstRate: 5,
    barcode: '',
    image: '',
    lowStockThreshold: 10,
    expiryDays: 3
  });

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tamilName && p.tamilName.includes(searchQuery)) ||
      p.barcode.includes(searchQuery);
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate pagination variables (10 items per page)
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handleOpenAdd = () => {
    setEditingProd(null);
    setFormData({
      name: '',
      tamilName: '',
      category: categories[1]?.id || 'Tea & Coffee',
      price: '',
      costPrice: '',
      stock: '',
      unit: 'piece',
      gstRate: 5,
      barcode: `8901001${Math.floor(100 + Math.random() * 900)}`,
      image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&auto=format&fit=crop&q=80',
      lowStockThreshold: 10,
      expiryDays: 3
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingProd(p);
    setFormData({ ...p });
    setIsModalOpen(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingProd) {
      updateProduct({ ...formData, id: editingProd.id });
    } else {
      addProduct(formData);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-5 pb-24 lg:pb-8 px-3 py-3 lg:px-6">
      {/* Top Header & Search */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-3 w-full md:w-auto">
          <div className="w-10 h-10 rounded-2xl bg-brand-light text-brand-primary flex items-center justify-center font-bold">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-bold text-slate-900">Products & Menu Catalog</h1>
            <p className="text-xs text-slate-500">{products.length} total active items</p>
          </div>
        </div>

        <div className="flex items-center space-x-2 sm:space-x-3 w-full md:w-auto">
          {/* View Mode Toggle Switcher (Icon Only) */}
          <div className="flex bg-slate-100 border border-purple-200/80 p-1.5 rounded-2xl shadow-inner space-x-1 shrink-0">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2.5 rounded-xl text-xs font-black flex items-center justify-center transition-all duration-200 ${
                viewMode === 'grid'
                  ? 'bg-brand-primary text-white shadow-purple-glow scale-[1.02]'
                  : 'text-slate-600 hover:text-brand-primary hover:bg-purple-100/60'
              }`}
              title="Grid Card View"
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-2.5 rounded-xl text-xs font-black flex items-center justify-center transition-all duration-200 ${
                viewMode === 'table'
                  ? 'bg-brand-primary text-white shadow-purple-glow scale-[1.02]'
                  : 'text-slate-600 hover:text-brand-primary hover:bg-purple-100/60'
              }`}
              title="Table List View"
            >
              <List className="w-5 h-5" />
            </button>
          </div>

          {/* Category Filter Popup Menu Button */}
          <button
            type="button"
            onClick={() => setIsCategoryModalOpen(true)}
            className="py-2.5 px-3.5 bg-purple-50 hover:bg-purple-100 text-brand-primary border border-purple-200 text-xs sm:text-sm font-black rounded-2xl flex items-center space-x-2 transition-all shadow-sm active:scale-95 shrink-0"
            title="Open All Categories Menu Popup"
          >
            <Filter className="w-4.5 h-4.5 text-brand-primary" />
            <span className="hidden sm:inline">Categories</span>
            <span className="bg-brand-primary text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-xs">
              {categories.length}
            </span>
          </button>

          <button
            onClick={handleOpenAdd}
            className="flex-1 md:flex-none py-2.5 px-4 bg-brand-primary hover:bg-brand-hover text-white text-xs sm:text-sm font-black rounded-2xl shadow-purple-glow flex items-center justify-center space-x-2 transition-all min-h-touch active:scale-[0.98]"
          >
            <Plus className="w-4.5 h-4.5" />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* Filter Bar with Search & Clean Scrollable Category Chips */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="relative w-full md:w-80 shrink-0">
          <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search products by title or barcode..."
            className="w-full pl-11 pr-4 py-2.5 sm:py-3 bg-white border border-purple-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 focus:border-brand-primary focus:outline-none shadow-sm"
          />
        </div>

        {/* Category Filter Controls: Scroll Left + Chips + Scroll Right (Hidden on Mobile, Visible sm:flex) */}
        <div className="hidden sm:flex items-center space-x-2 w-full md:w-auto min-w-0">
          {/* Scroll Left Button */}
          <button
            type="button"
            onClick={() => scrollCategoryRow('left')}
            className="p-2.5 rounded-2xl bg-white border border-purple-200 text-slate-700 hover:text-brand-primary hover:bg-purple-50 transition-colors shrink-0 shadow-sm"
            title="Scroll Left Categories"
          >
            <ChevronLeft className="w-4.5 h-4.5" />
          </button>

          {/* Scrollable Category Chips */}
          <div
            ref={categoryRowRef}
            className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1 scroll-smooth flex-1 min-w-0"
          >
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-black whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-purple-glow scale-[1.02]'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-50 hover:text-brand-primary'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Scroll Right Button */}
          <button
            type="button"
            onClick={() => scrollCategoryRow('right')}
            className="p-2.5 rounded-2xl bg-white border border-purple-200 text-slate-700 hover:text-brand-primary hover:bg-purple-50 transition-colors shrink-0 shadow-sm"
            title="Scroll Right Categories"
          >
            <ChevronRight className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* View Mode: Grid */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3.5 sm:gap-4">
          {paginatedProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white rounded-3xl p-3.5 border border-purple-100 shadow-soft hover:shadow-card-hover hover:border-purple-200 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="w-full h-32 sm:h-36 rounded-2xl overflow-hidden mb-2.5 relative bg-slate-100">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  <span
                    className={`absolute top-2 left-2 text-xs font-black px-2.5 py-0.5 rounded-full shadow-sm ${
                      p.stock <= 0
                        ? 'bg-rose-600 text-white'
                        : p.stock <= p.lowStockThreshold
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    Stock: {p.stock} {p.unit}s
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-black text-slate-900 line-clamp-1">{p.name}</h3>
                {p.tamilName && (
                  <p className="text-xs text-brand-primary font-black truncate mt-0.5">{p.tamilName}</p>
                )}
                <p className="text-xs text-slate-500 font-bold mt-1">Barcode: {p.barcode}</p>
              </div>

              <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-slate-100">
                <span className="text-base sm:text-lg font-black text-slate-900">₹{p.price}</span>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-2 text-brand-primary bg-purple-50 hover:bg-brand-primary hover:text-white border border-purple-200 rounded-xl transition-all duration-200 active:scale-95 shadow-xs"
                    title="Edit Product Item"
                  >
                    <Edit className="w-4.5 h-4.5" />
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 rounded-xl transition-all duration-200 active:scale-95 shadow-xs"
                    title="Delete Product Item"
                  >
                    <Trash2 className="w-4.5 h-4.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* View Mode: Table (Mobile-friendly row cards + Desktop HTML table) */
        <div className="bg-white rounded-3xl border border-purple-100 shadow-soft overflow-hidden">
          {/* Mobile List Row Cards (md:hidden) */}
          <div className="md:hidden divide-y divide-purple-100">
            {paginatedProducts.map((p) => (
              <div
                key={p.id}
                className="p-3.5 flex items-center justify-between space-x-3 hover:bg-purple-50/50 transition-colors"
              >
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-12 h-12 rounded-2xl object-cover shrink-0 border border-purple-100"
                  />
                  <div className="min-w-0 flex-1 space-y-1">
                    {/* Line 1: English name */}
                    <h4 className="font-black text-slate-900 text-sm sm:text-base truncate leading-tight">
                      {p.name}
                    </h4>

                    {/* Line 2: Tamil name */}
                    {p.tamilName && (
                      <p className="text-xs text-brand-primary font-black truncate">
                        {p.tamilName}
                      </p>
                    )}

                    {/* Line 3: Price & Cost */}
                    <div className="flex items-center space-x-2 pt-0.5">
                      <span className="text-xs font-black text-slate-900">
                        Price: ₹{p.price}
                      </span>
                      {p.costPrice && (
                        <span className="text-xs font-bold text-slate-500">
                          • Cost: ₹{p.costPrice}
                        </span>
                      )}
                    </div>

                    {/* Line 4: Category name & Stock */}
                    <div className="flex items-center space-x-2 pt-0.5">
                      <span className="bg-purple-100 text-brand-primary text-[10px] font-black px-2 py-0.5 rounded-md border border-purple-200 shrink-0">
                        {p.category}
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full shrink-0 ${
                          p.stock <= p.lowStockThreshold
                            ? 'bg-rose-100 text-rose-800 border border-rose-200'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                        }`}
                      >
                        Stock: {p.stock}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(p)}
                    className="p-2 text-brand-primary bg-purple-50 hover:bg-brand-primary hover:text-white border border-purple-200 rounded-xl transition-all shadow-xs"
                    title="Edit Item"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteProduct(p.id)}
                    className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 rounded-xl transition-all shadow-xs"
                    title="Delete Item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Desktop HTML Table View (hidden md:block) */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-purple-50/80 text-slate-800 uppercase text-sm font-black tracking-wider border-b border-purple-200">
                  <th className="py-4 px-4">Item Details</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Price</th>
                  <th className="py-4 px-4">Cost</th>
                  <th className="py-4 px-4">Stock</th>
                  <th className="py-4 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-extrabold">
                {paginatedProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-purple-50/40 transition-colors">
                    <td className="py-3.5 px-4 flex items-center space-x-3">
                      <img src={p.image} alt={p.name} className="w-11 h-11 rounded-xl object-cover" />
                      <div>
                        <p className="font-black text-slate-900 text-sm sm:text-base">{p.name}</p>
                        <p className="text-xs text-brand-primary font-black">{p.tamilName}</p>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700">{p.category}</td>
                    <td className="py-3.5 px-4 font-black text-slate-900 text-base">₹{p.price}</td>
                    <td className="py-3.5 px-4 text-slate-600">₹{p.costPrice || '-'}</td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs font-black px-3 py-1 rounded-full ${
                          p.stock <= p.lowStockThreshold
                            ? 'bg-rose-100 text-rose-800 border border-rose-300'
                            : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        }`}
                      >
                        {p.stock} {p.unit}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="p-2 text-brand-primary bg-purple-50 hover:bg-brand-primary hover:text-white border border-purple-200 rounded-xl transition-all duration-200 active:scale-95 shadow-xs"
                        title="Edit Product Item"
                      >
                        <Edit className="w-4.5 h-4.5" />
                      </button>
                      <button
                        onClick={() => deleteProduct(p.id)}
                        className="p-2 text-rose-600 bg-rose-50 hover:bg-rose-600 hover:text-white border border-rose-200 rounded-xl transition-all duration-200 active:scale-95 shadow-xs"
                        title="Delete Product Item"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Pagination Control Bar (10 items per page) */}
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

      {/* Add / Edit Product Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProd ? 'Edit Product Item' : 'Add New Product Item'}
        icon={Package}
        maxWidth="max-w-xl"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Product Title (English) *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Special Filter Coffee"
                className="w-full p-2.5 bg-slate-50 border border-purple-200 rounded-xl text-xs focus:border-brand-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tamil Subtitle Title</label>
              <input
                type="text"
                value={formData.tamilName}
                onChange={(e) => setFormData({ ...formData, tamilName: e.target.value })}
                placeholder="e.g. பில்டர் காபி"
                className="w-full p-2.5 bg-slate-50 border border-purple-200 rounded-xl text-xs focus:border-brand-primary focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-purple-200 rounded-xl text-xs font-bold focus:border-brand-primary"
              >
                {categories.filter((c) => c.id !== 'all').map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-purple-200 rounded-xl text-xs font-bold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Stock Qty *</label>
              <input
                type="number"
                required
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                className="w-full p-2.5 bg-slate-50 border border-purple-200 rounded-xl text-xs font-bold"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Barcode</label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                className="w-full p-2.5 bg-slate-50 border border-purple-200 rounded-xl text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Image URL</label>
              <input
                type="url"
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                placeholder="https://..."
                className="w-full p-2.5 bg-slate-50 border border-purple-200 rounded-xl text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs rounded-xl shadow-purple-glow transition-all"
          >
            {editingProd ? 'Save Changes' : 'Create Product Item'}
          </button>
        </form>
      </Modal>

      {/* Category Selection Popup Modal */}
      <Modal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
        title="Select Menu Category Filter"
        icon={FolderTree}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4">
          {/* Category Search Input */}
          <div className="relative">
            <Search className="w-4.5 h-4.5 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={categorySearchQuery}
              onChange={(e) => setCategorySearchQuery(e.target.value)}
              placeholder="Search category name..."
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-purple-200 rounded-2xl text-sm sm:text-base font-bold focus:border-brand-primary focus:outline-none shadow-inner"
            />
          </div>

          {/* Categories Grid List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 max-h-96 overflow-y-auto pr-1 scrollbar-thin">
            {categories
              .filter((cat) => cat.name.toLowerCase().includes(categorySearchQuery.toLowerCase()))
              .map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const prodCount = cat.id === 'all'
                  ? products.length
                  : products.filter((p) => p.category === cat.id).length;

                return (
                  <div
                    key={cat.id}
                    onClick={() => {
                      setSelectedCategory(cat.id);
                      setIsCategoryModalOpen(false);
                    }}
                    className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer flex items-center justify-between transition-all duration-200 ${
                      isSelected
                        ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white border-brand-primary shadow-purple-glow scale-[1.02]'
                        : 'bg-white border-purple-100 hover:border-purple-300 hover:bg-purple-50 text-slate-800'
                    }`}
                  >
                    <span className="text-sm sm:text-base font-black truncate pr-2">{cat.name}</span>
                    <div className="flex items-center space-x-2 shrink-0">
                      <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${isSelected ? 'bg-white/25 text-white font-black' : 'bg-purple-100/70 text-purple-800'}`}>
                        {prodCount}
                      </span>
                      {isSelected && <Check className="w-4.5 h-4.5 text-white" />}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </Modal>
    </div>
  );
};
