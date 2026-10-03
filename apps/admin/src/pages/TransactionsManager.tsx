import React, { useState } from 'react';
import Swal from 'sweetalert2';

type Transaction = {
  id: string;
  ref: string;
  voter: string;
  email: string;
  votes: number;
  amountKobo: number;
  method: 'paystack' | 'manual';
  status: 'paid' | 'pending' | 'failed';
  date: string;
};

const STATUS_STYLES: Record<string, string> = {
  paid: 'bg-[#007A4D]/30 text-[#EBF700] border-[#007A4D]',
  pending: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  failed: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
};

const METHOD_STYLES: Record<string, string> = {
  paystack: 'bg-[#007A4D]/20 text-emerald-300 border border-[#007A4D]/40',
  manual: 'bg-[#EBF700]/10 text-[#EBF700] border border-[#EBF700]/30',
};

const SAMPLE_TRANSACTIONS: Transaction[] = [
  { id: '1', ref: 'VOTE_17410001', voter: 'John Doe', email: 'john@example.com', votes: 10, amountKobo: 100000, method: 'paystack', status: 'paid', date: '2025-10-02 14:22' },
  { id: '2', ref: 'VOTE_17410002', voter: 'Jane Smith', email: 'jane@example.com', votes: 50, amountKobo: 500000, method: 'paystack', status: 'paid', date: '2025-10-02 15:05' },
  { id: '3', ref: 'MANUAL_17410003', voter: 'Emeka Eze', email: 'emeka@example.com', votes: 20, amountKobo: 200000, method: 'manual', status: 'pending', date: '2025-10-02 15:40' },
  { id: '4', ref: 'VOTE_17410004', voter: 'Ngozi Adeyemi', email: 'ngozi@example.com', votes: 5, amountKobo: 50000, method: 'paystack', status: 'failed', date: '2025-10-02 16:11' },
];

function formatNaira(kobo: number) {
  return `₦${(kobo / 100).toLocaleString('en-NG', { minimumFractionDigits: 2 })}`;
}

export default function TransactionsManager() {
  const [transactions, setTransactions] = useState<Transaction[]>(SAMPLE_TRANSACTIONS);
  const [filter, setFilter] = useState<'all' | 'paid' | 'pending' | 'failed'>('all');

  const filtered = filter === 'all' ? transactions : transactions.filter(t => t.status === filter);

  const totalRevenue = transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.amountKobo, 0);
  const totalVotes = transactions.filter(t => t.status === 'paid').reduce((sum, t) => sum + t.votes, 0);
  const pendingCount = transactions.filter(t => t.status === 'pending').length;

  const handleApproveManual = (t: Transaction) => {
    Swal.fire({
      title: 'Approve Manual Transfer?',
      html: `<div style="text-align:left;font-size:13px;line-height:1.8">
        <b>Voter:</b> ${t.voter}<br>
        <b>Email:</b> ${t.email}<br>
        <b>Amount:</b> ${formatNaira(t.amountKobo)}<br>
        <b>Votes:</b> ${t.votes}
      </div>`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#007A4D',
      confirmButtonText: 'Approve & Allocate Votes',
      background: '#051A10',
      color: '#FFFFFF',
    }).then(res => {
      if (res.isConfirmed) {
        setTransactions(transactions.map(x => x.id === t.id ? { ...x, status: 'paid' } : x));
        Swal.fire({ icon: 'success', title: 'Approved!', text: `${t.votes} votes allocated to ${t.voter}.`, timer: 2000, showConfirmButton: false, background: '#051A10', color: '#FFFFFF' });
      }
    });
  };

  const handleReconcile = (ref: string) => {
    Swal.fire({
      title: 'Reconciling…',
      text: `Checking Paystack for status of ${ref}`,
      icon: 'info',
      timer: 2000,
      showConfirmButton: false,
      background: '#051A10',
      color: '#FFFFFF',
    });
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      <div className="border-b border-[#007A4D]/30 pb-5">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Payment Orders & Audit</h1>
        <p className="text-emerald-200/70 text-sm mt-1">Audit live transactions, approve manual bank transfers, and reconcile Paystack orders.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-[#051A10]/90 border border-[#007A4D]/40 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="text-xs font-bold text-emerald-300/70 uppercase tracking-wider mb-1">Total Revenue (Paid)</div>
          <div className="text-2xl font-black text-[#EBF700]">{formatNaira(totalRevenue)}</div>
        </div>
        <div className="bg-[#051A10]/90 border border-[#007A4D]/40 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="text-xs font-bold text-emerald-300/70 uppercase tracking-wider mb-1">Total Votes Allocated</div>
          <div className="text-2xl font-black text-white">{totalVotes.toLocaleString()}</div>
        </div>
        <div className="bg-[#051A10]/90 border border-[#007A4D]/40 rounded-2xl p-5 shadow-xl backdrop-blur-md">
          <div className="text-xs font-bold text-emerald-300/70 uppercase tracking-wider mb-1">Pending Approvals</div>
          <div className={`text-2xl font-black ${pendingCount > 0 ? 'text-[#EBF700]' : 'text-emerald-400/60'}`}>{pendingCount}</div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'paid', 'pending', 'failed'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
              filter === f
                ? 'bg-[#007A4D] text-white shadow-lg shadow-[#007A4D]/40 border border-[#EBF700]/40'
                : 'bg-[#051A10] text-emerald-300/70 hover:text-white border border-[#007A4D]/30'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bg-[#051A10]/90 border border-[#007A4D]/40 rounded-2xl overflow-x-auto shadow-2xl backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#020F0A] text-emerald-300/80 text-xs uppercase tracking-wider border-b border-[#007A4D]/40">
              <th className="py-4 px-6">Reference</th>
              <th className="py-4 px-6">Voter</th>
              <th className="py-4 px-6">Method</th>
              <th className="py-4 px-6 text-right">Votes</th>
              <th className="py-4 px-6 text-right">Amount</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Date</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#007A4D]/20 text-sm text-emerald-100">
            {filtered.map((t) => (
              <tr key={t.id} className="hover:bg-[#007A4D]/10 transition-colors">
                <td className="py-4 px-6 font-mono text-[#EBF700] text-xs font-bold">{t.ref}</td>
                <td className="py-4 px-6">
                  <div className="font-semibold text-white">{t.voter}</div>
                  <div className="text-emerald-300/60 text-xs">{t.email}</div>
                </td>
                <td className="py-4 px-6">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-bold ${METHOD_STYLES[t.method]}`}>
                    {t.method === 'paystack' ? 'Paystack' : 'Bank Transfer'}
                  </span>
                </td>
                <td className="py-4 px-6 text-right font-mono font-bold">{t.votes}</td>
                <td className="py-4 px-6 text-right font-mono font-black text-[#EBF700]">{formatNaira(t.amountKobo)}</td>
                <td className="py-4 px-6">
                  <span className={`border text-xs px-2.5 py-1 rounded-full font-bold uppercase ${STATUS_STYLES[t.status]}`}>
                    {t.status}
                  </span>
                </td>
                <td className="py-4 px-6 text-emerald-300/60 text-xs">{t.date}</td>
                <td className="py-4 px-6 text-right space-x-3">
                  {t.method === 'manual' && t.status === 'pending' ? (
                    <button onClick={() => handleApproveManual(t)} className="text-[#EBF700] hover:underline text-xs font-extrabold cursor-pointer">
                      Approve
                    </button>
                  ) : (
                    <button onClick={() => handleReconcile(t.ref)} className="text-emerald-300 hover:underline text-xs font-bold cursor-pointer">
                      Reconcile
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="text-center py-12 text-emerald-400/50">No transactions found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
