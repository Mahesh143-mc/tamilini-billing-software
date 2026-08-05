import React, { useState } from 'react';
import { Users, Search, Award, Phone, Gift, Plus, Star } from 'lucide-react';
import { usePOS } from '../context/POSContext';
import { Modal } from '../components/common/Modal';

export const Customers = () => {
  const { customers, addCustomer } = usePOS();
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCust, setNewCust] = useState({ name: '', phone: '', email: '', birthday: '' });

  const filtered = customers.filter(
    (c) => c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.phone.includes(searchQuery)
  );

  const handleAdd = (e) => {
    e.preventDefault();
    addCustomer(newCust);
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-8 px-3 py-3 lg:px-6">
      {/* Header */}
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-brand-primary" />
            <span>Customer Directory & Loyalty Rewards</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium">{customers.length} registered bakery patrons</p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto py-2.5 px-4 bg-brand-primary hover:bg-brand-hover text-white text-xs sm:text-sm font-bold rounded-2xl shadow-purple-glow flex items-center justify-center space-x-2 min-h-touch"
        >
          <Plus className="w-4 h-4" />
          <span>Register New Customer</span>
        </button>
      </div>

      {/* Customer Directory Table */}
      <div className="bg-white rounded-3xl border border-purple-100 shadow-soft overflow-x-auto">
        <div className="p-4 border-b border-purple-100">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search customer by name or phone..."
            className="w-full sm:w-80 p-2.5 bg-slate-50 border border-purple-200 rounded-xl text-sm font-medium"
          />
        </div>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-purple-50/70 text-slate-700 uppercase text-xs font-extrabold border-b border-purple-100">
              <th className="py-3.5 px-4">Customer Name</th>
              <th className="py-3.5 px-4">Phone</th>
              <th className="py-3.5 px-4">Tier Status</th>
              <th className="py-3.5 px-4">Loyalty Points</th>
              <th className="py-3.5 px-4">Total Spent</th>
              <th className="py-3.5 px-4">Last Visit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-bold">
            {filtered.map((c) => (
              <tr key={c.id} className="hover:bg-purple-50/40 transition-colors">
                <td className="py-3.5 px-4 font-black text-slate-900 text-sm sm:text-base">{c.name}</td>
                <td className="py-3.5 px-4 text-slate-700">{c.phone}</td>
                <td className="py-3.5 px-4">
                  <span className="bg-amber-100 text-amber-900 border border-amber-300 font-extrabold px-3 py-1 rounded-full text-xs">
                    {c.tier} Member
                  </span>
                </td>
                <td className="py-3.5 px-4 font-black text-brand-primary text-base">{c.points} pts</td>
                <td className="py-3.5 px-4 font-black text-slate-900 text-base">₹{c.totalSpent?.toLocaleString()}</td>
                <td className="py-3.5 px-4 text-slate-600">{c.lastVisit || 'Today'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register Customer" icon={Users}>
        <form onSubmit={handleAdd} className="space-y-3">
          <input
            type="text"
            required
            placeholder="Full Name"
            value={newCust.name}
            onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
            className="w-full p-2.5 border rounded-xl text-xs"
          />
          <input
            type="tel"
            required
            placeholder="Phone Number"
            value={newCust.phone}
            onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
            className="w-full p-2.5 border rounded-xl text-xs"
          />
          <button type="submit" className="w-full py-3 bg-brand-primary text-white font-bold rounded-xl">
            Save Customer
          </button>
        </form>
      </Modal>
    </div>
  );
};
