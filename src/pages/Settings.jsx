import React, { useState } from 'react';
import { Settings as SettingsIcon, Store, Printer, Percent, ShieldCheck, Database, Save } from 'lucide-react';
import { usePOS } from '../context/POSContext';

export const Settings = () => {
  const { settings, updateSettings, showToast } = usePOS();
  const [formData, setFormData] = useState({ ...settings });

  const handleSave = (e) => {
    e.preventDefault();
    updateSettings(formData);
  };

  const handleBackup = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(formData));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `tamilini_pos_backup_${new Date().toISOString().split('T')[0]}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('Downloaded JSON Backup File!', 'success');
  };

  return (
    <div className="space-y-6 pb-24 lg:pb-8 px-3 py-3 lg:px-6">
      <div className="bg-white p-4 rounded-3xl shadow-sm border border-purple-100 flex items-center justify-between">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
            <SettingsIcon className="w-6 h-6 text-brand-primary" />
            <span>Shop & System Configuration</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 font-medium mt-0.5">Configure receipt headers, GSTIN, thermal printer, and backup data.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-5">
        {/* Store Details Card */}
        <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-soft space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-purple-100 pb-2.5">
            <Store className="w-5 h-5 text-brand-primary" />
            <span>Bakery Profile & Header Info</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Shop Name</label>
              <input
                type="text"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-purple-200 rounded-xl font-extrabold text-slate-900 text-sm sm:text-base"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Tagline</label>
              <input
                type="text"
                value={formData.tagline}
                onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-purple-200 rounded-xl font-medium text-slate-800 text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">GSTIN Number</label>
              <input
                type="text"
                value={formData.gstin}
                onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-purple-200 rounded-xl font-mono font-bold text-slate-900 text-sm"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Phone Contact</label>
              <input
                type="text"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-purple-200 rounded-xl font-medium text-slate-800 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs sm:text-sm font-bold text-slate-700 mb-1">Store Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="w-full p-3 bg-slate-50 border border-purple-200 rounded-xl text-sm font-medium text-slate-800"
            />
          </div>
        </div>

        {/* Printer & Receipt Setup */}
        <div className="bg-white p-5 rounded-3xl border border-purple-100 shadow-soft space-y-4">
          <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2 border-b border-purple-100 pb-2.5">
            <Printer className="w-5 h-5 text-brand-primary" />
            <span>Thermal Printer & Receipt Configuration</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs sm:text-sm">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Printer Paper Size</label>
              <select
                value={formData.printerType}
                onChange={(e) => setFormData({ ...formData, printerType: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-purple-200 rounded-xl font-bold text-sm text-slate-900"
              >
                <option value="Thermal 80mm (3 Inch)">Thermal 80mm (3 Inch)</option>
                <option value="Thermal 58mm (2 Inch)">Thermal 58mm (2 Inch)</option>
                <option value="A4 Sheet Standard">A4 Sheet Standard</option>
              </select>
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Receipt Footer Message</label>
              <input
                type="text"
                value={formData.footerMessage}
                onChange={(e) => setFormData({ ...formData, footerMessage: e.target.value })}
                className="w-full p-3 bg-slate-50 border border-purple-200 rounded-xl font-medium text-sm text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={handleBackup}
            className="w-full sm:w-auto px-5 py-3.5 bg-purple-100 text-brand-primary font-extrabold text-xs sm:text-sm rounded-2xl hover:bg-purple-200 flex items-center justify-center space-x-2"
          >
            <Database className="w-4.5 h-4.5" />
            <span>Download JSON Data Backup</span>
          </button>

          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3.5 bg-gradient-to-r from-brand-primary to-brand-secondary text-white font-black text-xs sm:text-sm rounded-2xl shadow-purple-glow flex items-center justify-center space-x-2 min-h-touch"
          >
            <Save className="w-4.5 h-4.5" />
            <span>Save Store Configuration</span>
          </button>
        </div>
      </form>
    </div>
  );
};
