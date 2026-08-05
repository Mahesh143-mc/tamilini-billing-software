import React, { useState } from 'react';
import { Boxes, AlertTriangle, RefreshCw, ArrowUpRight, ShieldAlert, Plus, Check } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const Inventory = () => {
  const { products, setProducts, showToast } = usePOS();

  const lowStockProducts = products.filter((p) => p.stock <= p.lowStockThreshold);
  const totalStockValue = products.reduce((acc, p) => acc + p.stock * p.price, 0);

  const handleReorder = (productId, reorderQty = 50) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, stock: p.stock + reorderQty } : p))
    );
    showToast(`Restocked +${reorderQty} units`, 'success');
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-8 px-3 py-3 lg:px-6">
      {/* Top Banner */}
      <div className="bg-white p-5 rounded-3xl shadow-sm border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Boxes className="w-6 h-6 text-brand-primary" />
            <span>Inventory & Stock Management</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">Track bakery stock levels, wastage, and automatic reorder triggers.</p>
        </div>

        <div className="flex items-center space-x-4">
          <div className="text-right">
            <span className="text-xs text-slate-500 font-extrabold uppercase block">Total Stock Valuation</span>
            <span className="text-xl sm:text-2xl font-black text-brand-primary">₹{totalStockValue.toLocaleString('en-IN')}</span>
          </div>
        </div>
      </div>

      {/* Warning Alert Banner */}
      {lowStockProducts.length > 0 && (
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-3xl flex items-center justify-between text-amber-900 shadow-sm">
          <div className="flex items-center space-x-3">
            <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <h3 className="text-sm sm:text-base font-extrabold">
                {lowStockProducts.length} Items Below Reorder Threshold!
              </h3>
              <p className="text-xs text-amber-800 font-medium">
                Replenish stock now to prevent order disruptions during peak bakery billing hours.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Stock Items Table */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-soft overflow-x-auto">
        <div className="p-4 border-b border-purple-100 flex items-center justify-between">
          <h2 className="text-base font-extrabold text-slate-900">Stock Inventory Matrix</h2>
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-purple-50/70 text-slate-700 uppercase text-xs font-extrabold border-b border-purple-100">
              <th className="py-3.5 px-4">Item Name</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Current Stock</th>
              <th className="py-3.5 px-4">Reorder Level</th>
              <th className="py-3.5 px-4">Shelf Life</th>
              <th className="py-3.5 px-4 text-right">Quick Restock</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold">
            {products.map((p) => {
              const isLow = p.stock <= p.lowStockThreshold;
              return (
                <tr key={p.id} className={isLow ? 'bg-amber-50/40' : ''}>
                  <td className="py-3.5 px-4 flex items-center space-x-3">
                    <img src={p.image} alt={p.name} className="w-10 h-10 rounded-xl object-cover" />
                    <div>
                      <p className="font-extrabold text-slate-900 text-sm sm:text-base">{p.name}</p>
                      <p className="text-xs text-slate-500 font-semibold">{p.barcode}</p>
                    </div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700">{p.category}</td>
                  <td className="py-3.5 px-4 font-black text-slate-900">
                    <span className={`px-3 py-1 rounded-full text-xs font-extrabold ${isLow ? 'bg-rose-100 text-rose-800' : 'bg-emerald-100 text-emerald-800'}`}>
                      {p.stock} {p.unit}s
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{p.lowStockThreshold} {p.unit}s</td>
                  <td className="py-3.5 px-4 text-slate-700">{p.expiryDays || 3} Days</td>
                  <td className="py-3.5 px-4 text-right">
                    <button
                      onClick={() => handleReorder(p.id, 50)}
                      className="px-3.5 py-1.5 bg-brand-light hover:bg-brand-primary text-brand-primary hover:text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-sm"
                    >
                      + Add 50 Stock
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
