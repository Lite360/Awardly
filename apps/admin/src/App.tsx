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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-600 font-bold text-white flex items-center justify-center text-lg">
              A
            </div>
            <div>
              <div className="font-bold text-white leading-tight">Awardly Admin</div>
              <div className="text-xs text-slate-400">Control Panel</div>
            </div>
          </div>

          <nav className="space-y-1.5">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              📊 Overview
            </button>
            <button
              onClick={() => setActiveTab('nominees')}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                activeTab === 'nominees'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              🏆 Nominees
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              💳 Transactions
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left px-4 py-3 rounded-xl font-semibold text-sm transition-colors ${
                activeTab === 'settings'
                  ? 'bg-indigo-600 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              ⚙️ Settings
            </button>
          </nav>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-slate-800 hover:bg-red-500/20 hover:text-red-400 text-slate-400 font-semibold py-2.5 rounded-lg text-sm transition-colors border border-slate-700/60"
        >
          Sign Out
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        {activeTab === 'dashboard' && <DashboardOverview />}
        {activeTab === 'nominees' && <NomineesManager />}
        {activeTab === 'transactions' && <TransactionsManager />}
        {activeTab === 'settings' && <SettingsManager />}
      </main>
    </div>
  );
}
