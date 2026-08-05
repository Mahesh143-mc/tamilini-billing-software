import React, { useState } from 'react';
import { Users, Search, UserPlus, Phone, Star, ShieldCheck, Check, Sparkles } from 'lucide-react';
import { Modal } from '../common/Modal';
import { usePOS } from '../../context/POSContext';

export const CustomerSelectModal = ({ isOpen, onClose }) => {
  const { customers, selectedCustomer, setSelectedCustomer, addCustomer } = usePOS();
  const [activeTab, setActiveTab] = useState('select'); // select | create
  const [searchQuery, setSearchQuery] = useState('');

  // New Customer Form State
  const [newCust, setNewCust] = useState({ name: '', phone: '', email: '', birthday: '' });

  const filteredCustomers = customers.filter(
    (c) =>
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.includes(searchQuery)
  );

  const handleCreateCustomer = (e) => {
    e.preventDefault();
    if (!newCust.name || !newCust.phone) return;
    addCustomer(newCust);
    setNewCust({ name: '', phone: '', email: '', birthday: '' });
    onClose();
  };

  const getTierBadgeStyle = (tier) => {
    switch (tier?.toLowerCase()) {
      case 'platinum':
        return 'bg-purple-100 text-purple-900 border-purple-300';
      case 'gold':
        return 'bg-amber-100 text-amber-900 border-amber-300';
      case 'silver':
        return 'bg-slate-100 text-slate-800 border-slate-300';
      case 'bronze':
        return 'bg-orange-100 text-orange-900 border-orange-300';
      default:
        return 'bg-purple-50 text-brand-primary border-purple-200';
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Attach Customer to Bill"
      icon={Users}
      maxWidth="max-w-xl"
    >
      <div className="space-y-4">
        {/* Navigation Tabs */}
        <div className="flex bg-slate-100 p-1.5 rounded-2xl border border-purple-100">
          <button
            onClick={() => setActiveTab('select')}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-black rounded-xl transition-all ${
              activeTab === 'select'
                ? 'bg-brand-primary text-white shadow-purple-glow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Select Existing Customer
          </button>
          <button
            onClick={() => setActiveTab('create')}
            className={`flex-1 py-2.5 px-3 text-xs sm:text-sm font-black rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
              activeTab === 'create'
                ? 'bg-brand-primary text-white shadow-purple-glow'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserPlus className="w-4 h-4" />
            <span>+ New Registration</span>
          </button>
        </div>

        {activeTab === 'select' ? (
          <div className="space-y-3.5">
            {/* Search Bar */}
            <div className="relative">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name or phone..."
                className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-purple-200 rounded-2xl text-sm sm:text-base font-bold text-slate-800 focus:border-brand-primary focus:bg-white focus:outline-none transition-all placeholder:text-slate-400 placeholder:font-medium"
              />
            </div>

            {/* Customer List */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 scrollbar-thin">
              {filteredCustomers.length === 0 ? (
                <div className="py-8 text-center text-slate-400">
                  <p className="text-sm font-bold">No customers found</p>
                  <p className="text-xs">Try searching with a different name or phone number.</p>
                </div>
              ) : (
                filteredCustomers.map((cust) => {
                  const isSelected = selectedCustomer?.id === cust.id;
                  return (
                    <div
                      key={cust.id}
                      onClick={() => {
                        setSelectedCustomer(cust);
                        onClose();
                      }}
                      className={`p-3.5 sm:p-4 rounded-2xl border cursor-pointer transition-all flex items-center justify-between hover:scale-[1.005] ${
                        isSelected
                          ? 'bg-purple-50/90 border-brand-primary ring-2 ring-brand-primary/30 shadow-sm'
                          : 'bg-white border-purple-100 hover:border-purple-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2.5">
                          <p className="text-sm sm:text-base font-black text-slate-900">{cust.name}</p>
                          <span className={`text-xs font-black px-2.5 py-0.5 rounded-lg border ${getTierBadgeStyle(cust.tier)}`}>
                            {cust.tier} Tier
                          </span>
                        </div>
                        <p className="text-xs sm:text-sm font-extrabold text-slate-600 flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                          <span>{cust.phone}</span>
                          <span className="text-slate-300">•</span>
                          <span className="text-amber-600 font-black flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                            {cust.points} pts
                          </span>
                        </p>
                      </div>

                      {isSelected ? (
                        <div className="w-7 h-7 rounded-full bg-brand-primary text-white flex items-center justify-center shadow-purple-glow shrink-0">
                          <Check className="w-4 h-4 stroke-[3]" />
                        </div>
                      ) : (
                        <span className="text-xs font-extrabold text-brand-primary hover:underline shrink-0">
                          Select →
                        </span>
                      )}
                    </div>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <form onSubmit={handleCreateCustomer} className="space-y-3.5 pt-1">
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">Full Name *</label>
              <input
                type="text"
                required
                value={newCust.name}
                onChange={(e) => setNewCust({ ...newCust, name: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                className="w-full p-3 bg-slate-50 border border-purple-200 rounded-xl text-sm sm:text-base font-bold text-slate-800 focus:border-brand-primary focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                value={newCust.phone}
                onChange={(e) => setNewCust({ ...newCust, phone: e.target.value })}
                placeholder="10-digit mobile number"
                className="w-full p-3 bg-slate-50 border border-purple-200 rounded-xl text-sm sm:text-base font-bold text-slate-800 focus:border-brand-primary focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-bold text-slate-800 mb-1">Email Address</label>
              <input
                type="email"
                value={newCust.email}
                onChange={(e) => setNewCust({ ...newCust, email: e.target.value })}
                placeholder="optional@gmail.com"
                className="w-full p-3 bg-slate-50 border border-purple-200 rounded-xl text-sm sm:text-base font-bold text-slate-800 focus:border-brand-primary focus:bg-white focus:outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 bg-brand-primary hover:bg-brand-hover text-white font-black text-sm sm:text-base rounded-xl shadow-purple-glow transition-all active:scale-[0.98] mt-2"
            >
              Register & Attach Customer
            </button>
          </form>
        )}
      </div>
    </Modal>
  );
};
