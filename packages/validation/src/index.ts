// ─────────────────────────────────────────────────────────────────────────────
// Awardly — Zod Validation Schemas
// Used by API route handlers for all incoming request validation
// ─────────────────────────────────────────────────────────────────────────────

import { z } from 'zod';

// ── Primitives ────────────────────────────────────────────────────────────────

export const currencySchema = z.enum(['NGN', 'USD', 'GHS', 'GBP', 'EUR']);

export const slugSchema = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug must be lowercase letters, numbers and hyphens only');

export const colorSchema = z
  .string()
  .regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g. #5B21B6)');

export const urlSchema = z.string().url().max(2048).optional().or(z.literal(''));

export const socialLinksSchema = z
  .object({
    twitter: urlSchema,
    instagram: urlSchema,
    facebook: urlSchema,
    youtube: urlSchema,
    tiktok: urlSchema,
    linkedin: urlSchema,
    whatsapp: urlSchema,
  })
  .partial();

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  perPage: z.coerce.number().int().min(1).max(100).default(20),
});

// ── Checkout / Voting ─────────────────────────────────────────────────────────

export const createOrderSchema = z.object({
  eventId: z.string().uuid(),
  nomineeId: z.string().uuid(),
  categoryId: z.string().uuid(),
  quantity: z.number().int().min(1).max(10000),
  voterEmail: z.string().email().max(255),
  voterName: z.string().max(255).optional(),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;

export const verifyPaymentSchema = z.object({
  reference: z.string().min(1).max(255),
});

export type VerifyPaymentInput = z.infer<typeof verifyPaymentSchema>;

// ── Newsletter ────────────────────────────────────────────────────────────────

export const newsletterSubscribeSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().max(255).optional(),
});

export type NewsletterSubscribeInput = z.infer<typeof newsletterSubscribeSchema>;

// ── Contact ───────────────────────────────────────────────────────────────────

export const contactMessageSchema = z.object({
  name: z.string().min(2).max(255),
  email: z.string().email().max(255),
  subject: z.string().min(5).max(255),
  message: z.string().min(20).max(5000),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

// ── Events (Management) ───────────────────────────────────────────────────────

export const createEventSchema = z.object({
  slug: slugSchema,
  title: z.string().min(3).max(255),
  description: z.string().max(5000).optional(),
  currency: currencySchema,
  votingMode: z.enum(['paid', 'free', 'disabled']),
  votePrice: z.number().int().min(0).default(10000), // kobo
  minVotesPerOrder: z.number().int().min(1).default(1),
  maxVotesPerOrder: z.number().int().min(1).max(10000).default(1000),
  startDate: z.string().datetime({ offset: true }).optional(),
  endDate: z.string().datetime({ offset: true }).optional(),
  timezone: z.string().default('Africa/Lagos'),
  isLeaderboardPublic: z.boolean().default(true),
  showVoteCounts: z.boolean().default(false),
  metaTitle: z.string().max(255).optional(),
  metaDescription: z.string().max(500).optional(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;
export const updateEventSchema = createEventSchema.partial();
export type UpdateEventInput = z.infer<typeof updateEventSchema>;

// ── Categories (Management) ───────────────────────────────────────────────────

export const createCategorySchema = z.object({
  name: z.string().min(2).max(255),
  slug: slugSchema,
  description: z.string().max(2000).optional(),
  sortOrder: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(false),
  hasCustomPricing: z.boolean().default(false),
  customVotePrice: z.number().int().min(0).optional(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export const updateCategorySchema = createCategorySchema.partial();
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;

// ── Nominees (Management) ─────────────────────────────────────────────────────

export const createNomineeSchema = z.object({
  categoryId: z.string().uuid(),
  name: z.string().min(2).max(255),
  slug: slugSchema,
  code: z.string().min(2).max(20).regex(/^[A-Z0-9-]+$/, 'Code must be uppercase letters, numbers and hyphens'),
  bio: z.string().max(5000).optional(),
  socialLinks: socialLinksSchema.optional(),
  sortOrder: z.number().int().min(0).default(0),
  isPublished: z.boolean().default(false),
});

export type CreateNomineeInput = z.infer<typeof createNomineeSchema>;
export const updateNomineeSchema = createNomineeSchema.partial();
export type UpdateNomineeInput = z.infer<typeof updateNomineeSchema>;

// ── Auth (Management) ─────────────────────────────────────────────────────────

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
  totpCode: z.string().length(6).optional(), // optional MFA code
});

export type LoginInput = z.infer<typeof loginSchema>;

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8).max(128),
    newPassword: z
      .string()
      .min(12)
      .max(128)
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
        'Password must contain uppercase, lowercase, number and special character'
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

export const createAdminUserSchema = z.object({
  email: z.string().email().max(255),
  name: z.string().min(2).max(255),
  role: z.enum(['owner', 'event_operator', 'finance_operator', 'viewer']),
  password: z.string().min(12).max(128),
});

export type CreateAdminUserInput = z.infer<typeof createAdminUserSchema>;

// ── Platform Settings (Management) ───────────────────────────────────────────

export const updatePlatformSettingsSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  tagline: z.string().max(500).optional(),
  platformType: z.enum(['awards', 'talent_competition', 'public_poll', 'community_voting']).optional(),
  primaryColor: colorSchema.optional(),
  primaryDarkColor: colorSchema.optional(),
  accentColor: colorSchema.optional(),
  backgroundColor: colorSchema.optional(),
  textColor: colorSchema.optional(),
  defaultCurrency: currencySchema.optional(),
  footerCredit: z.string().max(500).optional(),
  developerCredit: z.string().max(500).optional(),
  developerUrl: z.string().url().max(2048).optional(),
  contactEmail: z.string().email().max(255).optional(),
  contactPhone: z.string().max(50).optional(),
  socialLinks: socialLinksSchema.optional(),
  emailFromName: z.string().max(100).optional(),
  emailFromAddress: z.string().email().max(255).optional(),
});

export type UpdatePlatformSettingsInput = z.infer<typeof updatePlatformSettingsSchema>;

// ── Refunds (Finance) ─────────────────────────────────────────────────────────

export const requestRefundSchema = z.object({
  paymentId: z.string().uuid(),
  reason: z.string().min(10).max(1000),
  notes: z.string().max(2000).optional(),
  reverseVotes: z.boolean().default(true),
});

export type RequestRefundInput = z.infer<typeof requestRefundSchema>;
