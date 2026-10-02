CREATE TYPE "public"."currency" AS ENUM('NGN', 'USD', 'GHS', 'GBP', 'EUR');--> statement-breakpoint
CREATE TYPE "public"."platform_type" AS ENUM('awards', 'talent_competition', 'public_poll', 'community_voting');--> statement-breakpoint
CREATE TYPE "public"."event_status" AS ENUM('draft', 'scheduled', 'live', 'closed', 'archived');--> statement-breakpoint
CREATE TYPE "public"."voting_mode" AS ENUM('paid', 'free', 'disabled');--> statement-breakpoint
CREATE TYPE "public"."order_status" AS ENUM('pending', 'processing', 'paid', 'failed', 'cancelled', 'refunded');--> statement-breakpoint
CREATE TYPE "public"."payment_status" AS ENUM('pending', 'success', 'failed', 'abandoned', 'reversed');--> statement-breakpoint
CREATE TYPE "public"."refund_status" AS ENUM('pending', 'approved', 'processed', 'failed', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."media_purpose" AS ENUM('platform_logo', 'event_hero', 'event_logo', 'page_cta', 'nominee_photo', 'category_image', 'gallery_image', 'sponsor_logo', 'favicon', 'other');--> statement-breakpoint
CREATE TYPE "public"."sponsor_tier" AS ENUM('title', 'gold', 'silver', 'bronze', 'partner');--> statement-breakpoint
CREATE TYPE "public"."admin_role" AS ENUM('owner', 'event_operator', 'finance_operator', 'viewer');--> statement-breakpoint
CREATE TABLE "platform_settings" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text DEFAULT 'Awardly' NOT NULL,
	"tagline" text DEFAULT 'Celebrating excellence. Your vote matters.' NOT NULL,
	"platform_type" "platform_type" DEFAULT 'awards' NOT NULL,
	"logo_url" text,
	"favicon_url" text,
	"primary_color" text DEFAULT '#5B21B6' NOT NULL,
	"primary_dark_color" text DEFAULT '#3B0764' NOT NULL,
	"accent_color" text DEFAULT '#D4AF37' NOT NULL,
	"background_color" text DEFAULT '#FCFAF5' NOT NULL,
	"text_color" text DEFAULT '#171717' NOT NULL,
	"default_currency" "currency" DEFAULT 'NGN' NOT NULL,
	"footer_credit" text DEFAULT '© {year} {brandName}. All rights reserved.' NOT NULL,
	"developer_credit" text DEFAULT 'Developed by Elite Developers.' NOT NULL,
	"developer_url" text DEFAULT 'https://elitedevelopers.agency',
	"contact_email" text,
	"contact_phone" text,
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"features" jsonb DEFAULT '{"gallery":true,"sponsors":true,"leaderboard":true,"newsletter":true,"contactForm":true,"faq":true,"aboutPage":true}'::jsonb,
	"email_from_name" text DEFAULT 'Awardly' NOT NULL,
	"email_from_address" text DEFAULT 'noreply@awardly.com' NOT NULL,
	"singleton_key" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "platform_settings_singleton_key_unique" UNIQUE("singleton_key")
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"description" text,
	"image_url" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"has_custom_pricing" boolean DEFAULT false NOT NULL,
	"custom_vote_price" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "event_branding" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" text NOT NULL,
	"hero_image_url" text,
	"hero_image_alt" text,
	"primary_color" text,
	"accent_color" text,
	"logo_url" text,
	"page_cta_images" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "event_branding_event_id_unique" UNIQUE("event_id")
);
--> statement-breakpoint
CREATE TABLE "events" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"status" "event_status" DEFAULT 'draft' NOT NULL,
	"currency" "currency" DEFAULT 'NGN' NOT NULL,
	"voting_mode" "voting_mode" DEFAULT 'paid' NOT NULL,
	"vote_price" integer DEFAULT 10000 NOT NULL,
	"min_votes_per_order" integer DEFAULT 1 NOT NULL,
	"max_votes_per_order" integer DEFAULT 1000 NOT NULL,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"timezone" text DEFAULT 'Africa/Lagos' NOT NULL,
	"is_leaderboard_public" boolean DEFAULT true NOT NULL,
	"show_vote_counts" boolean DEFAULT false NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "nominees" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" text NOT NULL,
	"category_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"code" text NOT NULL,
	"bio" text,
	"image_url" text,
	"social_links" jsonb DEFAULT '{}'::jsonb,
	"is_published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "payments" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" text NOT NULL,
	"paystack_reference" text NOT NULL,
	"paystack_transaction_id" text,
	"status" "payment_status" DEFAULT 'pending' NOT NULL,
	"amount" integer NOT NULL,
	"currency" "currency" NOT NULL,
	"channel" text,
	"gateway_response" text,
	"ip_address" text,
	"paid_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "payments_paystack_reference_unique" UNIQUE("paystack_reference"),
	CONSTRAINT "payments_paystack_transaction_id_unique" UNIQUE("paystack_transaction_id")
);
--> statement-breakpoint
CREATE TABLE "refunds" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"payment_id" text NOT NULL,
	"order_id" text NOT NULL,
	"status" "refund_status" DEFAULT 'pending' NOT NULL,
	"amount" integer NOT NULL,
	"currency" "currency" NOT NULL,
	"reason" text NOT NULL,
	"requested_by" text NOT NULL,
	"approved_by" text,
	"paystack_refund_id" text,
	"votes_reversed" boolean DEFAULT false NOT NULL,
	"notes" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vote_allocations" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" text NOT NULL,
	"payment_id" text NOT NULL,
	"event_id" text NOT NULL,
	"nominee_id" text NOT NULL,
	"category_id" text NOT NULL,
	"votes_allocated" integer NOT NULL,
	"is_reversed" boolean DEFAULT false NOT NULL,
	"reversed_at" timestamp with time zone,
	"reversed_by" text,
	"reversal_reason" text,
	"allocated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vote_allocations_payment_id_unique" UNIQUE("payment_id")
);
--> statement-breakpoint
CREATE TABLE "vote_orders" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reference" text NOT NULL,
	"paystack_reference" text,
	"event_id" text NOT NULL,
	"nominee_id" text NOT NULL,
	"category_id" text NOT NULL,
	"voter_id" text,
	"voter_email" text NOT NULL,
	"voter_name" text,
	"quantity" integer NOT NULL,
	"unit_price" integer NOT NULL,
	"total_amount" integer NOT NULL,
	"currency" "currency" NOT NULL,
	"status" "order_status" DEFAULT 'pending' NOT NULL,
	"notes" text,
	"expires_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vote_orders_reference_unique" UNIQUE("reference"),
	CONSTRAINT "vote_orders_paystack_reference_unique" UNIQUE("paystack_reference")
);
--> statement-breakpoint
CREATE TABLE "voters" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "webhook_events" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"provider" text DEFAULT 'paystack' NOT NULL,
	"event_type" text NOT NULL,
	"reference" text,
	"payload" text NOT NULL,
	"signature_valid" boolean NOT NULL,
	"processed" boolean DEFAULT false NOT NULL,
	"processed_at" timestamp with time zone,
	"error" text,
	"ip_address" text,
	"received_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "faqs" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"question" text NOT NULL,
	"answer" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "gallery_images" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" text NOT NULL,
	"url" text NOT NULL,
	"thumbnail_url" text,
	"alt_text" text,
	"caption" text,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"url" text NOT NULL,
	"pathname" text NOT NULL,
	"filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"alt_text" text,
	"uploaded_by" text NOT NULL,
	"purpose" "media_purpose" DEFAULT 'other' NOT NULL,
	"entity_id" text,
	"entity_type" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pages" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"meta_title" text,
	"meta_description" text,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pages_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "sponsors" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_id" text NOT NULL,
	"name" text NOT NULL,
	"logo_url" text,
	"website_url" text,
	"tier" "sponsor_tier" DEFAULT 'partner' NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"is_published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "admin_users" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text NOT NULL,
	"password_hash" text NOT NULL,
	"role" "admin_role" DEFAULT 'viewer' NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"is_mfa_enabled" boolean DEFAULT false NOT NULL,
	"mfa_secret" text,
	"last_login_at" timestamp with time zone,
	"password_changed_at" timestamp with time zone,
	"created_by" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "admin_users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "audit_logs" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"actor_id" text,
	"actor_email" text,
	"action" text NOT NULL,
	"entity_type" text,
	"entity_id" text,
	"changes" text,
	"ip_address" text,
	"user_agent" text,
	"request_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "contact_messages" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"subject" text NOT NULL,
	"message" text NOT NULL,
	"ip_address" text,
	"is_read" boolean DEFAULT false NOT NULL,
	"is_spam" boolean DEFAULT false NOT NULL,
	"replied_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "email_outbox" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"to" text NOT NULL,
	"from" text NOT NULL,
	"subject" text NOT NULL,
	"template_id" text,
	"provider" text DEFAULT 'resend' NOT NULL,
	"provider_message_id" text,
	"status" text DEFAULT 'pending' NOT NULL,
	"attempts" text DEFAULT '0' NOT NULL,
	"last_attempt_at" timestamp with time zone,
	"error" text,
	"metadata" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "newsletter_subscribers" (
	"id" text PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"name" text,
	"is_confirmed" boolean DEFAULT false NOT NULL,
	"is_unsubscribed" boolean DEFAULT false NOT NULL,
	"confirmation_token" text,
	"unsubscribe_token" text NOT NULL,
	"consent_text" text NOT NULL,
	"ip_address" text,
	"subscribed_at" timestamp with time zone DEFAULT now() NOT NULL,
	"confirmed_at" timestamp with time zone,
	"unsubscribed_at" timestamp with time zone,
	CONSTRAINT "newsletter_subscribers_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_activity_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "categories" ADD CONSTRAINT "categories_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "event_branding" ADD CONSTRAINT "event_branding_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nominees" ADD CONSTRAINT "nominees_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "nominees" ADD CONSTRAINT "nominees_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "payments" ADD CONSTRAINT "payments_order_id_vote_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."vote_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "refunds" ADD CONSTRAINT "refunds_order_id_vote_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."vote_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_allocations" ADD CONSTRAINT "vote_allocations_order_id_vote_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."vote_orders"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_allocations" ADD CONSTRAINT "vote_allocations_payment_id_payments_id_fk" FOREIGN KEY ("payment_id") REFERENCES "public"."payments"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_allocations" ADD CONSTRAINT "vote_allocations_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_allocations" ADD CONSTRAINT "vote_allocations_nominee_id_nominees_id_fk" FOREIGN KEY ("nominee_id") REFERENCES "public"."nominees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_allocations" ADD CONSTRAINT "vote_allocations_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_orders" ADD CONSTRAINT "vote_orders_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_orders" ADD CONSTRAINT "vote_orders_nominee_id_nominees_id_fk" FOREIGN KEY ("nominee_id") REFERENCES "public"."nominees"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_orders" ADD CONSTRAINT "vote_orders_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vote_orders" ADD CONSTRAINT "vote_orders_voter_id_voters_id_fk" FOREIGN KEY ("voter_id") REFERENCES "public"."voters"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "gallery_images" ADD CONSTRAINT "gallery_images_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sponsors" ADD CONSTRAINT "sponsors_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_admin_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."admin_users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "categories_event_slug_idx" ON "categories" USING btree ("event_id","slug");--> statement-breakpoint
CREATE INDEX "categories_event_id_idx" ON "categories" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "categories_published_idx" ON "categories" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "events_status_idx" ON "events" USING btree ("status");--> statement-breakpoint
CREATE INDEX "events_slug_idx" ON "events" USING btree ("slug");--> statement-breakpoint
CREATE UNIQUE INDEX "nominees_event_slug_idx" ON "nominees" USING btree ("event_id","slug");--> statement-breakpoint
CREATE UNIQUE INDEX "nominees_event_code_idx" ON "nominees" USING btree ("event_id","code");--> statement-breakpoint
CREATE INDEX "nominees_event_id_idx" ON "nominees" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "nominees_category_id_idx" ON "nominees" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "nominees_published_idx" ON "nominees" USING btree ("is_published");--> statement-breakpoint
CREATE INDEX "payments_order_id_idx" ON "payments" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "payments_status_idx" ON "payments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "payments_paystack_ref_idx" ON "payments" USING btree ("paystack_reference");--> statement-breakpoint
CREATE INDEX "vote_allocations_nominee_id_idx" ON "vote_allocations" USING btree ("nominee_id");--> statement-breakpoint
CREATE INDEX "vote_allocations_event_id_idx" ON "vote_allocations" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "vote_allocations_category_id_idx" ON "vote_allocations" USING btree ("category_id");--> statement-breakpoint
CREATE INDEX "vote_orders_event_id_idx" ON "vote_orders" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "vote_orders_nominee_id_idx" ON "vote_orders" USING btree ("nominee_id");--> statement-breakpoint
CREATE INDEX "vote_orders_voter_email_idx" ON "vote_orders" USING btree ("voter_email");--> statement-breakpoint
CREATE INDEX "vote_orders_status_idx" ON "vote_orders" USING btree ("status");--> statement-breakpoint
CREATE INDEX "vote_orders_paystack_ref_idx" ON "vote_orders" USING btree ("paystack_reference");--> statement-breakpoint
CREATE UNIQUE INDEX "voters_email_idx" ON "voters" USING btree ("email");--> statement-breakpoint
CREATE INDEX "webhook_events_reference_idx" ON "webhook_events" USING btree ("reference");--> statement-breakpoint
CREATE INDEX "webhook_events_processed_idx" ON "webhook_events" USING btree ("processed");--> statement-breakpoint
CREATE INDEX "gallery_images_event_id_idx" ON "gallery_images" USING btree ("event_id");--> statement-breakpoint
CREATE INDEX "media_assets_purpose_idx" ON "media_assets" USING btree ("purpose");--> statement-breakpoint
CREATE INDEX "media_assets_entity_idx" ON "media_assets" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "sponsors_event_id_idx" ON "sponsors" USING btree ("event_id");--> statement-breakpoint
CREATE UNIQUE INDEX "admin_users_email_idx" ON "admin_users" USING btree ("email");--> statement-breakpoint
CREATE INDEX "admin_users_role_idx" ON "admin_users" USING btree ("role");--> statement-breakpoint
CREATE INDEX "admin_users_active_idx" ON "admin_users" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX "audit_logs_actor_id_idx" ON "audit_logs" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "audit_logs_action_idx" ON "audit_logs" USING btree ("action");--> statement-breakpoint
CREATE INDEX "audit_logs_entity_idx" ON "audit_logs" USING btree ("entity_type","entity_id");--> statement-breakpoint
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX "contact_messages_email_idx" ON "contact_messages" USING btree ("email");--> statement-breakpoint
CREATE INDEX "email_outbox_to_idx" ON "email_outbox" USING btree ("to");--> statement-breakpoint
CREATE INDEX "email_outbox_status_idx" ON "email_outbox" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "newsletter_subscribers_email_idx" ON "newsletter_subscribers" USING btree ("email");--> statement-breakpoint
CREATE INDEX "newsletter_subscribers_confirmed_idx" ON "newsletter_subscribers" USING btree ("is_confirmed");--> statement-breakpoint
CREATE INDEX "newsletter_subscribers_unsubscribed_idx" ON "newsletter_subscribers" USING btree ("is_unsubscribed");--> statement-breakpoint
CREATE INDEX "sessions_user_id_idx" ON "sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "sessions_expires_at_idx" ON "sessions" USING btree ("expires_at");