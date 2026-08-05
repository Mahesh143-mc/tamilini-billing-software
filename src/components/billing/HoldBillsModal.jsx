import React from 'react';
import { PauseCircle, Play, Trash2, Clock, User } from 'lucide-react';
import { Modal } from '../common/Modal';
import { usePOS } from '../../context/POSContext';

export const HoldBillsModal = ({ isOpen, onClose }) => {
  const { heldBills, resumeHeldBill, deleteHeldBill } = usePOS();

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Suspended / Held Bills"
      icon={PauseCircle}
      maxWidth="max-w-lg"
    >
      {heldBills.length === 0 ? (
        <div className="py-10 text-center text-slate-400 space-y-2">
          <PauseCircle className="w-12 h-12 text-slate-300 mx-auto" />
          <p className="text-sm font-semibold text-slate-600">No Held Bills Found</p>
          <p className="text-xs text-slate-400">Bills placed on hold during checkout will appear here.</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-1">
          {heldBills.map((bill) => (
            <div
              key={bill.id}
              className="bg-slate-50 border border-purple-100 p-4 rounded-2xl flex items-center justify-between shadow-sm hover:border-brand-primary transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="bg-brand-light text-brand-primary font-bold text-xs px-2 py-0.5 rounded-lg border border-purple-200">
                    {bill.id}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {bill.timestamp}
                  </span>
                </div>
                <p className="text-xs font-bold text-slate-800 flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-brand-primary" />
                  {bill.customerName}
                </p>
                <p className="text-xs text-slate-500">
                  {bill.items?.length || 0} items • <span className="font-bold text-slate-900">₹{bill.grandTotal}</span>
                </p>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => {
                    resumeHeldBill(bill.id);
                    onClose();
                  }}
                  className="flex items-center space-x-1.5 px-3 py-2 bg-brand-primary hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-purple-glow transition-all min-h-touch"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Resume</span>
                </button>
                <button
                  onClick={() => deleteHeldBill(bill.id)}
                  className="p-2 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded-xl transition-colors min-h-touch min-w-touch flex items-center justify-center"
                  title="Discard"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </Modal>
  );
};
