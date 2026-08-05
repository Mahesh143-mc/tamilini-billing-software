import React, { createContext, useContext, useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_CUSTOMERS,
  INITIAL_SUPPLIERS,
  INITIAL_EXPENSES,
  INITIAL_RECENT_BILLS,
  INITIAL_SETTINGS
} from '../mock/initialData';

const POSContext = createContext();

export const POSProvider = ({ children }) => {
  // Helper for localStorage
  const getStored = (key, fallback) => {
    try {
      const saved = localStorage.getItem(`tamilini_pos_${key}`);
      return saved ? JSON.parse(saved) : fallback;
    } catch {
      return fallback;
    }
  };

  const setStored = (key, value) => {
    try {
      localStorage.setItem(`tamilini_pos_${key}`, JSON.stringify(value));
    } catch (e) {
      console.error("Storage error", e);
    }
  };

  // State definitions
  const [user, setUser] = useState(() => getStored('user', {
    name: 'Sundar Raman',
    role: 'Cashier / Admin',
    branch: 'Chromepet Main Branch',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    isLoggedIn: true
  }));

  const [products, setProducts] = useState(() => {
    const stored = getStored('products', null);
    if (!stored || stored.length < INITIAL_PRODUCTS.length) {
      setStored('products', INITIAL_PRODUCTS);
      return INITIAL_PRODUCTS;
    }
    return stored;
  });

  const [categories, setCategories] = useState(() => {
    const stored = getStored('categories', null);
    if (!stored || stored.length < INITIAL_CATEGORIES.length) {
      setStored('categories', INITIAL_CATEGORIES);
      return INITIAL_CATEGORIES;
    }
    return stored;
  });
  const [customers, setCustomers] = useState(() => getStored('customers', INITIAL_CUSTOMERS));
  const [suppliers, setSuppliers] = useState(() => getStored('suppliers', INITIAL_SUPPLIERS));
  const [expenses, setExpenses] = useState(() => getStored('expenses', INITIAL_EXPENSES));
  const [recentBills, setRecentBills] = useState(() => getStored('bills', INITIAL_RECENT_BILLS));
  const [settings, setSettings] = useState(() => getStored('settings', INITIAL_SETTINGS));
  const [heldBills, setHeldBills] = useState(() => getStored('held_bills', []));

  // Active Cart State
  const [cart, setCart] = useState(() => getStored('cart', []));
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [discount, setDiscountState] = useState({ type: 'percentage', value: 0 }); // type: 'percentage' | 'flat'
  const [orderType, setOrderType] = useState('takeaway'); // 'dine-in' | 'takeaway' | 'delivery'
  const [couponCode, setCouponCode] = useState('');

  // Toast Notification System
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3500);
  };

  // Sync to localStorage
  useEffect(() => setStored('products', products), [products]);
  useEffect(() => setStored('customers', customers), [customers]);
  useEffect(() => setStored('suppliers', suppliers), [suppliers]);
  useEffect(() => setStored('expenses', expenses), [expenses]);
  useEffect(() => setStored('bills', recentBills), [recentBills]);
  useEffect(() => setStored('settings', settings), [settings]);
  useEffect(() => setStored('held_bills', heldBills), [heldBills]);
  useEffect(() => setStored('cart', cart), [cart]);
  useEffect(() => setStored('user', user), [user]);

  // Cart operations
  const addToCart = (product) => {
    let toastMessage = null;
    let toastType = 'info';

    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex((item) => item.id === product.id);
      if (existingIndex > -1) {
        if (prevCart[existingIndex].qty < product.stock) {
          const newQty = prevCart[existingIndex].qty + 1;
          toastMessage = `Increased ${product.name} quantity (${newQty})`;
          toastType = 'info';
          return prevCart.map((item, idx) =>
            idx === existingIndex ? { ...item, qty: newQty } : item
          );
        } else {
          toastMessage = `Cannot add more than available stock (${product.stock})`;
          toastType = 'warning';
          return prevCart;
        }
      } else {
        if (product.stock <= 0) {
          toastMessage = `${product.name} is currently Out of Stock!`;
          toastType = 'error';
          return prevCart;
        }
        toastMessage = `Added ${product.name} to cart`;
        toastType = 'success';
        return [...prevCart, { ...product, qty: 1, note: '' }];
      }
    });

    if (toastMessage) {
      showToast(toastMessage, toastType);
    }
  };

  const updateCartQty = (productId, delta) => {
    let toastMessage = null;
    let toastType = 'info';

    setCart((prevCart) => {
      const targetItem = prevCart.find((i) => i.id === productId);
      if (!targetItem) return prevCart;

      const targetProd = products.find((p) => p.id === productId);
      const maxStock = targetProd ? targetProd.stock : 999;
      const newQty = targetItem.qty + delta;

      if (newQty > maxStock) {
        toastMessage = `Max available stock is ${maxStock}`;
        toastType = 'warning';
        return prevCart;
      }

      if (newQty <= 0) {
        toastMessage = `Removed ${targetItem.name} from cart`;
        toastType = 'info';
        return prevCart.filter((item) => item.id !== productId);
      }

      return prevCart.map((item) =>
        item.id === productId ? { ...item, qty: newQty } : item
      );
    });

    if (toastMessage) {
      showToast(toastMessage, toastType);
    }
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
    showToast(`Removed item from cart`, 'info');
  };

  const updateCartItemNote = (productId, note) => {
    setCart((prevCart) =>
      prevCart.map((item) => (item.id === productId ? { ...item, note } : item))
    );
  };

  const clearCart = () => {
    setCart([]);
    setSelectedCustomer(null);
    setDiscountState({ type: 'percentage', value: 0 });
    setCouponCode('');
  };

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  const calculateDiscountAmount = () => {
    if (discount.type === 'percentage') {
      return (subtotal * (discount.value || 0)) / 100;
    }
    return Math.min(discount.value || 0, subtotal);
  };

  const discountAmount = calculateDiscountAmount();
  const taxAmount = 0; // GST concepts removed from billing
  const grandTotal = Math.max(0, Math.round(subtotal - discountAmount));

  // Hold & Resume Bills
  const holdCurrentBill = () => {
    if (cart.length === 0) {
      showToast('Cannot hold an empty cart!', 'warning');
      return;
    }
    const newHeld = {
      id: `HOLD-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
      items: [...cart],
      discount,
      orderType,
      grandTotal
    };
    setHeldBills((prev) => [newHeld, ...prev]);
    clearCart();
    showToast(`Bill ${newHeld.id} held successfully!`, 'success');
  };

  const resumeHeldBill = (heldId) => {
    const target = heldBills.find((b) => b.id === heldId);
    if (target) {
      setCart(target.items);
      if (target.discount) setDiscountState(target.discount);
      if (target.orderType) setOrderType(target.orderType);
      setHeldBills((prev) => prev.filter((b) => b.id !== heldId));
      showToast(`Resumed held bill ${target.id}`, 'success');
    }
  };

  const deleteHeldBill = (heldId) => {
    setHeldBills((prev) => prev.filter((b) => b.id !== heldId));
    showToast(`Cleared held bill`, 'info');
  };

  // Complete Checkout
  const completeCheckout = (paymentMode = 'Cash', amountTendered = grandTotal) => {
    if (cart.length === 0) {
      showToast('Cart is empty!', 'error');
      return null;
    }

    const billNumber = `INV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date();
    const timestampStr = `${now.toISOString().split('T')[0]} ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    const newBill = {
      id: billNumber,
      customerName: selectedCustomer ? selectedCustomer.name : 'Walk-in Customer',
      customerPhone: selectedCustomer ? selectedCustomer.phone : '-',
      itemsCount: cart.reduce((acc, i) => acc + i.qty, 0),
      subtotal,
      tax: Math.round(taxAmount * 100) / 100,
      discount: discountAmount,
      total: grandTotal,
      paymentMode,
      amountTendered,
      changeDue: Math.max(0, amountTendered - grandTotal),
      cashier: user.name,
      timestamp: timestampStr,
      status: 'Paid',
      orderType,
      items: cart.map((i) => ({
        id: i.id,
        name: i.name,
        qty: i.qty,
        price: i.price,
        gstRate: i.gstRate,
        note: i.note || ''
      }))
    };

    // Update Product Stock Levels
    setProducts((prevProducts) =>
      prevProducts.map((p) => {
        const cartMatch = cart.find((c) => c.id === p.id);
        if (cartMatch) {
          const newStock = Math.max(0, p.stock - cartMatch.qty);
          return { ...p, stock: newStock };
        }
        return p;
      })
    );

    // Update Customer Loyalty Points & Spent
    if (selectedCustomer) {
      const earnedPoints = Math.floor((grandTotal * (settings.pointsPer100 || 5)) / 100);
      setCustomers((prevCustomers) =>
        prevCustomers.map((c) => {
          if (c.id === selectedCustomer.id) {
            const updatedPoints = (c.points || 0) + earnedPoints;
            const updatedSpent = (c.totalSpent || 0) + grandTotal;
            let tier = c.tier;
            if (updatedSpent > 10000) tier = 'Platinum';
            else if (updatedSpent > 4000) tier = 'Gold';
            else if (updatedSpent > 1500) tier = 'Silver';

            return {
              ...c,
              points: updatedPoints,
              totalSpent: updatedSpent,
              tier,
              lastVisit: now.toISOString().split('T')[0]
            };
          }
          return c;
        })
      );
    }

    // Record to Sales history
    setRecentBills((prev) => [newBill, ...prev]);

    // Trigger celebration confetti!
    try {
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#6D28D9', '#7C3AED', '#8B5CF6', '#10B981']
      });
    } catch (e) {
      // ignore non-canvas environment
    }

    clearCart();
    showToast(`Bill ${billNumber} generated successfully!`, 'success');
    return newBill;
  };

  // CRUD Helpers
  const addProduct = (prodData) => {
    const id = `PROD-${(products.length + 1).toString().padStart(3, '0')}`;
    const newP = { ...prodData, id, stock: Number(prodData.stock) || 0, price: Number(prodData.price) || 0 };
    setProducts((prev) => [newP, ...prev]);
    showToast(`Product ${newP.name} added successfully!`, 'success');
  };

  const updateProduct = (prodData) => {
    setProducts((prev) => prev.map((p) => (p.id === prodData.id ? prodData : p)));
    showToast(`Product ${prodData.name} updated!`, 'success');
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    showToast(`Product removed`, 'info');
  };

  const addCustomer = (custData) => {
    const id = `CUST-${Math.floor(100 + Math.random() * 900)}`;
    const newC = { ...custData, id, points: 0, totalSpent: 0, tier: 'Bronze', lastVisit: new Date().toISOString().split('T')[0] };
    setCustomers((prev) => [newC, ...prev]);
    setSelectedCustomer(newC);
    showToast(`Customer ${newC.name} registered!`, 'success');
    return newC;
  };

  const addExpense = (expData) => {
    const id = `EXP-${Math.floor(500 + Math.random() * 500)}`;
    const newE = { ...expData, id, date: expData.date || new Date().toISOString().split('T')[0] };
    setExpenses((prev) => [newE, ...prev]);
    showToast(`Expense recorded: ₹${newE.amount}`, 'success');
  };

  const updateSettings = (newSet) => {
    setSettings(newSet);
    showToast('Store settings updated!', 'success');
  };

  return (
    <POSContext.Provider
      value={{
        user,
        setUser,
        products,
        setProducts,
        categories,
        customers,
        suppliers,
        expenses,
        recentBills,
        settings,
        heldBills,
        cart,
        selectedCustomer,
        setSelectedCustomer,
        discount,
        setDiscountState,
        orderType,
        setOrderType,
        couponCode,
        setCouponCode,
        subtotal,
        discountAmount,
        taxAmount,
        grandTotal,
        addToCart,
        updateCartQty,
        removeFromCart,
        updateCartItemNote,
        clearCart,
        holdCurrentBill,
        resumeHeldBill,
        deleteHeldBill,
        completeCheckout,
        addProduct,
        updateProduct,
        deleteProduct,
        addCustomer,
        addExpense,
        updateSettings,
        toasts,
        showToast
      }}
    >
      {children}
    </POSContext.Provider>
  );
};

export const usePOS = () => {
  const context = useContext(POSContext);
  if (!context) {
    throw new Error('usePOS must be used within a POSProvider');
  }
  return context;
};
