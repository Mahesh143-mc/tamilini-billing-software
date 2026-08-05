import React, { useState } from 'react';
import { DollarSign, Plus, Calendar, Tag } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { Modal } from '../components/common/Modal';

export const Expenses = () => {
  const { expenses, addExpense } = usePOS();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    category: 'Ingredients',
    amount: '',
    paymentMode: 'Cash',
    notes: ''
  });

  const totalExpense = expenses.reduce((acc, e) => acc + Number(e.amount || 0), 0);

  const handleSubmit = (e) => {
    e.preventDefault();
    addExpense({ ...formData, amount: Number(formData.amount) });
    setFormData({ title: '', category: 'Ingredients', amount: '', paymentMode: 'Cash', notes: '' });
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-8 px-3 py-3 lg:px-6">
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-rose-600" />
            <span>Daily Store Expenses</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">Log ingredient purchases, packaging, electricity bills, and maintenance.</p>
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <div className="text-right hidden sm:block">
            <span className="text-xs text-slate-500 font-extrabold uppercase block">Total Expenses</span>
            <span className="text-lg font-black text-rose-600">₹{totalExpense.toLocaleString('en-IN')}</span>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto py-2.5 px-4 bg-rose-600 hover:bg-rose-700 text-white text-xs sm:text-sm font-bold rounded-2xl shadow-sm flex items-center justify-center space-x-2 min-h-touch"
          >
            <Plus className="w-4 h-4" />
            <span>Log New Expense</span>
          </button>
        </div>
      </div>

      {/* Expense List */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-soft overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-purple-50/70 text-slate-700 uppercase text-xs font-extrabold border-b border-purple-100">
              <th className="py-3.5 px-4">Expense Description</th>
              <th className="py-3.5 px-4">Category</th>
              <th className="py-3.5 px-4">Date</th>
              <th className="py-3.5 px-4">Payment Mode</th>
              <th className="py-3.5 px-4 text-right">Amount</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold">
            {expenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-purple-50/40 transition-colors">
                <td className="py-3.5 px-4">
                  <p className="font-extrabold text-slate-900 text-sm sm:text-base">{exp.title}</p>
                  {exp.notes && <p className="text-xs text-slate-500 font-medium">{exp.notes}</p>}
                </td>
                <td className="py-3.5 px-4">
                  <span className="bg-purple-100 text-brand-primary text-xs font-extrabold px-3 py-1 rounded-full">
                    {exp.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-slate-700">{exp.date}</td>
                <td className="py-3.5 px-4 text-slate-700">{exp.paymentMode}</td>
                <td className="py-3.5 px-4 text-right font-black text-rose-600 text-base">
                  ₹{exp.amount?.toLocaleString('en-IN')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Log New Store Expense" icon={DollarSign}>
        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            required
            placeholder="Expense Title (e.g. Milk 50L)"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="w-full p-2.5 border rounded-xl text-xs"
          />
          <div className="grid grid-cols-2 gap-2">
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="p-2.5 border rounded-xl text-xs font-bold"
            >
              <option value="Ingredients">Ingredients</option>
              <option value="Packaging">Packaging</option>
              <option value="Utilities">Utilities</option>
              <option value="Maintenance">Maintenance</option>
            </select>
            <input
              type="number"
              required
              placeholder="Amount (₹)"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="p-2.5 border rounded-xl text-xs font-bold"
            />
          </div>
          <button type="submit" className="w-full py-3 bg-rose-600 text-white font-bold rounded-xl">
            Save Expense Record
          </button>
        </form>
      </Modal>
    </div>
  );
};
