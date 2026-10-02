import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { gsap } from 'gsap';
import { getCategories, getNominees, getActiveEvent } from '../services/public';
import type { Category, Nominee, Event } from '@awardly/shared-types';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

// ─── Hero Countdown ────────────────────────────────────────────────────────────
function useCountdown(targetDate: Date | null) {
  const [diff, setDiff] = useState<number>(0);

  useEffect(() => {
    if (!targetDate) return;
    const interval = setInterval(() => {
      setDiff(Math.max(0, targetDate.getTime() - Date.now()));
    }, 1000);
    setDiff(Math.max(0, targetDate.getTime() - Date.now()));
    return () => clearInterval(interval);
  }, [targetDate]);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);
  return { days, hours, minutes, seconds };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="card-glass px-4 py-3 md:px-6 md:py-4 min-w-[70px] md:min-w-[90px] text-center">
        <span className="font-display font-bold text-3xl md:text-4xl text-white leading-none">
          {String(value).padStart(2, '0')}
        </span>
      </div>
      <span className="text-xs md:text-sm text-white/60 mt-2 font-medium uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

// ─── Nominee Highlight Card ────────────────────────────────────────────────────
function HighlightCard({ nominee }: { nominee: Nominee }) {
  return (
    <Link to={`/nominees/${nominee.slug}`} className="nominee-card group block" data-aos="fade-up">
      <div className="relative overflow-hidden aspect-[3/4]">
        <img
          src={nominee.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=80'}
          alt={nominee.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute bottom-0 inset-x-0 p-4">
          {nominee.categoryName && <span className="badge badge-accent mb-1">{nominee.categoryName}</span>}
          <h3 className="font-display font-bold text-white text-lg leading-tight">{nominee.name}</h3>
        </div>
      </div>
      <div className="p-4 flex items-center justify-between">
        <span className="text-sm text-muted">View Profile</span>
        <svg className="w-4 h-4 text-primary transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </div>
    </Link>
  );
}

// ─── Category Card ────────────────────────────────────────────────────────────
function CategoryCard({ category }: { category: Category }) {
  return (
    <Link
      to={`/nominees?category=${encodeURIComponent(category.slug)}`}
      className="card card-hover group p-6 block"
      data-aos="fade-up"
    >
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-white transition-colors">
        <svg className="w-6 h-6 text-primary group-hover:text-white transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      </div>
      <h3 className="font-display font-bold text-lg mb-1">{category.name}</h3>
      <p className="text-sm text-muted mb-3">{category.description || ''}</p>
      <span className="badge badge-primary">{category.nomineeCount || 0} nominees</span>
    </Link>
  );
}

export default function HomePage() {
  const { settings } = useSiteSettings();
  const heroRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  const [activeEvent, setActiveEvent] = useState<Event | null>(null);
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredNominees, setFeaturedNominees] = useState<Nominee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getActiveEvent().catch(() => null),
      getCategories().catch(() => [] as Category[]),
      getNominees().catch(() => ({ items: [] as Nominee[] })),
    ]).then(([evt, cats, nomRes]) => {
      if (evt) setActiveEvent(evt);
      if (cats) setCategories(cats);
      const items = Array.isArray(nomRes) ? nomRes : nomRes?.items || [];
      setFeaturedNominees(items.slice(0, 4));
    }).finally(() => setLoading(false));
  }, []);

  const endDate = activeEvent?.endDate ? new Date(activeEvent.endDate) : new Date('2025-03-15T23:59:59');
  const countdown = useCountdown(endDate);

  useEffect(() => {
    if (!headlineRef.current || !subRef.current || !ctaRef.current) return;

    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(
      headlineRef.current,
      { y: 40, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8, ease: 'power3.out' }
    )
      .fromTo(
        subRef.current,
        { y: 24, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.7, ease: 'power3.out' },
        '-=0.5'
      )
      .fromTo(
        ctaRef.current,
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out' },
        '-=0.4'
      );
  }, []);

  return (
    <>
      <Helmet>
        <title>{activeEvent ? `${activeEvent.title} — ${settings.siteName}` : `${settings.siteName} — ${settings.tagline}`}</title>
        <meta
          name="description"
          content={activeEvent?.description || `Vote for your favourite nominees at ${settings.siteName} — the premier awards voting platform.`}
        />
      </Helmet>

      {/* ── Hero ──────────────────────────────────────────────────────────── */}
      {/* ── Hero Section ──────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-[#051A10] text-white pt-24 pb-16"
        aria-labelledby="hero-headline"
        id="hero"
      >
        <img
          src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=1600&q=80"
          alt="Award ceremony stage"
          className="absolute inset-0 w-full h-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#051A10] via-[#051A10]/70 to-transparent" />

        <div className="relative z-10 container text-center max-w-4xl mx-auto px-4 py-12">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-1.5 mb-6 text-xs md:text-sm font-semibold text-[#EBF700]">
            <span>✨ {settings.siteName.toUpperCase()} AWARDS 2026</span>
          </div>

          <h1
            ref={headlineRef}
            id="hero-headline"
            className="font-display font-extrabold text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-white leading-tight mb-6 tracking-tight"
          >
            {settings.heroTitle}
          </h1>

          <p
            ref={subRef}
            className="text-base sm:text-lg md:text-xl text-white/80 leading-relaxed mb-8 max-w-2xl mx-auto font-normal"
          >
            {settings.heroSubtitle}
          </p>

          <div ref={ctaRef} className="flex flex-wrap items-center justify-center gap-4 mb-10">
            <Link to={settings.heroCta1Link} id="hero-nominate-cta" className="bg-[#007A4D] hover:bg-[#006640] text-white font-extrabold text-sm md:text-base px-8 py-3.5 rounded-full shadow-lg transition-all flex items-center gap-2">
              <span>{settings.heroCta1Label}</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
            <Link to={settings.heroCta2Link} id="hero-vote-cta" className="bg-[#EBF700] hover:bg-[#e2f000] text-[#0B2B1B] font-extrabold text-sm md:text-base px-8 py-3.5 rounded-full shadow-lg transition-all flex items-center gap-2">
              <span>{settings.heroCta2Label}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Stat Strip Section ────────────────────────────────────────────────── */}
      <section className="bg-[#007A4D] text-white py-10 border-y border-[#006640]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4">
              <div className="font-display font-extrabold text-4xl md:text-5xl text-[#EBF700] mb-1">{settings.stat1Value}</div>
              <div className="text-xs md:text-sm font-semibold text-white/90 uppercase tracking-wider">{settings.stat1Label}</div>
            </div>
            <div className="p-4">
              <div className="font-display font-extrabold text-4xl md:text-5xl text-[#EBF700] mb-1">{settings.stat2Value}</div>
              <div className="text-xs md:text-sm font-semibold text-white/90 uppercase tracking-wider">{settings.stat2Label}</div>
            </div>
            <div className="p-4">
              <div className="font-display font-extrabold text-4xl md:text-5xl text-[#EBF700] mb-1">{settings.stat3Value}</div>
              <div className="text-xs md:text-sm font-semibold text-white/90 uppercase tracking-wider">{settings.stat3Label}</div>
            </div>
            <div className="p-4">
              <div className="font-display font-extrabold text-4xl md:text-5xl text-[#EBF700] mb-1">{settings.stat4Value}</div>
              <div className="text-xs md:text-sm font-semibold text-white/90 uppercase tracking-wider">{settings.stat4Label}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Honoring Excellence Across Africa (About Preview) ───────────────────── */}
      <section className="py-20 bg-[#F4FAF5]" aria-labelledby="about-preview-heading">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Image Card */}
            <div className="relative" data-aos="fade-right">
              <div className="rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white">
                <img
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80"
                  alt="Awardly Award Ceremony"
                  className="w-full h-[420px] object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-4 rounded-2xl shadow-xl hidden sm:flex items-center gap-3 border border-[#E2EFE7]">
                <div className="w-12 h-12 rounded-xl bg-[#007A4D] text-[#EBF700] font-extrabold text-xl flex items-center justify-center">
                  🏆
                </div>
                <div>
                  <div className="font-extrabold text-[#0B2B1B] text-sm">2026 Edition</div>
                  <div className="text-xs text-[#526c60]">Celebrating African Heritage</div>
                </div>
              </div>
            </div>

            {/* Right Content */}
            <div data-aos="fade-left">
              <span className="text-xs font-extrabold text-[#007A4D] uppercase tracking-widest bg-[#007A4D]/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
                # ABOUT US
              </span>
              <h2 id="about-preview-heading" className="font-display font-extrabold text-3xl md:text-5xl text-[#0B2B1B] mb-6 leading-tight">
                Honoring Excellence Across Africa
              </h2>
              <p className="text-base text-[#526c60] leading-relaxed mb-4">
                Awardly is an annual prestigious recognition program that seeks to honor exceptional talents, rising icons, and impactful leaders who are making a remarkable difference in their respective fields across Africa.
              </p>
              <p className="text-base text-[#526c60] leading-relaxed mb-8">
                We believe in shining a spotlight on hard work, dedication, and cultural heritage, ensuring that outstanding contributions are celebrated with the recognition they truly deserve.
              </p>

              <Link
                to="/about"
                id="about-read-more-btn"
                className="inline-flex items-center gap-2 border-2 border-[#007A4D] text-[#007A4D] hover:bg-[#007A4D] hover:text-white font-extrabold text-sm px-6 py-3 rounded-full transition-all"
              >
                <span>Read More About Us</span>
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How The Award Works ───────────────────────────────────────────────── */}
      <section className="py-20 bg-white" aria-labelledby="how-it-works-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-extrabold text-[#007A4D] uppercase tracking-widest bg-[#007A4D]/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
              # HOW IT WORKS
            </span>
            <h2 id="how-it-works-heading" className="font-display font-extrabold text-3xl md:text-5xl text-[#0B2B1B] mb-4">
              How The Award Works
            </h2>
            <p className="text-[#526c60] text-base">
              A transparent, community-driven process to honor outstanding achievement.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {[
              {
                num: '1',
                title: 'Nomination Phase',
                desc: 'The community identifies and nominates exceptional individuals across various categories to be considered for the award.',
                icon: '📋',
              },
              {
                num: '2',
                title: 'Public Voting',
                desc: 'Public votes play a crucial role in deciding the winner, giving equal opportunity to nominees and their advocates to engage their community.',
                icon: '🗳️',
              },
              {
                num: '3',
                title: 'Award Night',
                desc: 'Winners are announced and celebrated during an unforgettable gala evening, honoring their impact and achievements.',
                icon: '🏆',
              },
            ].map((step) => (
              <div key={step.num} className="bg-[#F4FAF5] p-8 rounded-3xl border border-[#E2EFE7] text-center relative group hover:shadow-xl transition-all" data-aos="fade-up">
                <div className="w-16 h-16 rounded-full bg-white border-2 border-[#007A4D] text-[#007A4D] font-display font-extrabold text-2xl flex items-center justify-center mx-auto mb-6 shadow-md relative">
                  <span>{step.icon}</span>
                  <span className="absolute -top-2 -right-2 bg-[#EBF700] text-[#0B2B1B] w-7 h-7 rounded-full text-xs font-extrabold flex items-center justify-center border border-[#0B2B1B]/10">
                    {step.num}
                  </span>
                </div>
                <h3 className="font-display font-extrabold text-xl text-[#0B2B1B] mb-3">{step.title}</h3>
                <p className="text-[#526c60] text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Meet the Nominees ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#F4FAF5]" aria-labelledby="nominees-heading">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-[#007A4D] uppercase tracking-widest bg-[#007A4D]/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
              # OUR NOMINEES
            </span>
            <h2 id="nominees-heading" className="font-display font-extrabold text-3xl md:text-5xl text-[#0B2B1B] mb-4">
              Meet the Nominees
            </h2>
            <p className="text-[#526c60] text-base">
              Discover the incredible nominees across various categories and support them to succeed.
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12 text-[#526c60]">Loading nominees...</div>
          ) : featuredNominees.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredNominees.map((n) => (
                <HighlightCard key={n.id} nominee={n} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { name: 'Sarah Johnson', cat: 'Innovator of the Year', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&q=80' },
                { name: 'David Oscar', cat: 'Community Leader', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&q=80' },
                { name: 'Grace Peters', cat: 'Cultural Heritage', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=500&q=80' },
              ].map((mock, idx) => (
                <div key={idx} className="bg-white rounded-3xl overflow-hidden border border-[#E2EFE7] shadow-md hover:shadow-xl transition-all p-4">
                  <div className="rounded-2xl overflow-hidden aspect-[4/3] mb-4">
                    <img src={mock.img} alt={mock.name} className="w-full h-full object-cover" />
                  </div>
                  <span className="text-xs font-bold text-[#007A4D] bg-[#007A4D]/10 px-3 py-1 rounded-full">{mock.cat}</span>
                  <h3 className="font-display font-extrabold text-lg text-[#0B2B1B] mt-2 mb-1">{mock.name}</h3>
                  <p className="text-xs text-[#526c60] mb-4">Dedicated to bringing positive impact and innovation to African communities.</p>
                  <Link to="/vote" className="w-full bg-[#007A4D] text-white font-bold text-xs py-2.5 rounded-full inline-block text-center hover:bg-[#006640] transition-colors">
                    Vote Nominee
                  </Link>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/nominees" id="explore-nominees-btn" className="bg-[#007A4D] hover:bg-[#006640] text-white font-extrabold text-sm px-8 py-3.5 rounded-full inline-flex items-center gap-2 shadow-md transition-all">
              <span>Explore All Nominees</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── A Glimpse of Greatness (Gallery Preview) ───────────────────────────── */}
      <section className="py-20 bg-white" aria-labelledby="gallery-preview-heading">
        <div className="container">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-xs font-extrabold text-[#007A4D] uppercase tracking-widest bg-[#007A4D]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
                # OUR GALLERY
              </span>
              <h2 id="gallery-preview-heading" className="font-display font-extrabold text-3xl md:text-5xl text-[#0B2B1B]">
                A Glimpse of Greatness
              </h2>
            </div>
            <Link to="/gallery" id="view-full-gallery-btn" className="border-2 border-[#007A4D] text-[#007A4D] hover:bg-[#007A4D] hover:text-white font-extrabold text-sm px-6 py-2.5 rounded-full transition-all inline-flex items-center gap-2">
              <span>View Full Gallery</span>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=600&q=80',
              'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=600&q=80',
              'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
              'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?w=600&q=80',
            ].map((src, i) => (
              <div key={i} className="rounded-3xl overflow-hidden aspect-square shadow-md border border-[#E2EFE7] group relative">
                <img src={src} alt={`Gallery moment ${i + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-4 flex items-end">
                  <span className="text-white font-bold text-sm">Event Moment {i + 1}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ───────────────────────────────────────────────────────── */}
      <section className="py-20 bg-[#007A4D] text-white text-center relative overflow-hidden" aria-labelledby="final-cta-heading">
        <div className="container relative z-10 max-w-3xl mx-auto">
          <h2 id="final-cta-heading" className="font-display font-extrabold text-3xl sm:text-4xl md:text-5xl mb-6">
            Your Voice Can Make a <span className="text-[#EBF700]">Difference</span>
          </h2>
          <p className="text-white/80 text-base sm:text-lg mb-8 max-w-xl mx-auto">
            Nominate an exceptional talent or cast your vote for your favorite nominees today!
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link to="/register" id="cta-register-btn" className="bg-[#EBF700] hover:bg-[#e2f000] text-[#0B2B1B] font-extrabold text-sm md:text-base px-8 py-3.5 rounded-full shadow-lg transition-all">
              👤 Register Now
            </Link>
            <Link to="/vote" id="cta-vote-btn" className="border-2 border-white text-white hover:bg-white hover:text-[#007A4D] font-extrabold text-sm md:text-base px-8 py-3.5 rounded-full transition-all">
              ✓ Vote Now
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
