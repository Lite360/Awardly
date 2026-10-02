// ─────────────────────────────────────────────────────────────────────────────
// Events, Branding, Categories, Nominees
// ─────────────────────────────────────────────────────────────────────────────

import {
    pgTable,
    text,
    boolean,
    timestamp,
    integer,
    jsonb,
    pgEnum,
    index,
    uniqueIndex
} from 'drizzle-orm/pg-core';
import {sql, relations} from 'drizzle-orm';
import {currencyEnum} from './platform';

export const eventStatusEnum = pgEnum('event_status', [
    'draft',
    'scheduled',
    'live',
    'closed',
    'archived',
]);

export const votingModeEnum = pgEnum('voting_mode', ['paid', 'free', 'disabled',]);

// ── Events ────────────────────────────────────────────────────────────────────

export const events = pgTable('events', {
    id: text('id').primaryKey().default(sql `gen_random_uuid()`),
    slug: text('slug').notNull().unique(),
    title: text('title').notNull(),
    description: text('description'),
    status: eventStatusEnum('status').notNull().default('draft'),
    currency: currencyEnum('currency').notNull().default('NGN'),
    votingMode: votingModeEnum('voting_mode').notNull().default('paid'),
    // Price in smallest currency unit (kobo for NGN, cents for USD)
    votePrice: integer('vote_price').notNull().default(10000), // e.g. 100.00 NGN = 10000 kobo
    minVotesPerOrder: integer('min_votes_per_order').notNull().default(1),
    maxVotesPerOrder: integer('max_votes_per_order').notNull().default(1000),
    startDate: timestamp('start_date', {withTimezone: true}),
    endDate: timestamp('end_date', {withTimezone: true}),
    timezone: text('timezone').notNull().default('Africa/Lagos'),
    isLeaderboardPublic: boolean('is_leaderboard_public').notNull().default(true),
    showVoteCounts: boolean('show_vote_counts').notNull().default(false),
    metaTitle: text('meta_title'),
    metaDescription: text('meta_description'),
    createdAt: timestamp('created_at', {withTimezone: true}).notNull().default(sql `now()`),
    updatedAt: timestamp('updated_at', {withTimezone: true}).notNull().default(sql `now()`)
}, (t) => [
    index('events_status_idx').on(t.status),
    index('events_slug_idx').on(t.slug),
]);

// ── Event Branding ────────────────────────────────────────────────────────────

export const eventBranding = pgTable('event_branding', {
    id: text('id').primaryKey().default(sql `gen_random_uuid()`),
    eventId: text('event_id').notNull().unique().references(() => events.id, {onDelete: 'cascade'}),
    heroImageUrl: text('hero_image_url'),
    heroImageAlt: text('hero_image_alt'),
    primaryColor: text('primary_color'),
    accentColor: text('accent_color'),
    logoUrl: text('logo_url'),
    // Per-page CTA images stored as JSON
    pageCtaImages: jsonb('page_cta_images').$type<{
      home?: string;
      about?: string;
      categories?: string;
      nominees?: string;
      vote?: string;
      leaderboard?: string;
      gallery?: string;
      contact?: string;
      faq?: string;
    }>().default({}),
    createdAt: timestamp('created_at', {withTimezone: true}).notNull().default(sql `now()`),
    updatedAt: timestamp('updated_at', {withTimezone: true}).notNull().default(sql `now()`)
});

// ── Categories ────────────────────────────────────────────────────────────────

export const categories = pgTable('categories', {
    id: text('id').primaryKey().default(sql `gen_random_uuid()`),
    eventId: text('event_id').notNull().references(() => events.id, {onDelete: 'cascade'}),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    description: text('description'),
    imageUrl: text('image_url'),
    sortOrder: integer('sort_order').notNull().default(0),
    isPublished: boolean('is_published').notNull().default(false),
    hasCustomPricing: boolean('has_custom_pricing').notNull().default(false),
    customVotePrice: integer('custom_vote_price'), // kobo/cents, overrides event price
    createdAt: timestamp('created_at', {withTimezone: true}).notNull().default(sql `now()`),
    updatedAt: timestamp('updated_at', {withTimezone: true}).notNull().default(sql `now()`)
}, (t) => [
    uniqueIndex('categories_event_slug_idx').on(t.eventId, t.slug),
    index('categories_event_id_idx').on(t.eventId),
    index('categories_published_idx').on(t.isPublished),
]);

// ── Nominees ──────────────────────────────────────────────────────────────────

export const nominees = pgTable('nominees', {
    id: text('id').primaryKey().default(sql `gen_random_uuid()`),
    eventId: text('event_id').notNull().references(() => events.id, {onDelete: 'cascade'}),
    categoryId: text('category_id').notNull().references(() => categories.id, {onDelete: 'restrict'}),
    name: text('name').notNull(),
    slug: text('slug').notNull(),
    code: text('code').notNull(), // short code e.g. NOM-001
    bio: text('bio'),
    imageUrl: text('image_url'),
    socialLinks: jsonb('social_links').$type<{
        twitter?: string;
        instagram?: string;
        facebook?: string;
        youtube?: string;
        tiktok?: string;
      }>().default({}),
    isPublished: boolean('is_published').notNull().default(false),
    sortOrder: integer('sort_order').notNull().default(0),
    createdAt: timestamp('created_at', {withTimezone: true}).notNull().default(sql `now()`),
    updatedAt: timestamp('updated_at', {withTimezone: true}).notNull().default(sql `now()`)
}, (t) => [
    uniqueIndex('nominees_event_slug_idx').on(t.eventId, t.slug),
    uniqueIndex('nominees_event_code_idx').on(t.eventId, t.code),
    index('nominees_event_id_idx').on(t.eventId),
    index('nominees_category_id_idx').on(t.categoryId),
    index('nominees_published_idx').on(t.isPublished),
]);

// ── Relations ─────────────────────────────────────────────────────────────────

export const eventsRelations = relations(events, ({one, many}) => ({
    branding: one(eventBranding, {
        fields: [events.id],
        references: [eventBranding.eventId]
    }),
    categories: many(categories),
    nominees: many(nominees)
}));

export const eventBrandingRelations = relations(eventBranding, ({one}) => ({
    event: one(events, {
        fields: [eventBranding.eventId],
        references: [events.id]
    })
}));

export const categoriesRelations = relations(categories, ({one, many}) => ({
    event: one(events, {
        fields: [categories.eventId],
        references: [events.id]
    }),
    nominees: many(nominees)
}));

export const nomineesRelations = relations(nominees, ({one}) => ({
    event: one(events, {
        fields: [nominees.eventId],
        references: [events.id]
    }),
    category: one(categories, {
        fields: [nominees.categoryId],
        references: [categories.id]
    })
}));
