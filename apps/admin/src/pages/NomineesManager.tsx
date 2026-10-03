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
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApiRequest<any[]>('/api/admin/nominees')
      .then((data) => {
        if (Array.isArray(data)) {
          setNominees(
            data.map((n: any) => ({
              id: n.id,
              name: n.name,
              category: n.categoryName || 'General',
              code: n.code || 'NOM-001',
              votes: n.voteCount || 0,
              isPublished: n.isPublished ?? true,
            }))
          );
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  type FormState = { name: string; category: string; code: string; isPublished: boolean };

  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Nominee | null>(null);
  const [form, setForm] = useState<FormState>({ name: '', category: CATEGORIES[0]!, code: '', isPublished: true });
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setEditTarget(null);
    setForm({ name: '', category: CATEGORIES[0]!, code: '', isPublished: true });
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
      const saved = await adminApiRequest<any>('/api/admin/nominees', {
        method: editTarget ? 'PUT' : 'POST',
        body: JSON.stringify({ ...form, id: editTarget?.id }),
      });
      if (editTarget) {
        setNominees(nominees.map(n => n.id === editTarget.id ? { ...n, ...form } : n));
      } else {
        const newNominee: Nominee = {
          id: saved?.id || String(Date.now()),
          votes: 0,
          name: form.name,
          category: form.category,
          code: form.code || saved?.code || `NOM-${Math.floor(100 + Math.random() * 900)}`,
          isPublished: form.isPublished,
        };
        setNominees([...nominees, newNominee]);
      }
      setShowModal(false);
      Swal.fire({
        icon: 'success',
        title: editTarget ? 'Nominee Updated' : 'Nominee Added',
        timer: 1500,
        showConfirmButton: false,
        background: '#051A10',
        color: '#FFFFFF',
      });
    } catch {
      Swal.fire({
        icon: 'error',
        title: 'Save Failed',
        text: 'Could not save nominee. Please try again.',
        background: '#051A10',
        color: '#FFFFFF',
      });
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
      background: '#051A10',
      color: '#FFFFFF',
    }).then((res) => {
      if (res.isConfirmed) {
        setNominees(nominees.filter(n => n.id !== id));
        Swal.fire({ icon: 'success', title: 'Deleted!', text: `${name} has been removed.`, timer: 1500, showConfirmButton: false, background: '#051A10', color: '#FFFFFF' });
      }
    });
  };

  return (
    <div className="space-y-6 max-w-5xl pb-16">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#007A4D]/30 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Nominees Management</h1>
          <p className="text-emerald-200/70 text-sm mt-1">Create, edit, publish or archive event nominees across categories.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-[#EBF700] hover:bg-[#d4e200] text-[#051A10] font-black px-6 py-3 rounded-xl shadow-lg shadow-[#EBF700]/20 transition-all text-sm flex items-center justify-center gap-2 cursor-pointer"
        >
          + Add New Nominee
        </button>
      </div>

      <div className="bg-[#051A10]/90 border border-[#007A4D]/40 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-md">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#020F0A] text-emerald-300/80 text-xs uppercase tracking-wider border-b border-[#007A4D]/40">
              <th className="py-4 px-6">Code</th>
              <th className="py-4 px-6">Nominee Name</th>
              <th className="py-4 px-6">Category</th>
              <th className="py-4 px-6 text-right">Votes</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#007A4D]/20 text-sm text-emerald-100">
            {nominees.map((n) => (
              <tr key={n.id} className="hover:bg-[#007A4D]/10 transition-colors">
                <td className="py-4 px-6 font-mono text-[#EBF700] font-bold">{n.code}</td>
                <td className="py-4 px-6 font-semibold text-white">{n.name}</td>
                <td className="py-4 px-6 text-emerald-200/80">{n.category}</td>
                <td className="py-4 px-6 text-right font-mono font-black text-[#EBF700]">{n.votes.toLocaleString()}</td>
                <td className="py-4 px-6">
                  <button
                    onClick={() => handleTogglePublish(n)}
                    className={`text-xs px-3 py-1 rounded-full font-bold border transition-colors cursor-pointer ${
                      n.isPublished
                        ? 'bg-[#007A4D]/30 text-[#EBF700] border-[#007A4D] hover:bg-rose-950/40 hover:text-rose-400 hover:border-rose-500/40'
                        : 'bg-[#020F0A] text-emerald-400/60 border-[#007A4D]/40 hover:bg-[#007A4D]/30 hover:text-[#EBF700]'
                    }`}
                  >
                    {n.isPublished ? '✓ Published' : 'Draft'}
                  </button>
                </td>
                <td className="py-4 px-6 text-right space-x-3">
                  <button onClick={() => openEdit(n)} className="text-[#EBF700] hover:underline text-xs font-bold cursor-pointer">Edit</button>
                  <button onClick={() => handleDelete(n.id, n.name)} className="text-rose-400 hover:underline text-xs font-bold cursor-pointer">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Nominee Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="bg-[#051A10] border border-[#007A4D] rounded-3xl p-8 w-full max-w-lg shadow-2xl space-y-6">
            <h2 className="text-2xl font-extrabold text-white">{editTarget ? 'Edit Nominee' : 'Add New Nominee'}</h2>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-200 uppercase mb-1.5">Full Name</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Sarah Okonkwo"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-200 uppercase mb-1.5">Category</label>
                <select
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700]"
                >
                  {CATEGORIES.map(c => <option key={c} value={c} className="bg-[#051A10]">{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-emerald-200 uppercase mb-1.5">Nominee Code</label>
                <input
                  required
                  type="text"
                  placeholder="e.g. NOM-005"
                  value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white font-mono focus:outline-none focus:border-[#EBF700]"
                />
              </div>
              <div className="flex items-center gap-3 pt-1">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={form.isPublished}
                  onChange={e => setForm({ ...form, isPublished: e.target.checked })}
                  className="w-4 h-4 accent-[#007A4D] cursor-pointer"
                />
                <label htmlFor="isPublished" className="text-sm text-emerald-200 cursor-pointer">Publish immediately to live public vote</label>
              </div>
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-[#020F0A] hover:bg-[#007A4D]/20 text-emerald-200 font-bold py-3 rounded-xl transition-colors border border-[#007A4D]/40">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 bg-[#EBF700] hover:bg-[#d4e200] text-[#051A10] font-black py-3 rounded-xl transition-colors disabled:opacity-50">
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
