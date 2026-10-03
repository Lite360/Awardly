import React, { useState } from 'react';
import Swal from 'sweetalert2';
import { adminApiRequest } from '../services/api';

type Nominee = {
  id: string;
  name: string;
  category: string;
  code: string;
  votes: number;
  isPublished: boolean;
};

const CATEGORIES = [
  'Artist of the Year',
  'Entrepreneur of the Year',
  'Innovator of the Year',
  'Young Leader of the Year',
  'Humanitarian of the Year',
  'Music Icon of the Year',
];

export default function NomineesManager() {
  const [nominees, setNominees] = useState<Nominee[]>([
    { id: '1', name: 'Sarah Okonkwo', category: 'Artist of the Year', code: 'NOM-001', votes: 4280, isPublished: true },
    { id: '2', name: 'James Adewale', category: 'Entrepreneur of the Year', code: 'NOM-002', votes: 3120, isPublished: true },
    { id: '3', name: 'Amara Osei', category: 'Innovator of the Year', code: 'NOM-003', votes: 2890, isPublished: true },
    { id: '4', name: 'Kemi Johnson', category: 'Young Leader of the Year', code: 'NOM-004', votes: 2160, isPublished: true },
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Nominee | null>(null);
  const [form, setForm] = useState({ name: '', category: CATEGORIES[0] as string, code: '', isPublished: true });
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditTarget(null);
    setForm({ name: '', category: CATEGORIES[0], code: '', isPublished: true });
    setShowModal(true);
  };

  const openEdit = (n: Nominee) => {
    setEditTarget(n);
    setForm({ name: n.name, category: n.category, code: n.code, isPublished: n.isPublished });
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApiRequest('/nominees', { method: editTarget ? 'PUT' : 'POST', body: JSON.stringify({ ...form, id: editTarget?.id }) });
      if (editTarget) {
        setNominees(nominees.map(n => n.id === editTarget.id ? { ...n, ...form } : n));
      } else {
        const newNominee: Nominee = { id: String(Date.now()), votes: 0, ...form };
        setNominees([...nominees, newNominee]);
      }
      setShowModal(false);
      Swal.fire({ icon: 'success', title: editTarget ? 'Nominee Updated' : 'Nominee Added', timer: 1500, showConfirmButton: false });
    } catch {
      Swal.fire({ icon: 'error', title: 'Save Failed', text: 'Could not save nominee. Please try again.' });
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePublish = (n: Nominee) => {
    setNominees(nominees.map(x => x.id === n.id ? { ...x, isPublished: !x.isPublished } : x));
  };

  const handleDelete = (id: string, name: string) => {
    Swal.fire({
      title: 'Delete Nominee?',
      text: `Are you sure you want to remove ${name}? This action cannot be undone.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      confirmButtonText: 'Yes, Delete',
      background: '#1e293b',
      color: '#f1f5f9',
    }).then((res) => {
      if (res.isConfirmed) {
        setNominees(nominees.filter(n => n.id !== id));
        Swal.fire({ icon: 'success', title: 'Deleted!', text: `${name} has been removed.`, timer: 1500, showConfirmButton: false });
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-white">Nominees Management</h1>
          <p className="text-slate-400 text-sm">Create, edit, publish or archive event nominees.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-colors"
        >
          + Add New Nominee
        </button>
      </div>

      <div className="bg-slate-800 border border-slate-700/60 rounded-xl overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/60 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-700">
              <th className="py-4 px-6">Code</th>
              <th className="py-4 px-6">Nominee Name</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6 text-right">Votes</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-700/60 text-sm text-slate-200">
            {nominees.map((n) => (
              <tr key={n.id} className="hover:bg-slate-700/30 transition-colors">
                <td className="py-4 px-6 font-mono text-indigo-400">{n.code}</td>
                <td className="py-4 px-6 font-semibold text-white">{n.name}</td>
                <td className="py-4 px-6 text-slate-300">{n.category}</td>
                <td className="py-4 px-6 text-right font-mono font-bold text-amber-400">{n.votes.toLocaleString()}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => handleTogglePublish(n)}
                    className={`text-xs px-2.5 py-1 rounded-full font-bold border transition-colors ${
                      n.isPublished
                        ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 hover:bg-red-500/20 hover:text-red-400 hover:border-red-500/30'
                        : 'bg-slate-700/40 text-slate-400 border-slate-600 hover:bg-emerald-500/20 hover:text-emerald-400 hover:border-emerald-500/30'
                    }`}
                  >
                    {n.isPublished ? 'Published' : 'Draft'}
                  </button>
                </td>
                <td className="py-4 px-6 text-right space-x-3">
                  <button onClick={() => openEdit(n)} className="text-indigo-400 hover:underline text-xs font-semibold">Edit</button>
                  <button onClick={() => handleDelete(n.id, n.name)} className="text-red-400 hover:underline text-xs font-semibold">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Nominee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-8 w-full max-w-lg shadow-2xl">
            <h2 className="text-xl font-bold text-white mb-6">{editTarget ? 'Edit Nominee' : 'Add New Nominee'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sarah Okonkwo"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-indigo-500"
                >
                  {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-400 uppercase mb-1.5">Nominee Code</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. NOM-005"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2.5 text-white font-mono focus:outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-indigo-600"
                />
                <label htmlFor="isPublished" className="text-sm text-slate-300">Publish immediately</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold py-2.5 rounded-lg transition-colors">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2.5 rounded-lg transition-colors disabled:opacity-50">
                  {saving ? 'Saving…' : editTarget ? 'Save Changes' : 'Add Nominee'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
