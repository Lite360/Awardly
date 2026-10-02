import React, { useState } from 'react';
import Swal from 'sweetalert2';

export default function TransactionsManager() {
  const [transactions] = useState([
    { id: '1', ref: 'VOTE_17410001', voter: 'John Doe', email: 'john@example.com', votes: 10, amount: 10.00, status: 'paid', date: '2025-03-10 14:22' },
    { id: '2', ref: 'VOTE_17410002', voter: 'Jane Smith', email: 'jane@example.com', votes: 50, amount: 50.00, status: 'paid', date: '2025-03-10 15:05' },
    { id: '3', ref: 'VOTE_17410003', voter: 'Anonymous', email: 'voter3@example.com', votes: 5, amount: 5.00, status: 'paid', date: '2025-03-10 15:40' },
  ]);

  const handleReconcile = (ref: string) => {
    Swal.fire('Reconciling Paystack Ref', `Verifying status for transaction ${ref}...`, 'info');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Payment Orders & Webhooks</h1>
          <p className="text-slate-400 text-sm">Audit live transactions, view webhook logs, and manually reconcile orders.</p>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
              <th className="py-4 px-6">Paystack Reference</th>
              <th className="py-4 px-6">Voter</th>
              <th className="py-4 px-6 text-right">Votes</th>
              <th className="py-4 px-6 text-right">Amount ($)</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60 text-sm text-slate-200">
            {transactions.map((t) => (
              <tr key={t.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="py-4 px-6 font-mono text-indigo-400">{t.ref}</td>
                <td className="py-4 px-6">
                  <div className="font-semibold text-white">{t.voter}</div>
                  <div className="text-slate-400 text-xs">{t.email}</div>
                </td>
                <td className="py-4 px-6 text-right font-mono font-bold">{t.votes}</td>
                <td className="py-4 px-6 text-right font-mono font-bold text-amber-400">${t.amount.toFixed(2)}</td>
                <td className="py-4 px-6">
                  <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs px-2.5 py-1 rounded-full font-bold uppercase">
                    {t.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-slate-400 text-xs">{t.date}</td>
                <td className="py-4 px-6 text-right">
                  <button onClick={() => handleReconcile(t.ref)} className="text-indigo-400 hover:underline text-xs font-semibold">
                    Reconcile
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
