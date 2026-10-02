// ─────────────────────────────────────────────────────────────────────────────
// Platform Settings — deployment identity and global configuration
// ─────────────────────────────────────────────────────────────────────────────

import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  jsonb,
  pgEnum,
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

export const platformTypeEnum = pgEnum('platform_type', [
  'awards',
  'talent_competition',
  'public_poll',
  'community_voting',
]);

export const currencyEnum = pgEnum('currency', [
  'NGN',
  'USD',
  'GHS',
  'GBP',
  'EUR',
]);

export const platformSettings = pgTable('platform_settings', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  name: text('name').notNull().default('Awardly'),
  tagline: text('tagline')
    .notNull()
    .default('Celebrating excellence. Your vote matters.'),
  platformType: platformTypeEnum('platform_type').notNull().default('awards'),
  logoUrl: text('logo_url'),
  faviconUrl: text('favicon_url'),
  primaryColor: text('primary_color').notNull().default('#5B21B6'),
  primaryDarkColor: text('primary_dark_color').notNull().default('#3B0764'),
  accentColor: text('accent_color').notNull().default('#D4AF37'),
  backgroundColor: text('background_color').notNull().default('#FCFAF5'),
  textColor: text('text_color').notNull().default('#171717'),
  defaultCurrency: currencyEnum('default_currency').notNull().default('NGN'),
  footerCredit: text('footer_credit')
    .notNull()
    .default('© {year} {brandName}. All rights reserved.'),
  developerCredit: text('developer_credit')
    .notNull()
    .default('Developed by Elite Developers.'),
  developerUrl: text('developer_url').default('https://elitedevelopers.agency'),
  contactEmail: text('contact_email'),
  contactPhone: text('contact_phone'),
  // JSON fields
  socialLinks: jsonb('social_links')
    .$type<{
      twitter?: string;
      instagram?: string;
      facebook?: string;
      youtube?: string;
      tiktok?: string;
      linkedin?: string;
      whatsapp?: string;
    }>()
    .default({}),
  features: jsonb('features')
    .$type<{
      gallery: boolean;
      sponsors: boolean;
      leaderboard: boolean;
      newsletter: boolean;
      contactForm: boolean;
      faq: boolean;
      aboutPage: boolean;
    }>()
    .default({
      gallery: true,
      sponsors: true,
      leaderboard: true,
      newsletter: true,
      contactForm: true,
      faq: true,
      aboutPage: true,
    }),
  emailFromName: text('email_from_name').notNull().default('Awardly'),
  emailFromAddress: text('email_from_address').notNull().default('noreply@awardly.com'),
  // Singleton row guard
  singletonKey: integer('singleton_key').notNull().unique().default(1),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});
