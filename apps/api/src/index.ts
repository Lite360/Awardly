import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { PaystackService } from './services/paystack.js';
import { EmailService } from './services/email.js';
import { publicRouter } from './routes/public.js';
import { adminRouter } from './routes/admin.js';
import { contentPublicRouter, contentAdminRouter } from './routes/content.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4000;
const paystack = new PaystackService();
const emailService = new EmailService();
const platformName = process.env.PLATFORM_NAME || 'Awardly';

app.use(cors());

// Raw body parser MUST come before express.json() for webhook HMAC verification
app.use('/api/webhooks', express.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Health Check ────────────────────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() });
});

// ── Public Routers ──────────────────────────────────────────────────────────
app.use('/api/public', publicRouter);
app.use('/api/public/content', contentPublicRouter);

// ── Protected Admin Routers ─────────────────────────────────────────────────
app.use('/api/admin', adminRouter);
app.use('/api/admin/content', contentAdminRouter);

// ── Paid Vote Checkout (Initialize Payment) ─────────────────────────────────
app.post('/api/public/vote/checkout', async (req: Request, res: Response) => {
  try {
    const { nomineeSlug, voteCount, voterEmail, voterName } = req.body;
    if (!nomineeSlug || !voteCount || !voterEmail) {
      return res.status(400).json({
        success: false,
        error: { code: 'INVALID_INPUT', message: 'Nominee slug, vote count, and email are required.' },
      });
    }

    // TODO: Look up nominee and event in DB to get live price + validate nominee is published
    const pricePerVoteKobo = 10000; // 100.00 NGN in kobo — will come from event config
    const totalAmount = voteCount * pricePerVoteKobo;
    const reference = `VOTE_${Date.now()}_${Math.floor(Math.random() * 9999)}`;

    const paystackRes = await paystack.initializeTransaction({
      email: voterEmail,
      amount: totalAmount,
      reference,
      callback_url: `${process.env.WEB_URL || 'http://localhost:5173'}/vote/callback?trxref=${reference}`,
      metadata: {
        nomineeSlug,
        voteCount,
        voterName: voterName || 'Anonymous Voter',
        platformName,
      },
    });

    if (paystackRes.status && paystackRes.data) {
      return res.json({
        success: true,
        data: {
          reference,
          authorizationUrl: paystackRes.data.authorization_url,
          accessCode: paystackRes.data.access_code,
        },
        requestId: `req_${Date.now()}`,
      });
    }

    res.status(400).json({
      success: false,
      error: { code: 'PAYMENT_INIT_FAILED', message: paystackRes.message || 'Payment initialization failed.' },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Checkout error';
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message } });
  }
});

// ── Server-side Verify Payment ──────────────────────────────────────────────
app.get('/api/public/vote/verify/:reference', async (req: Request, res: Response) => {
  try {
    const { reference } = req.params;
    if (!reference) {
      return res.status(400).json({ success: false, error: { code: 'MISSING_REF', message: 'Transaction reference is required.' } });
    }

    const verification = await paystack.verifyTransaction(reference);
    if (verification.status && verification.data.status === 'success') {
      return res.json({
        success: true,
        data: {
          reference: verification.data.reference,
          amountPaid: verification.data.amount,
          currency: verification.data.currency,
          status: 'verified',
          paidAt: verification.data.paid_at,
          metadata: verification.data.metadata,
        },
        requestId: `req_${Date.now()}`,
      });
    }

    res.status(400).json({
      success: false,
      error: {
        code: 'VERIFICATION_FAILED',
        message: verification.data?.gateway_response || 'Payment verification failed.',
      },
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Verification error';
    res.status(500).json({ success: false, error: { code: 'SERVER_ERROR', message } });
  }
});

// ── Paystack Webhook Handler ─────────────────────────────────────────────────
app.post('/api/webhooks/paystack', async (req: Request, res: Response) => {
  const signature = req.headers['x-paystack-signature'] as string;
  const rawBody = req.body.toString();

  // HMAC SHA512 signature verification — must happen before any JSON parsing
  const isValid = paystack.verifyWebhookSignature(rawBody, signature);
  if (!isValid) {
    console.warn('[Webhook] Invalid Paystack signature — request rejected');
    return res.status(400).send('Invalid signature');
  }

  // Respond immediately to Paystack to prevent retry loops
  res.status(200).json({ status: 'received' });

  // Process event asynchronously after responding
  try {
    const event = JSON.parse(rawBody);
    console.log(`[Webhook] Event received: ${event.event}`);

    if (event.event === 'charge.success') {
      const { reference, amount, currency, metadata, paid_at } = event.data;
      const voterEmail = event.data.customer?.email;
      const nomineeSlug = metadata?.nomineeSlug as string | undefined;
      const voteCount = metadata?.voteCount as number | undefined;
      const voterName = metadata?.voterName as string | undefined;

      console.log(`[Webhook] charge.success — ref: ${reference}, amount: ${amount} ${currency}`);

      // TODO: Atomic DB transaction:
      //   1. Find voteOrder by reference
      //   2. Check voteAllocation doesn't already exist (idempotency via unique constraint on orderId)
      //   3. Update voteOrder status → 'paid'
      //   4. Insert payment record
      //   5. Insert voteAllocation (unique constraint prevents double allocation)
      //   6. Update nominee vote count aggregate if applicable

      // Send vote receipt email — non-blocking, failure never reverses votes
      if (voterEmail && nomineeSlug && voteCount) {
        emailService
          .sendVoteReceipt({
            to: voterEmail,
            voterName: voterName || 'Voter',
            nomineeName: nomineeSlug.replace(/-/g, ' '),
            categoryName: 'Award Category',     // TODO: pull from DB lookup
            voteCount,
            totalAmount: amount,
            currency: currency || 'NGN',
            reference,
            paidAt: paid_at || new Date().toISOString(),
            platformName,
          })
          .then((result) => {
            if (!result.success) {
              console.error(`[Webhook] Vote receipt email failed for ${reference}:`, result.error);
            } else {
              console.log(`[Webhook] Vote receipt sent to ${voterEmail} (msgId: ${result.messageId})`);
            }
          })
          .catch((err) => console.error('[Webhook] Email service exception:', err));
      }
    }

    if (event.event === 'charge.dispute.create' || event.event === 'refund.processed') {
      const { reference } = event.data;
      console.log(`[Webhook] ${event.event} for ref: ${reference} — review required`);
      // TODO: Mark order for review, apply refund policy, log in audit_logs
    }
  } catch (err: unknown) {
    console.error('[Webhook] Processing error:', err instanceof Error ? err.message : err);
  }
});

// ── 404 catch-all ────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'The requested API endpoint does not exist.' },
  });
});

app.listen(PORT, () => {
  console.log(`[Awardly API] Listening on http://localhost:${PORT}`);
  console.log(`[Awardly API] Email service: ${process.env.RESEND_API_KEY ? 'Resend configured' : 'DEV MODE (logging only)'}`);
  console.log(`[Awardly API] Media service: ${process.env.BLOB_READ_WRITE_TOKEN ? 'Vercel Blob configured' : 'DEV MODE (local paths)'}`);
});
