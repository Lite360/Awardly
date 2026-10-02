import { useState, useEffect, useCallback } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useSearchParams } from 'react-router-dom';
import { getCategories, getNominees } from '../services/public';
import type { Category, Nominee } from '@awardly/shared-types';

export default function NomineesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState<Category[]>([]);
  const [nominees, setNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const activeCategory = searchParams.get('category') ?? 'all';

  useEffect(() => {
    Promise.all([
      getCategories().catch(() => [] as Category[]),
      getNominees().catch(() => ({ items: [] as Nominee[] })),
    ]).then(([cats, nomRes]) => {
      setCategories(cats || []);
      if (Array.isArray(nomRes)) {
        setNominees(nomRes);
      } else if (nomRes && Array.isArray(nomRes.items)) {
        setNominees(nomRes.items);
      }
    }).finally(() => setLoading(false));
  }, []);

  const setCategory = useCallback(
    (catSlug: string) => {
      const params = new URLSearchParams(searchParams);
      if (catSlug === 'all') {
        params.delete('category');
      } else {
        params.set('category', catSlug);
      }
      setSearchParams(params);
    },
    [searchParams, setSearchParams]
  );

  const filtered = nominees.filter((n) => {
    const matchCat = activeCategory === 'all' || n.categoryId === activeCategory;
    const matchSearch = n.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="pt-20 pb-16 min-h-screen bg-[#F4FAF5]">
      <Helmet>
        <title>Nominees & Categories | Awardly 2026</title>
        <meta name="description" content="Browse all award categories and nominees for the Awardly Awards 2026." />
      </Helmet>

      {/* Page Hero */}
      <div className="relative py-20 bg-[#051A10] text-white text-center overflow-hidden mb-12">
        <div className="relative container max-w-3xl mx-auto px-4">
          <span className="text-xs font-extrabold text-[#EBF700] uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            AWARDLY AWARDS 2026
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-3">
            Nominees & Categories
          </h1>
          <p className="text-emerald-100 text-base max-w-xl mx-auto">
            Discover outstanding talents across various categories and cast your votes to support your favorites.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search & Filter Bar */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2EFE7] shadow-sm mb-12 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">🔍</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search nominee by name..."
              className="w-full bg-[#F7FBF8] border border-[#D5E8DD] rounded-full pl-11 pr-4 py-3 text-sm text-[#0B2B1B] placeholder-slate-400 focus:outline-none focus:border-[#007A4D] transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                activeCategory === 'all'
                  ? 'bg-[#007A4D] text-white shadow-md'
                  : 'bg-[#F4FAF5] border border-[#E2EFE7] text-[#0B2B1B] hover:border-[#007A4D]'
              }`}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setCategory(cat.slug)}
                className={`px-4 py-2 rounded-full text-xs font-extrabold transition-all ${
                  activeCategory === cat.slug
                    ? 'bg-[#007A4D] text-white shadow-md'
                    : 'bg-[#F4FAF5] border border-[#E2EFE7] text-[#0B2B1B] hover:border-[#007A4D]'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Categories & Nominees Accordion Section (Matching Reference Image 2) */}
        {loading ? (
          <div className="text-center py-20 text-[#526c60]">Loading categories and nominees...</div>
        ) : filtered.length > 0 ? (
          <div className="space-y-12">
            {(categories.length > 0 ? categories : [{ id: 'all', name: 'General Nominees', slug: 'all' }])
              .filter((cat) => activeCategory === 'all' || activeCategory === cat.slug)
              .map((cat) => {
                const categoryNominees = filtered.filter(
                  (n) => activeCategory === 'all' || n.categoryId === cat.id || n.categoryId === cat.slug
                );
                if (activeCategory === 'all' && categoryNominees.length === 0) return null;

                return (
                  <div key={cat.id} className="bg-white rounded-3xl border border-[#E2EFE7] overflow-hidden shadow-sm">
                    {/* Category Header Banner (Matching Green Bar in Reference) */}
                    <div className="bg-[#007A4D] text-white px-6 py-4 flex items-center justify-between font-display font-extrabold text-lg md:text-xl">
                      <div className="flex items-center gap-3">
                        <span>🔔</span>
                        <span>AWARDLY AWARDS 2026 — {cat.name.toUpperCase()}</span>
                      </div>
                      <span className="text-xs font-bold text-[#EBF700] bg-white/10 px-3 py-1 rounded-full">
                        {categoryNominees.length} Nominees
                      </span>
                    </div>

                    {/* Category Nominees Grid */}
                    <div className="p-6 sm:p-8">
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {(categoryNominees.length > 0 ? categoryNominees : filtered).map((n) => (
                          <div
                            key={n.id}
                            className="bg-[#F4FAF5] rounded-3xl p-4 border border-[#E2EFE7] shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                          >
                            <div>
                              <div className="relative rounded-2xl overflow-hidden aspect-[4/3] mb-4 border border-[#E2EFE7]">
                                <img
                                  src={n.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80'}
                                  alt={n.name}
                                  className="w-full h-full object-cover"
                                />
                                <span className="absolute top-2 left-2 bg-[#007A4D] text-white text-[10px] font-extrabold px-2.5 py-1 rounded-full">
                                  CODE: {n.code || n.id.slice(0, 4)}
                                </span>
                              </div>
                              <span className="text-xs font-bold text-[#007A4D] uppercase tracking-wider block mb-1">
                                {cat.name}
                              </span>
                              <h3 className="font-display font-extrabold text-lg text-[#0B2B1B] mb-2">{n.name}</h3>
                              <p className="text-xs text-[#526c60] leading-relaxed line-clamp-3 mb-4">
                                {n.bio || 'Honored for exceptional contribution and dedication to African culture and achievement.'}
                              </p>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#E2EFE7]">
                              <Link
                                to={`/nominees/${n.slug}`}
                                className="border border-[#007A4D] text-[#007A4D] hover:bg-[#007A4D] hover:text-white font-extrabold text-xs py-2.5 rounded-full text-center transition-colors"
                              >
                                View Profile
                              </Link>
                              <Link
                                to={`/vote?nominee=${n.slug}`}
                                className="bg-[#007A4D] text-white font-extrabold text-xs py-2.5 rounded-full text-center hover:bg-[#006640] transition-colors shadow-sm"
                              >
                                Vote Now
                              </Link>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center border border-[#E2EFE7]">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="font-display font-extrabold text-2xl text-[#0B2B1B] mb-2">No Nominees Found</h3>
            <p className="text-[#526c60] text-sm">Try searching for a different name or clearing category filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
