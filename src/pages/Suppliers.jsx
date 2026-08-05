import React, { useState } from 'react';
import { Truck, Plus, FileText, Phone, Building } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const Suppliers = () => {
  const { suppliers } = usePOS();

  return (
    <div className="space-y-6 pb-24 lg:pb-8 px-3 py-3 lg:px-6">
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-purple-100 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Truck className="w-6 h-6 text-brand-primary" />
            <span>Supplier & Vendor Portal</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">Manage flour, dairy, and essence vendor accounts & GST invoices.</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-purple-100 shadow-soft overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-purple-50/70 text-slate-700 uppercase text-xs font-extrabold border-b border-purple-100">
              <th className="py-3.5 px-4">Company</th>
              <th className="py-3.5 px-4">GSTIN</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Contact</th>
              <th className="py-3.5 px-4">Payment Due</th>
              <th className="py-3.5 px-4 text-center">Invoices</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold">
            {suppliers.map((s) => (
              <tr key={s.id} className="hover:bg-purple-50/40 transition-colors">
                <td className="py-3.5 px-4 font-black text-slate-900 text-sm sm:text-base">{s.company}</td>
                <td className="py-3.5 px-4 font-mono font-bold text-slate-700">{s.gstin}</td>
                <td className="py-3.5 px-4 text-slate-700">{s.category}</td>
                <td className="py-3.5 px-4 text-slate-800">{s.contactPerson} ({s.phone})</td>
                <td className="py-3.5 px-4 font-black text-slate-900 text-base">₹{s.paymentDue?.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-center font-extrabold text-brand-primary">{s.pendingInvoices} Pending</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
