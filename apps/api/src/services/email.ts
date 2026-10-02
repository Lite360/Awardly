// ─────────────────────────────────────────────────────────────────────────────
// Email Service — Resend integration for all transactional email
// Failed delivery never undoes a successful payment or vote record
// ─────────────────────────────────────────────────────────────────────────────

export interface VoteReceiptData {
    to: string;
    voterName: string;
    nomineeName: string;
    categoryName: string;
    voteCount: number;
    totalAmount: number;
    currency: string;
    reference: string;
    paidAt: string;
    platformName: string;
}

export interface ContactConfirmationData {
    to: string;
    name: string;
    subject: string;
    platformName: string;
    contactEmail: string;
}

export interface NewsletterWelcomeData {
    to: string;
    name: string | null;
    unsubscribeToken: string;
    platformName: string;
}

export interface EmailResult {
    success: boolean;
    messageId?: string;
    error?: string;
}

// Currency formatter helper
function formatAmount(amountInSmallestUnit: number, currency: string): string {
    const majorUnit = amountInSmallestUnit / 100;
    const symbols: Record<string, string> = {
        NGN: '₦',
        USD: '$',
        GHS: 'GH₵',
        GBP: '£',
        EUR: '€'
    };
    const symbol = symbols[currency] || currency;
    return `${symbol}${
        majorUnit.toLocaleString('en-NG', {minimumFractionDigits: 2})
    }`;
}

export class EmailService {
    private resend : import ('resend').Resend | null = null;
    private fromAddress : string;
    private fromName : string;
    private isConfigured : boolean;

    constructor() {
        const apiKey = process.env.RESEND_API_KEY;
        this.fromAddress = process.env.EMAIL_FROM_ADDRESS || 'noreply@awardly.com';
        this.fromName = process.env.EMAIL_FROM_NAME || 'Awardly';
        this.isConfigured = Boolean(apiKey && apiKey !== 're_1234567890abcdef');

        if (this.isConfigured && apiKey) {
            import ('resend').then(({Resend}) => {
                this.resend = new Resend(apiKey);
            });
        }
    }

    private get from(): string {
        return `${
            this.fromName
        } <${
            this.fromAddress
        }>`;
    }

    // ── Vote Receipt Email ───────────────────────────────────────────────────────
    async sendVoteReceipt(data : VoteReceiptData): Promise < EmailResult > {
        const subject = `✅ Vote Confirmed — ${
            data.reference
        }`;
        const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; background: #0f0a1e; color: #e8e4f0; margin: 0; padding: 0; }
          .container { max-width: 560px; margin: 0 auto; padding: 32px 16px; }
          .card { background: #1a1030; border-radius: 16px; padding: 32px; border: 1px solid rgba(91,33,182,0.3); }
          .badge { background: #16a34a; color: #fff; display: inline-block; padding: 6px 16px; border-radius: 999px; font-size: 13px; font-weight: 700; margin-bottom: 24px; }
          h1 { color: #D4AF37; font-size: 22px; margin: 0 0 8px; }
          .summary-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid rgba(255,255,255,0.07); font-size: 14px; }
          .summary-row:last-child { border-bottom: none; }
          .label { color: #a78bfa; }
          .value { color: #fff; font-weight: 600; font-family: monospace; }
          .footer { margin-top: 24px; font-size: 12px; color: #6b7280; text-align: center; }
          .ref { background: rgba(91,33,182,0.2); border-radius: 8px; padding: 12px 16px; margin: 20px 0; text-align: center; font-family: monospace; font-size: 15px; color: #D4AF37; letter-spacing: 1px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="card">
            <div class="badge">Payment Verified</div>
            <h1>🏆 Your Votes Are In!</h1>
            <p style="color:#c4b5fd; margin: 0 0 24px; font-size:14px;">
              Hi <strong style="color:#fff">${
            data.voterName || 'Voter'
        }</strong>, your vote has been confirmed and successfully allocated.
            </p>

            <div class="ref">${
            data.reference
        }</div>

            <div style="background:rgba(255,255,255,0.03); border-radius:12px; padding:16px; margin-bottom:16px;">
              <div class="summary-row">
                <span class="label">Nominee</span>
                <span class="value">${
            data.nomineeName
        }</span>
              </div>
              <div class="summary-row">
                <span class="label">Category</span>
                <span class="value">${
            data.categoryName
        }</span>
              </div>
              <div class="summary-row">
                <span class="label">Votes Purchased</span>
                <span class="value">${
            data.voteCount.toLocaleString()
        } votes</span>
              </div>
              <div class="summary-row">
                <span class="label">Amount Paid</span>
                <span class="value">${
            formatAmount(data.totalAmount, data.currency)
        }</span>
              </div>
              <div class="summary-row">
                <span class="label">Currency</span>
                <span class="value">${
            data.currency
        }</span>
              </div>
              <div class="summary-row">
                <span class="label">Date</span>
                <span class="value">${
            new Date(data.paidAt).toLocaleString('en-NG')
        }</span>
              </div>
            </div>

            <p style="color:#a78bfa; font-size:13px; margin:0;">
              Your votes have been recorded and will appear on the live leaderboard shortly.
              If you have any issues, contact us with the reference number above.
            </p>
          </div>
          <div class="footer">
            &copy; ${
            new Date().getFullYear()
        } ${
            data.platformName
        }. All rights reserved.
          </div>
        </div>
      </body>
      </html>
    `;

        return this.send(
            {to: data.to, subject, html}
        );
    }

    // ── Contact Form Acknowledgement ─────────────────────────────────────────────
    async sendContactConfirmation(data : ContactConfirmationData): Promise < EmailResult > {
        const subject = `We received your message — ${
            data.platformName
        }`;
        const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family:Arial,sans-serif;background:#0f0a1e;color:#e8e4f0;margin:0;padding:0;">
        <div style="max-width:520px;margin:0 auto;padding:32px 16px;">
          <div style="background:#1a1030;border-radius:16px;padding:32px;border:1px solid rgba(91,33,182,0.3);">
            <h2 style="color:#D4AF37;margin:0 0 16px;">Thank you, ${
            data.name
        }!</h2>
            <p style="color:#c4b5fd;font-size:14px;line-height:1.6;">
              We've received your message about "<strong style="color:#fff">${
            data.subject
        }</strong>" and our team will respond as soon as possible.
            </p>
            <p style="color:#c4b5fd;font-size:14px;">
              You can also reach us directly at
              <a href="mailto:${
            data.contactEmail
        }" style="color:#D4AF37;">${
            data.contactEmail
        }</a>.
            </p>
          </div>
          <p style="text-align:center;color:#6b7280;font-size:12px;margin-top:16px;">
            &copy; ${
            new Date().getFullYear()
        } ${
            data.platformName
        }
          </p>
        </div>
      </body>
      </html>
    `;

        return this.send(
            {to: data.to, subject, html}
        );
    }

    // ── Newsletter Welcome + Unsubscribe Link ────────────────────────────────────
    async sendNewsletterWelcome(data : NewsletterWelcomeData): Promise < EmailResult > {
        const webUrl = process.env.WEB_URL || 'http://localhost:5173';
        const unsubscribeUrl = `${webUrl}/newsletter/unsubscribe?token=${
            data.unsubscribeToken
        }`;
        const subject = `Welcome to ${
            data.platformName
        } updates!`;
        const html = `
      <!DOCTYPE html>
      <html>
      <body style="font-family:Arial,sans-serif;background:#0f0a1e;color:#e8e4f0;margin:0;padding:0;">
        <div style="max-width:520px;margin:0 auto;padding:32px 16px;">
          <div style="background:#1a1030;border-radius:16px;padding:32px;border:1px solid rgba(91,33,182,0.3);">
            <h2 style="color:#D4AF37;margin:0 0 16px;">You're on the list! 🎉</h2>
            <p style="color:#c4b5fd;font-size:14px;line-height:1.6;">
              ${
            data.name ? `Hi <strong style="color:#fff">${
                data.name
            }</strong>, you've` : "You've"
        } been subscribed to <strong style="color:#fff">${
            data.platformName
        }</strong> updates.
              We'll notify you when nominations open, voting starts, and winners are announced.
            </p>
          </div>
          <p style="text-align:center;color:#6b7280;font-size:12px;margin-top:16px;">
            Don't want these emails?
            <a href="${unsubscribeUrl}" style="color:#a78bfa;">Unsubscribe</a>
            &nbsp;&middot;&nbsp;
            &copy; ${
            new Date().getFullYear()
        } ${
            data.platformName
        }
          </p>
        </div>
      </body>
      </html>
    `;

        return this.send(
            {to: data.to, subject, html}
        );
    }

    // ── Internal Send with Fallback Logging ─────────────────────────────────────
    private async send(params : {
        to: string;
        subject: string;
        html: string
    }): Promise < EmailResult > {
        if (!this.isConfigured || !this.resend) { // Dev/test mode: log instead of sending
            console.log(`[Email Service - DEV MODE] Would send to: ${
                params.to
            }`);
            console.log(`  Subject: ${
                params.subject
            }`);
            return {success: true, messageId: `dev_${
                    Date.now()
                }`};
        }

        try {
            const result = await this.resend.emails.send({from: this.from, to: params.to, subject: params.subject, html: params.html});

            if (result.error) {
                console.error('[Email Service] Send failed:', result.error);
                return {success: false, error: result.error.message};
            }

            return {
                success: true,
                messageId: result.data ?. id
            };
        } catch (err : unknown) {
            const message = err instanceof Error ? err.message : 'Unknown email error';
            console.error('[Email Service] Exception:', message);
            return {success: false, error: message};
        }
    }
}
