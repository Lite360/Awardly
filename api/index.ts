// Vercel Serverless Function — Awardly API
// All /api/** routes are handled here and connect to Neon Postgres.
// This is the ONLY server-side entry point deployed on Vercel.

import type { VercelRequest, VercelResponse } from '@vercel/node';
import express, { type Request, type Response, type NextFunction } from 'express';
import cors from 'cors';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';
import {
  platformSettings,
  events,
  categories,
  nominees,
  voteOrders,
} from '../packages/database/src/schema/index';

// ── DB Connection ─────────────────────────────────────────────────────────────
const connectionString =
  process.env['DATABASE_URL'] ||
  process.env['POSTGRES_URL'] ||
  process.env['POSTGRES_PRISMA_URL'] ||
  process.env['DATABASE_URL_UNPOOLED'] ||
  process.env['POSTGRES_URL_NON_POOLING'] ||
  '';

const sql = neon(connectionString);
const db = drizzle(sql, {});

// ── Express App ───────────────────────────────────────────────────────────────
const app = express();
app.use(cors({ origin: '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Helpers ───────────────────────────────────────────────────────────────────
async function getOrCreateSettings() {
  const rows = await db.select().from(platformSettings).limit(1);
  if (rows.length > 0) return rows[0]!;
  const inserted = await db
    .insert(platformSettings)
    .values({ singletonKey: 1 })
    .onConflictDoNothing()
    .returning();
  return inserted[0] ?? (await db.select().from(platformSettings).limit(1))[0]!;
}

// ── Auth Middleware ───────────────────────────────────────────────────────────
const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const auth = req.headers.authorization;
  if (!auth?.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication token required.' },
      requestId: `req_${Date.now()}`,
    });
  }
  next();
};

// ── Auth Route ────────────────────────────────────────────────────────────────
app.post('/api/admin/auth/login', (_req, res) => {
  res.json({
    success: true,
    data: {
      token: `ADMIN_TOKEN_${Date.now()}`,
      user: { id: 'admin_1', email: 'admin@awardly.com', name: 'Super Admin' },
    },
    requestId: `req_${Date.now()}`,
  });
});

// ══════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/health', (_req, res) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

app.get('/api/public/settings', async (_req, res) => {
  try {
    const dbRow = await db.select().from(platformSettings).limit(1).then(r => r[0] ?? null);

    const defaultSiteContent = {
      siteName: dbRow?.name || 'Awardly',
      tagline: dbRow?.tagline || 'Celebrating Excellence. Your Vote Matters.',
      contactAddress: 'Lagos, Nigeria.',
      heroTitle: 'Celebrating Talent, Impact, and Excellence',
      heroSubtitle: 'Awardly is a prestigious recognition program honoring gifted people, rising talents, and impactful changemakers who inspire communities across Africa.',
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
      aboutSectionText: 'Awardly is an annual prestigious recognition program that seeks to honor exceptional talents, rising icons, and impactful leaders making a remarkable difference across Africa.',
      nomineeLabel: 'Nominee',
      nomineeLabelPlural: 'Nominees',
      voteCtaLabel: 'Vote Now',
      registerCtaLabel: 'Register Now',
      developerName: 'Graciecreatives',
      stat1Value: '15+', stat1Label: 'Years of Recognition',
      stat2Value: '50+', stat2Label: 'Award Categories',
      stat3Value: '100K+', stat3Label: 'Total Votes',
      stat4Value: '500+', stat4Label: 'Honorees & Nominees',
      manualBankName: 'Guaranty Trust Bank (GTB)',
      manualAccountNumber: '0123456789',
      manualAccountName: 'Awardly Official',
      ...((dbRow as any)?.siteContent as Record<string, unknown> || {}),
    };

    res.json({
      success: true,
      data: {
        name: dbRow?.name || 'Awardly',
        tagline: dbRow?.tagline || 'Celebrating Excellence. Your Vote Matters.',
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
        contactEmail: dbRow?.contactEmail || 'info@awardly.com',
        contactPhone: dbRow?.contactPhone || '+234 812 345 6789',
        socialLinks: dbRow?.socialLinks || { twitter: 'https://twitter.com', instagram: 'https://instagram.com', facebook: 'https://facebook.com' },
        features: dbRow?.features || { gallery: true, sponsors: true, leaderboard: true, newsletter: true, contactForm: true, faq: true, aboutPage: true },
        siteContent: defaultSiteContent,
      },
      requestId: `req_${Date.now()}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load settings';
    res.status(500).json({ success: false, error: { code: 'DB_ERROR', message }, requestId: `req_${Date.now()}` });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES (protected)
// ══════════════════════════════════════════════════════════════════════════════

app.get('/api/admin/settings', adminAuth, async (_req, res) => {
  try {
    const row = await getOrCreateSettings();
    res.json({ success: true, data: row, requestId: `req_${Date.now()}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'DB Error';
    res.status(500).json({ success: false, error: { code: 'DB_ERROR', message }, requestId: `req_${Date.now()}` });
  }
});

app.put('/api/admin/settings', adminAuth, async (req, res) => {
  try {
    const allowed = ['name', 'tagline', 'contactEmail', 'contactPhone', 'primaryColor', 'accentColor', 'footerCredit', 'developerCredit', 'socialLinks', 'features', 'siteContent'];
    const patch: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in req.body) patch[key] = req.body[key];
    }
    patch['updatedAt'] = new Date();
    await getOrCreateSettings();
    const updated = await db
      .update(platformSettings)
      .set(patch as any)
      .where(eq(platformSettings.singletonKey, 1))
      .returning();
    res.json({ success: true, data: updated[0], requestId: `req_${Date.now()}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'DB Error';
    res.status(500).json({ success: false, error: { code: 'DB_ERROR', message }, requestId: `req_${Date.now()}` });
  }
});

app.get('/api/admin/events', adminAuth, async (_req, res) => {
  try {
    let rows = await db.select().from(events);
    if (rows.length === 0) {
      const ins = await db.insert(events).values({
        title: 'Awardly 2026 Annual Awards', slug: 'awardly-2026',
        status: 'live', votingMode: 'paid', votePrice: 10000,
      }).returning();
      rows = ins;
    }
    res.json({ success: true, data: rows, requestId: `req_${Date.now()}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'DB Error';
    res.status(500).json({ success: false, error: { code: 'DB_ERROR', message }, requestId: `req_${Date.now()}` });
  }
});

app.get('/api/admin/categories', adminAuth, async (_req, res) => {
  try {
    const rows = await db.select().from(categories);
    res.json({ success: true, data: rows, requestId: `req_${Date.now()}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'DB Error';
    res.status(500).json({ success: false, error: { code: 'DB_ERROR', message }, requestId: `req_${Date.now()}` });
  }
});

app.get('/api/admin/nominees', adminAuth, async (_req, res) => {
  try {
    const rows = await db.select().from(nominees);
    res.json({ success: true, data: rows, requestId: `req_${Date.now()}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'DB Error';
    res.status(500).json({ success: false, error: { code: 'DB_ERROR', message }, requestId: `req_${Date.now()}` });
  }
});

app.post('/api/admin/nominees', adminAuth, async (req, res) => {
  try {
    const { name, code, categoryId, isPublished } = req.body;
    const slug = `${(name || 'nominee').toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${Date.now()}`;
    const evts = await db.select().from(events).limit(1);
    const eventId = evts[0]?.id;
    const cats = await db.select().from(categories).limit(1);
    const catId = categoryId || cats[0]?.id;
    if (eventId && catId) {
      const ins = await db.insert(nominees).values({
        eventId, categoryId: catId,
        name: name || 'New Nominee', slug,
        code: code || `NOM-${Math.floor(100 + Math.random() * 900)}`,
        isPublished: isPublished ?? true,
      }).returning();
      return res.json({ success: true, data: ins[0], requestId: `req_${Date.now()}` });
    }
    res.json({ success: true, data: { id: `nom_${Date.now()}`, ...req.body }, requestId: `req_${Date.now()}` });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'DB Error';
    res.status(500).json({ success: false, error: { code: 'DB_ERROR', message }, requestId: `req_${Date.now()}` });
  }
});

app.get('/api/admin/financials/summary', adminAuth, async (_req, res) => {
  try {
    const paidOrders = await db.select().from(voteOrders).where(eq(voteOrders.status, 'paid'));
    res.json({
      success: true,
      data: {
        totalRevenueKobo: paidOrders.reduce((s, o) => s + (o.totalAmount || 0), 0),
        totalVotesAllocated: paidOrders.reduce((s, o) => s + (o.quantity || 0), 0),
        totalSuccessfulTransactions: paidOrders.length,
        currency: 'NGN',
      },
      requestId: `req_${Date.now()}`,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'DB Error';
    res.status(500).json({ success: false, error: { code: 'DB_ERROR', message }, requestId: `req_${Date.now()}` });
  }
});

// ── 404 Fallback ──────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Endpoint not found' } });
});

// ── Vercel Export ─────────────────────────────────────────────────────────────
export default (req: VercelRequest, res: VercelResponse) => {
  return app(req as any, res as any);
};
