import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getCategories } from '../services/public';
import type { Category } from '@awardly/shared-types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then((data) => setCategories(data || []))
      .catch(() => setCategories([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#F4FAF5]">
      <Helmet>
        <title>Award Categories — Awardly</title>
        <meta name="description" content="Browse all award categories and find the nominees you want to vote for." />
      </Helmet>

      {/* Page Hero */}
      <div className="relative py-20 bg-[#051A10] text-white text-center overflow-hidden mb-12">
        <img
          src="https://images.unsplash.com/photo-1567427017947-545c5f8d16ad?w=1200&q=80"
          alt="Trophy award categories"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#051A10] via-[#051A10]/70 to-transparent" />
        <div className="relative z-10 container max-w-3xl mx-auto px-4">
          <span className="text-xs font-extrabold text-[#EBF700] uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            BROWSE CATEGORIES
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-3">
            Award Categories
          </h1>
          <p className="text-emerald-100 text-base max-w-xl mx-auto">
            Explore all award categories, learn about the criteria and find nominees worth voting for.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-16 text-[#526c60]">Loading categories...</div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat, i) => (
              <Link
                key={cat.id}
                to={`/nominees?category=${cat.slug}`}
                className="bg-white rounded-3xl border border-[#E2EFE7] shadow-sm hover:shadow-xl group overflow-hidden block transition-all"
                data-aos="fade-up"
                data-aos-delay={i * 80}
                id={`category-card-${cat.slug}`}
              >
                <div className="relative h-48 overflow-hidden">
                  <img
                    src={cat.imageUrl || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&q=80'}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                  <div className="absolute bottom-3 left-4">
                    <span className="text-xs font-extrabold text-[#0B2B1B] bg-[#EBF700] px-3 py-1 rounded-full">{cat.nomineeCount || 0} nominees</span>
                  </div>
                </div>
                <div className="p-5">
                  <h2 className="font-display font-extrabold text-xl text-[#0B2B1B] mb-2 group-hover:text-[#007A4D] transition-colors">
                    {cat.name}
                  </h2>
                  <p className="text-[#526c60] text-sm leading-relaxed mb-4">{cat.description || ''}</p>
                  <div className="flex items-center text-[#007A4D] font-extrabold text-sm gap-1">
                    Browse nominees →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-[#526c60]">No categories currently active.</div>
        )}
      </div>
    </div>
  );
}
