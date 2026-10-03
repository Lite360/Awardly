// ─────────────────────────────────────────────────────────────────────────────
// Content — Gallery, Sponsors, FAQs, Pages, Media Assets
// ─────────────────────────────────────────────────────────────────────────────

import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  pgEnum,
  index,
} from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';
import { events } from './events.js';

export const mediaPurposeEnum = pgEnum('media_purpose', [
  'platform_logo',
  'event_hero',
  'event_logo',
  'page_cta',
  'nominee_photo',
  'category_image',
  'gallery_image',
  'sponsor_logo',
  'favicon',
  'other',
]);

export const sponsorTierEnum = pgEnum('sponsor_tier', [
  'title',
  'gold',
  'silver',
  'bronze',
  'partner',
]);

// ── Media Assets ──────────────────────────────────────────────────────────────

export const mediaAssets = pgTable(
  'media_assets',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    url: text('url').notNull(), // Vercel Blob URL
    pathname: text('pathname').notNull(), // Blob pathname for deletion
    filename: text('filename').notNull(),
    mimeType: text('mime_type').notNull(),
    sizeBytes: integer('size_bytes').notNull(),
    altText: text('alt_text'),
    uploadedBy: text('uploaded_by').notNull(), // admin user id
    purpose: mediaPurposeEnum('purpose').notNull().default('other'),
    entityId: text('entity_id'), // e.g. nominee id, event id
    entityType: text('entity_type'), // 'nominee', 'event', 'category', etc.
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index('media_assets_purpose_idx').on(t.purpose),
    index('media_assets_entity_idx').on(t.entityType, t.entityId),
  ]
);

// ── Gallery ───────────────────────────────────────────────────────────────────

export const galleryImages = pgTable(
  'gallery_images',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    url: text('url').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    altText: text('alt_text'),
    caption: text('caption'),
    sortOrder: integer('sort_order').notNull().default(0),
    isPublished: boolean('is_published').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [index('gallery_images_event_id_idx').on(t.eventId)]
);

// ── Sponsors ──────────────────────────────────────────────────────────────────

export const sponsors = pgTable(
  'sponsors',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'cascade' }),
    name: text('name').notNull(),
    logoUrl: text('logo_url'),
    websiteUrl: text('website_url'),
    tier: sponsorTierEnum('tier').notNull().default('partner'),
    sortOrder: integer('sort_order').notNull().default(0),
    isPublished: boolean('is_published').notNull().default(false),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [index('sponsors_event_id_idx').on(t.eventId)]
);

// ── FAQs ──────────────────────────────────────────────────────────────────────

export const faqs = pgTable('faqs', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  question: text('question').notNull(),
  answer: text('answer').notNull(),
  sortOrder: integer('sort_order').notNull().default(0),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

// ── Static Pages ──────────────────────────────────────────────────────────────

export const pages = pgTable('pages', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  slug: text('slug').notNull().unique(), // 'about', 'terms', 'privacy'
  title: text('title').notNull(),
  content: text('content').notNull(), // HTML or Markdown
  metaTitle: text('meta_title'),
  metaDescription: text('meta_description'),
  isPublished: boolean('is_published').notNull().default(false),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

// ── Relations ─────────────────────────────────────────────────────────────────

export const galleryImagesRelations = relations(galleryImages, ({ one }) => ({
  event: one(events, {
    fields: [galleryImages.eventId],
    references: [events.id],
  }),
}));

export const sponsorsRelations = relations(sponsors, ({ one }) => ({
  event: one(events, {
    fields: [sponsors.eventId],
    references: [events.id],
  }),
}));
