import { useState } from 'react';
import { Link } from 'react-router-dom';
import { subscribeNewsletter } from '../../services/public';
import Swal from 'sweetalert2';
import Logo from '../navigation/Logo';
import { useSiteSettings } from '../../contexts/SiteSettingsContext';

const QUICK_LINKS = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/vote', label: 'Vote Now' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

const LEGAL_LINKS = [
  { to: '/terms', label: 'Terms of Service' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/faq', label: 'FAQ' },
];

export default function Footer() {
  const { settings } = useSiteSettings();
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const year = new Date().getFullYear();

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setIsLoading(true);
    try {
      await subscribeNewsletter({ email });
      await Swal.fire({
        icon: 'success',
        title: "You're in! 🎉",
        text: 'Thank you for subscribing. You\'ll be the first to know about updates.',
        confirmButtonColor: '#007A4D',
      });
      setEmail('');
    } catch {
      await Swal.fire({
        icon: 'error',
        title: 'Oops!',
        text: 'Something went wrong. Please try again.',
        confirmButtonColor: '#007A4D',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <footer className="bg-[#051A10] text-white/80 pt-16 pb-8 border-t border-[#0A2E1D]" role="contentinfo">
      <div className="container">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Logo light className="mb-4" />
            <p className="text-sm leading-relaxed text-white/60 mb-5">
              {settings.tagline || 'Honoring exceptionally gifted people, rising talents, and impactful changemakers who inspire communities across the globe.'}
            </p>
            <div className="flex gap-3 text-slate-300 text-sm">
              <a href="#facebook" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#007A4D] hover:text-white transition-colors">f</a>
              <a href="#twitter" aria-label="Twitter" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#007A4D] hover:text-white transition-colors">t</a>
              <a href="#instagram" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#007A4D] hover:text-white transition-colors">ig</a>
              <a href="#linkedin" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-[#007A4D] hover:text-white transition-colors">in</a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5" role="list">
              {QUICK_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-[#EBF700] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              Legal
            </h3>
            <ul className="space-y-2.5" role="list">
              {LEGAL_LINKS.map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="text-sm text-white/60 hover:text-[#EBF700] transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4">
              Stay Updated
            </h3>
            <p className="text-sm text-white/60 mb-4 leading-relaxed">
              Subscribe to our newsletter to get the latest updates on nominations and voting.
            </p>
            <form onSubmit={handleSubscribe} className="space-y-2.5" id="footer-newsletter-form">
              <label htmlFor="footer-email" className="sr-only">Email address</label>
              <div className="relative">
                <input
                  id="footer-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Your email address"
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm bg-white/5 border border-white/10 text-white placeholder-white/40 focus:outline-none focus:border-[#007A4D] transition-colors pl-10"
                />
                <span className="absolute left-3.5 top-3.5 text-white/40 text-sm">✉</span>
              </div>
              <button
                id="footer-subscribe-btn"
                type="submit"
                disabled={isLoading}
                className="w-full bg-[#007A4D] hover:bg-[#006640] text-white font-bold text-sm py-3 rounded-xl transition-colors disabled:opacity-60"
              >
                {isLoading ? 'Subscribing…' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 my-8" />

        {/* Bottom bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/50">
          <p>© {year} {settings.siteName}. All rights reserved.</p>
          <p>
            {settings.developerCredit}{' '}
            <span className="text-[#34d399] font-bold">{settings.developerName}</span>.
          </p>
        </div>
      </div>
    </footer>
  );
}
