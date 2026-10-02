import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const FAQS = [
  { q: 'How does the voting process work?', a: 'Voting is open to everyone. You can browse nominees by category and cast votes directly using supported digital payment methods. Each vote costs $1.00 and is recorded immediately.' },
  { q: 'Can I vote multiple times for the same nominee?', a: 'Yes! You can purchase multiple vote packs (e.g. 5, 10, 50, or custom amounts) to give your preferred nominee a stronger lead on the leaderboard.' },
  { q: 'What payment gateways are supported?', a: 'We accept payments through Paystack, Flutterwave, and Stripe, supporting credit/debit cards, bank transfers, mobile money, and USSD depending on your region.' },
  { q: 'How is voting fraud prevented?', a: 'All transactions undergo instant automated verification and cryptographic integrity checks to prevent bot inflation and fraudulent manipulation.' },
  { q: 'Are vote purchases refundable?', a: 'Due to the live leaderboard dynamic, all cast votes are final and non-refundable once transaction payment is verified.' },
];

export default function FaqPage() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#F4FAF5]">
      <Helmet>
        <title>Frequently Asked Questions | Awardly</title>
        <meta name="description" content="Answers to common questions about voting, nominees, and the Awardly awards process." />
      </Helmet>

      {/* Hero Banner */}
      <div className="relative py-20 bg-[#051A10] text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(#007A4D_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        <div className="relative container max-w-3xl mx-auto px-4">
          <span className="text-xs font-extrabold text-[#EBF700] uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            HELP CENTER
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-3">
            Frequently Asked Questions
          </h1>
          <p className="text-emerald-100 text-base max-w-xl mx-auto">
            Find answers to common questions about voting, nominees, and rules.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-4">
          {FAQS.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-2xl overflow-hidden border border-[#E2EFE7] shadow-sm hover:shadow-md transition-shadow">
              <button
                onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
                className="w-full p-6 text-left font-display font-bold text-base md:text-lg text-[#0B2B1B] flex justify-between items-center gap-4 hover:text-[#007A4D] transition-colors"
              >
                <span>{faq.q}</span>
                <span className={`transition-transform duration-300 shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                  openIdx === idx
                    ? 'rotate-180 bg-[#007A4D] text-white'
                    : 'bg-[#F4FAF5] text-[#526c60] border border-[#E2EFE7]'
                }`}>
                  ▼
                </span>
              </button>
              {openIdx === idx && (
                <div className="px-6 pb-6 text-[#526c60] text-sm border-t border-[#E2EFE7] pt-4 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
