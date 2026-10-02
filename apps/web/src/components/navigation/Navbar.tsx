import { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { gsap } from 'gsap';
import Logo from './Logo';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

const NAV_LINKS = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact Us' },
];

export default function Navbar() {
  const { settings } = useSiteSettings();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();
  const navRef = useRef<HTMLElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileMenuRef.current) return;
    if (isMobileOpen) {
      gsap.fromTo(
        mobileMenuRef.current,
        { opacity: 0, y: -16 },
        { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' }
      );
    }
  }, [isMobileOpen]);

  return (
    <header
      ref={navRef}
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-[#E2EFE7]'
          : 'bg-[#F4FAF5]'
      }`}
      role="banner"
    >
      {/* Top Banner Ticker — admin-controlled text */}
      {settings.tickerEnabled && (
        <div className="bg-[#007A4D] text-white text-xs py-2 overflow-hidden whitespace-nowrap font-bold tracking-wider">
          <div className="flex gap-12 items-center" style={{ animation: 'marquee 20s linear infinite', width: 'max-content' }}>
            {[...Array(8)].map((_, i) => (
              <span key={i} className="inline-flex items-center gap-2 uppercase">
                {settings.tickerText}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="container">
        <nav
          className="flex items-center justify-between h-16 md:h-20"
          aria-label="Main navigation"
        >
          {/* Logo */}
          <Logo />

          {/* Desktop Nav */}
          <ul className="hidden md:flex items-center gap-8" role="list">
            {NAV_LINKS.map(({ to, label, end }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end={end}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition-colors ${
                      isActive
                        ? 'text-[#007A4D] font-bold border-b-2 border-[#007A4D] pb-1'
                        : 'text-[#0B2B1B]/80 hover:text-[#007A4D]'
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* CTA Buttons — admin-controlled labels & links */}
          <div className="flex items-center gap-3">
            <Link
              to={settings.navCta1Link}
              id="navbar-register-cta"
              className="hidden sm:inline-flex bg-[#EBF700] hover:bg-[#e0ee00] text-[#0B2B1B] font-extrabold text-xs md:text-sm px-5 py-2.5 rounded-full shadow-sm transition-all items-center gap-1.5"
            >
              {settings.navCta1Label}
            </Link>
            <Link
              to={settings.navCta2Link}
              id="navbar-vote-cta"
              className="hidden sm:inline-flex bg-[#007A4D] hover:bg-[#006640] text-white font-bold text-xs md:text-sm px-5 py-2.5 rounded-full shadow-sm transition-all items-center gap-1.5"
            >
              {settings.navCta2Label}
            </Link>

            {/* Mobile hamburger */}
            <button
              id="mobile-menu-toggle"
              className="md:hidden p-2 rounded-lg text-[#0B2B1B] hover:bg-slate-100 transition-colors"
              onClick={() => setIsMobileOpen((o) => !o)}
              aria-label={isMobileOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMobileOpen}
            >
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      {isMobileOpen && (
        <div
          id="mobile-menu"
          ref={mobileMenuRef}
          className="md:hidden bg-white border-t border-slate-100 shadow-xl"
        >
          <div className="container py-4 space-y-2">
            {NAV_LINKS.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `block px-4 py-3 text-sm font-semibold rounded-lg transition-colors ${
                    isActive ? 'text-[#008751] bg-[#F4F9F5]' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            <div className="pt-2 grid grid-cols-2 gap-2">
              <Link to={settings.navCta1Link} className="bg-[#EBF547] text-[#0B2B1B] font-bold text-xs py-3 text-center rounded-xl">
                {settings.registerCtaLabel}
              </Link>
              <Link to={settings.navCta2Link} className="bg-[#008751] text-white font-bold text-xs py-3 text-center rounded-xl">
                {settings.voteCtaLabel}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
