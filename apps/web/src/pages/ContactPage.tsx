import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export default function ContactPage() {
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
      Swal.fire({
        icon: 'success',
        title: 'Message Sent!',
        text: 'Thank you for reaching out to Awardly. We will get back to you shortly.',
        confirmButtonColor: '#007A4D',
      });
    }, 1000);
  };

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#F4F9F5]">
      <Helmet>
        <title>Contact Us | Awardly 2026</title>
        <meta name="description" content="Get in touch with the Awardly team for inquiries, sponsorships, and support." />
      </Helmet>

      {/* Hero Banner */}
      <div className="relative py-20 bg-[#0B2B1B] text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(#008751_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />
        <div className="relative container">
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-3">
            Contact Us
          </h1>
          <p className="text-emerald-100 text-lg max-w-xl mx-auto">
            We'd love to hear from you. Reach out to us for any inquiries or feedback.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-display font-extrabold text-[#0B2B1B]">Get in Touch</h2>
          <p className="text-slate-600 text-sm mt-2">We'd love to hear from you. Reach out to us for any inquiries or feedback.</p>
        </div>

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="bg-[#EBF7F0] border border-[#D5E8DD] rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#D1ECD9] text-[#008751] flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              ✉
            </div>
            <h3 className="text-[#0B2B1B] font-bold mb-1">Email</h3>
            <p className="text-[#008751] text-sm font-semibold">info@ayanwale-award.com</p>
          </div>

          <div className="bg-[#EBF7F0] border border-[#D5E8DD] rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#D1ECD9] text-[#008751] flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              📞
            </div>
            <h3 className="text-[#0B2B1B] font-bold mb-1">Phone</h3>
            <p className="text-slate-700 text-sm font-semibold">+234 812 345 6789</p>
          </div>

          <div className="bg-[#EBF7F0] border border-[#D5E8DD] rounded-2xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-[#D1ECD9] text-[#008751] flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              📍
            </div>
            <h3 className="text-[#0B2B1B] font-bold mb-1">Location</h3>
            <p className="text-slate-700 text-sm font-semibold">Lagos, Nigeria.</p>
          </div>
        </div>

        {/* Message Form */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-display font-extrabold text-[#0B2B1B]">Send us a Message</h2>
          <p className="text-slate-600 text-sm mt-2">Fill out the form below and we'll get back to you as soon as possible.</p>
        </div>

        <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#E2EFE7] shadow-sm max-w-2xl mx-auto mb-16">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-[#0B2B1B] mb-2">Full Name</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#F7FBF8] border border-[#D5E8DD] rounded-xl px-4 py-3.5 text-[#0B2B1B] placeholder-slate-400 focus:outline-none focus:border-[#008751] transition-all"
                placeholder="Your name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0B2B1B] mb-2">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-[#F7FBF8] border border-[#D5E8DD] rounded-xl px-4 py-3.5 text-[#0B2B1B] placeholder-slate-400 focus:outline-none focus:border-[#008751] transition-all"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0B2B1B] mb-2">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="w-full bg-[#F7FBF8] border border-[#D5E8DD] rounded-xl px-4 py-3.5 text-[#0B2B1B] placeholder-slate-400 focus:outline-none focus:border-[#008751] transition-all"
                placeholder="What is this about?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#0B2B1B] mb-2">Message</label>
              <textarea
                rows={5}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full bg-[#F7FBF8] border border-[#D5E8DD] rounded-xl px-4 py-3.5 text-[#0B2B1B] placeholder-slate-400 focus:outline-none focus:border-[#008751] transition-all"
                placeholder="Your message..."
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#008751] hover:bg-[#006e42] text-white font-bold py-4 rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 text-base disabled:opacity-60"
            >
              {submitting ? 'Sending...' : 'Send Message ✈'}
            </button>
          </form>
        </div>

        {/* Ready to Join Us CTA Banner */}
        <div className="bg-[#008751] rounded-3xl p-10 md:p-14 text-center text-white space-y-6 shadow-xl mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight">
            Ready to Join Us?
          </h2>
          <p className="text-emerald-100 max-w-xl mx-auto text-base">
            Nominate an exceptional talent or cast your vote for your favorite nominees today!
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/register" className="bg-white text-[#0B2B1B] hover:bg-slate-100 font-bold px-8 py-3.5 rounded-full text-sm shadow-md transition-all">
              Nominate Now
            </Link>
            <Link to="/vote" className="border-2 border-white text-white hover:bg-white hover:text-[#008751] font-bold px-8 py-3.5 rounded-full text-sm transition-all">
              Vote Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
