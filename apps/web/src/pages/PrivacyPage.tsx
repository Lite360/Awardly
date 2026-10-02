import { Helmet } from 'react-helmet-async';

export default function PrivacyPage() {
  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#F4FAF5]">
      <Helmet>
        <title>Privacy Policy | Awardly</title>
        <meta name="description" content="Read the Awardly privacy policy on data collection, usage, and protection." />
      </Helmet>

      {/* Hero Banner */}
      <div className="relative py-16 bg-[#051A10] text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(#007A4D_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        <div className="relative container max-w-3xl mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-3">
            Privacy Policy
          </h1>
          <p className="text-emerald-100 text-base max-w-xl mx-auto">
            How we handle and protect your data.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E2EFE7] shadow-sm text-[#526c60] space-y-5 text-sm leading-relaxed">
          <p>Your privacy is important to us. This Privacy Policy outlines how Awardly collects, uses, and safeguards your information during your interaction with our website.</p>
          <h2 className="text-lg font-display font-extrabold text-[#0B2B1B] mt-6">1. Information We Collect</h2>
          <p>We collect personal information such as your email address and name when you subscribe to updates or make a vote purchase. Payment card numbers are processed directly by PCI-DSS compliant payment gateways and are never stored on our servers.</p>
          <h2 className="text-lg font-display font-extrabold text-[#0B2B1B] mt-6">2. How We Use Information</h2>
          <p>Your information is used strictly to verify votes, issue transaction receipts, deliver event updates, and improve platform functionality.</p>
          <h2 className="text-lg font-display font-extrabold text-[#0B2B1B] mt-6">3. Data Protection</h2>
          <p>We enforce strict encryption standards (SSL/TLS) for data transmission and store data securely against unauthorized access.</p>
        </div>
      </div>
    </div>
  );
}
