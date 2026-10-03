import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { adminApiRequest } from '../services/api';

interface PlatformSettingsData {
  name?: string;
  tagline?: string;
  contactEmail?: string;
  contactPhone?: string;
  primaryColor?: string;
  accentColor?: string;
  footerCredit?: string;
  developerCredit?: string;
  socialLinks?: Record<string, string>;
  features?: Record<string, boolean>;
  siteContent?: Record<string, any>;
}

export default function SettingsManager() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Form State
  const [name, setName] = useState('Awardly');
  const [tagline, setTagline] = useState('Celebrating Excellence. Your Vote Matters.');
  const [contactEmail, setContactEmail] = useState('info@awardly.com');
  const [contactPhone, setContactPhone] = useState('+234 812 345 6789');

  // Extended Site Content (front-end live controls)
  const [heroTitle, setHeroTitle] = useState('Celebrating Talent, Impact, and Excellence');
  const [heroSubtitle, setHeroSubtitle] = useState('Awardly is a prestigious recognition program honoring gifted people, rising talents, and impactful changemakers who inspire communities across Africa.');
  const [tickerText, setTickerText] = useState('🔔 AWARDLY AWARDS 2026 — NOMINATIONS & VOTING NOW OPEN');
  const [tickerEnabled, setTickerEnabled] = useState(true);

  const [aboutTitle, setAboutTitle] = useState('Honoring Excellence Across Africa');
  const [aboutText, setAboutText] = useState('Awardly is an annual prestigious recognition program that seeks to honor exceptional talents, rising icons, and impactful leaders who are making a remarkable difference in their respective fields across Africa.');

  const [stat1Value, setStat1Value] = useState('15+');
  const [stat1Label, setStat1Label] = useState('Years of Recognition');
  const [stat2Value, setStat2Value] = useState('50+');
  const [stat2Label, setStat2Label] = useState('Award Categories');
  const [stat3Value, setStat3Value] = useState('100K+');
  const [stat3Label, setStat3Label] = useState('Total Votes');
  const [stat4Value, setStat4Value] = useState('500+');
  const [stat4Label, setStat4Label] = useState('Honorees & Nominees');

  const [bankName, setBankName] = useState('Guaranty Trust Bank (GTB)');
  const [accountNumber, setAccountNumber] = useState('0123456789');
  const [accountName, setAccountName] = useState('Awardly Official');

  const [footerCredit, setFooterCredit] = useState('© {year} Awardly. All rights reserved.');
  const [developerName, setDeveloperName] = useState('Graciecreatives');

  // Load from API on mount
  useEffect(() => {
    async function loadSettings() {
      try {
        setLoading(true);
        const res = await adminApiRequest<PlatformSettingsData>('/api/admin/settings');
        if (res) {
          if (res.name) setName(res.name);
          if (res.tagline) setTagline(res.tagline);
          if (res.contactEmail) setContactEmail(res.contactEmail);
          if (res.contactPhone) setContactPhone(res.contactPhone);
          if (res.footerCredit) setFooterCredit(res.footerCredit);

          const sc = res.siteContent || {};
          if (sc.heroTitle) setHeroTitle(sc.heroTitle);
          if (sc.heroSubtitle) setHeroSubtitle(sc.heroSubtitle);
          if (sc.tickerText) setTickerText(sc.tickerText);
          if (typeof sc.tickerEnabled === 'boolean') setTickerEnabled(sc.tickerEnabled);
          if (sc.aboutSectionTitle) setAboutTitle(sc.aboutSectionTitle);
          if (sc.aboutSectionText) setAboutText(sc.aboutSectionText);

          if (sc.stat1Value) setStat1Value(sc.stat1Value);
          if (sc.stat1Label) setStat1Label(sc.stat1Label);
          if (sc.stat2Value) setStat2Value(sc.stat2Value);
          if (sc.stat2Label) setStat2Label(sc.stat2Label);
          if (sc.stat3Value) setStat3Value(sc.stat3Value);
          if (sc.stat3Label) setStat3Label(sc.stat3Label);
          if (sc.stat4Value) setStat4Value(sc.stat4Value);
          if (sc.stat4Label) setStat4Label(sc.stat4Label);

          if (sc.manualBankName) setBankName(sc.manualBankName);
          if (sc.manualAccountNumber) setAccountNumber(sc.manualAccountNumber);
          if (sc.manualAccountName) setAccountName(sc.manualAccountName);
          if (sc.developerName) setDeveloperName(sc.developerName);
        }
      } catch (err: any) {
        console.warn('Failed to load DB settings, using current values:', err?.message);
      } finally {
        setLoading(false);
      }
    }

    loadSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const payload = {
        name,
        tagline,
        contactEmail,
        contactPhone,
        footerCredit,
        siteContent: {
          siteName: name,
          tagline,
          contactEmail,
          contactPhone,
          heroTitle,
          heroSubtitle,
          tickerText,
          tickerEnabled,
          aboutSectionTitle: aboutTitle,
          aboutSectionText: aboutText,
          stat1Value,
          stat1Label,
          stat2Value,
          stat2Label,
          stat3Value,
          stat3Label,
          stat4Value,
          stat4Label,
          manualBankName: bankName,
          manualAccountNumber: accountNumber,
          manualAccountName: accountName,
          developerName,
        },
      };

      await adminApiRequest('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(payload),
      });

      Swal.fire({
        icon: 'success',
        title: 'Settings Live & Saved!',
        text: 'Frontend display and platform configuration updated successfully in database.',
        confirmButtonColor: '#007A4D',
        background: '#051A10',
        color: '#FFFFFF',
      });
    } catch (err: any) {
      Swal.fire({
        icon: 'error',
        title: 'Failed to Save Settings',
        text: err?.message || 'Could not update configuration.',
        confirmButtonColor: '#007A4D',
        background: '#051A10',
        color: '#FFFFFF',
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#EBF700]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl pb-16">
      {/* Header */}
      <div className="border-b border-[#007A4D]/30 pb-5">
        <div className="inline-block bg-[#007A4D]/20 text-[#EBF700] text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-2 border border-[#007A4D]/40">
          Frontend Controls
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Platform & Frontend Settings</h1>
        <p className="text-emerald-200/70 text-sm mt-1">
          Everything changed here immediately updates live across the entire Awardly web landing page and public portal.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {/* 1. General & Branding Settings */}
        <div className="bg-[#051A10]/90 border border-[#007A4D]/40 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center gap-3 border-b border-[#007A4D]/30 pb-3">
            <span className="text-2xl">🏛️</span>
            <div>
              <h2 className="text-lg font-bold text-white">General Platform Identity</h2>
              <p className="text-xs text-emerald-300/60">Core branding, header text, and official contact channels</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase font-semibold text-emerald-200 mb-2">Platform Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700] transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-emerald-200 mb-2">Platform Tagline</label>
              <input
                type="text"
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-emerald-200 mb-2">Official Contact Email</label>
              <input
                type="email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-emerald-200 mb-2">Official Support Phone</label>
              <input
                type="text"
                value={contactPhone}
                onChange={(e) => setContactPhone(e.target.value)}
                className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 2. Homepage Hero & Banner Controls */}
        <div className="bg-[#051A10]/90 border border-[#007A4D]/40 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center gap-3 border-b border-[#007A4D]/30 pb-3">
            <span className="text-2xl">✨</span>
            <div>
              <h2 className="text-lg font-bold text-white">Hero & Announcement Ticker</h2>
              <p className="text-xs text-emerald-300/60">Customize the headline banner and ticker text displayed to visitors</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs uppercase font-semibold text-emerald-200 mb-2">Hero Headline Title</label>
              <input
                type="text"
                value={heroTitle}
                onChange={(e) => setHeroTitle(e.target.value)}
                className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700] transition-colors font-medium"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-emerald-200 mb-2">Hero Description Text</label>
              <textarea
                rows={3}
                value={heroSubtitle}
                onChange={(e) => setHeroSubtitle(e.target.value)}
                className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700] transition-colors resize-none text-sm leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="md:col-span-2">
                <label className="block text-xs uppercase font-semibold text-emerald-200 mb-2">Notification Ticker Bar Text</label>
                <input
                  type="text"
                  value={tickerText}
                  onChange={(e) => setTickerText(e.target.value)}
                  className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700] transition-colors text-sm"
                />
              </div>

              <div>
                <label className="block text-xs uppercase font-semibold text-emerald-200 mb-2">Ticker Visibility</label>
                <button
                  type="button"
                  onClick={() => setTickerEnabled(!tickerEnabled)}
                  className={`w-full py-3 px-4 rounded-xl font-bold text-sm border transition-all flex items-center justify-center gap-2 ${
                    tickerEnabled
                      ? 'bg-[#007A4D] border-[#EBF700] text-white shadow-lg shadow-[#007A4D]/30'
                      : 'bg-[#020F0A] border-[#007A4D]/40 text-emerald-400'
                  }`}
                >
                  {tickerEnabled ? '✓ Ticker Active' : '✕ Ticker Hidden'}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 3. About Section Controls */}
        <div className="bg-[#051A10]/90 border border-[#007A4D]/40 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center gap-3 border-b border-[#007A4D]/30 pb-3">
            <span className="text-2xl">📜</span>
            <div>
              <h2 className="text-lg font-bold text-white">About Us Section Content</h2>
              <p className="text-xs text-emerald-300/60">Main about text featured on the homepage and about page</p>
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-xs uppercase font-semibold text-emerald-200 mb-2">Section Heading Title</label>
              <input
                type="text"
                value={aboutTitle}
                onChange={(e) => setAboutTitle(e.target.value)}
                className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-emerald-200 mb-2">About Section Body Text</label>
              <textarea
                rows={4}
                value={aboutText}
                onChange={(e) => setAboutText(e.target.value)}
                className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700] transition-colors resize-none text-sm leading-relaxed"
              />
            </div>
          </div>
        </div>

        {/* 4. Statistics Banner Strip */}
        <div className="bg-[#051A10]/90 border border-[#007A4D]/40 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center gap-3 border-b border-[#007A4D]/30 pb-3">
            <span className="text-2xl">📊</span>
            <div>
              <h2 className="text-lg font-bold text-white">Homepage Impact Stats Strip</h2>
              <p className="text-xs text-emerald-300/60">Display key counter statistics to build trust and social proof</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Stat 1 */}
            <div className="bg-[#020F0A] border border-[#007A4D]/40 p-4 rounded-xl space-y-2">
              <label className="text-[10px] uppercase font-bold text-[#EBF700]">Stat 1 (Value & Label)</label>
              <input
                type="text"
                value={stat1Value}
                onChange={(e) => setStat1Value(e.target.value)}
                placeholder="15+"
                className="w-full bg-[#051A10] border border-[#007A4D]/50 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#EBF700]"
              />
              <input
                type="text"
                value={stat1Label}
                onChange={(e) => setStat1Label(e.target.value)}
                placeholder="Years"
                className="w-full bg-[#051A10] border border-[#007A4D]/50 rounded-lg px-3 py-1.5 text-emerald-200/80 text-xs focus:outline-none focus:border-[#EBF700]"
              />
            </div>

            {/* Stat 2 */}
            <div className="bg-[#020F0A] border border-[#007A4D]/40 p-4 rounded-xl space-y-2">
              <label className="text-[10px] uppercase font-bold text-[#EBF700]">Stat 2 (Value & Label)</label>
              <input
                type="text"
                value={stat2Value}
                onChange={(e) => setStat2Value(e.target.value)}
                placeholder="50+"
                className="w-full bg-[#051A10] border border-[#007A4D]/50 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#EBF700]"
              />
              <input
                type="text"
                value={stat2Label}
                onChange={(e) => setStat2Label(e.target.value)}
                placeholder="Categories"
                className="w-full bg-[#051A10] border border-[#007A4D]/50 rounded-lg px-3 py-1.5 text-emerald-200/80 text-xs focus:outline-none focus:border-[#EBF700]"
              />
            </div>

            {/* Stat 3 */}
            <div className="bg-[#020F0A] border border-[#007A4D]/40 p-4 rounded-xl space-y-2">
              <label className="text-[10px] uppercase font-bold text-[#EBF700]">Stat 3 (Value & Label)</label>
              <input
                type="text"
                value={stat3Value}
                onChange={(e) => setStat3Value(e.target.value)}
                placeholder="100K+"
                className="w-full bg-[#051A10] border border-[#007A4D]/50 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#EBF700]"
              />
              <input
                type="text"
                value={stat3Label}
                onChange={(e) => setStat3Label(e.target.value)}
                placeholder="Total Votes"
                className="w-full bg-[#051A10] border border-[#007A4D]/50 rounded-lg px-3 py-1.5 text-emerald-200/80 text-xs focus:outline-none focus:border-[#EBF700]"
              />
            </div>

            {/* Stat 4 */}
            <div className="bg-[#020F0A] border border-[#007A4D]/40 p-4 rounded-xl space-y-2">
              <label className="text-[10px] uppercase font-bold text-[#EBF700]">Stat 4 (Value & Label)</label>
              <input
                type="text"
                value={stat4Value}
                onChange={(e) => setStat4Value(e.target.value)}
                placeholder="500+"
                className="w-full bg-[#051A10] border border-[#007A4D]/50 rounded-lg px-3 py-1.5 text-white text-sm focus:outline-none focus:border-[#EBF700]"
              />
              <input
                type="text"
                value={stat4Label}
                onChange={(e) => setStat4Label(e.target.value)}
                placeholder="Honorees"
                className="w-full bg-[#051A10] border border-[#007A4D]/50 rounded-lg px-3 py-1.5 text-emerald-200/80 text-xs focus:outline-none focus:border-[#EBF700]"
              />
            </div>
          </div>
        </div>

        {/* 5. Bank Transfer Payment Details */}
        <div className="bg-[#051A10]/90 border border-[#007A4D]/40 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center gap-3 border-b border-[#007A4D]/30 pb-3">
            <span className="text-2xl">💳</span>
            <div>
              <h2 className="text-lg font-bold text-white">Manual Bank Payment Details</h2>
              <p className="text-xs text-emerald-300/60">Displayed to voters selecting manual bank transfer payment option</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs uppercase font-semibold text-emerald-200 mb-2">Bank Name</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-emerald-200 mb-2">Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700] transition-colors font-mono tracking-wide"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-emerald-200 mb-2">Account Name</label>
              <input
                type="text"
                value={accountName}
                onChange={(e) => setAccountName(e.target.value)}
                className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* 6. Footer & Developer Credit */}
        <div className="bg-[#051A10]/90 border border-[#007A4D]/40 p-6 md:p-8 rounded-2xl shadow-xl backdrop-blur-md space-y-6">
          <div className="flex items-center gap-3 border-b border-[#007A4D]/30 pb-3">
            <span className="text-2xl">🏷️</span>
            <div>
              <h2 className="text-lg font-bold text-white">Footer & Credit Overrides</h2>
              <p className="text-xs text-emerald-300/60">Copyright notice and developer attribution</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase font-semibold text-emerald-200 mb-2">Footer Copyright Template</label>
              <input
                type="text"
                value={footerCredit}
                onChange={(e) => setFooterCredit(e.target.value)}
                className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700] transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs uppercase font-semibold text-emerald-200 mb-2">Developer Name</label>
              <input
                type="text"
                value={developerName}
                onChange={(e) => setDeveloperName(e.target.value)}
                className="w-full bg-[#020F0A] border border-[#007A4D]/50 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#EBF700] transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Floating Submit Action */}
        <div className="sticky bottom-6 z-20 bg-[#051A10]/95 border border-[#007A4D] p-4 rounded-2xl shadow-2xl flex items-center justify-between backdrop-blur-xl">
          <div className="hidden sm:flex items-center gap-2 text-xs text-emerald-200/80">
            <span className="w-2.5 h-2.5 rounded-full bg-[#EBF700] animate-pulse"></span>
            Changes apply instantly to the Awardly frontend database
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto bg-[#EBF700] hover:bg-[#d4e200] text-[#051A10] font-extrabold px-8 py-3.5 rounded-xl shadow-lg shadow-[#EBF700]/20 transition-all transform active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
          >
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-[#051A10] border-t-transparent"></div>
                Saving to Frontend DB...
              </>
            ) : (
              '✨ Save & Publish Settings Live'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
