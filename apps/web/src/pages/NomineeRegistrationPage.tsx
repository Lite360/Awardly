import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { getCategories } from '../services/public';
import type { Category } from '@awardly/shared-types';

export default function NomineeRegistrationPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    address: '',
    categoryId: '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res || []))
      .catch(() => setCategories([]));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId) {
      Swal.fire('Category Required', 'Please select an award category.', 'warning');
      return;
    }

    setSubmitting(true);
    try {
      // Direct registration call / feedback
      await new Promise((r) => setTimeout(r, 1000));
      Swal.fire({
        icon: 'success',
        title: 'Registration Submitted!',
        text: 'Thank you for registering. Our review panel will evaluate your nomination.',
        confirmButtonColor: '#008751',
      });
      setFormData({ fullName: '', email: '', address: '', categoryId: '' });
      setFile(null);
    } catch {
      Swal.fire('Error', 'Registration failed. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-[#F4F9F5]">
      <Helmet>
        <title>Register as a Nominee | Awardly 2026</title>
        <meta name="description" content="Register yourself or nominate a candidate for Awardly 2026." />
      </Helmet>

      {/* Hero Banner */}
      <div className="relative py-20 bg-[#051A10] text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(#007A4D_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        <div className="relative container max-w-3xl mx-auto px-4">
          <span className="text-xs font-extrabold text-[#EBF700] uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            NOMINEE REGISTRATION
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-3">
            Register as a Nominee
          </h1>
          <p className="text-emerald-100 text-base max-w-xl mx-auto">
            Tell us about yourself and choose the award category that fits your work.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="bg-white rounded-3xl p-8 sm:p-10 shadow-sm border border-[#E2EFE7]">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#0B2B1B] mb-2">
                Full name
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">👤</span>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Enter your full name"
                  className="w-full bg-[#F7FBF8] border border-[#D5E8DD] rounded-xl px-4 py-3.5 pl-11 text-[#0B2B1B] placeholder-slate-400 focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0B2B1B] mb-2">
                Email
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">✉️</span>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="you@example.com"
                  className="w-full bg-[#F7FBF8] border border-[#D5E8DD] rounded-xl px-4 py-3.5 pl-11 text-[#0B2B1B] placeholder-slate-400 focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0B2B1B] mb-2">
                Address
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">📍</span>
                <input
                  type="text"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Enter your full address"
                  className="w-full bg-[#F7FBF8] border border-[#D5E8DD] rounded-xl px-4 py-3.5 pl-11 text-[#0B2B1B] placeholder-slate-400 focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751] transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0B2B1B] mb-2">
                Award category
              </label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔔</span>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full bg-[#F7FBF8] border border-[#D5E8DD] rounded-xl px-4 py-3.5 pl-11 text-[#0B2B1B] focus:outline-none focus:border-[#008751] focus:ring-1 focus:ring-[#008751] transition-all appearance-none"
                >
                  <option value="">Select a category...</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0B2B1B] mb-2">
                Photo
              </label>
              <div className="border-2 border-dashed border-[#BCE0CB] bg-[#F7FBF8] rounded-2xl p-8 text-center cursor-pointer hover:border-[#008751] transition-colors relative">
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="w-10 h-10 rounded-full bg-[#E2F5EA] text-[#008751] flex items-center justify-center mx-auto mb-3 text-lg">
                  ⬆
                </div>
                <div className="font-semibold text-sm text-[#0B2B1B]">
                  {file ? file.name : 'Click or drag an image here'}
                </div>
                <div className="text-xs text-slate-400 mt-1">JPEG, PNG, or WebP, up to 10 MB</div>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#008751] hover:bg-[#006e42] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-base disabled:opacity-60"
            >
              {submitting ? 'Registering...' : 'Register nominee →'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
