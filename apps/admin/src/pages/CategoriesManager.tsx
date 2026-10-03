import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { adminApiRequest } from '../services/api';

type Category = {
  id: string;
  name: string;
  description: string | null;
  displayOrder: number;
  isPublished: boolean;
};

export default function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editTarget, setEditTarget] = useState<Category | null>(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);

  const loadCategories = async () => {
    setLoading(true);
    try {
      const data = await adminApiRequest<Category[]>('/api/admin/categories');
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch {
      // Fallback
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const openAdd = () => {
    setEditTarget(null);
    setName('');
    setDescription('');
    setShowModal(true);
  };

  const openEdit = (cat: Category) => {
    setEditTarget(cat);
    setName(cat.name);
    setDescription(cat.description || '');
    setShowModal(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setSaving(true);
    try {
      const saved = await adminApiRequest<Category>('/api/admin/categories', {
        method: editTarget ? 'PUT' : 'POST',
        body: JSON.stringify({
          id: editTarget?.id,
          name: name.trim(),
          description: description.trim() || null,
        }),
      });

      if (saved) {
        if (editTarget) {
          setCategories(categories.map(c => c.id === editTarget.id ? { ...c, name, description } : c));
        } else {
          setCategories([...categories, saved]);
        }
      }
      setShowModal(false);
      Swal.fire({
        icon: 'success',
        title: editTarget ? 'Category Updated' : 'Category Created',
        timer: 1500,
        showConfirmButton: false,
        background: '#051A10',
        color: '#FFFFFF',
      });
      loadCategories();
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Operation Failed',
        text: err?.message || 'Could not save category.',
        background: '#051A10',
        color: '#FFFFFF',
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (cat: Category) => {
    Swal.fire({
      title: 'Delete Category?',
      text: `Are you sure you want to remove "${cat.name}"?`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e11d48',
      confirmButtonText: 'Yes, Delete',
      background: '#051A10',
      color: '#FFFFFF',
    }).then(async (res) => {
      if (res.isConfirmed) {
        try {
          await adminApiRequest(`/api/admin/categories/${cat.id}`, { method: 'DELETE' });
          setCategories(categories.filter(c => c.id !== cat.id));
          Swal.fire({ icon: 'success', title: 'Deleted', timer: 1200, showConfirmButton: false, background: '#051A10', color: '#FFFFFF' });
        } catch {
          Swal.fire({ icon: 'error', title: 'Delete failed', background: '#051A10', color: '#FFFFFF' });
        }
      }
    });
  };

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      <div className="flex items-center justify-between border-b border-[#007A4D]/30 pb-5">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Award Categories</h1>
          <p className="text-emerald-200/70 text-sm mt-1">Manage all official award categories live on your platform.</p>
        </div>
        <button
          onClick={openAdd}
          className="bg-gradient-to-r from-[#007A4D] to-[#054C31] text-[#EBF700] hover:brightness-110 font-black px-5 py-3 rounded-xl shadow-lg border border-[#EBF700]/30 transition-all flex items-center gap-2 cursor-pointer"
        >
          <span>➕</span> Add New Category
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12 text-emerald-400 font-bold">Loading Categories...</div>
      ) : categories.length === 0 ? (
        <div className="bg-[#051A10] border border-[#007A4D]/30 rounded-2xl p-12 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <h3 className="text-xl font-bold text-white mb-1">No Award Categories Found</h3>
          <p className="text-emerald-300/60 text-sm mb-6">Create your first award category so nominees can be grouped.</p>
          <button
            onClick={openAdd}
            className="bg-[#007A4D] text-[#EBF700] font-bold px-6 py-2.5 rounded-xl border border-[#EBF700]/40"
          >
            + Create First Category
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="bg-[#051A10] border border-[#007A4D]/40 hover:border-[#007A4D] rounded-2xl p-5 flex flex-col justify-between transition-all group"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="text-lg font-extrabold text-white group-hover:text-[#EBF700] transition-colors">{cat.name}</h3>
                  <span className="text-[10px] bg-[#007A4D]/30 text-emerald-300 px-2 py-0.5 rounded-full border border-[#007A4D]/60 font-bold uppercase">
                    Active Category
                  </span>
                </div>
                <p className="text-emerald-200/70 text-xs line-clamp-2">{cat.description || 'No description provided.'}</p>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-[#007A4D]/20 mt-4">
                <button
                  onClick={() => openEdit(cat)}
                  className="px-3 py-1.5 bg-[#007A4D]/20 hover:bg-[#007A4D] text-emerald-200 hover:text-white rounded-lg text-xs font-bold transition-all border border-[#007A4D]/40"
                >
                  ✏️ Edit
                </button>
                <button
                  onClick={() => handleDelete(cat)}
                  className="px-3 py-1.5 bg-rose-950/20 hover:bg-rose-900/60 text-rose-300 rounded-lg text-xs font-bold transition-all border border-rose-800/40"
                >
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#051A10] border border-[#007A4D] rounded-2xl p-6 max-w-md w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#007A4D]/40 pb-4">
              <h3 className="text-xl font-extrabold text-white">
                {editTarget ? 'Edit Award Category' : 'Add New Category'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-emerald-400 hover:text-white text-xl">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">Category Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Artist of the Year"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#020F0A] border border-[#007A4D]/50 focus:border-[#EBF700] rounded-xl px-4 py-2.5 text-white font-semibold text-sm focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-emerald-300 uppercase tracking-wider mb-2">Description (Optional)</label>
                <textarea
                  rows={3}
                  placeholder="Brief description of this award category..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#020F0A] border border-[#007A4D]/50 focus:border-[#EBF700] rounded-xl px-4 py-2.5 text-white font-semibold text-sm focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#007A4D]/30">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-emerald-300 hover:text-white font-bold text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="bg-[#007A4D] hover:bg-[#054C31] text-[#EBF700] font-black px-6 py-2.5 rounded-xl border border-[#EBF700]/40 transition-all cursor-pointer"
                >
                  {saving ? 'Saving...' : editTarget ? 'Save Changes' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
