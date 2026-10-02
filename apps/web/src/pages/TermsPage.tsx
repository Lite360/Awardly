import { Helmet } from 'react-helmet-async';

export default function TermsPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#F4FAF5]">
      <Helmet>
        <title>Terms & Conditions | Awardly</title>
        <meta name="description" content="Read the Awardly terms and conditions for voting, participation, and platform usage." />
      </Helmet>

      {/* Hero Banner */}
      <div className="relative py-16 bg-[#051A10] text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(#007A4D_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        <div className="relative container max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-3">
            Terms & Conditions
          </h1>
          <p className="text-emerald-100 text-base max-w-xl mx-auto">
            Rules and guidelines governing the use of our platform.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E2EFE7] shadow-sm text-[#526c60] space-y-5 text-sm leading-relaxed">
          <p>Welcome to Awardly. By accessing or using our platform, voting system, and services, you agree to be bound by these Terms and Conditions.</p>
          <h2 className="text-lg font-display font-extrabold text-[#0B2B1B] mt-6">1. Voting Rules</h2>
          <p>Votes are purchased and processed in real time. All votes are non-refundable once payment is completed. Any attempt to artificially manipulate vote totals through automated scripting, botting, or fraud will result in immediate disqualification of the associated votes.</p>
          <h2 className="text-lg font-display font-extrabold text-[#0B2B1B] mt-6">2. Intellectual Property</h2>
          <p>All logos, brands, and content displayed on Awardly belong to their respective owners. Unauthorized reproduction or distribution is strictly prohibited.</p>
          <h2 className="text-lg font-display font-extrabold text-[#0B2B1B] mt-6">3. Limitation of Liability</h2>
          <p>Awardly and its organizers shall not be liable for technical disruptions, network delays, or third-party payment gateway outages beyond our control.</p>
        </div>
      </div>
    </div>
  );
}
