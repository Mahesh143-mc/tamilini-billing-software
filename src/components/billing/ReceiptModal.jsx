import React from 'react';
import { Printer, CheckCircle, ShoppingBag, Download, PlusCircle } from 'lucide-react';
import { Modal } from '../common/Modal';
import { usePOS } from '../../context/POSContext';

export const ReceiptModal = ({ isOpen, onClose, bill }) => {
  const { settings } = usePOS();

  if (!bill) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Sale Invoice Generated"
      icon={CheckCircle}
      maxWidth="max-w-md"
    >
      <div className="space-y-4">
        {/* Printable Thermal Receipt Card */}
        <div
          id="printable-receipt"
          className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm font-mono text-slate-800 text-xs space-y-3"
        >
          {/* Header */}
          <div className="text-center pb-3 border-b border-dashed border-slate-300">
            <h2 className="text-base font-extrabold tracking-tight text-slate-900 uppercase">
              {settings.shopName || 'TAMILINI BAKERY POS'}
            </h2>
            <p className="text-[11px] text-slate-600 leading-tight">{settings.tagline}</p>
            <p className="text-[10px] text-slate-500 mt-1">{settings.address}</p>
            <p className="text-[10px] text-slate-500">Ph: {settings.phone}</p>
          </div>

          {/* Bill Meta */}
          <div className="text-[11px] space-y-1 pb-2 border-b border-dashed border-slate-300">
            <div className="flex justify-between font-bold">
              <span>Invoice #: {bill.id}</span>
              <span>Mode: {bill.paymentMode}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Date: {bill.timestamp}</span>
              <span>Cashier: {bill.cashier}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Customer: {bill.customerName}</span>
              <span>Type: {bill.orderType?.toUpperCase() || 'TAKEAWAY'}</span>
            </div>
          </div>

          {/* Itemized Table */}
          <table className="w-full text-left text-[11px]">
            <thead>
              <tr className="border-b border-slate-300 text-slate-500 uppercase">
                <th className="py-1">Item</th>
                <th className="py-1 text-center">Qty</th>
                <th className="py-1 text-right">Price</th>
                <th className="py-1 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bill.items?.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-1 font-sans font-medium pr-1">{item.name}</td>
                  <td className="py-1 text-center font-bold">{item.qty}</td>
                  <td className="py-1 text-right">₹{item.price}</td>
                  <td className="py-1 text-right font-bold">₹{item.price * item.qty}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Calculations */}
          <div className="pt-2 border-t border-dashed border-slate-300 space-y-1 text-[11px]">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal</span>
              <span>₹{bill.subtotal?.toLocaleString('en-IN')}</span>
            </div>
            {bill.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-₹{bill.discount?.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-extrabold pt-1.5 border-t border-slate-400 text-slate-900">
              <span>GRAND TOTAL</span>
              <span>₹{bill.total?.toLocaleString('en-IN')}</span>
            </div>
            {bill.amountTendered && (
              <div className="flex justify-between text-slate-500 text-[10px] pt-1">
                <span>Tendered: ₹{bill.amountTendered}</span>
                <span>Change: ₹{bill.changeDue}</span>
              </div>
            )}
          </div>

          {/* Footer Note */}
          <div className="text-center pt-3 border-t border-dashed border-slate-300 text-[10px] text-slate-500 italic">
            <p>{settings.footerMessage}</p>
            <p className="mt-1 font-sans font-bold text-brand-primary">Powered by Tamilini Bakery POS</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-brand-primary hover:bg-brand-hover text-white font-bold text-xs rounded-xl shadow-purple-glow transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Print Thermal (80mm)</span>
          </button>
          <button
            onClick={onClose}
            className="flex items-center justify-center space-x-2 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all"
          >
            <PlusCircle className="w-4 h-4 text-brand-primary" />
            <span>Start New Sale</span>
          </button>
        </div>
      </div>
    </Modal>
  );
};
