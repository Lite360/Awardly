import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function SettingsManager() {
  const [settings, setSettings] = useState({
    name: 'Awardly',
    tagline: 'Celebrating Excellence. Your Vote Matters.',
    votePrice: 100,
    currency: 'NGN',
    votingMode: 'paid',
    contactEmail: 'support@awardly.com',
    heroTitle: 'Celebrating Talent, Impact, and Excellence',
    heroSubtitle: 'Awardly is a prestigious recognition program honoring gifted people, rising talents, and impactful changemakers who inspire communities across Africa.',
    tickerText: '🔔 AWARDLY AWARDS 2026 — NOMINATIONS & VOTING NOW OPEN',
    manualBankName: 'Guaranty Trust Bank (GTB)',
    manualAccountNumber: '0123456789',
    manualAccountName: 'Awardly Official',
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
    <div className="space-y-6 max-w-4xl pb-12">
      <div>
        <h1 className="text-3xl font-bold text-white">Platform Settings</h1>
        <p className="text-slate-400 text-sm">Configure event branding, vote pricing, frontend display, and manual payment details.</p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* General Settings */}
        <div className="bg-slate-800 border border-slate-700/60 p-8 rounded-xl space-y-6">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">General Config</h2>
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
              <label className="block text-xs uppercase font-semibold text-slate-300 mb-2">Default Vote Price (₦)</label>
              <input
                type="number"
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
        </div>

        {/* Frontend Display Settings */}
        <div className="bg-slate-800 border border-slate-700/60 p-8 rounded-xl space-y-6">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Frontend Display Content</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase font-semibold text-slate-300 mb-2">Hero Title</label>
              <input
                type="text"
                value={settings.heroTitle}
                onChange={(e) => setSettings({ ...settings, heroTitle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-semibold text-slate-300 mb-2">Hero Subtitle</label>
              <textarea
                rows={3}
                value={settings.heroSubtitle}
                onChange={(e) => setSettings({ ...settings, heroSubtitle: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500 resize-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-semibold text-slate-300 mb-2">Notification Ticker Text</label>
              <input
                type="text"
                value={settings.tickerText}
                onChange={(e) => setSettings({ ...settings, tickerText: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Manual Bank Transfer Settings */}
        <div className="bg-slate-800 border border-slate-700/60 p-8 rounded-xl space-y-6">
          <h2 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Bank Transfer Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase font-semibold text-slate-300 mb-2">Bank Name</label>
              <input
                type="text"
                value={settings.manualBankName}
                onChange={(e) => setSettings({ ...settings, manualBankName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <label className="block text-xs uppercase font-semibold text-slate-300 mb-2">Account Number</label>
              <input
                type="text"
                value={settings.manualAccountNumber}
                onChange={(e) => setSettings({ ...settings, manualAccountNumber: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs uppercase font-semibold text-slate-300 mb-2">Account Name</label>
              <input
                type="text"
                value={settings.manualAccountName}
                onChange={(e) => setSettings({ ...settings, manualAccountName: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4 sticky bottom-4">
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-lg shadow-lg transition-colors"
          >
            Save Configuration
          </button>
        </div>
      </form>
    </div>
  );
}
