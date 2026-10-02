import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    name: 'Awardly 2025',
    tagline: 'Celebrating Excellence. Your Vote Matters.',
    votePrice: 1.00,
    currency: 'USD',
    votingMode: 'paid',
    contactEmail: 'support@awardly.com',
  });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    Swal.fire({
      icon: 'success',
      title: 'Settings Saved',
      text: 'Platform configuration updated successfully.',
      confirmButtonColor: '#6366F1',
    });
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
        <p className="text-slate-400 text-sm">Configure event branding, vote pricing, and contact details.</p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-800 border border-slate-700/60 p-8 rounded-xl space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-xs uppercase font-semibold text-slate-300 mb-2">Platform Name</label>
            <input
              type="text"
              value={settings.name}
              onChange={(e) => setSettings({ ...settings, name: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-300 mb-2">Tagline</label>
            <input
              type="text"
              value={settings.tagline}
              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-300 mb-2">Default Vote Price ($)</label>
            <input
              type="number"
              step="0.01"
              value={settings.votePrice}
              onChange={(e) => setSettings({ ...settings, votePrice: parseFloat(e.target.value) })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs uppercase font-semibold text-slate-300 mb-2">Voting Mode</label>
            <select
              value={settings.votingMode}
              onChange={(e) => setSettings({ ...settings, votingMode: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            >
              <option value="paid">Paid Voting Enabled</option>
              <option value="free">Free Voting</option>
              <option value="disabled">Voting Disabled / Closed</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t border-slate-700 flex justify-end">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
