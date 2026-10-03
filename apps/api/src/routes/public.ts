import express, { Request, Response, Router } from 'express';
import { db } from '@awardly/database/client';
import { platformSettings } from '@awardly/database/schema';

export const publicRouter = Router();

// Helper to load settings from DB or default
async function getDbSettings() {
  try {
    const rows = await db.select().from(platformSettings).limit(1);
    if (rows.length > 0) return rows[0];
  } catch (err) {
    console.error('Failed to load settings from DB:', err);
  }
  return null;
}

// ── 1. Platform & Tenant Settings ─────────────────────────────────────────────
publicRouter.get('/settings', async (_req: Request, res: Response) => {
  const dbRow = await getDbSettings();

  const defaultSiteContent = {
    siteName: dbRow?.name || process.env.PLATFORM_NAME || 'Awardly',
    tagline: dbRow?.tagline || process.env.PLATFORM_TAGLINE || 'Celebrating Excellence. Your Vote Matters.',
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

    ...((dbRow as any)?.siteContent as Record<string, unknown> || {}),
  };

  res.json({
    success: true,
    data: {
      name: dbRow?.name || process.env.PLATFORM_NAME || 'Awardly',
      tagline: dbRow?.tagline || process.env.PLATFORM_TAGLINE || 'Celebrating Excellence. Your Vote Matters.',
      platformType: 'awards',
      logoUrl: dbRow?.logoUrl || null,
      faviconUrl: dbRow?.faviconUrl || null,
      primaryColor: dbRow?.primaryColor || '#007A4D',
      primaryDarkColor: '#054C31',
      accentColor: dbRow?.accentColor || '#EBF700',
      backgroundColor: '#F4FAF5',
      textColor: '#0B2B1B',
      defaultCurrency: 'NGN',
      footerCredit: dbRow?.footerCredit || '© {year} Awardly. All rights reserved.',
      developerCredit: dbRow?.developerCredit || 'Developed by',
      contactEmail: dbRow?.contactEmail || process.env.CONTACT_EMAIL || 'info@awardly.com',
      contactPhone: dbRow?.contactPhone || process.env.CONTACT_PHONE || '+234 812 345 6789',
      socialLinks: dbRow?.socialLinks || {
        twitter: 'https://twitter.com',
        instagram: 'https://instagram.com',
        facebook: 'https://facebook.com',
      },
      features: dbRow?.features || {
        gallery: true,
        sponsors: true,
        leaderboard: true,
        newsletter: true,
        contactForm: true,
        faq: true,
        aboutPage: true,
      },

      // Admin-editable frontend content
      siteContent: defaultSiteContent,
    },
    requestId: `req_${Date.now()}`,
  });
});

// ── 2. Active Event Overview ──────────────────────────────────────────────────
publicRouter.get('/events/active', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      id: 'evt_active_001',
      slug: 'national-excellence-awards-2026',
      title: 'National Excellence Awards 2026',
      description: 'Honoring outstanding talent and leadership across technology, business, and arts.',
      status: 'live',
      currency: 'NGN',
      votingMode: 'paid',
      votePrice: 10000, // 100.00 NGN in kobo
      minVotesPerOrder: 1,
      maxVotesPerOrder: 1000,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      timezone: 'Africa/Lagos',
      branding: {
        heroImageUrl: null,
        heroImageAlt: 'Award Ceremony Stage',
        primaryColor: '#5B21B6',
        accentColor: '#D4AF37',
        logoUrl: null,
        pageCtaImages: {},
      },
    },
    requestId: `req_${Date.now()}`,
  });
});

// ── 3. Categories Listing ─────────────────────────────────────────────────────
publicRouter.get('/categories', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 'cat_01',
        eventId: 'evt_active_001',
        name: 'Tech Innovator of the Year',
        slug: 'tech-innovator-of-the-year',
        description: 'Pioneers building transformative tech solutions.',
        imageUrl: null,
        sortOrder: 1,
        isPublished: true,
        hasCustomPricing: false,
        customVotePrice: null,
        nomineeCount: 4,
      },
      {
        id: 'cat_02',
        eventId: 'evt_active_001',
        name: 'Creative Leader of the Year',
        slug: 'creative-leader-of-the-year',
        description: 'Visionaries shaping design, media, and storytelling.',
        imageUrl: null,
        sortOrder: 2,
        isPublished: true,
        hasCustomPricing: false,
        customVotePrice: null,
        nomineeCount: 3,
      },
    ],
    requestId: `req_${Date.now()}`,
  });
});

// ── 4. Nominees (Search & Filter) ─────────────────────────────────────────────
publicRouter.get('/nominees', (req: Request, res: Response) => {
  const { categorySlug, search } = req.query;

  res.json({
    success: true,
    data: {
      items: [
        {
          id: 'nom_01',
          eventId: 'evt_active_001',
          categoryId: 'cat_01',
          categoryName: 'Tech Innovator of the Year',
          name: 'Sarah Jenkins',
          slug: 'sarah-jenkins',
          code: 'NOM-101',
          bio: 'Founder of NextGen AI Labs.',
          imageUrl: null,
          socialLinks: { twitter: 'https://twitter.com/sarah' },
          isPublished: true,
          sortOrder: 1,
          voteCount: 1420,
        },
        {
          id: 'nom_02',
          eventId: 'evt_active_001',
          categoryId: 'cat_01',
          categoryName: 'Tech Innovator of the Year',
          name: 'David Chen',
          slug: 'david-chen',
          code: 'NOM-102',
          bio: 'Lead Architect at CloudCore Systems.',
          imageUrl: null,
          socialLinks: { twitter: 'https://twitter.com/david' },
          isPublished: true,
          sortOrder: 2,
          voteCount: 980,
        },
      ],
      total: 2,
      page: 1,
      perPage: 20,
      totalPages: 1,
      hasNextPage: false,
      hasPrevPage: false,
    },
    requestId: `req_${Date.now()}`,
  });
});

// ── 5. Nominee Detail Endpoint ────────────────────────────────────────────────
publicRouter.get('/nominees/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;

  res.json({
    success: true,
    data: {
      id: 'nom_01',
      eventId: 'evt_active_001',
      categoryId: 'cat_01',
      categoryName: 'Tech Innovator of the Year',
      name: slug.replace(/-/g, ' ').toUpperCase(),
      slug,
      code: 'NOM-101',
      bio: 'Leading innovator dedicated to building cutting-edge web infrastructure.',
      imageUrl: null,
      socialLinks: { twitter: 'https://twitter.com' },
      isPublished: true,
      sortOrder: 1,
      voteCount: 1420,
    },
    requestId: `req_${Date.now()}`,
  });
});

// ── 6. Public Leaderboard ─────────────────────────────────────────────────────
publicRouter.get('/leaderboard', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      eventId: 'evt_active_001',
      eventTitle: 'National Excellence Awards 2026',
      isLive: true,
      showVoteCounts: true,
      totalVotes: 2400,
      lastUpdated: new Date().toISOString(),
      categories: [
        {
          categoryId: 'cat_01',
          categoryName: 'Tech Innovator of the Year',
          entries: [
            {
              rank: 1,
              nomineeId: 'nom_01',
              nomineeName: 'Sarah Jenkins',
              nomineeImageUrl: null,
              nomineeSlug: 'sarah-jenkins',
              categoryId: 'cat_01',
              categoryName: 'Tech Innovator of the Year',
              voteCount: 1420,
              percentage: 59.1,
            },
            {
              rank: 2,
              nomineeId: 'nom_02',
              nomineeName: 'David Chen',
              nomineeImageUrl: null,
              nomineeSlug: 'david-chen',
              categoryId: 'cat_01',
              categoryName: 'Tech Innovator of the Year',
              voteCount: 980,
              percentage: 40.9,
            },
          ],
        },
      ],
    },
    requestId: `req_${Date.now()}`,
  });
});

// ── 7. Public Content & FAQs ──────────────────────────────────────────────────
publicRouter.get('/content/faqs', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 'faq_1',
        question: 'How do I cast a paid vote?',
        answer: 'Select your nominee, enter your desired vote count, and complete secure Paystack checkout.',
        sortOrder: 1,
        isPublished: true,
      },
      {
        id: 'faq_2',
        question: 'Are vote sales final?',
        answer: 'Yes, all confirmed vote transactions are allocated immediately to the nominee.',
        sortOrder: 2,
        isPublished: true,
      },
    ],
    requestId: `req_${Date.now()}`,
  });
});

// ── 8. Contact Form Submission Endpoint ──────────────────────────────────────
publicRouter.post('/contact', (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_INPUT', message: 'Name, email, and message are required.' },
      requestId: `req_${Date.now()}`,
    });
  }

  res.json({
    success: true,
    data: { message: 'Your message has been received. Thank you for contacting us.' },
    requestId: `req_${Date.now()}`,
  });
});

// ── 9. Newsletter Subscription Endpoint ──────────────────────────────────────
publicRouter.post('/newsletter/subscribe', (req: Request, res: Response) => {
  const { email, name } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_EMAIL', message: 'Valid email address is required.' },
      requestId: `req_${Date.now()}`,
    });
  }

  res.json({
    success: true,
    data: { message: 'Successfully subscribed to the newsletter updates.' },
    requestId: `req_${Date.now()}`,
  });
});
