// ─────────────────────────────────────────────────────────────────────────────
// Public API client service — all public-facing data fetching
// Never put secrets here; this is frontend code
// ─────────────────────────────────────────────────────────────────────────────

import { apiRequest } from './api';
import type {
  Event,
  Category,
  Nominee,
  LeaderboardData,
  GalleryImage,
  Sponsor,
  FaqEntry,
  PaginatedResponse,
  PlatformSettings,
} from '@awardly/shared-types';

// ── Platform settings (white-label branding) ──────────────────────────────────
export const getPlatformSettings = () =>
  apiRequest<PlatformSettings>('get', '/public/settings');

// ── Active event ──────────────────────────────────────────────────────────────
export const getActiveEvent = () =>
  apiRequest<Event>('get', '/public/events/active');

// ── Categories ────────────────────────────────────────────────────────────────
export const getCategories = () =>
  apiRequest<Category[]>('get', '/public/categories');

// ── Nominees ──────────────────────────────────────────────────────────────────
export const getNominees = (params?: {
  categorySlug?: string;
  search?: string;
  page?: number;
  perPage?: number;
}) => apiRequest<PaginatedResponse<Nominee>>('get', '/public/nominees', undefined, params);

export const getNomineeBySlug = (slug: string) =>
  apiRequest<Nominee>('get', `/public/nominees/${slug}`);

// ── Leaderboard ───────────────────────────────────────────────────────────────
export const getLeaderboard = (categoryId?: string) =>
  apiRequest<LeaderboardData>(
    'get',
    '/public/leaderboard',
    undefined,
    categoryId ? { categoryId } : undefined
  );

// ── Gallery ───────────────────────────────────────────────────────────────────
export const getGallery = () =>
  apiRequest<GalleryImage[]>('get', '/public/content/gallery');

// ── Sponsors ──────────────────────────────────────────────────────────────────
export const getSponsors = () =>
  apiRequest<Sponsor[]>('get', '/public/content/sponsors');

// ── FAQs ──────────────────────────────────────────────────────────────────────
export const getFaqs = () =>
  apiRequest<FaqEntry[]>('get', '/public/content/faqs');

// ── Static page content (about, terms, privacy) ───────────────────────────────
export const getPageContent = (slug: string) =>
  apiRequest<{ slug: string; title: string; content: string }>(
    'get',
    `/public/content/pages/${slug}`
  );

// ── Newsletter subscribe ──────────────────────────────────────────────────────
export const subscribeNewsletter = (data: { email: string; name?: string }) =>
  apiRequest<{ message: string }>('post', '/public/content/newsletter/subscribe', data);

// ── Newsletter unsubscribe (token from email link) ────────────────────────────
export const unsubscribeNewsletter = (token: string) =>
  apiRequest<{ message: string }>(
    'get',
    '/public/content/newsletter/unsubscribe',
    undefined,
    { token }
  );

// ── Contact form ──────────────────────────────────────────────────────────────
export const sendContactMessage = (data: {
  name: string;
  email: string;
  subject: string;
  message: string;
}) => apiRequest<{ message: string }>('post', '/public/content/contact', data);

// ── Vote checkout: initialize Paystack transaction ────────────────────────────
export const initializeVoteCheckout = (data: {
  nomineeSlug: string;
  voteCount: number;
  voterEmail: string;
  voterName?: string;
}) =>
  apiRequest<{ reference: string; authorizationUrl: string; accessCode: string }>(
    'post',
    '/public/vote/checkout',
    data
  );

// ── Vote verification: confirm payment server-side after Paystack redirect ────
export const verifyVotePayment = (reference: string) =>
  apiRequest<{
    reference: string;
    amountPaid: number;
    currency: string;
    status: string;
    paidAt: string;
    metadata: { nomineeSlug?: string; voteCount?: number; voterName?: string };
  }>('get', `/public/vote/verify/${reference}`);
