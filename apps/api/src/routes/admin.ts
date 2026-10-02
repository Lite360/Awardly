import express, { Request, Response, Router } from 'express';

// Re-export router cleanly
export const adminRouter = Router();

// Simple mock auth check middleware for protected management routes
const adminAuthMiddleware = (req: Request, res: Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Authentication token required for administrative access.' },
      requestId: `req_${Date.now()}`,
    });
  }
  next();
};

adminRouter.use(adminAuthMiddleware);

// ── 1. Platform & Tenant Settings Management ──────────────────────────────────
adminRouter.get('/settings', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      name: process.env.PLATFORM_NAME || 'Awardly',
      tagline: 'Celebrating excellence. Your vote matters.',
      platformType: 'awards',
      primaryColor: '#5B21B6',
      accentColor: '#D4AF37',
      defaultCurrency: 'NGN',
      footerCredit: '© 2026 Awardly. All rights reserved.',
      developerCredit: 'Developed by Elite Developers',
      contactEmail: 'admin@awardly.com',
    },
    requestId: `req_${Date.now()}`,
  });
});

adminRouter.put('/settings', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: { ...req.body, updatedAt: new Date().toISOString() },
    requestId: `req_${Date.now()}`,
  });
});

// ── 2. Event Management ────────────────────────────────────────────────────────
adminRouter.get('/events', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      {
        id: 'evt_01',
        slug: 'awardly-2025',
        title: 'Awardly 2025 Annual Awards',
        status: 'live',
        votingMode: 'paid',
        votePrice: 100,
        currency: 'NGN',
      },
    ],
    requestId: `req_${Date.now()}`,
  });
});

// ── 3. Category Management ────────────────────────────────────────────────────
adminRouter.get('/categories', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 'cat_01', name: 'Artist of the Year', slug: 'artist-of-the-year', nomineeCount: 8 },
      { id: 'cat_02', name: 'Entrepreneur of the Year', slug: 'entrepreneur-of-the-year', nomineeCount: 6 },
    ],
    requestId: `req_${Date.now()}`,
  });
});

// ── 4. Nominees Management ────────────────────────────────────────────────────
adminRouter.get('/nominees', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: [
      { id: 'nom_01', name: 'Sarah Jenkins', code: 'NOM-101', categoryId: 'cat_01', isPublished: true, voteCount: 1420 },
      { id: 'nom_02', name: 'David Chen', code: 'NOM-102', categoryId: 'cat_01', isPublished: true, voteCount: 980 },
    ],
    requestId: `req_${Date.now()}`,
  });
});

adminRouter.post('/nominees', (req: Request, res: Response) => {
  res.json({
    success: true,
    data: { id: `nom_${Date.now()}`, ...req.body, voteCount: 0, createdAt: new Date().toISOString() },
    requestId: `req_${Date.now()}`,
  });
});

// ── 5. Payment Audit & Vote Orders Ledger ────────────────────────────────────
adminRouter.get('/financials/summary', (_req: Request, res: Response) => {
  res.json({
    success: true,
    data: {
      totalRevenueKobo: 24000000,
      totalVotesAllocated: 2400,
      totalSuccessfulTransactions: 48,
      currency: 'NGN',
    },
    requestId: `req_${Date.now()}`,
  });
});

// ── 6. Phase 7 Automated Compliance Test Suite ────────────────────────────────
adminRouter.get('/test-suite', async (_req: Request, res: Response) => {
  const { runPhase7TestSuite } = await import('../services/testSuite.js');
  const results = runPhase7TestSuite();
  res.json({
    success: true,
    data: {
      passed: results.every((r) => r.passed),
      totalTests: results.length,
      passCount: results.filter((r) => r.passed).length,
      failCount: results.filter((r) => !r.passed).length,
      results,
    },
    requestId: `req_${Date.now()}`,
  });
});
