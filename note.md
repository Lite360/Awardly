Awardly: Complete Product Blueprint

Reusable paid voting and awards management platform by Elite Developers

This blueprint defines the product requirements, MVP, engineering requirements, design architecture, database, API, security, deployment, and master development prompt for building Awardly. It is designed so you can reuse the same codebase for different award shows, competitions, talent contests, public polls, and other paid-voting events, while changing the platform name, branding, features, and event configuration without rebuilding everything.

11
Product identity
Awardly

Paid voting, awards, nominees and event management

Brand palette

Royal purple

#5B21B6

Deep plum

#3B0764

Champagne gold

#D4AF37

Warm ivory

#FCFAF5

Charcoal

#171717

1. Project objective

Build a production-ready web platform that lets event organizers create and manage award events, categories and nominees. Visitors browse the event, select their preferred nominees, purchase votes through Paystack, and receive verified confirmations.

The system must support two distinct experiences:

Public website: event information, nominees, voting, payments, leaderboard, gallery, contact, legal pages and newsletter.

Private management application: secure access for authorized personnel to manage events, pricing, content, voting, payments, reports and platform configuration.

The public experience must not expose administrative links, administrative terminology, private routes, management controls or privileged API functionality.

2. Reusability: the core product requirement

The platform should be white-label and configuration-driven. Awardly is the default brand, not a permanent name hardcoded throughout the source code.

For example, the same codebase could be deployed as:

Awardly

VoteStage

Talent Crown Awards

Campus Excellence Awards

Elite Choice Awards

Changing the brand should not require rewriting components or database tables.

Configurable brand settings
Brand configuration preview

Change these sample values to see how a new deployment can be configured.

Awardly

Celebrating excellence. Your vote matters.

Explore nominees

Platform name
Tagline
Platform type
Paid awards voting
Talent competition
Paid public polls
Free community voting
Primary color
Burgundy
Accent color
White
Default currency
NGN ₦
USD $
GHS GH₵
Copy sample configuration

This is a configuration preview, not a saved change to the actual project. Production settings would be saved securely through the management interface.

The finished platform should support configurable logos, icons, favicon, typography, color palette, domain, contact details, footer credits, social links, page content, CTA images, enabled modules, voting rules, currency, email branding and payment settings.

3. Technology stack

This is the proposed locked stack for the first production implementation.

Layer

	

Technology

	

Responsibility




Public frontend

	

React + Vite + TypeScript

	

Public pages and voting UI




Private frontend

	

React + Vite + TypeScript

	

Protected management interface




Styling

	

Tailwind CSS

	

Responsive design and reusable components




Animations

	

GSAP + AOS.js

	

Hero effects, transitions and scroll reveals




Dialogs

	

SweetAlert2

	

Confirmations, success and error feedback




Backend

	

Node.js + TypeScript on Vercel Functions

	

API and business logic




API validation

	

Zod

	

Validate all incoming requests




Database

	

Neon PostgreSQL

	

Events, users, orders, votes and configuration




Database access

	

Drizzle ORM + SQL migrations

	

Typed queries and schema evolution




Media

	

Vercel Blob

	

Logos, nominee photos, galleries and CTA images




Payments

	

Paystack

	

Checkout and transaction verification




Email

	

Resend

	

Transactional email and newsletter delivery




SMTP option

	

Gmail SMTP

	

Secondary or specifically configured SMTP delivery




Deployment

	

Vercel + GitHub

	

Hosting, version control and deployments




Testing

	

Vitest + API integration tests

	

Business logic, API and payment testing

Architecture note: Vercel hosts the frontend and server-side functions. Neon is the persistent database, Blob is file storage, Paystack processes payments, and Resend sends email. They have distinct responsibilities.

Use server-side functions for all privileged operations. Never put secret keys in Vite variables prefixed with VITE_.

For the initial version, use database-backed leaderboard queries and polling or SSE where appropriate. Introduce Redis or a dedicated realtime service only if actual traffic and update requirements justify it.

4. Product Requirements Document (PRD)
4.1 Product goals

Allow organizers to launch a branded voting event without modifying source code.

Allow visitors to browse categories and nominees.

Accept payments for votes and allocate votes only after verified payment.

Provide accurate leaderboards and auditable financial records.

Give authorized operators comprehensive control of content, event settings and reports.

Support multiple event configurations and reusable deployments.

Keep administrative functionality entirely separate from the public experience.

4.2 User types

User type

	

Permissions




Visitor

	

Browse public event information and nominees




Voter

	

Purchase votes, check order status and receive receipts




Event operator

	

Manage assigned event content and operations




Finance operator

	

Review payments, reconciliation and refunds, if enabled




Platform owner

	

Configure branding, modules, deployments and privileged settings

The first release can start with a single platform owner and one event. The data model should still support additional events and authorized roles without a redesign.

4.3 Functional requirements

FR-01: Event and brand configuration

Event title, slug, logo, favicon, hero image, CTA images, theme, dates, currency, event description, social links, footer content and metadata must be configurable.

FR-02: Categories and nominees

Create, edit, publish, archive and order categories and nominees. Support images, biographies, codes, social links and category assignments.

FR-03: Paid voting

Select a nominee, specify vote quantity, calculate the price server-side, create an order, initialize Paystack checkout, verify payment and allocate votes exactly once.

FR-04: Leaderboard

Show nominee rankings, category rankings and configurable vote totals. Refresh the displayed results without requiring a full page reload.

FR-05: Content and media

Manage gallery images, sponsors, FAQ entries, page copy, hero artwork and individual page CTA images. Use Vercel Blob for stored media.

FR-06: Communications

Newsletter subscriptions, confirmation and payment emails, vote receipts, contact enquiries and event announcements. Support unsubscribe and consent records.

4.4 Public pages and page-specific CTA requirements

Page

	

Main content

	

CTA and image direction




Home

	

Event hero, featured nominees, categories and event overview

	

Award-stage image, “Vote Now”




About Us

	

Story, mission, organizers and sponsors

	

Ceremony image, “Explore the Awards”




Categories

	

Category cards and descriptions

	

Trophy image, “Browse Categories”




Nominees

	

Search, filters and nominee cards

	

Nominee photography, “Choose Your Nominee”




Nominee details

	

Biography, category and voting details

	

Nominee-specific image, “Vote for This Nominee”




Vote Now

	

Vote quantity and order summary

	

Voting-themed image, “Continue to Payment”




Leaderboard

	

Rankings, category filters and update status

	

Trophy image, “Support Your Favourite”




Gallery

	

Responsive image grid and lightbox

	

Event photo, “Explore the Moments”




Contact

	

Contact form and support details

	

Event/venue image, “Send Message”




FAQ

	

Questions and answers

	

Help-themed image, “Get Support”




Terms of Service

	

Voting, payment and event terms

	

Brand-matched CTA if appropriate




Privacy Policy

	

Data collection and privacy details

	

Brand-matched CTA if appropriate

Every page should have its own appropriate visual and CTA configuration. Legal pages can use restrained layouts rather than forcing an oversized promotional banner into every page.

The global footer must include:

Quick Links: Home, About Us, Vote Now, Gallery, Contact.

Legal: Terms of Service, Privacy Policy, FAQ.

Stay Updated: “Subscribe to our newsletter to get the latest updates on nominations and voting.”

Email field and Subscribe button.

Social media links.

© {year} {brandName}. All rights reserved.

Developed by Elite Developers.

The footer credit must be configurable per deployment, while defaulting to Elite Developers.

4.5 Payment and voting rules

The server calculates the payable amount from the current price and requested quantity.

Create a pending order before redirecting the voter to Paystack.

Verify the payment reference, status, expected amount and currency server-side.

Verify the Paystack webhook signature against the raw request body.

Use a database transaction and unique constraints to prevent duplicate vote allocation.

Keep the payment ledger separate from vote-allocation records.

Do not count pending, failed or unverified payments.

Handle retries, delayed callbacks, reversals and refunds explicitly.

If an order is refunded, record the refund and apply the event's configured vote-reversal policy.

Keep the audit trail for corrections and adjustments.

Reject purchases for unpublished nominees or closed events.

Enforce configured minimum/maximum vote quantities and purchase limits.

A paid vote is not a vote until the backend has confirmed the payment and committed the corresponding vote allocation.

4.6 Non-functional requirements

Responsive layouts for mobile, tablet and desktop.

Accessible keyboard navigation, visible focus states and sufficient contrast.

Optimized image loading and sensible caching.

Paginated API results for large nominee, payment and vote lists.

Database indexes for common leaderboard and reporting queries.

Consistent API error responses and request IDs.

Monitoring for payment failures, webhook failures and email delivery issues.

Backups and a documented recovery procedure.

Clear event-closing and post-event archival procedures.

5. MVP: Minimum Viable Product

The MVP should launch one complete event end to end, while the architecture already supports future events and rebranding.

MVP scope

0 of 9 milestones marked complete

Reset

Project foundation

React apps, API, Neon, migrations and deployment

Brand and event setup

Name, logo, colors, dates and event configuration

Categories and nominees

CRUD, images, publishing and public profiles

Paid voting

Orders, Paystack checkout, verified vote allocation

Leaderboard

Category rankings and public totals

Website content

CTA images, gallery, FAQ, sponsors and footer

Email and receipts

Resend delivery and newsletter subscriptions

Security and audit

Protected sessions, rate limits, audit records

Testing and deployment

Payment tests, production configuration and monitoring

MVP exclusions

To keep the first release manageable, defer the following until the core system is stable:

Multiple payment gateways.

Complex multi-tenant billing and subscriptions.

Dedicated native mobile applications.

Advanced fraud-scoring models.

Multiple realtime infrastructure providers.

Automated bulk marketing workflows beyond essential newsletter functionality.

Complex competition brackets or tournament formats.

Important: reusable branding and multiple event records are part of the initial architecture, not later add-ons. Advanced multi-tenant isolation, billing and custom-domain automation can be implemented in a subsequent phase.

6. EPR: Engineering and Product Requirements

This section translates the PRD into implementation and acceptance requirements.

Phase 1: Foundation

Create the repository and separate frontend applications.

Configure TypeScript, Vite, Tailwind and shared lint/test scripts.

Configure Vercel deployment and server-side API functions.

Connect Neon using a server-only database client.

Establish migrations, validation schemas and centralized errors.

Add .env.example with placeholder variable names only.

Acceptance: both applications build, the API health endpoint works, and the database connection is verified without exposing credentials.

Phase 2: Database and reusable configuration

Implement the relational schema.

Add migrations and safe seed scripts.

Create brand, event, theme and feature configuration models.

Support event-specific settings and independent branding.

Store media metadata separately from Blob objects.

Add indexes, foreign keys and appropriate unique constraints.

Acceptance: a second event can use a different name, logo, theme, CTA artwork and voting configuration without source-code changes.

Phase 3: Core API

Build event, category, nominee and public content endpoints.

Implement pagination, filtering and request validation.

Separate public DTOs from private database models.

Add protected management operations.

Add role checks on every privileged endpoint.

Acceptance: public endpoints cannot expose private settings, voter details, payment secrets or administrative records.

Phase 4: Voting and Paystack

Create a pending order and immutable price snapshot.

Initialize Paystack transactions server-side.

Implement signed webhook verification.

Verify the transaction through Paystack's verification endpoint.

Commit payment state and vote allocation atomically.

Add unique payment-reference and allocation constraints.

Handle webhook retries, abandoned checkout and reconciliation.

Acceptance: repeated webhook delivery cannot credit the same order twice. Failed, forged or amount-mismatched transactions cannot generate votes.

Phase 5: Content, media and email

Add Vercel Blob upload and deletion workflows.

Implement page-specific hero and CTA configuration.

Integrate Resend for receipts and notifications.

Add newsletter consent and unsubscribe handling.

Implement delivery status logging and retryable email jobs where necessary.

Acceptance: uploaded media is permission-checked; failed email delivery does not undo a successful payment or lose the vote record.

Phase 6: Frontend and administration

Build public pages against the implemented API.

Create the private management application as a separate build and deployment.

Implement SweetAlert2 confirmations and feedback.

Use GSAP and AOS.js for restrained animations.

Implement dashboards, reports, settings and content management.

Ensure all page sections and branding can be configured.

Acceptance: the public website contains no management navigation or privileged operations. Direct requests to protected endpoints are rejected without authorization.

Phase 7: Testing and launch

Test at minimum:

Successful and failed payments.

Invalid amount and currency.

Invalid webhook signature.

Duplicate webhook delivery.

Concurrent requests for the same order.

Closed event and unpublished nominee.

Vote limits and pricing changes.

Session expiry, CSRF and rate limiting.

Upload size/type restrictions.

Database failures and payment reconciliation.

Newsletter unsubscribe.

Mobile responsiveness and keyboard accessibility.

Do not launch paid voting until payment reconciliation and duplicate-allocation tests pass.

7. Detailed design architecture
Visual system

Home page

Full-width hero with a unique event photograph, headline, event dates, countdown and primary voting CTA. Use ivory content sections, purple controls and restrained gold details.

Nominee and category pages

Portrait-led cards, readable names, category badges, biography links and clearly displayed vote pricing. Provide search, category filters and pagination.

Voting and checkout

Show nominee, category, quantity, unit price, total amount and applicable terms before payment. Keep the payment action prominent and the order summary unambiguous.

Leaderboard

Use a clear ranking table or card layout with nominee images, rank, category and optional vote totals. Distinguish first, second and third place without relying on color alone.

Design tokens
:root {
  --color-primary: #5B21B6;
  --color-primary-dark: #3B0764;
  --color-accent: #D4AF37;
  --color-background: #FCFAF5;
  --color-surface: #FFFFFF;
  --color-text: #171717;
  --color-muted: #6B7280;
  --color-border: #E5E7EB;

  --radius-card: 16px;
  --radius-button: 10px;
  --container-width: 1200px;
}

The implementation should map these tokens to Tailwind theme variables so each deployment can change its palette centrally.

Animation rules

GSAP: hero sequences, interactive transitions and selected counters.

AOS.js: lightweight scroll-triggered reveals.

SweetAlert2: confirmation, payment feedback, form status and error messages.

Respect prefers-reduced-motion.

Never use animations to delay payment verification or obscure an important error.

Avoid running multiple animation systems on the same element.

Use SweetAlert2 for meaningful feedback, not for every routine interaction.

8. System and deployment architecture

Deployment recommendation: use separate Vercel projects for the public site, private management application and API where practical. They may share the same GitHub monorepo. The management application's URL should be private and unlinked from public pages, but obscurity is not a security control. Authentication, authorization and server-side checks are mandatory.

For a future multi-client SaaS version, add tenant isolation, organization membership, per-tenant storage policies, custom domains and billing. A reusable single-deployment product does not automatically provide secure multi-tenant isolation.

9. Folder and file architecture

Use a TypeScript monorepo with shared packages for database access, validation, types and business logic.


awardly/
├── apps/
│   ├── web/
│   │   ├── public/
│   │   └── src/
│   │       ├── app/
│   │       ├── pages/
│   │       ├── components/
│   │       │   ├── layout/
│   │       │   ├── navigation/
│   │       │   ├── nominees/
│   │       │   ├── voting/
│   │       │   ├── leaderboard/
│   │       │   ├── gallery/
│   │       │   └── common/
│   │       ├── hooks/
│   │       ├── services/
│   │       ├── animations/
│   │       ├── styles/
│   │       └── main.tsx
│   │
│   ├── admin/
│   │   └── src/
│   │       ├── app/
│   │       ├── pages/
│   │       ├── components/
│   │       ├── features/
│   │       │   ├── events/
│   │       │   ├── categories/
│   │       │   ├── nominees/
│   │       │   ├── votes/
│   │       │   ├── payments/
│   │       │   ├── content/
│   │       │   ├── media/
│   │       │   ├── reports/
│   │       │   └── settings/
│   │       └── main.tsx
│   │
│   └── api/
│       └── api/
│           └── v1/
│               ├── health.ts
│               ├── public/
│               ├── checkout/
│               ├── payments/
│               │   └── paystack-webhook.ts
│               ├── newsletter/
│               ├── contact/
│               └── management/
│
├── packages/
│   ├── database/
│   │   ├── schema/
│   │   ├── migrations/
│   │   ├── client.ts
│   │   └── seeds/
│   ├── validation/
│   ├── shared-types/
│   ├── business-logic/
│   ├── auth/
│   └── ui/
│
├── tests/
│   ├── unit/
│   ├── integration/
│   ├── payments/
│   └── e2e/
│
├── docs/
│   ├── PRD.md
│   ├── MVP.md
│   ├── EPR.md
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── DATABASE.md
│   └── SECURITY.md
│
├── .env.example
├── package.json
├── pnpm-workspace.yaml
├── tsconfig.base.json
└── README.md

This is a logical monorepo structure. Vercel's actual routing and build configuration must be implemented and tested against its deployment conventions rather than assuming every folder maps automatically to an API route.

10. API architecture

Base path: /api/v1

Module

	

Example endpoints

	

Access




Health

	

GET /health

	

Public, minimal information




Events

	

GET /public/events/:slug

	

Public




Categories

	

GET /public/categories

	

Public




Nominees

	

GET /public/nominees

	

Public




Leaderboard

	

GET /public/leaderboard

	

Public, configurable




Checkout

	

POST /checkout

	

Public with rate limits




Order status

	

GET /orders/:reference

	

Restricted to safe, authorized order lookup




Paystack webhook

	

POST /payments/paystack-webhook

	

Signature-verified gateway request




Newsletter

	

POST /newsletter/subscribe

	

Public with rate limits




Contact

	

POST /contact

	

Public with validation and abuse controls




Event management

	

CRUD under /management/events

	

Authorized




Category management

	

CRUD under /management/categories

	

Authorized




Nominee management

	

CRUD under /management/nominees

	

Authorized




Payment reports

	

GET /management/payments

	

Finance/owner permission




Vote reports

	

GET /management/votes

	

Authorized




Media

	

Upload/delete under /management/media

	

Authorized




Site settings

	

CRUD under /management/settings

	

Owner permission




Audit logs

	

GET /management/audit-logs

	

Restricted

The public API must expose only public fields. Internal administrative routes should be protected regardless of whether their URL is known.

Core database entities

platform_settings: deployment identity and configuration.

events: event details, dates, currency and state.

event_branding: logos, colors, hero artwork and CTA configuration.

categories: event categories.

nominees: nominee profiles and publication state.

voters: minimal voter information.

vote_orders: requested quantity and immutable price snapshot.

payments: provider references, status, amount and currency.

vote_allocations: verified allocations linked to paid orders.

media_assets: Blob URLs, ownership and metadata.

galleries, sponsors, faqs, pages.

newsletter_subscribers, contact_messages.

admin_users, sessions, roles, permissions.

audit_logs, webhook_events, refunds, email_outbox.

Use foreign keys, indexes, uniqueness constraints and database transactions where required. Do not maintain a leaderboard as an independently editable source of truth. Calculate it from committed vote allocations or maintain a carefully reconciled aggregate.

11. Reusability and feature configuration

The management application should include a Brand & Platform Settings area with:

Setting

	

Examples




Brand name

	

Awardly, VoteStage, another client brand




Logo and favicon

	

Uploaded through Blob




Colors and typography

	

Purple/gold, navy/silver, green/ivory




Event type

	

Awards, talent contest, community poll




Features

	

Gallery, newsletter, leaderboard, sponsors




Voting mode

	

Paid, free or disabled




Vote pricing

	

Global or category-specific, according to rules




Currency

	

NGN or another explicitly supported currency




Page content

	

Headlines, copy, images and CTAs




Footer credit

	

Elite Developers or client-specific wording




Email identity

	

Sender name, verified sender address




Payment settings

	

Server-side Paystack configuration




Event state

	

Draft, scheduled, live, closed or archived

Keep platform configuration separate from event configuration. Platform settings control the deployment identity and available capabilities. Event settings control the individual competition.

Feature flags must be enforced on the server as well as reflected in the UI. Hiding a button is not sufficient to disable an API capability.

12. Security and production checklist
Strong authentication, secure HTTP-only cookies and session rotation.
Owner-only initial setup; no public admin registration.
Role-based access checks on every privileged API operation.
CSRF protection for cookie-authenticated mutations.
Restricted CORS, security headers and HTTPS.
Endpoint-specific rate limits for login, checkout, newsletter and contact.
Server-side pricing and quantity validation.
Paystack signature and transaction verification.
Idempotent payment processing and transactional vote allocation.
Immutable payment references and audit records.
Secure Blob uploads and orphaned-file cleanup.
Secrets restricted to server-side environment variables.
Newsletter consent and unsubscribe handling.
Payment reconciliation, backup and restore procedures.
No private voter or payment information in public API responses.
No administrative links, routes or management language in the public UI.
Automated tests for failed payments, duplicate callbacks and authorization failures.
13. Full master development prompt

The following prompt can be used with your coding agent. It combines the product specification, architecture, UI rules and implementation process into one instruction.

MASTER DEVELOPMENT PROMPT: AWARDLY
MASTER DEVELOPMENT PROMPT: AWARDLY
1. Role and objective

Act as a senior full-stack engineer, software architect, UI/UX designer, database engineer and application security engineer.

Build Awardly, a production-ready, reusable, white-label paid voting and awards management platform owned and developed by Elite Developers.

Do not create a static mockup, a frontend-only demo or a collection of disconnected pages. Implement a complete system with a functioning database, API, authentication, event configuration, voting, Paystack payment verification, vote allocation, email delivery and management interface.

Follow the specification in this document. Do not silently remove requirements or replace the chosen technologies.

2. Mandatory technology stack
React, Vite and TypeScript for the public application.
A separate React, Vite and TypeScript application for private management.
Tailwind CSS for styling.
Node.js and TypeScript using Vercel server-side functions.
Neon PostgreSQL for persistent data.
Drizzle ORM and version-controlled SQL migrations.
Zod for request validation.
Vercel Blob for media storage.
Paystack as the initial payment gateway.
Resend as the primary email provider.
Gmail SMTP as an optional, separately configured SMTP delivery route.
GSAP for selected interactive animations.
AOS.js for appropriate scroll reveals.
SweetAlert2 for confirmations, errors and success feedback.
Vitest and integration tests for quality assurance.
GitHub and Vercel for version control and deployment.

Do not use Laravel, PHP or a different backend framework. Do not put private API keys in frontend code.

3. Non-negotiable public/private separation

The public website must never display an administration link, admin login, admin navigation, management CTA or administrative terminology.

Do not place administrative routes in public navigation, footer, sitemap links, public page content or frontend-generated links.

Build the private management application separately from the public application. Use server-side authentication, authorization, secure sessions and role checks for all management operations.

Do not rely on a hidden URL as the security mechanism. Protect every private API endpoint.

4. Reusable white-label architecture

Awardly must be the default brand, not a hardcoded name.

Allow authorized operators to configure:

Platform name and tagline.
Event name, slug, description and status.
Logo, icon, favicon and brand imagery.
Primary, secondary, accent, background and text colors.
Typography and design tokens.
Hero images and page-specific CTA images.
Public page content and SEO metadata.
Social links, contact details and footer.
Developer credit, defaulting to Elite Developers.
Event currency and voting prices.
Categories, nominees and voting dates.
Feature availability, such as gallery, sponsors, newsletter and leaderboard.
Email sender settings.
Payment configuration using server-side secrets.

A future client should be able to rebrand the deployment through settings rather than source-code edits.

Support multiple event records from the beginning. Design tenant isolation and custom-domain support as explicit future capabilities rather than claiming that separate events alone provide multi-tenant security.

5. Public pages

Implement:

Home.
About Us.
Categories.
Nominees.
Nominee details.
Vote Now.
Leaderboard.
Gallery.
Contact.
FAQ.
Terms of Service.
Privacy Policy.

Every major page must have its own configurable hero image and relevant CTA image. Do not reuse one generic CTA banner everywhere.

Each page must have appropriate headings, copy, responsive layouts, accessible controls, page metadata, loading states, empty states and error states.

Use real content structures and functional API integrations. Do not fill the finished website with meaningless placeholder text.

The footer must include Quick Links, Legal, newsletter subscription, social links, a configurable copyright year and brand name, and “Developed by Elite Developers” by default.

6. Design requirements

Use the default premium award-event palette:

Royal purple: #5B21B6.
Deep plum: #3B0764.
Champagne gold: #D4AF37.
Warm ivory: #FCFAF5.
White: #FFFFFF.
Charcoal: #171717.
Muted text: #6B7280.
Border: #E5E7EB.

Use award photography, nominee portraits, clean typography, consistent spacing and carefully designed page layouts.

Avoid generic AI-generated SaaS layouts, excessive gradients, repeated cards with no visual hierarchy, unnecessary animation and excessive decorative effects.

Use GSAP and AOS.js selectively. Respect reduced-motion preferences. Use SweetAlert2 for meaningful confirmations and user feedback.

Build a mobile-first responsive design, then optimize tablet and desktop layouts.

7. Event and nominee management

Implement full CRUD operations for events, categories and nominees.

Events must support:

Draft, scheduled, live, closed and archived states.
Start and end timestamps with an explicit timezone.
Branding and event-specific content.
Currency and voting configuration.
Public visibility settings.
Event closure and archival behavior.

Categories must support descriptions, images, ordering, publication state and optional category-specific pricing.

Nominees must support names, profile images, biography, nominee codes, category assignments, social links and publication state.

Prevent voting for unpublished nominees, invalid categories or closed events.

8. Voting and payment rules

Allow voters to select a nominee and quantity, review an order and continue to Paystack checkout.

The server must calculate the amount. Never trust a client-supplied price or payment status.

Create a pending order with an immutable price snapshot before initializing payment.

Verify Paystack transactions server-side. Verify webhook signatures using the raw request body and the correct server-side secret.

Check the payment reference, transaction status, expected amount and currency. Reject mismatched or unrecognized transactions.

Use database transactions, unique constraints and idempotency controls so repeated callbacks cannot allocate votes more than once.

Only verified successful payments may create vote allocations.

Handle delayed webhooks, duplicate delivery, failed payments, abandoned checkouts, reversals and refunds. Record payment changes and vote adjustments in an auditable manner.

Do not make refunds or manual vote changes silently. Require appropriate permissions and record the reason, actor and timestamp.

9. Database

Use Neon PostgreSQL with Drizzle ORM and version-controlled migrations.

Design appropriate tables for:

Platform settings and event branding.
Events, categories and nominees.
Voters and vote orders.
Payments and vote allocations.
Refunds and webhook events.
Media assets.
Gallery, sponsors, FAQs and pages.
Newsletter subscribers and contact messages.
Authorized users, sessions, roles and permissions.
Audit logs and email delivery records.

Use foreign keys, indexes, constraints and transactions.

Keep the payment ledger separate from vote allocations. Store the original order quantity and pricing snapshot. Use committed vote allocations as the authoritative source for rankings.

Use appropriate data retention rules and collect only the personal information required to operate voting and fulfill receipts.

10. API

Use a versioned REST API under /api/v1.

Implement public endpoints for events, categories, nominees, nominee details, leaderboard, gallery, FAQs, newsletter subscription and contact.

Implement protected management endpoints for event settings, categories, nominees, voting rules, orders, payments, reports, media, content, newsletter operations and audit logs.

Implement checkout and payment-status endpoints plus a dedicated Paystack webhook endpoint.

Validate all inputs using Zod. Apply pagination, consistent errors, structured logs and request identifiers.

Keep database operations and business logic in reusable services instead of duplicating them across route handlers.

Return only fields intended for the requesting user. Do not expose payment secrets, privileged settings, private voter information or internal database models.

11. Media

Use Vercel Blob for logos, icons, hero images, CTA images, nominee portraits, gallery images and sponsor artwork.

Validate upload permissions, file size, file type and allowed content. Store media metadata and URLs in PostgreSQL.

Support replacement, deletion and orphaned-file cleanup. Prevent public visitors from uploading or deleting privileged assets.

12. Email and notifications

Use Resend for transactional email and newsletter delivery.

Implement payment receipts, vote confirmation, relevant security emails, event announcements, newsletter subscriptions and contact notifications.

Gmail SMTP may be configured as an optional delivery route. Keep its credentials and all provider keys server-side.

Use verified sender identities. Implement unsubscribe handling and subscriber consent records. Record delivery attempts without allowing an email provider failure to undo a confirmed payment.

13. Private management application

Provide an authenticated management interface with:

Overview dashboard.
Event settings.
Category and nominee management.
Voting configuration.
Orders and payments.
Leaderboard controls.
Gallery and media.
Sponsors and FAQ.
Website content and CTA images.
Newsletter and announcements.
Email configuration.
Reports and exports.
Authorized user and permission management.
Audit logs.
Platform branding and feature settings.

Implement role-based access controls. Require stronger authorization for payment configuration, refunds, privileged settings and manual vote corrections.

No public administration links or privileged management operations may be exposed in the public application.

14. Security

Implement:

Secure HTTP-only cookies.
Session rotation and expiry.
CSRF protection where applicable.
Strong password hashing and optional multi-factor authentication.
Server-side authorization.
Endpoint-specific rate limiting.
Strict input validation.
Parameterized database queries.
Security headers and restricted CORS.
Secret management through server-side environment variables.
Webhook signature verification.
Payment reconciliation and idempotency.
Audit logging.
Secure upload validation.
Appropriate backup and recovery procedures.

Do not invent security guarantees. Test access controls and failure cases.

15. Testing

Write automated tests for:

Brand and event configuration.
CRUD permissions.
Voting quantity and pricing validation.
Successful, failed and mismatched payments.
Invalid webhook signatures.
Duplicate webhook delivery.
Concurrent vote allocation.
Closed events and unpublished nominees.
Refund and reversal processing.
Session expiry and unauthorized API access.
Upload restrictions.
Newsletter subscription and unsubscribe.
Public API privacy boundaries.

Use Paystack test mode during development. Never use live payment credentials for routine automated tests.

16. Implementation workflow

Build in phases:

Repository, TypeScript configuration and Vercel architecture.
Neon schema, migrations and reusable configuration.
API foundation and validation.
Authentication and authorization.
Event, category and nominee services.
Checkout, Paystack verification and idempotent vote allocation.
Leaderboard and reporting.
Media and Blob integration.
Resend and optional SMTP.
Public React website.
Private management application.
Responsive design, animations and SweetAlert2.
Integration tests, security tests and deployment.

After each phase, run relevant tests, fix failures and document what is complete.

Do not claim an integration works until it has been configured and tested. If credentials are missing, implement the integration, provide an example environment file and document the remaining setup steps.

17. Required deliverables

Provide:

Complete source code.
Working public application.
Separate protected management application.
Vercel API functions.
PostgreSQL schema and migrations.
Seed scripts for development.
API documentation.
PRD, MVP, EPR and architecture documentation.
Security checklist.
Environment variable example.
Automated tests.
Vercel deployment instructions.
Paystack setup and webhook instructions.
Resend and optional Gmail SMTP configuration.
Database migration and backup instructions.
README with local development steps.

The final result must be a functioning, reusable product, not just a UI prototype. Preserve every mandatory requirement throughout implementation.

14. Recommended implementation order

Build Awardly in this order to avoid creating a beautiful frontend around an unreliable payment system:

Foundation and configuration: repository, Neon schema, migrations, brand configuration and event model.

API and security: public data endpoints, private authentication, authorization and audit logs.

Voting engine: immutable orders, Paystack initialization, webhook verification, idempotency and vote allocation.

Management application: event, category, nominee, payment and content controls.

Public website: unique page layouts, images, CTA sections, voting, leaderboard and footer.

Integrations and launch: Blob, Resend, tests, monitoring, deployment and payment reconciliation.

Final recommendation: treat Awardly as a reusable product with configurable branding, not a single award-event website. The event data, visual identity, enabled features, voting rules and email branding should all be configurable. Keep the public site separate from the private management application, and make payment verification plus vote allocation the most rigorously tested part of the system.