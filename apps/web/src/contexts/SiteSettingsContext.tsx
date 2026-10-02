// ─────────────────────────────────────────────────────────────────────────────
// SiteSettingsContext — loads PlatformSettings from the API once on boot
// and provides them to every page/component via React Context.
// Admin can control: site name, tagline, hero text, CTA labels, colors, etc.
// ─────────────────────────────────────────────────────────────────────────────

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getPlatformSettings } from '../services/public';
import type { PlatformSettings } from '@awardly/shared-types';

// ── Extended frontend-specific content settings (loaded from API) ────────────
export interface SiteContent {
  // Core branding
  siteName: string;
  tagline: string;
  logoUrl: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  contactAddress: string;

  // Hero section
  heroTitle: string;
  heroSubtitle: string;
  heroCta1Label: string;
  heroCta1Link: string;
  heroCta2Label: string;
  heroCta2Link: string;

  // Ticker / announcement bar
  tickerText: string;
  tickerEnabled: boolean;

  // Navbar CTA buttons
  navCta1Label: string;
  navCta1Link: string;
  navCta2Label: string;
  navCta2Link: string;

  // About section (homepage)
  aboutSectionTitle: string;
  aboutSectionText: string;

  // Nominee label overrides (e.g. "Contestant" instead of "Nominee")
  nomineeLabel: string;
  nomineeLabelPlural: string;

  // CTA labels
  voteCtaLabel: string;
  registerCtaLabel: string;

  // Footer
  footerCredit: string;
  developerCredit: string;
  developerName: string;

  // Stats strip
  stat1Value: string;
  stat1Label: string;
  stat2Value: string;
  stat2Label: string;
  stat3Value: string;
  stat3Label: string;
  stat4Value: string;
  stat4Label: string;

  // Manual Payment Details
  manualBankName: string;
  manualAccountNumber: string;
  manualAccountName: string;

  // Social links
  socialLinks: {
    twitter?: string;
    instagram?: string;
    facebook?: string;
    youtube?: string;
    tiktok?: string;
    linkedin?: string;
    whatsapp?: string;
  };

  // Feature flags
  features: {
    gallery: boolean;
    sponsors: boolean;
    leaderboard: boolean;
    newsletter: boolean;
    contactForm: boolean;
    faq: boolean;
    aboutPage: boolean;
  };
}

// ── Defaults (used when API is unreachable) ──────────────────────────────────
const DEFAULT_SITE_CONTENT: SiteContent = {
  siteName: 'Awardly',
  tagline: 'Celebrating Excellence. Your Vote Matters.',
  logoUrl: null,
  contactEmail: 'info@awardly.com',
  contactPhone: '+234 812 345 6789',
  contactAddress: 'Lagos, Nigeria.',

  heroTitle: 'Celebrating Talent, Impact, and Excellence',
  heroSubtitle:
    'Awardly is a prestigious recognition program honoring gifted people, rising talents, and impactful changemakers who inspire communities across Africa.',
  heroCta1Label: '👤 Register Now',
  heroCta1Link: '/register',
  heroCta2Label: '✓ Vote Now',
  heroCta2Link: '/vote',

  tickerText: '🔔 AWARDLY AWARDS 2026 — NOMINATIONS & VOTING NOW OPEN',
  tickerEnabled: true,

  navCta1Label: '👤 Register Now',
  navCta1Link: '/register',
  navCta2Label: '✓ Vote Now',
  navCta2Link: '/vote',

  aboutSectionTitle: 'Honoring Excellence Across Africa',
  aboutSectionText:
    'Awardly is an annual prestigious recognition program that seeks to honor exceptional talents, rising icons, and impactful leaders who are making a remarkable difference in their respective fields across Africa.',

  nomineeLabel: 'Nominee',
  nomineeLabelPlural: 'Nominees',

  voteCtaLabel: 'Vote Now',
  registerCtaLabel: 'Register Now',

  footerCredit: '© {year} Awardly. All rights reserved.',
  developerCredit: 'Developed by',
  developerName: 'Graciecreatives',

  stat1Value: '15+',
  stat1Label: 'Years of Recognition',
  stat2Value: '50+',
  stat2Label: 'Award Categories',
  stat3Value: '100K+',
  stat3Label: 'Total Votes',
  stat4Value: '500+',
  stat4Label: 'Honorees & Nominees',

  manualBankName: 'Guaranty Trust Bank (GTB)',
  manualAccountNumber: '0123456789',
  manualAccountName: 'Awardly Official',

  socialLinks: {},
  features: {
    gallery: true,
    sponsors: true,
    leaderboard: true,
    newsletter: true,
    contactForm: true,
    faq: true,
    aboutPage: true,
  },
};

// ── Context ──────────────────────────────────────────────────────────────────
interface SiteSettingsContextValue {
  settings: SiteContent;
  loading: boolean;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue>({
  settings: DEFAULT_SITE_CONTENT,
  loading: true,
});

export function useSiteSettings() {
  return useContext(SiteSettingsContext);
}

// ── Helper: map PlatformSettings from API → SiteContent ─────────────────────
function mapPlatformToSiteContent(api: PlatformSettings): SiteContent {
  return {
    ...DEFAULT_SITE_CONTENT,
    siteName: api.name || DEFAULT_SITE_CONTENT.siteName,
    tagline: api.tagline || DEFAULT_SITE_CONTENT.tagline,
    logoUrl: api.logoUrl,
    contactEmail: api.contactEmail,
    contactPhone: api.contactPhone,
    footerCredit: api.footerCredit || DEFAULT_SITE_CONTENT.footerCredit,
    developerCredit: api.developerCredit || DEFAULT_SITE_CONTENT.developerCredit,
    socialLinks: api.socialLinks || {},
    features: api.features || DEFAULT_SITE_CONTENT.features,

    // The admin can set these via the extended siteContent JSON field
    // which gets merged on top of defaults
    ...(((api as unknown) as Record<string, unknown>).siteContent as Partial<SiteContent> || {}),
  };
}

// ── Provider ─────────────────────────────────────────────────────────────────
export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteContent>(DEFAULT_SITE_CONTENT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlatformSettings()
      .then((data) => {
        if (data) {
          setSettings(mapPlatformToSiteContent(data));
        }
      })
      .catch(() => {
        // Use defaults when API is down
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <SiteSettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export default SiteSettingsContext;
