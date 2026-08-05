import React, { useState } from 'react';
import {
  Banknote,
  QrCode,
  CreditCard,
  Layers,
  Wallet,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { usePOS } from '../../context/POSContext';

export const PaymentModal = ({ isOpen, onClose, onPaymentSuccess }) => {
  const { grandTotal, completeCheckout, selectedCustomer } = usePOS();
  
  const [paymentMode, setPaymentMode] = useState('Cash'); // Cash | UPI | Card | Split | Wallet
  const [amountTendered, setAmountTendered] = useState(grandTotal);
  const [isProcessing, setIsProcessing] = useState(false);

  // Split payment state
  const [splitCash, setSplitCash] = useState(Math.round(grandTotal / 2));
  const [splitUpi, setSplitUpi] = useState(grandTotal - Math.round(grandTotal / 2));

  const changeDue = Math.max(0, amountTendered - grandTotal);

  const handleQuickCashAdd = (denom) => {
    setAmountTendered((prev) => Number(prev || 0) + denom);
  };

  const handleConfirmPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedBill = completeCheckout(paymentMode, amountTendered);
      if (generatedBill) {
        onPaymentSuccess(generatedBill);
      }
    }, 600);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Complete Checkout & Payment"
      icon={Sparkles}
      maxWidth="max-w-2xl"
    >
      <div className="space-y-5">
        {/* Payable Summary Header */}
        <div className="bg-gradient-to-br from-purple-900 to-brand-dark text-white p-5 rounded-2xl shadow-purple-glow flex items-center justify-between">
          <div>
            <p className="text-xs text-purple-300 uppercase tracking-wider font-semibold">Total Amount Payable</p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white mt-0.5">
              ₹{grandTotal.toLocaleString('en-IN')}
            </h2>
            {selectedCustomer && (
              <p className="text-xs text-purple-200 mt-1 flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                Customer: <span className="font-bold">{selectedCustomer.name}</span> ({selectedCustomer.tier} Tier)
              </p>
            )}
          </div>
          <div className="text-right">
            <span className="inline-block bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider border border-white/20">
              POS Terminal #01
            </span>
          </div>
        </div>

        {/* Payment Method Tabs */}
        <div>
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Select Payment Method
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'Cash', label: 'Cash', icon: Banknote },
              { id: 'UPI', label: 'UPI QR', icon: QrCode },
              { id: 'Card', label: 'Card', icon: CreditCard },
              { id: 'Split', label: 'Split', icon: Layers },
              { id: 'Wallet', label: 'Wallet', icon: Wallet },
            ].map((method) => {
              const Icon = method.icon;
              const isSelected = paymentMode === method.id;
              return (
                <button
                  key={method.id}
                  onClick={() => {
                    setPaymentMode(method.id);
                    if (method.id === 'Cash') setAmountTendered(grandTotal);
                  }}
                  className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-200 min-h-touch ${
                    isSelected
                      ? 'bg-brand-primary text-white border-brand-primary shadow-purple-glow font-bold scale-[1.02]'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-purple-300 hover:bg-brand-light'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-white' : 'text-brand-primary'}`} />
                  <span className="text-xs">{method.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Dynamic Payment Mode Body */}
        {paymentMode === 'Cash' && (
          <div className="bg-slate-50 border border-purple-100 p-4 rounded-2xl space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Cash Amount Received (₹)
                </label>
                <input
                  type="number"
                  value={amountTendered}
                  onChange={(e) => setAmountTendered(Number(e.target.value))}
                  className="w-full text-xl font-bold text-slate-900 px-3.5 py-2.5 bg-white border-2 border-purple-200 rounded-xl focus:border-brand-primary focus:outline-none"
                  placeholder="Enter cash amount"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Change Due to Customer
                </label>
                <div className={`text-xl font-extrabold px-3.5 py-2.5 rounded-xl border-2 ${
                  changeDue >= 0 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
                }`}>
                  ₹{changeDue.toLocaleString('en-IN')}
                </div>
              </div>
            </div>

            {/* Quick Tender Denomination Buttons */}
            <div>
              <span className="text-[11px] font-semibold text-slate-500 block mb-1.5">Quick Add Cash Notes:</span>
              <div className="flex flex-wrap gap-2">
                {[50, 100, 200, 500, 1000].map((denom) => (
                  <button
                    key={denom}
                    type="button"
                    onClick={() => handleQuickCashAdd(denom)}
                    className="px-3 py-1.5 bg-white border border-purple-200 rounded-xl text-xs font-bold text-brand-primary hover:bg-brand-primary hover:text-white transition-colors shadow-sm"
                  >
                    +₹{denom}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setAmountTendered(grandTotal)}
                  className="px-3 py-1.5 bg-purple-100 text-brand-primary rounded-xl text-xs font-bold hover:bg-purple-200"
                >
                  Exact Amount (₹{grandTotal})
                </button>
              </div>
            </div>
          </div>
        )}

        {paymentMode === 'UPI' && (
          <div className="bg-slate-50 border border-purple-100 p-5 rounded-2xl text-center space-y-3">
            <p className="text-xs font-bold text-slate-700">Scan QR using GPay, PhonePe, Paytm, BHIM</p>
            <div className="inline-block p-3 bg-white rounded-2xl shadow-md border border-purple-200">
              {/* Dynamic QR SVG */}
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=upi://pay?pa=tamilinibakery@upi%26pn=Tamilini%20Bakery%26am=${grandTotal}%26cu=INR`}
                alt="UPI Payment QR Code"
                className="w-44 h-44 mx-auto rounded-lg"
              />
            </div>
            <p className="text-xs text-purple-700 font-bold">UPI ID: tamilinibakery@upi</p>
            <p className="text-[11px] text-slate-500">Auto-detecting payment receipt...</p>
          </div>
        )}

        {paymentMode === 'Card' && (
          <div className="bg-slate-50 border border-purple-100 p-6 rounded-2xl text-center space-y-3">
            <CreditCard className="w-12 h-12 text-brand-primary mx-auto animate-pulse" />
            <h4 className="text-sm font-bold text-slate-800">Tap, Swipe, or Insert Card on POS Terminal</h4>
            <p className="text-xs text-slate-500">Supports Visa, MasterCard, RuPay, Amex</p>
            <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>POS Device Connected</span>
            </div>
          </div>
        )}

        {paymentMode === 'Split' && (
          <div className="bg-slate-50 border border-purple-100 p-4 rounded-2xl space-y-3">
            <p className="text-xs font-bold text-slate-700">Split Bill into Cash & UPI/Card</p>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Cash Portion (₹)</label>
                <input
                  type="number"
                  value={splitCash}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSplitCash(val);
                    setSplitUpi(Math.max(0, grandTotal - val));
                  }}
                  className="w-full text-sm font-bold p-2.5 border border-purple-200 rounded-xl bg-white"
                />
              </div>
              <div>
                <label className="text-xs text-slate-600 font-semibold block mb-1">Digital/UPI Portion (₹)</label>
                <input
                  type="number"
                  value={splitUpi}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setSplitUpi(val);
                    setSplitCash(Math.max(0, grandTotal - val));
                  }}
                  className="w-full text-sm font-bold p-2.5 border border-purple-200 rounded-xl bg-white"
                />
              </div>
            </div>
          </div>
        )}

        {paymentMode === 'Wallet' && (
          <div className="bg-slate-50 border border-purple-100 p-4 rounded-2xl text-center space-y-2">
            <Wallet className="w-10 h-10 text-brand-secondary mx-auto" />
            <p className="text-xs font-bold text-slate-800">Store Credit / Digital Wallet</p>
            <p className="text-xs text-slate-500">Customer point redemption / pre-paid card balance</p>
          </div>
        )}

        {/* Submit Checkout Button */}
        <button
          onClick={handleConfirmPayment}
          disabled={isProcessing}
          className="w-full py-3.5 px-4 bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent hover:from-brand-hover hover:to-brand-primary text-white font-extrabold text-base rounded-2xl shadow-purple-lg flex items-center justify-center space-x-2 transition-all duration-200 transform active:scale-95 disabled:opacity-50 min-h-touch"
        >
          {isProcessing ? (
            <span>Generating Invoice...</span>
          ) : (
            <>
              <span>Confirm & Generate Invoice (₹{grandTotal})</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </Modal>
  );
};
