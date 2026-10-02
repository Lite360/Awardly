// ─────────────────────────────────────────────────────────────────────────────
// Users, Auth, Sessions — Private management application only
// ─────────────────────────────────────────────────────────────────────────────

import {
  pgTable,
  text,
  boolean,
  timestamp,
  pgEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';

export const adminRoleEnum = pgEnum('admin_role', [
  'owner',
  'event_operator',
  'finance_operator',
  'viewer',
]);

// ── Admin Users ───────────────────────────────────────────────────────────────

export const adminUsers = pgTable(
  'admin_users',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: text('email').notNull().unique(),
    name: text('name').notNull(),
    // bcrypt-hashed password
    passwordHash: text('password_hash').notNull(),
    role: adminRoleEnum('role').notNull().default('viewer'),
    isActive: boolean('is_active').notNull().default(true),
    isMfaEnabled: boolean('is_mfa_enabled').notNull().default(false),
    mfaSecret: text('mfa_secret'), // encrypted TOTP secret
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    passwordChangedAt: timestamp('password_changed_at', { withTimezone: true }),
    createdBy: text('created_by'), // admin user id who created this account
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    uniqueIndex('admin_users_email_idx').on(t.email),
    index('admin_users_role_idx').on(t.role),
    index('admin_users_active_idx').on(t.isActive),
  ]
);

// ── Sessions ──────────────────────────────────────────────────────────────────

export const sessions = pgTable(
  'sessions',
  {
    id: text('id').primaryKey(), // random session ID stored in cookie
    userId: text('user_id')
      .notNull()
      .references(() => adminUsers.id, { onDelete: 'cascade' }),
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    lastActivityAt: timestamp('last_activity_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index('sessions_user_id_idx').on(t.userId),
    index('sessions_expires_at_idx').on(t.expiresAt),
  ]
);

// ── Audit Logs ────────────────────────────────────────────────────────────────

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    actorId: text('actor_id'), // admin user id (null = system)
    actorEmail: text('actor_email'),
    action: text('action').notNull(), // e.g. 'nominee.create', 'payment.refund'
    entityType: text('entity_type'), // e.g. 'nominee', 'payment'
    entityId: text('entity_id'),
    changes: text('changes'), // JSON diff of what changed
    ipAddress: text('ip_address'),
    userAgent: text('user_agent'),
    requestId: text('request_id'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index('audit_logs_actor_id_idx').on(t.actorId),
    index('audit_logs_action_idx').on(t.action),
    index('audit_logs_entity_idx').on(t.entityType, t.entityId),
    index('audit_logs_created_at_idx').on(t.createdAt),
  ]
);

// ── Newsletter Subscribers ────────────────────────────────────────────────────

export const newsletterSubscribers = pgTable(
  'newsletter_subscribers',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: text('email').notNull().unique(),
    name: text('name'),
    isConfirmed: boolean('is_confirmed').notNull().default(false),
    isUnsubscribed: boolean('is_unsubscribed').notNull().default(false),
    confirmationToken: text('confirmation_token'),
    unsubscribeToken: text('unsubscribe_token').notNull(),
    consentText: text('consent_text').notNull(),
    ipAddress: text('ip_address'),
    subscribedAt: timestamp('subscribed_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    confirmedAt: timestamp('confirmed_at', { withTimezone: true }),
    unsubscribedAt: timestamp('unsubscribed_at', { withTimezone: true }),
  },
  (t) => [
    uniqueIndex('newsletter_subscribers_email_idx').on(t.email),
    index('newsletter_subscribers_confirmed_idx').on(t.isConfirmed),
    index('newsletter_subscribers_unsubscribed_idx').on(t.isUnsubscribed),
  ]
);

// ── Contact Messages ──────────────────────────────────────────────────────────

export const contactMessages = pgTable(
  'contact_messages',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    name: text('name').notNull(),
    email: text('email').notNull(),
    subject: text('subject').notNull(),
    message: text('message').notNull(),
    ipAddress: text('ip_address'),
    isRead: boolean('is_read').notNull().default(false),
    isSpam: boolean('is_spam').notNull().default(false),
    repliedAt: timestamp('replied_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [index('contact_messages_email_idx').on(t.email)]
);

// ── Email Outbox ──────────────────────────────────────────────────────────────
// Tracks delivery status of transactional emails

export const emailOutbox = pgTable(
  'email_outbox',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    to: text('to').notNull(),
    from: text('from').notNull(),
    subject: text('subject').notNull(),
    templateId: text('template_id'),
    provider: text('provider').notNull().default('resend'), // 'resend' | 'smtp'
    providerMessageId: text('provider_message_id'),
    status: text('status').notNull().default('pending'), // pending | sent | failed | bounced
    attempts: text('attempts').notNull().default('0'),
    lastAttemptAt: timestamp('last_attempt_at', { withTimezone: true }),
    error: text('error'),
    metadata: text('metadata'), // JSON — order id, etc.
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index('email_outbox_to_idx').on(t.to),
    index('email_outbox_status_idx').on(t.status),
  ]
);

// ── Relations ─────────────────────────────────────────────────────────────────

export const adminUsersRelations = relations(adminUsers, ({ many }) => ({
  sessions: many(sessions),
  auditLogs: many(auditLogs),
}));

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(adminUsers, {
    fields: [sessions.userId],
    references: [adminUsers.id],
  }),
}));
