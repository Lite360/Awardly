// ─────────────────────────────────────────────────────────────────────────────
// Phase 5: Content, Media & Email Routes
// Public: newsletter subscribe/unsubscribe, contact form, gallery, FAQs
// Admin: media upload/delete, content management
// ─────────────────────────────────────────────────────────────────────────────

import { Router, Request, Response } from 'express';
import crypto from 'crypto';
import { EmailService } from '../services/email.js';
import { MediaService } from '../services/media.js';

const emailService = new EmailService();
const mediaService = new MediaService();

// ── Public content routes ──────────────────────────────────────────────────────
export const contentPublicRouter = Router();

// Gallery — published images only
contentPublicRouter.get('/gallery', (_req: Request, res: Response) => {
  // TODO: Query galleryImages from DB where isPublished = true, ordered by sortOrder
  res.json({
    success: true,
    data: [],
    requestId: `req_${Date.now()}`,
  });
});

// Sponsors — published, ordered by tier & sortOrder
contentPublicRouter.get('/sponsors', (_req: Request, res: Response) => {
  // TODO: Query sponsors from DB where isPublished = true
  res.json({
    success: true,
    data: [],
    requestId: `req_${Date.now()}`,
  });
});

// FAQs — published, ordered by sortOrder
contentPublicRouter.get('/faqs', (_req: Request, res: Response) => {
  // TODO: Query faqs from DB where isPublished = true
  res.json({
    success: true,
    data: [],
    requestId: `req_${Date.now()}`,
  });
});

// Static page content (about, terms, privacy)
contentPublicRouter.get('/pages/:slug', (req: Request, res: Response) => {
  const { slug } = req.params;
  const allowed = ['about', 'terms', 'privacy'];
  if (!allowed.includes(slug)) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Page not found.' },
      requestId: `req_${Date.now()}`,
    });
  }
  // TODO: Query pages table from DB by slug
  res.json({
    success: true,
    data: { slug, title: slug, content: '', isPublished: true },
    requestId: `req_${Date.now()}`,
  });
});

// ── Newsletter Subscribe ───────────────────────────────────────────────────────
contentPublicRouter.post('/newsletter/subscribe', async (req: Request, res: Response) => {
  const { email, name } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_EMAIL', message: 'A valid email address is required.' },
      requestId: `req_${Date.now()}`,
    });
  }

  const unsubscribeToken = crypto.randomBytes(32).toString('hex');
  const platformName = process.env.PLATFORM_NAME || 'Awardly';

  // TODO: Upsert into newsletter_subscribers table, skip if already subscribed
  // const existing = await db.query.newsletterSubscribers.findFirst({ where: eq(newsletterSubscribers.email, email) });
  // if (!existing) { await db.insert(newsletterSubscribers).values({ email, name, unsubscribeToken, consentText: 'subscribed via website form' }) }

  // Send welcome email — non-blocking, failure does not fail the request
  emailService
    .sendNewsletterWelcome({ to: email, name: name || null, unsubscribeToken, platformName })
    .catch((err) => console.error('[Newsletter] Welcome email failed:', err));

  res.json({
    success: true,
    data: { message: 'You have been subscribed to updates. Check your inbox for a confirmation.' },
    requestId: `req_${Date.now()}`,
  });
});

// ── Newsletter Unsubscribe ─────────────────────────────────────────────────────
contentPublicRouter.get('/newsletter/unsubscribe', async (req: Request, res: Response) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_TOKEN', message: 'A valid unsubscribe token is required.' },
      requestId: `req_${Date.now()}`,
    });
  }

  // TODO: Find subscriber by unsubscribeToken and set isUnsubscribed = true, unsubscribedAt = now()
  // const subscriber = await db.query.newsletterSubscribers.findFirst({ where: eq(newsletterSubscribers.unsubscribeToken, token) });
  // if (subscriber) { await db.update(newsletterSubscribers).set({ isUnsubscribed: true, unsubscribedAt: new Date() }).where(eq(newsletterSubscribers.id, subscriber.id)); }

  console.log(`[Newsletter] Unsubscribe token used: ${token.substring(0, 8)}...`);

  res.json({
    success: true,
    data: { message: 'You have been successfully unsubscribed. You will no longer receive updates.' },
    requestId: `req_${Date.now()}`,
  });
});

// ── Contact Form ──────────────────────────────────────────────────────────────
contentPublicRouter.post('/contact', async (req: Request, res: Response) => {
  const { name, email, subject, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_INPUT', message: 'Name, email, and message are required.' },
      requestId: `req_${Date.now()}`,
    });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_EMAIL', message: 'A valid email address is required.' },
      requestId: `req_${Date.now()}`,
    });
  }

  // TODO: Insert into contact_messages table in DB
  // await db.insert(contactMessages).values({ name, email, subject: subject || '(No subject)', message, ipAddress: req.ip });

  const platformName = process.env.PLATFORM_NAME || 'Awardly';
  const contactEmail = process.env.CONTACT_EMAIL || 'support@awardly.com';

  // Send auto-reply to submitter — non-blocking
  emailService
    .sendContactConfirmation({ to: email, name, subject: subject || 'General enquiry', platformName, contactEmail })
    .catch((err) => console.error('[Contact] Confirmation email failed:', err));

  res.json({
    success: true,
    data: { message: 'Your message has been received. We will get back to you as soon as possible.' },
    requestId: `req_${Date.now()}`,
  });
});

// ── Admin Content Routes (require auth via adminRouter middleware) ──────────────
export const contentAdminRouter = Router();

// Media upload endpoint
contentAdminRouter.post('/media/upload', async (req: Request, res: Response) => {
  // In production: req.file is populated by multer middleware on the router
  const file = (req as Request & { file?: Express.Multer.File }).file;

  if (!file) {
    return res.status(400).json({
      success: false,
      error: { code: 'NO_FILE', message: 'No file was provided in the request.' },
      requestId: `req_${Date.now()}`,
    });
  }

  const validation = mediaService.validateFile(file);
  if (!validation.valid) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_FILE', message: validation.error },
      requestId: `req_${Date.now()}`,
    });
  }

  const purpose = (req.body.purpose || 'other') as import('../services/media.js').MediaPurpose;
  const entityId = req.body.entityId as string | undefined;

  try {
    const uploaded = await mediaService.upload(file.buffer, file.originalname, file.mimetype, purpose, entityId);

    // TODO: Insert into media_assets table in DB
    // await db.insert(mediaAssets).values({ url: uploaded.url, pathname: uploaded.pathname, filename: uploaded.filename, mimeType: uploaded.mimeType, sizeBytes: uploaded.sizeBytes, uploadedBy: req.adminUser.id, purpose, entityId, entityType: req.body.entityType });

    res.json({
      success: true,
      data: uploaded,
      requestId: `req_${Date.now()}`,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Upload failed';
    res.status(500).json({
      success: false,
      error: { code: 'UPLOAD_FAILED', message },
      requestId: `req_${Date.now()}`,
    });
  }
});

// Media delete endpoint
contentAdminRouter.delete('/media/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  // TODO: Find media asset in DB by id to get its pathname
  // const asset = await db.query.mediaAssets.findFirst({ where: eq(mediaAssets.id, id) });
  // if (!asset) return res.status(404).json({ ... });

  const pathname = req.body.pathname as string;
  if (!pathname) {
    return res.status(400).json({
      success: false,
      error: { code: 'MISSING_PATHNAME', message: 'pathname is required to delete a media asset.' },
      requestId: `req_${Date.now()}`,
    });
  }

  const result = await mediaService.delete(pathname);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      error: { code: 'DELETE_FAILED', message: result.error },
      requestId: `req_${Date.now()}`,
    });
  }

  // TODO: Delete from media_assets table in DB
  // await db.delete(mediaAssets).where(eq(mediaAssets.id, id));

  res.json({
    success: true,
    data: { id, deleted: true },
    requestId: `req_${Date.now()}`,
  });
});

// Admin: Manage FAQs
contentAdminRouter.get('/faqs', (_req: Request, res: Response) => {
  // TODO: Query all faqs from DB (includes unpublished)
  res.json({ success: true, data: [], requestId: `req_${Date.now()}` });
});

contentAdminRouter.post('/faqs', async (req: Request, res: Response) => {
  const { question, answer, sortOrder } = req.body;
  if (!question || !answer) {
    return res.status(400).json({
      success: false,
      error: { code: 'INVALID_INPUT', message: 'Question and answer are required.' },
      requestId: `req_${Date.now()}`,
    });
  }
  // TODO: Insert into faqs table in DB
  res.json({
    success: true,
    data: { id: `faq_${Date.now()}`, question, answer, sortOrder: sortOrder || 0, isPublished: false },
    requestId: `req_${Date.now()}`,
  });
});

contentAdminRouter.put('/faqs/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: Update FAQ in DB
  res.json({
    success: true,
    data: { id, ...req.body, updatedAt: new Date().toISOString() },
    requestId: `req_${Date.now()}`,
  });
});

contentAdminRouter.delete('/faqs/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: Delete FAQ from DB
  res.json({ success: true, data: { id, deleted: true }, requestId: `req_${Date.now()}` });
});

// Admin: Gallery management
contentAdminRouter.get('/gallery', (_req: Request, res: Response) => {
  // TODO: Query all gallery images from DB (includes unpublished)
  res.json({ success: true, data: [], requestId: `req_${Date.now()}` });
});

contentAdminRouter.put('/gallery/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: Update gallery image (caption, altText, isPublished, sortOrder)
  res.json({
    success: true,
    data: { id, ...req.body, updatedAt: new Date().toISOString() },
    requestId: `req_${Date.now()}`,
  });
});

contentAdminRouter.delete('/gallery/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: Delete from DB and blob storage
  res.json({ success: true, data: { id, deleted: true }, requestId: `req_${Date.now()}` });
});

// Admin: Page content (about, terms, privacy)
contentAdminRouter.put('/pages/:slug', async (req: Request, res: Response) => {
  const { slug } = req.params;
  const { title, content, metaTitle, metaDescription, isPublished } = req.body;
  // TODO: Upsert page content in DB
  res.json({
    success: true,
    data: { slug, title, content, metaTitle, metaDescription, isPublished, updatedAt: new Date().toISOString() },
    requestId: `req_${Date.now()}`,
  });
});

// Admin: Contact messages
contentAdminRouter.get('/contact-messages', (_req: Request, res: Response) => {
  // TODO: Query contactMessages from DB with pagination
  res.json({ success: true, data: [], requestId: `req_${Date.now()}` });
});

contentAdminRouter.put('/contact-messages/:id/read', async (req: Request, res: Response) => {
  const { id } = req.params;
  // TODO: Mark contactMessage as isRead = true
  res.json({ success: true, data: { id, isRead: true }, requestId: `req_${Date.now()}` });
});

// Admin: Newsletter subscribers (read-only view + export)
contentAdminRouter.get('/newsletter/subscribers', (_req: Request, res: Response) => {
  // TODO: Query newsletterSubscribers from DB with pagination
  res.json({ success: true, data: [], requestId: `req_${Date.now()}` });
});

// Admin: Email outbox / delivery log
contentAdminRouter.get('/email-outbox', (_req: Request, res: Response) => {
  // TODO: Query emailOutbox from DB with pagination
  res.json({ success: true, data: [], requestId: `req_${Date.now()}` });
});
