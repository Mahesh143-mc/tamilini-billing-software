import React, { useState, useRef } from 'react';
import {
  Search,
  Mic,
  Barcode,
  Plus,
  Minus,
  Trash2,
  Users,
  Tag,
  PauseCircle,
  Play,
  CheckCircle2,
  ShoppingCart,
  Percent,
  FileText,
  Sparkles,
  ArrowRight,
  Coffee,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Filter,
  FolderTree,
  Check
} from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { PaymentModal } from '../components/billing/PaymentModal';
import { ReceiptModal } from '../components/billing/ReceiptModal';
import { HoldBillsModal } from '../components/billing/HoldBillsModal';
import { CustomerSelectModal } from '../components/billing/CustomerSelectModal';
import { Modal } from '../components/common/Modal';

export const Billing = () => {
  const {
    products,
    categories,
    cart,
    addToCart,
    updateCartQty,
    removeFromCart,
    clearCart,
    subtotal,
    discountAmount,
    taxAmount,
    grandTotal,
    discount,
    setDiscountState,
    orderType,
    setOrderType,
    selectedCustomer,
    holdCurrentBill,
    heldBills
  } = usePOS();

  // Search & Category Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [categorySearchQuery, setCategorySearchQuery] = useState('');
  const categoryRowRef = useRef(null);

  const scrollCategoryRow = (direction) => {
    if (categoryRowRef.current) {
      categoryRowRef.current.scrollBy({
        left: direction === 'left' ? -220 : 220,
        behavior: 'smooth'
      });
    }
  };

  // Mobile View Toggle: 'catalog' | 'cart'
  const [mobileTab, setMobileTab] = useState('catalog');

  // Modals state
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);
  const [isHoldModalOpen, setIsHoldModalOpen] = useState(false);
  const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
  const [generatedBill, setGeneratedBill] = useState(null);

  // Discount input toggle
  const [showDiscountInput, setShowDiscountInput] = useState(false);

  const totalCartCount = cart.reduce((acc, i) => acc + i.qty, 0);

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.tamilName && p.tamilName.includes(searchQuery)) ||
      p.barcode.includes(searchQuery);
    const matchesCategory =
      selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePaymentSuccess = (bill) => {
    setIsPaymentOpen(false);
    setGeneratedBill(bill);
    setIsReceiptOpen(true);
  };

  return (
    <div className="h-[calc(100vh-130px)] lg:h-[calc(100vh-64px)] overflow-y-auto lg:overflow-hidden px-1.5 py-1.5 sm:px-3 lg:px-6 flex flex-col pb-3 lg:pb-0">
      {/* 📱 Mobile Top Screen View Switcher (lg:hidden) */}
      <div className="lg:hidden flex bg-white p-1 rounded-2xl border border-purple-200 shadow-sm mb-2 shrink-0">
        <button
          onClick={() => setMobileTab('catalog')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center justify-center space-x-2 ${
            mobileTab === 'catalog'
              ? 'bg-brand-primary text-white shadow-purple-glow'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Menu Catalog</span>
        </button>

        <button
          onClick={() => setMobileTab('cart')}
          className={`flex-1 py-2.5 text-xs sm:text-sm font-black rounded-xl transition-all flex items-center justify-center space-x-2 relative ${
            mobileTab === 'cart'
              ? 'bg-brand-primary text-white shadow-purple-glow'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>View Cart ({totalCartCount})</span>
          {totalCartCount > 0 && (
            <span className="bg-amber-400 text-brand-dark text-[10px] font-black px-1.5 py-0.5 rounded-full ml-1">
              ₹{grandTotal}
            </span>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 flex-1 min-h-0">
        {/* LEFT COLUMN: CATALOG & PRODUCTS (SCROLLABLE ON MOBILE & DESKTOP) */}
        <div className={`lg:col-span-7 xl:col-span-8 space-y-3 flex-1 overflow-y-auto lg:h-full lg:pr-2 scrollbar-thin bg-slate-100/80 p-2 sm:p-4 rounded-3xl border border-slate-200/90 ${mobileTab === 'catalog' ? 'block' : 'hidden lg:block'}`}>
        {/* Top Search & Filter Bar */}
        <div className="bg-white p-2.5 sm:p-4 rounded-3xl shadow-sm border border-purple-100 space-y-3">
          <div className="flex items-center space-x-2">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products by name, Tamil title, or barcode..."
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-purple-200 rounded-2xl text-xs sm:text-sm font-bold text-slate-800 focus:border-brand-primary focus:outline-none"
              />
            </div>

            {/* Barcode Scanner Sim */}
            <button
              onClick={() => console.log('Barcode')}
              className="p-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-brand-primary border border-purple-200 transition-colors"
              title="Barcode Scanner Mode"
            >
              <Barcode className="w-5 h-5" />
            </button>

            {/* Voice Input Sim */}
            <button
              onClick={() => console.log('Voice')}
              className="p-2 rounded-2xl bg-purple-50 hover:bg-purple-100 text-brand-primary border border-purple-200 transition-colors"
              title="Voice Search"
            >
              <Mic className="w-5 h-5" />
            </button>

            {/* Category Filter Popup Menu Button */}
            <button
              type="button"
              onClick={() => setIsCategoryModalOpen(true)}
              className="py-2 px-3 bg-purple-50 hover:bg-purple-100 text-brand-primary border border-purple-200 text-xs sm:text-sm font-black rounded-2xl flex items-center space-x-1.5 transition-all shadow-sm active:scale-95 shrink-0"
              title="Open All Categories Menu Popup"
            >
              <Filter className="w-4 h-4 text-brand-primary" />
              <span className="bg-brand-primary text-white text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-xs">
                {categories.length}
              </span>
            </button>
          </div>

          {/* Category Filter Bar: Scroll Left + Chips + Scroll Right (Hidden on Mobile, Visible sm:flex) */}
          <div className="hidden sm:flex items-center space-x-2 w-full min-w-0">
            {/* Scroll Left Button */}
            <button
              type="button"
              onClick={() => scrollCategoryRow('left')}
              className="p-2 rounded-2xl bg-white border border-purple-200 text-slate-700 hover:text-brand-primary hover:bg-purple-50 transition-colors shrink-0 shadow-sm"
              title="Scroll Left Categories"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {/* Category Chips Scrollable */}
            <div
              ref={categoryRowRef}
              className="flex items-center space-x-2 overflow-x-auto scrollbar-none py-1 scroll-smooth flex-1 min-w-0"
            >
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`px-4 py-2 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all duration-200 flex items-center space-x-1.5 shrink-0 ${
                      isSelected
                        ? 'bg-gradient-to-r from-brand-primary to-brand-secondary text-white shadow-purple-glow scale-[1.02]'
                        : 'bg-white text-slate-700 border border-slate-200 hover:bg-purple-100 hover:text-brand-primary'
                    }`}
                  >
                    <span>{cat.name}</span>
                  </button>
                );
              })}
            </div>

            {/* Scroll Right Button */}
            <button
              type="button"
              onClick={() => scrollCategoryRow('right')}
              className="p-2 rounded-2xl bg-white border border-purple-200 text-slate-700 hover:text-brand-primary hover:bg-purple-50 transition-colors shrink-0 shadow-sm"
              title="Scroll Right Categories"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4">
          {filteredProducts.map((product) => {
            const inCart = cart.find((c) => c.id === product.id);

            return (
              <div
                key={product.id}
                onClick={() => {
                  if (!inCart) addToCart(product);
                }}
                className={`group rounded-3xl p-3.5 border transition-all duration-200 flex flex-col justify-between relative overflow-hidden select-none ${
                  inCart
                    ? 'bg-purple-50/60 border-2 border-brand-primary shadow-purple-glow'
                    : 'bg-white border-purple-100/90 shadow-soft hover:shadow-card-hover hover:border-purple-300 cursor-pointer'
                }`}
              >
                {/* Popular & In-Cart Badges */}
                <div className="absolute top-2.5 right-2.5 z-10 flex items-center space-x-1">
                  {inCart && (
                    <span className="bg-brand-primary text-white text-[10px] font-black px-2.5 py-0.5 rounded-full shadow-sm">
                      {inCart.qty} SELECTED
                    </span>
                  )}
                  {product.isPopular && !inCart && (
                    <span className="bg-amber-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm">
                      POPULAR
                    </span>
                  )}
                </div>

                <div>
                  {/* Image */}
                  <div className="w-full h-28 sm:h-32 rounded-2xl overflow-hidden mb-2.5 bg-slate-100 relative">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.stock <= product.lowStockThreshold && (
                      <span className="absolute bottom-2 left-2 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-sm">
                        Stock: {product.stock}
                      </span>
                    )}
                  </div>

                  {/* Name & Tamil Subtitle */}
                  <h3 className="text-sm sm:text-base font-extrabold text-slate-900 line-clamp-1 group-hover:text-brand-primary transition-colors">
                    {product.name}
                  </h3>
                  {product.tamilName && (
                    <p className="text-xs text-brand-primary font-extrabold truncate mt-0.5">
                      {product.tamilName}
                    </p>
                  )}
                </div>

                {/* Price Row */}
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-purple-100/80">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-base sm:text-lg font-black text-slate-900">
                      ₹{product.price}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">/ pc</span>
                  </div>
                </div>

                {/* Full-Width Action Row */}
                <div className="mt-2">
                  {inCart ? (
                    <div
                      onClick={(e) => e.stopPropagation()}
                      className="w-full flex items-center justify-between bg-white border border-purple-200 p-1 rounded-xl shadow-sm"
                    >
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          updateCartQty(product.id, -1);
                        }}
                        className="w-8 h-8 rounded-lg bg-rose-100 text-rose-700 border border-rose-300 hover:bg-rose-600 hover:text-white flex items-center justify-center font-black text-sm transition-all duration-200 active:scale-95 shrink-0 shadow-sm"
                        title="Decrease quantity"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span className="text-sm font-black text-slate-900 px-2">
                        {inCart.qty}
                      </span>

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addToCart(product);
                        }}
                        className="w-8 h-8 rounded-lg bg-brand-primary hover:bg-brand-hover text-white flex items-center justify-center font-black text-sm transition-colors shadow-purple-glow active:scale-95 shrink-0"
                        title="Increase quantity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(product);
                      }}
                      className="w-full py-2 bg-brand-primary hover:bg-brand-hover text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-1 transition-all shadow-purple-glow active:scale-[0.98]"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Add to Cart</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* RIGHT COLUMN: CART & CHECKOUT PANEL (RICH PURPLE TINTED SECTION) */}
      <div className={`lg:col-span-5 xl:col-span-4 lg:h-full min-h-0 ${mobileTab === 'cart' ? 'block' : 'hidden lg:block'}`}>
        <div className="bg-gradient-to-b from-purple-100/90 via-purple-50/90 to-purple-100/90 rounded-3xl p-3.5 sm:p-4 shadow-xl border-2 border-purple-300/90 flex flex-col lg:h-full space-y-3 overflow-y-auto lg:overflow-hidden justify-between pb-3 sm:pb-4">
          {/* Cart Header */}
          <div className="flex items-center justify-between pb-2.5 border-b border-purple-100 shrink-0">
            <div className="flex items-center space-x-2.5">
              <div className="w-10 h-10 rounded-xl bg-brand-light text-brand-primary flex items-center justify-center shrink-0">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-black text-slate-900 leading-tight">Current Cart</h2>
                <p className="text-xs sm:text-sm font-bold text-slate-600">{cart.length} unique items selected</p>
              </div>
            </div>

            {/* Held Bills Counter Button */}
            <button
              onClick={() => setIsHoldModalOpen(true)}
              className="flex items-center space-x-1 px-3.5 py-2 bg-purple-50 text-brand-primary hover:bg-purple-100 rounded-xl text-xs sm:text-sm font-extrabold transition-colors border border-purple-200 shrink-0"
            >
              <PauseCircle className="w-4 h-4" />
              <span>Held ({heldBills.length})</span>
            </button>
          </div>

          {/* Customer Attachment Bar */}
          <div
            onClick={() => setIsCustomerModalOpen(true)}
            className="p-3 bg-purple-50/80 border border-purple-200 rounded-2xl cursor-pointer hover:bg-purple-100/90 transition-colors flex items-center justify-between shrink-0"
          >
            <div className="flex items-center space-x-3">
              <Users className="w-5 h-5 text-brand-primary shrink-0" />
              <div>
                <p className="text-sm sm:text-base font-black text-slate-900 leading-tight">
                  {selectedCustomer ? selectedCustomer.name : 'Attach Customer'}
                </p>
                <p className="text-xs sm:text-sm font-bold text-slate-600">
                  {selectedCustomer
                    ? `${selectedCustomer.phone} • ${selectedCustomer.points} Pts`
                    : 'Earn loyalty points'}
                </p>
              </div>
            </div>
            <span className="text-xs sm:text-sm font-black text-brand-primary hover:underline">
              {selectedCustomer ? 'Change' : '+ Add'}
            </span>
          </div>

          {/* Cart Items List (Compact row height so 3 full items fit in mobile screen view) */}
          <div className="max-h-[170px] sm:max-h-[220px] lg:max-h-[280px] overflow-y-auto space-y-1.5 sm:space-y-2 pr-1 scrollbar-thin shrink-0">
            {cart.length === 0 ? (
              <div className="py-10 text-center text-slate-400 space-y-2">
                <Coffee className="w-10 h-10 text-slate-200 mx-auto" />
                <p className="text-sm font-extrabold text-slate-700">Your cart is empty</p>
                <p className="text-xs font-medium text-slate-500">Click on items from the menu to add to billing.</p>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="bg-slate-50 border border-purple-100 p-2 sm:p-2.5 rounded-2xl flex items-center justify-between space-x-2 shadow-sm"
                >
                  <div className="flex-1 pr-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900 leading-snug truncate">{item.name}</h4>
                    <p className="text-[11px] sm:text-xs font-bold text-slate-600">₹{item.price} × {item.qty}</p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center space-x-1 bg-white border border-purple-200 rounded-xl p-0.5 sm:p-1 shadow-sm shrink-0">
                    <button
                      onClick={() => updateCartQty(item.id, -1)}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-rose-100 text-rose-700 border border-rose-300 hover:bg-rose-600 hover:text-white flex items-center justify-center font-black transition-colors"
                      title="Decrease quantity"
                    >
                      <Minus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                    <span className="text-xs sm:text-sm font-black text-slate-900 px-1.5">{item.qty}</span>
                    <button
                      onClick={() => updateCartQty(item.id, 1)}
                      className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-brand-primary hover:bg-brand-hover text-white flex items-center justify-center font-black transition-colors shadow-sm"
                    >
                      <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                    </button>
                  </div>

                  <span className="text-xs sm:text-sm font-black text-slate-900 w-14 sm:w-16 text-right shrink-0">
                    ₹{item.price * item.qty}
                  </span>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 sm:p-2 text-rose-600 hover:text-white bg-rose-50 hover:bg-rose-600 border border-rose-200 rounded-xl transition-all duration-200 shrink-0 active:scale-95 shadow-xs"
                    title="Remove item from cart"
                  >
                    <Trash2 className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Discount & Calculations Summary */}
          <div className="border-t border-purple-100 pt-3 space-y-2 text-sm sm:text-base shrink-0">
            <div className="flex justify-between text-slate-700 font-bold">
              <span>Subtotal</span>
              <span className="font-black text-slate-900">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>

            {/* Discount Toggle */}
            <div className="flex justify-between items-center text-slate-700 font-bold">
              <button
                type="button"
                onClick={() => setShowDiscountInput(!showDiscountInput)}
                className="text-brand-primary font-black hover:underline flex items-center gap-1.5 text-xs sm:text-sm"
              >
                <Tag className="w-4 h-4" />
                <span>{discountAmount > 0 ? `Discount (${discount.value}${discount.type === 'percentage' ? '%' : '₹'})` : '+ Add Coupon / Discount'}</span>
              </button>
              {discountAmount > 0 && (
                <span className="font-black text-emerald-600">-₹{discountAmount.toLocaleString('en-IN')}</span>
              )}
            </div>

            {showDiscountInput && (
              <div className="flex items-center space-x-2 bg-purple-50 p-2 rounded-xl border border-purple-200">
                <select
                  value={discount.type}
                  onChange={(e) => setDiscountState({ ...discount, type: e.target.value })}
                  className="bg-white border border-purple-200 text-xs font-bold rounded-lg p-2"
                >
                  <option value="percentage">% Off</option>
                  <option value="flat">₹ Flat</option>
                </select>
                <input
                  type="number"
                  placeholder="Val"
                  value={discount.value || ''}
                  onChange={(e) => setDiscountState({ ...discount, value: Number(e.target.value) })}
                  className="w-24 p-2 border border-purple-200 rounded-lg text-xs font-bold"
                />
              </div>
            )}

            {/* Grand Total Bar */}
            <div className="flex justify-between items-center text-base sm:text-lg font-black pt-2 border-t border-purple-200 text-slate-900">
              <span>Grand Total</span>
              <span className="text-2xl sm:text-3xl text-brand-primary font-black">
                ₹{grandTotal.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Cart Action Buttons */}
          <div className="grid grid-cols-2 gap-2 shrink-0">
            <button
              onClick={holdCurrentBill}
              className="py-2.5 px-3 bg-purple-50 hover:bg-purple-100 text-brand-primary font-black text-xs sm:text-sm rounded-xl border border-purple-200 transition-colors flex items-center justify-center space-x-1"
            >
              <PauseCircle className="w-4 h-4" />
              <span>Hold Bill</span>
            </button>
            <button
              onClick={clearCart}
              className="py-2.5 px-3 bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-black text-xs sm:text-sm rounded-xl transition-colors flex items-center justify-center space-x-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear Cart</span>
            </button>
          </div>

          {/* HERO STICKY CHECKOUT BUTTON */}
          <button
            onClick={() => setIsPaymentOpen(true)}
            disabled={cart.length === 0}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent hover:from-brand-hover hover:to-brand-primary text-white font-black text-base sm:text-lg rounded-2xl shadow-purple-lg flex items-center justify-between transition-all duration-200 transform active:scale-95 disabled:opacity-50 shrink-0"
          >
            <div className="flex items-center space-x-2">
              <Sparkles className="w-5 h-5 text-amber-300" />
              <span>Proceed to Checkout</span>
            </div>
            <span className="text-xl sm:text-2xl font-black bg-white/20 px-3.5 py-1 rounded-xl">
              ₹{grandTotal}
            </span>
          </button>
        </div>
      </div>
      </div>

      {/* MODALS */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        onPaymentSuccess={handlePaymentSuccess}
      />

      <ReceiptModal
        isOpen={isReceiptOpen}
        onClose={() => setIsReceiptOpen(false)}
        bill={generatedBill}
      />

      <HoldBillsModal
        isOpen={isHoldModalOpen}
        onClose={() => setIsHoldModalOpen(false)}
      />

      <CustomerSelectModal
        isOpen={isCustomerModalOpen}
        onClose={() => setIsCustomerModalOpen(false)}
      />

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
