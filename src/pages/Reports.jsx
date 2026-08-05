import React, { useState } from 'react';
import { BarChart3, Download, Printer, Calendar, FileText, Sparkles } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const Reports = () => {
  const { recentBills, showToast } = usePOS();
  const [reportType, setReportType] = useState('daily'); // daily | weekly | monthly | yearly

  const totalSales = recentBills.reduce((acc, b) => acc + (b.total || 0), 0);
  const totalTax = recentBills.reduce((acc, b) => acc + (b.tax || 0), 0);

  const handleExport = (type) => {
    showToast(`Exported ${reportType.toUpperCase()} Sales Report as ${type}`, 'success');
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-8 px-3 py-3 lg:px-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-purple-100 flex flex-col md:flex-row items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-brand-primary" />
            <span>Sales & Revenue Financial Reports</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">Generate itemized revenue and cashier summaries.</p>
        </div>

        {/* Export Buttons */}
        <div className="flex items-center space-x-2 w-full md:w-auto">
          <button
            onClick={() => handleExport('PDF')}
            className="flex-1 md:flex-none px-4 py-2.5 bg-brand-light text-brand-primary font-extrabold text-xs sm:text-sm rounded-xl hover:bg-purple-100 flex items-center justify-center space-x-1 min-h-touch"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
          <button
            onClick={() => handleExport('Excel')}
            className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs sm:text-sm rounded-xl flex items-center justify-center space-x-1 min-h-touch shadow-sm"
          >
            <FileText className="w-4 h-4" />
            <span>Export Excel</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-soft">
          <p className="text-sm text-slate-600 font-extrabold">Total Gross Revenue</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">₹{totalSales.toLocaleString('en-IN')}</h3>
          <p className="text-xs text-emerald-600 font-bold mt-1">Net Sales Revenue</p>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-soft">
          <p className="text-sm text-slate-600 font-extrabold">Total Invoices Issued</p>
          <h3 className="text-3xl font-black text-slate-900 mt-1">{recentBills.length} Bills</h3>
          <p className="text-xs text-slate-500 font-medium mt-1">Average Bill Value: ₹{recentBills.length ? Math.round(totalSales / recentBills.length) : 0}</p>
        </div>
      </div>

      {/* Bills Matrix */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-soft overflow-x-auto">
        <div className="p-4 border-b border-purple-100">
          <h2 className="text-base font-extrabold text-slate-900">Completed Bills Log</h2>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-purple-50/70 text-slate-700 uppercase text-xs font-extrabold border-b border-purple-100">
              <th className="py-3.5 px-4">Invoice ID</th>
              <th className="py-3.5 px-4">Timestamp</th>
              <th className="py-3.5 px-4">Customer Name</th>
              <th className="py-3.5 px-4">Payment Method</th>
              <th className="py-3.5 px-4 text-right">Grand Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold">
            {recentBills.map((b) => (
              <tr key={b.id} className="hover:bg-purple-50/40 transition-colors">
                <td className="py-3.5 px-4 font-black text-brand-primary text-sm sm:text-base">{b.id}</td>
                <td className="py-3.5 px-4 text-slate-600 font-medium">{b.timestamp}</td>
                <td className="py-3.5 px-4 font-black text-slate-900">{b.customerName}</td>
                <td className="py-3.5 px-4 text-slate-700">{b.paymentMode}</td>
                <td className="py-3.5 px-4 text-right font-black text-slate-900 text-base">₹{b.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
