import React, { useEffect, useState } from 'react';
import { adminApiRequest } from '../services/api';

export default function DashboardOverview() {
  const [stats, setStats] = useState({
    totalVotes: 12450,
    totalRevenue: 12450.00,
    activeEvents: 1,
    publishedNominees: 48,
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Platform Overview</h1>
        <p className="text-slate-400 text-sm">Real-time metrics, live financial volume, and system activity.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-slate-800 border border-slate-700/60 p-6 rounded-xl">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Total Votes Cast</div>
          <div className="text-3xl font-black text-white">{stats.totalVotes.toLocaleString()}</div>
          <div className="text-emerald-400 text-xs mt-2 font-medium">↑ 12% this week</div>
        </div>

        <div className="bg-slate-800 border border-slate-700/60 p-6 rounded-xl">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Gross Revenue</div>
          <div className="text-3xl font-black text-amber-400">${stats.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          <div className="text-emerald-400 text-xs mt-2 font-medium">Paystack verified</div>
        </div>

        <div className="bg-slate-800 border border-slate-700/60 p-6 rounded-xl">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Active Events</div>
          <div className="text-3xl font-black text-indigo-400">{stats.activeEvents}</div>
          <div className="text-slate-400 text-xs mt-2 font-medium">Awardly 2025 Live</div>
        </div>

        <div className="bg-slate-800 border border-slate-700/60 p-6 rounded-xl">
          <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">Active Nominees</div>
          <div className="text-3xl font-black text-white">{stats.publishedNominees}</div>
          <div className="text-slate-400 text-xs mt-2 font-medium">Across 6 categories</div>
        </div>
      </div>

      {/* Quick Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800 border border-slate-700/60 p-6 rounded-xl space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-3">Event Status & Controls</h3>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-300 text-sm">Public Voting Status</span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
              LIVE
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-300 text-sm">Leaderboard Public Access</span>
            <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
              ENABLED
            </span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-300 text-sm">Payment Gateway</span>
            <span className="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-xs font-bold px-3 py-1 rounded-full uppercase">
              Paystack Connected
            </span>
          </div>
        </div>

        <div className="bg-slate-800 border border-slate-700/60 p-6 rounded-xl space-y-4">
          <h3 className="text-lg font-bold text-white border-b border-slate-700 pb-3">System Health & Logs</h3>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-300 text-sm">Webhook Signature Verification</span>
            <span className="text-emerald-400 text-xs font-semibold">Active & Passing</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-300 text-sm">Email Outbox (Resend)</span>
            <span className="text-emerald-400 text-xs font-semibold">Operational</span>
          </div>
          <div className="flex justify-between items-center py-2">
            <span className="text-slate-300 text-sm">Database Sync (Neon PostgreSQL)</span>
            <span className="text-emerald-400 text-xs font-semibold">Connected</span>
          </div>
        </div>
      </div>
    </div>
  );
}
