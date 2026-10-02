// ─────────────────────────────────────────────────────────────────────────────
// Awardly — Shared Types
// Central type definitions used across all apps and packages
// ─────────────────────────────────────────────────────────────────────────────

// ── Platform & Branding ───────────────────────────────────────────────────────

export type PlatformType =
  | 'awards'
  | 'talent_competition'
  | 'public_poll'
  | 'community_voting';

export type VotingMode = 'paid' | 'free' | 'disabled';

export type Currency = 'NGN' | 'USD' | 'GHS' | 'GBP' | 'EUR';

export interface PlatformSettings {
  id: string;
  name: string;
  tagline: string;
  platformType: PlatformType;
  logoUrl: string | null;
  faviconUrl: string | null;
  primaryColor: string;
  primaryDarkColor: string;
  accentColor: string;
  backgroundColor: string;
  textColor: string;
  defaultCurrency: Currency;
  footerCredit: string;
  developerCredit: string;
  contactEmail: string | null;
  contactPhone: string | null;
  socialLinks: SocialLinks;
  features: FeatureFlags;
  emailFromName: string;
  emailFromAddress: string;
  updatedAt: string;
}

export interface SocialLinks {
  twitter?: string;
  instagram?: string;
  facebook?: string;
  youtube?: string;
  tiktok?: string;
  linkedin?: string;
  whatsapp?: string;
}

export interface FeatureFlags {
  gallery: boolean;
  sponsors: boolean;
  leaderboard: boolean;
  newsletter: boolean;
  contactForm: boolean;
  faq: boolean;
  aboutPage: boolean;
}

// ── Events ────────────────────────────────────────────────────────────────────

export type EventStatus =
  | 'draft'
  | 'scheduled'
  | 'live'
  | 'closed'
  | 'archived';

export interface Event {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  status: EventStatus;
  currency: Currency;
  votingMode: VotingMode;
  votePrice: number; // price per vote in smallest unit (kobo/cents)
  minVotesPerOrder: number;
  maxVotesPerOrder: number;
  startDate: string | null;
  endDate: string | null;
  timezone: string;
  branding: EventBranding | null;
  createdAt: string;
  updatedAt: string;
}

export interface EventBranding {
  id: string;
  eventId: string;
  heroImageUrl: string | null;
  heroImageAlt: string | null;
  primaryColor: string | null;
  accentColor: string | null;
  logoUrl: string | null;
  pageCtaImages: PageCtaImages;
}

export interface PageCtaImages {
  home?: string;
  about?: string;
  categories?: string;
  nominees?: string;
  vote?: string;
  leaderboard?: string;
  gallery?: string;
  contact?: string;
  faq?: string;
}

// ── Categories ────────────────────────────────────────────────────────────────

export interface Category {
  id: string;
  eventId: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  sortOrder: number;
  isPublished: boolean;
  hasCustomPricing: boolean;
  customVotePrice: number | null; // overrides event price if set
  nomineeCount?: number;
  createdAt: string;
  updatedAt: string;
}

// ── Nominees ──────────────────────────────────────────────────────────────────

export interface Nominee {
  id: string;
  eventId: string;
  categoryId: string;
  categoryName?: string;
  name: string;
  slug: string;
  code: string; // short unique code e.g. NOM-001
  bio: string | null;
  imageUrl: string | null;
  socialLinks: SocialLinks;
  isPublished: boolean;
  sortOrder: number;
  voteCount?: number; // included in leaderboard context
  createdAt: string;
  updatedAt: string;
}

// ── Voting & Orders ───────────────────────────────────────────────────────────

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'refunded';

export interface VoteOrder {
  id: string;
  reference: string; // Paystack reference
  eventId: string;
  nomineeId: string;
  categoryId: string;
  voterEmail: string;
  voterName: string | null;
  quantity: number;
  unitPrice: number; // immutable price snapshot at time of order
  totalAmount: number; // unitPrice * quantity
  currency: Currency;
  status: OrderStatus;
  paystackReference: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
}

export type PaymentStatus =
  | 'pending'
  | 'success'
  | 'failed'
  | 'abandoned'
  | 'reversed';

export interface Payment {
  id: string;
  orderId: string;
  paystackReference: string;
  paystackTransactionId: string | null;
  status: PaymentStatus;
  amount: number;
  currency: Currency;
  channel: string | null; // card, bank_transfer, etc.
  paidAt: string | null;
  gatewayResponse: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface VoteAllocation {
  id: string;
  orderId: string;
  paymentId: string;
  eventId: string;
  nomineeId: string;
  categoryId: string;
  votesAllocated: number;
  allocatedAt: string;
}

// ── Leaderboard ───────────────────────────────────────────────────────────────

export interface LeaderboardEntry {
  rank: number;
  nomineeId: string;
  nomineeName: string;
  nomineeImageUrl: string | null;
  nomineeSlug: string;
  categoryId: string;
  categoryName: string;
  voteCount: number;
  percentage: number; // percentage of total votes in category
}

export interface LeaderboardData {
  eventId: string;
  eventTitle: string;
  isLive: boolean;
  showVoteCounts: boolean; // configurable per event
  totalVotes: number;
  lastUpdated: string;
  categories: {
    categoryId: string;
    categoryName: string;
    entries: LeaderboardEntry[];
  }[];
}

// ── Content & Media ───────────────────────────────────────────────────────────

export interface MediaAsset {
  id: string;
  url: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  altText: string | null;
  uploadedBy: string;
  purpose: MediaPurpose;
  entityId: string | null;
  entityType: string | null;
  createdAt: string;
}

export type MediaPurpose =
  | 'platform_logo'
  | 'event_hero'
  | 'event_logo'
  | 'page_cta'
  | 'nominee_photo'
  | 'category_image'
  | 'gallery_image'
  | 'sponsor_logo'
  | 'favicon'
  | 'other';

export interface GalleryImage {
  id: string;
  eventId: string;
  url: string;
  thumbnailUrl: string | null;
  altText: string | null;
  caption: string | null;
  sortOrder: number;
  isPublished: boolean;
  createdAt: string;
}

export interface Sponsor {
  id: string;
  eventId: string;
  name: string;
  logoUrl: string | null;
  websiteUrl: string | null;
  tier: 'title' | 'gold' | 'silver' | 'bronze' | 'partner';
  sortOrder: number;
  isPublished: boolean;
}

export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  sortOrder: number;
  isPublished: boolean;
}

// ── Users & Auth ──────────────────────────────────────────────────────────────

export type AdminRole = 'owner' | 'event_operator' | 'finance_operator' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}

// ── Newsletter ────────────────────────────────────────────────────────────────

export interface NewsletterSubscriber {
  id: string;
  email: string;
  name: string | null;
  isConfirmed: boolean;
  isUnsubscribed: boolean;
  subscribedAt: string;
  unsubscribedAt: string | null;
  consentText: string;
}

// ── API Helpers ───────────────────────────────────────────────────────────────

export interface ApiResponse<T = unknown> {
  success: true;
  data: T;
  requestId: string;
}

export interface ApiError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
  requestId: string;
}

export type ApiResult<T> = ApiResponse<T> | ApiError;

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

export interface PaginationParams {
  page?: number;
  perPage?: number;
}
