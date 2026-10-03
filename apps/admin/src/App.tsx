import React, { useState } from 'react';
import LoginPage from './pages/LoginPage';
import DashboardOverview from './pages/DashboardOverview';
import NomineesManager from './pages/NomineesManager';
import TransactionsManager from './pages/TransactionsManager';
import SettingsManager from './pages/SettingsManager';
import { getAuthToken, removeAuthToken } from './services/api';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(Boolean(getAuthToken()));
  const [activeTab, setActiveTab] = useState<'dashboard' | 'nominees' | 'transactions' | 'settings'>('dashboard');

  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setIsAuthenticated(true)} />;
  }

  const handleLogout = () => {
    removeAuthToken();
    setIsAuthenticated(false);
  };

  return (
    <div className="min-h-screen bg-[#020F0A] text-emerald-50 flex font-sans selection:bg-[#007A4D] selection:text-white">
      {/* Sidebar */}
      <aside className="w-64 bg-[#051A10] border-r border-[#007A4D]/30 p-6 flex flex-col justify-between shrink-0 shadow-2xl relative z-10">
        <div className="space-y-8">
          {/* Logo & Brand Header */}
          <div className="flex items-center gap-3 border-b border-[#007A4D]/30 pb-5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#007A4D] to-[#054C31] text-[#EBF700] font-black flex items-center justify-center text-xl shadow-lg border border-[#EBF700]/30">
              A
            </div>
            <div>
              <div className="font-extrabold text-white leading-tight tracking-wide text-lg flex items-center gap-1.5">
                Awardly <span className="text-[10px] bg-[#EBF700] text-[#051A10] font-black px-1.5 py-0.5 rounded uppercase">PRO</span>
              </div>
              <div className="text-xs text-emerald-400/70">Admin Control Panel</div>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'dashboard'
                  ? 'bg-[#007A4D] text-white shadow-lg shadow-[#007A4D]/40 border border-[#EBF700]/40'
                  : 'text-emerald-200/70 hover:text-white hover:bg-[#007A4D]/20 border border-transparent'
              }`}
            >
              <span className="text-base">📊</span> Overview
            </button>

            <button
              onClick={() => setActiveTab('nominees')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'nominees'
                  ? 'bg-[#007A4D] text-white shadow-lg shadow-[#007A4D]/40 border border-[#EBF700]/40'
                  : 'text-emerald-200/70 hover:text-white hover:bg-[#007A4D]/20 border border-transparent'
              }`}
            >
              <span className="text-base">🏆</span> Nominees
            </button>

            <button
              onClick={() => setActiveTab('transactions')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'transactions'
                  ? 'bg-[#007A4D] text-white shadow-lg shadow-[#007A4D]/40 border border-[#EBF700]/40'
                  : 'text-emerald-200/70 hover:text-white hover:bg-[#007A4D]/20 border border-transparent'
              }`}
            >
              <span className="text-base">💳</span> Transactions
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-3 cursor-pointer ${
                activeTab === 'settings'
                  ? 'bg-[#007A4D] text-white shadow-lg shadow-[#007A4D]/40 border border-[#EBF700]/40'
                  : 'text-emerald-200/70 hover:text-white hover:bg-[#007A4D]/20 border border-transparent'
              }`}
            >
              <span className="text-base">⚙️</span> Frontend Settings
            </button>
          </nav>
        </div>

        {/* Footer Info & Logout */}
        <div className="space-y-4 pt-6 border-t border-[#007A4D]/30">
          <div className="bg-[#020F0A] p-3 rounded-xl border border-[#007A4D]/30 flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-[#EBF700] animate-ping"></div>
            <div className="text-[11px] text-emerald-300">
              <span className="font-semibold text-white block">System Status</span>
              API & DB Sync Active
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full bg-[#051A10] hover:bg-rose-950/40 hover:text-rose-300 text-emerald-300/80 font-bold py-2.5 rounded-xl text-sm transition-all border border-[#007A4D]/40 hover:border-rose-500/50 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>🚪</span> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col overflow-hidden bg-gradient-to-br from-[#020F0A] via-[#051A10] to-[#020F0A]">
        {/* Top Navbar */}
        <header className="bg-[#051A10]/80 backdrop-blur-md border-b border-[#007A4D]/30 px-8 py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs bg-[#007A4D]/30 text-[#EBF700] border border-[#007A4D] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider">
              Awardly Portal
            </span>
            <span className="text-xs text-emerald-400/60">• Live Admin Session</span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href="http://localhost:5173"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-bold text-[#EBF700] hover:underline flex items-center gap-1.5 bg-[#007A4D]/20 border border-[#007A4D] px-3 py-1.5 rounded-lg transition-all"
            >
              🌐 View Public Website ↗
            </a>
          </div>
        </header>

        {/* Scrollable Content View */}
        <main className="flex-1 p-8 overflow-y-auto">
          {activeTab === 'dashboard' && <DashboardOverview />}
          {activeTab === 'nominees' && <NomineesManager />}
          {activeTab === 'transactions' && <TransactionsManager />}
          {activeTab === 'settings' && <SettingsManager />}
        </main>
      </div>
    </div>
  );
}
