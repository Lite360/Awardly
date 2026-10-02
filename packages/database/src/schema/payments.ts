// ─────────────────────────────────────────────────────────────────────────────
// Payments, Orders, and Vote Allocations
// The payment ledger is kept strictly separate from vote allocations.
// Votes are only allocated after server-side payment verification.
// ─────────────────────────────────────────────────────────────────────────────

import {
  pgTable,
  text,
  boolean,
  timestamp,
  integer,
  pgEnum,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';
import { sql, relations } from 'drizzle-orm';
import { currencyEnum } from './platform';
import { events, nominees, categories } from './events';

export const orderStatusEnum = pgEnum('order_status', [
  'pending',
  'processing',
  'paid',
  'failed',
  'cancelled',
  'refunded',
]);

export const paymentStatusEnum = pgEnum('payment_status', [
  'pending',
  'success',
  'failed',
  'abandoned',
  'reversed',
]);

export const refundStatusEnum = pgEnum('refund_status', [
  'pending',
  'approved',
  'processed',
  'failed',
  'rejected',
]);

// ── Voters ────────────────────────────────────────────────────────────────────
// Minimal voter info — only what's needed for receipts and contact

export const voters = pgTable(
  'voters',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    email: text('email').notNull(),
    name: text('name'),
    // No password — voters are identified by email for receipt lookup only
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [uniqueIndex('voters_email_idx').on(t.email)]
);

// ── Vote Orders ───────────────────────────────────────────────────────────────
// Created before payment is initialized. Price is immutable after creation.

export const voteOrders = pgTable(
  'vote_orders',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    // Internal order reference
    reference: text('reference').notNull().unique(),
    // Paystack's payment reference (set when checkout is initialized)
    paystackReference: text('paystack_reference').unique(),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'restrict' }),
    nomineeId: text('nominee_id')
      .notNull()
      .references(() => nominees.id, { onDelete: 'restrict' }),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict' }),
    voterId: text('voter_id').references(() => voters.id, { onDelete: 'set null' }),
    voterEmail: text('voter_email').notNull(),
    voterName: text('voter_name'),
    quantity: integer('quantity').notNull(),
    // Immutable snapshot — never recalculate from current price
    unitPrice: integer('unit_price').notNull(), // kobo/cents at time of order
    totalAmount: integer('total_amount').notNull(), // quantity * unitPrice
    currency: currencyEnum('currency').notNull(),
    status: orderStatusEnum('status').notNull().default('pending'),
    notes: text('notes'),
    expiresAt: timestamp('expires_at', { withTimezone: true }), // abandoned checkout cleanup
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index('vote_orders_event_id_idx').on(t.eventId),
    index('vote_orders_nominee_id_idx').on(t.nomineeId),
    index('vote_orders_voter_email_idx').on(t.voterEmail),
    index('vote_orders_status_idx').on(t.status),
    index('vote_orders_paystack_ref_idx').on(t.paystackReference),
  ]
);

// ── Payments ──────────────────────────────────────────────────────────────────
// One payment record per Paystack transaction attempt.

export const payments = pgTable(
  'payments',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    orderId: text('order_id')
      .notNull()
      .references(() => voteOrders.id, { onDelete: 'restrict' }),
    paystackReference: text('paystack_reference').notNull().unique(),
    paystackTransactionId: text('paystack_transaction_id').unique(),
    status: paymentStatusEnum('status').notNull().default('pending'),
    amount: integer('amount').notNull(), // kobo/cents as reported by Paystack
    currency: currencyEnum('currency').notNull(),
    channel: text('channel'), // card, bank_transfer, ussd, etc.
    gatewayResponse: text('gateway_response'),
    ipAddress: text('ip_address'),
    paidAt: timestamp('paid_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index('payments_order_id_idx').on(t.orderId),
    index('payments_status_idx').on(t.status),
    index('payments_paystack_ref_idx').on(t.paystackReference),
  ]
);

// ── Vote Allocations ──────────────────────────────────────────────────────────
// Created ONLY after server-side payment verification succeeds.
// Unique constraint on payment_id prevents double-allocation.

export const voteAllocations = pgTable(
  'vote_allocations',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    orderId: text('order_id')
      .notNull()
      .references(() => voteOrders.id, { onDelete: 'restrict' }),
    // Unique on paymentId — the core idempotency guarantee
    paymentId: text('payment_id')
      .notNull()
      .unique()
      .references(() => payments.id, { onDelete: 'restrict' }),
    eventId: text('event_id')
      .notNull()
      .references(() => events.id, { onDelete: 'restrict' }),
    nomineeId: text('nominee_id')
      .notNull()
      .references(() => nominees.id, { onDelete: 'restrict' }),
    categoryId: text('category_id')
      .notNull()
      .references(() => categories.id, { onDelete: 'restrict' }),
    votesAllocated: integer('votes_allocated').notNull(),
    isReversed: boolean('is_reversed').notNull().default(false),
    reversedAt: timestamp('reversed_at', { withTimezone: true }),
    reversedBy: text('reversed_by'), // admin user id
    reversalReason: text('reversal_reason'),
    allocatedAt: timestamp('allocated_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index('vote_allocations_nominee_id_idx').on(t.nomineeId),
    index('vote_allocations_event_id_idx').on(t.eventId),
    index('vote_allocations_category_id_idx').on(t.categoryId),
  ]
);

// ── Refunds ───────────────────────────────────────────────────────────────────

export const refunds = pgTable('refunds', {
  id: text('id')
    .primaryKey()
    .default(sql`gen_random_uuid()`),
  paymentId: text('payment_id')
    .notNull()
    .references(() => payments.id, { onDelete: 'restrict' }),
  orderId: text('order_id')
    .notNull()
    .references(() => voteOrders.id, { onDelete: 'restrict' }),
  status: refundStatusEnum('status').notNull().default('pending'),
  amount: integer('amount').notNull(),
  currency: currencyEnum('currency').notNull(),
  reason: text('reason').notNull(),
  requestedBy: text('requested_by').notNull(), // admin user id
  approvedBy: text('approved_by'),
  paystackRefundId: text('paystack_refund_id'),
  votesReversed: boolean('votes_reversed').notNull().default(false),
  notes: text('notes'),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
  updatedAt: timestamp('updated_at', { withTimezone: true })
    .notNull()
    .default(sql`now()`),
});

// ── Webhook Events ────────────────────────────────────────────────────────────
// Stores raw webhook payloads for audit and replay protection

export const webhookEvents = pgTable(
  'webhook_events',
  {
    id: text('id')
      .primaryKey()
      .default(sql`gen_random_uuid()`),
    provider: text('provider').notNull().default('paystack'),
    eventType: text('event_type').notNull(),
    reference: text('reference'), // Paystack reference from payload
    payload: text('payload').notNull(), // raw JSON string
    signatureValid: boolean('signature_valid').notNull(),
    processed: boolean('processed').notNull().default(false),
    processedAt: timestamp('processed_at', { withTimezone: true }),
    error: text('error'),
    ipAddress: text('ip_address'),
    receivedAt: timestamp('received_at', { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (t) => [
    index('webhook_events_reference_idx').on(t.reference),
    index('webhook_events_processed_idx').on(t.processed),
  ]
);

// ── Relations ─────────────────────────────────────────────────────────────────

export const votersRelations = relations(voters, ({ many }) => ({
  orders: many(voteOrders),
}));

export const voteOrdersRelations = relations(voteOrders, ({ one, many }) => ({
  event: one(events, {
    fields: [voteOrders.eventId],
    references: [events.id],
  }),
  nominee: one(nominees, {
    fields: [voteOrders.nomineeId],
    references: [nominees.id],
  }),
  category: one(categories, {
    fields: [voteOrders.categoryId],
    references: [categories.id],
  }),
  voter: one(voters, {
    fields: [voteOrders.voterId],
    references: [voters.id],
  }),
  payments: many(payments),
  allocations: many(voteAllocations),
  refunds: many(refunds),
}));

export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(voteOrders, {
    fields: [payments.orderId],
    references: [voteOrders.id],
  }),
  allocation: one(voteAllocations, {
    fields: [payments.id],
    references: [voteAllocations.paymentId],
  }),
}));

export const voteAllocationsRelations = relations(voteAllocations, ({ one }) => ({
  order: one(voteOrders, {
    fields: [voteAllocations.orderId],
    references: [voteOrders.id],
  }),
  payment: one(payments, {
    fields: [voteAllocations.paymentId],
    references: [payments.id],
  }),
  event: one(events, {
    fields: [voteAllocations.eventId],
    references: [events.id],
  }),
  nominee: one(nominees, {
    fields: [voteAllocations.nomineeId],
    references: [nominees.id],
  }),
  category: one(categories, {
    fields: [voteAllocations.categoryId],
    references: [categories.id],
  }),
}));
