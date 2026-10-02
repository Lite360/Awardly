import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

export default function AboutPage() {
  return (
    <div className="pt-20 pb-16 min-h-screen bg-[#F4FAF5]">
      <Helmet>
        <title>About Us | Awardly 2026</title>
        <meta name="description" content="Learn about Awardly — our mission, vision, story, impact, and achievements." />
      </Helmet>

      {/* Page Hero Banner */}
      <div className="relative py-24 bg-[#051A10] text-white text-center overflow-hidden mb-12">
        <img
          src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600&q=80"
          alt="Awardly Award Event"
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#051A10] via-[#051A10]/80 to-transparent" />
        <div className="relative z-10 container max-w-3xl mx-auto px-4">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-display font-extrabold tracking-tight mb-4">
            About Us
          </h1>
          <p className="text-emerald-100 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
            Honoring African excellence, cultural heritage, and rising changemakers across the continent.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mission & Vision Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Mission Card */}
          <div className="bg-[#EBF7F0] border border-[#D5E8DD] rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden" data-aos="fade-right">
            <div className="w-14 h-14 rounded-2xl bg-[#D1ECD9] text-[#007A4D] font-bold text-2xl flex items-center justify-center mb-6">
              🎯
            </div>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#0B2B1B] mb-4">
              Our Mission
            </h2>
            <p className="text-[#526c60] text-sm md:text-base leading-relaxed mb-4">
              To identify, recognize, and amplify the voices of exceptional individuals who are driving positive change and cultural preservation across Africa.
            </p>
            <p className="text-[#526c60] text-sm md:text-base leading-relaxed">
              We believe in empowering future generations by showcasing the rich heritage of African talent, ingenuity, and grassroots leadership.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-[#EEF2FF] border border-[#E0E7FF] rounded-3xl p-8 sm:p-10 shadow-sm relative overflow-hidden" data-aos="fade-left">
            <div className="w-14 h-14 rounded-2xl bg-[#E0E7FF] text-[#4F46E5] font-bold text-2xl flex items-center justify-center mb-6">
              👁️
            </div>
            <h2 className="font-display font-extrabold text-2xl md:text-3xl text-[#0B2B1B] mb-4">
              Our Vision
            </h2>
            <p className="text-[#526c60] text-sm md:text-base leading-relaxed mb-4">
              To create a continent-wide movement where excellence in every sphere of life—cultural, artistic, and social impact—is recognized and celebrated without boundaries.
            </p>
            <p className="text-[#526c60] text-sm md:text-base leading-relaxed">
              We aim to become the premier platform for African achievement, fostering unity, pride, and inspirational role models for upcoming generations.
            </p>
          </div>
        </div>

        {/* What We Stand For */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-[#007A4D] uppercase tracking-widest bg-[#007A4D]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            # OUR VALUES
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[#0B2B1B]">
            What We Stand For
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
          {[
            { icon: '🌿', title: 'Cultural Heritage', desc: 'Preserving African traditions, music, storytelling, and indigenous arts for generations to come.' },
            { icon: '🤝', title: 'Community Impact', desc: 'Rewarding individuals who selflessly dedicate their talent to uplift communities and solve social problems.' },
            { icon: '🚀', title: 'Youth Empowerment', desc: 'Creating pathways of visibility, mentorship, and opportunities for rising young talents.' },
          ].map((v, idx) => (
            <div key={idx} className="bg-white rounded-3xl p-8 border border-[#E2EFE7] shadow-sm hover:shadow-md transition-all text-center" data-aos="fade-up">
              <div className="w-14 h-14 rounded-2xl bg-[#F4FAF5] text-[#007A4D] font-bold text-2xl flex items-center justify-center mx-auto mb-5 border border-[#E2EFE7]">
                {v.icon}
              </div>
              <h3 className="font-display font-extrabold text-lg text-[#0B2B1B] mb-2">{v.title}</h3>
              <p className="text-[#526c60] text-sm leading-relaxed">{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Our Impact Banner */}
        <div className="bg-[#051A10] rounded-3xl p-10 md:p-14 text-white mb-20 shadow-2xl relative overflow-hidden" data-aos="fade-up">
          <div className="relative z-10 text-center max-w-3xl mx-auto">
            <span className="text-xs font-extrabold text-[#EBF700] uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full inline-block mb-4">
              # OUR IMPACT
            </span>
            <h2 className="font-display font-extrabold text-3xl md:text-5xl mb-12">
              Transforming Recognition Across Africa
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-3xl text-[#EBF700] mb-2">🏆</div>
                <div className="font-display font-extrabold text-4xl text-white mb-1">50+</div>
                <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">Award Categories</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-3xl text-[#EBF700] mb-2">👨‍👩‍👧‍👦</div>
                <div className="font-display font-extrabold text-4xl text-white mb-1">10K+</div>
                <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">Nominees Recognized</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                <div className="text-3xl text-[#EBF700] mb-2">📈</div>
                <div className="font-display font-extrabold text-4xl text-white mb-1">1M+</div>
                <div className="text-xs text-white/70 uppercase tracking-wider font-semibold">Community Engagement</div>
              </div>
            </div>
          </div>
        </div>

        {/* The Awardly Story */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-xs font-extrabold text-[#007A4D] uppercase tracking-widest bg-[#007A4D]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            # HISTORY
          </span>
          <h2 className="font-display font-extrabold text-3xl md:text-4xl text-[#0B2B1B]">
            The Awardly Story
          </h2>
          <p className="text-[#526c60] text-base mt-2">From a local recognition initiative to an inspiring African movement.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20 items-center">
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 border border-[#E2EFE7] shadow-sm">
              <span className="text-xs font-bold text-[#007A4D] uppercase tracking-wider">Our Humble Beginnings</span>
              <h3 className="font-display font-bold text-lg text-[#0B2B1B] mt-1 mb-2">Rooted in Cultural Heritage</h3>
              <p className="text-xs text-[#526c60] leading-relaxed">
                Founded with a deep reverence for traditional drum culture and artistic expression, the award started as a beacon for uncelebrated community heroes.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 border border-[#E2EFE7] shadow-sm">
              <span className="text-xs font-bold text-[#007A4D] uppercase tracking-wider">Expanding into a Full Movement</span>
              <h3 className="font-display font-bold text-lg text-[#0B2B1B] mt-1 mb-2">Connecting Communities Across Africa</h3>
              <p className="text-xs text-[#526c60] leading-relaxed">
                Over the years, the initiative grew to encompass diverse award categories spanning music, community advocacy, youth leadership, and cultural preservation.
              </p>
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <img src="https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80" alt="Award history celebration" className="w-full h-[360px] object-cover" />
          </div>
        </div>

        {/* Convener Profile Section */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#E2EFE7] shadow-md mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-center">
            <div className="lg:col-span-1">
              <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-[#E2EFE7]">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80"
                  alt="Ayandokun Ayanwale Matthew"
                  className="w-full h-80 object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-2">
              <span className="text-xs font-extrabold text-[#007A4D] uppercase tracking-widest bg-[#007A4D]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
                FOUNDER & CONVENER
              </span>
              <h2 className="font-display font-extrabold text-3xl text-[#0B2B1B] mb-2">
                Ayandokun Ayanwale Matthew
              </h2>
              <p className="text-xs font-bold text-[#007A4D] uppercase tracking-wider mb-4">
                Cultural Ambassador & Social Entrepreneur
              </p>
              <p className="text-sm text-[#526c60] leading-relaxed mb-4">
                Ayandokun Ayanwale Matthew is a passionate advocate for African cultural preservation and youth empowerment. Driven by a vision to celebrate unsung heroes, he established Awardly to platform talented individuals who inspire communities.
              </p>
              <p className="text-sm text-[#526c60] leading-relaxed mb-6">
                Under his leadership, the award program has grown into one of the most respected cultural recognition initiatives, bridging traditional African heritage with modern achievement.
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t border-[#E2EFE7] pt-4 text-center">
                <div>
                  <div className="font-extrabold text-[#007A4D] text-lg">15+</div>
                  <div className="text-[11px] text-[#526c60]">Years Experience</div>
                </div>
                <div>
                  <div className="font-extrabold text-[#007A4D] text-lg">50+</div>
                  <div className="text-[11px] text-[#526c60]">Categories</div>
                </div>
                <div>
                  <div className="font-extrabold text-[#007A4D] text-lg">20+</div>
                  <div className="text-[11px] text-[#526c60]">Events Hosted</div>
                </div>
                <div>
                  <div className="font-extrabold text-[#007A4D] text-lg">100K+</div>
                  <div className="text-[11px] text-[#526c60]">Votes Managed</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="bg-[#007A4D] rounded-3xl p-10 md:p-14 text-center text-white space-y-6 shadow-xl mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-black tracking-tight">
            Be Part of African Excellence
          </h2>
          <p className="text-emerald-100 max-w-xl mx-auto text-base">
            Nominate deserving talent or cast your vote to support your favorites!
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link to="/register" className="bg-[#EBF700] text-[#0B2B1B] hover:bg-[#e2f000] font-bold px-8 py-3.5 rounded-full text-sm shadow-md transition-all">
              Register Nominee
            </Link>
            <Link to="/vote" className="border-2 border-white text-white hover:bg-white hover:text-[#007A4D] font-bold px-8 py-3.5 rounded-full text-sm transition-all">
              Vote Now
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
