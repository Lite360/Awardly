import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { useParams, Link } from 'react-router-dom';
import { getNomineeBySlug } from '../services/public';
import type { Nominee } from '@awardly/shared-types';
import Swal from 'sweetalert2';

export default function NomineeDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [nominee, setNominee] = useState<Nominee | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [voteCount, setVoteCount] = useState<number>(10);

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    getNomineeBySlug(slug)
      .then((data) => {
        setNominee(data);
      })
      .catch(() => {
        setNominee(null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  const handleShare = () => {
    const title = nominee ? nominee.name : 'Nominee';
    if (navigator.share) {
      navigator.share({
        title,
        text: `Vote for ${title} on Awardly!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      Swal.fire({
        icon: 'success',
        title: 'Link Copied!',
        text: 'Nominee profile link copied to clipboard.',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    }
  };

  if (loading) {
    return (
      <div className="pt-32 pb-16 min-h-screen bg-[#F4FAF5] text-center text-[#526c60]">
        Loading nominee details...
      </div>
    );
  }

  if (!nominee) {
    return (
      <div className="pt-32 pb-16 min-h-screen bg-[#F4FAF5] text-center">
        <h1 className="text-2xl font-display font-bold text-[#0B2B1B] mb-4">Nominee Not Found</h1>
        <p className="text-[#526c60] mb-6">The requested nominee profile could not be found.</p>
        <Link to="/nominees" className="bg-[#007A4D] hover:bg-[#006640] text-white font-bold text-sm px-6 py-3 rounded-full transition-all">
          View All Nominees
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#F4FAF5]">
      <Helmet>
        <title>{`${nominee.name} - Vote Now | Awardly`}</title>
        <meta name="description" content={`Vote for ${nominee.name} on Awardly.`} />
      </Helmet>

      {/* Hero Banner */}
      <div className="relative py-20 bg-[#051A10] text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-b from-[#051A10]/60 to-[#051A10]" />
        <div className="relative container max-w-3xl mx-auto px-4">
          <span className="text-xs font-extrabold text-[#EBF700] uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            NOMINEE PROFILE
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-3">
            {nominee.name}
          </h1>
          {nominee.categoryName && (
            <p className="text-emerald-100 text-base max-w-xl mx-auto">
              {nominee.categoryName}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column - Image & Quick Info */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-5 border border-[#E2EFE7] shadow-sm text-center">
            <div className="relative rounded-2xl overflow-hidden mb-6 group">
              <img
                src={nominee.imageUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=600&q=80'}
                alt={nominee.name}
                className="w-full h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute top-4 left-4 bg-[#EBF700] text-[#0B2B1B] font-extrabold text-xs uppercase px-3 py-1.5 rounded-full shadow-sm">
                Code: {nominee.code}
              </div>
            </div>

            <h2 className="text-2xl font-display font-extrabold text-[#0B2B1B] mb-1">{nominee.name}</h2>
            {nominee.categoryName && (
              <Link to="/categories" className="text-[#007A4D] text-sm font-bold hover:underline block mb-4">
                {nominee.categoryName}
              </Link>
            )}

            {nominee.voteCount !== undefined && (
              <div className="flex items-center justify-center gap-4 py-4 border-y border-[#E2EFE7] mb-6">
                <div>
                  <span className="block text-3xl font-display font-extrabold text-[#007A4D]">{nominee.voteCount.toLocaleString()}</span>
                  <span className="text-xs text-[#526c60] uppercase tracking-wider font-semibold">Total Votes</span>
                </div>
              </div>
            )}

            <button
              onClick={handleShare}
              className="w-full border-2 border-[#007A4D] text-[#007A4D] hover:bg-[#007A4D] hover:text-white font-extrabold text-sm py-3 rounded-full transition-all flex items-center justify-center gap-2"
            >
              🔗 Share Nominee
            </button>
          </div>

          {/* Right Column - Bio & Voting Form */}
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EFE7] shadow-sm">
              <h2 className="text-xl font-display font-extrabold text-[#0B2B1B] mb-3">Biography & Background</h2>
              <p className="text-[#526c60] text-sm leading-relaxed mb-6">
                {nominee.bio || 'No biography provided.'}
              </p>
            </div>

            {/* Direct Vote Box */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border-2 border-[#007A4D]/30 shadow-sm relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#007A4D] via-[#EBF700] to-[#007A4D]" />
              <h3 className="text-xl font-display font-extrabold text-[#0B2B1B] mb-2 flex items-center gap-2">
                ❤️ Cast Your Vote
              </h3>
              <p className="text-sm text-[#526c60] mb-4">
                Support {nominee.name} to win the award.
              </p>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center border border-[#E2EFE7] rounded-2xl overflow-hidden bg-[#F4FAF5]">
                  <button
                    onClick={() => setVoteCount(Math.max(1, voteCount - 1))}
                    className="px-5 py-3 hover:bg-[#007A4D]/10 text-[#0B2B1B] font-extrabold text-lg transition-colors"
                  >
                    −
                  </button>
                  <span className="px-6 py-3 font-display font-extrabold text-xl text-[#007A4D] border-x border-[#E2EFE7] bg-white min-w-[60px] text-center">{voteCount}</span>
                  <button
                    onClick={() => setVoteCount(voteCount + 1)}
                    className="px-5 py-3 hover:bg-[#007A4D]/10 text-[#0B2B1B] font-extrabold text-lg transition-colors"
                  >
                    +
                  </button>
                </div>

                <div className="text-lg font-extrabold text-[#0B2B1B]">
                  Total: <span className="text-[#007A4D]">${(voteCount * 1.0).toFixed(2)}</span>
                </div>
              </div>

              <Link
                to={`/vote?nominee=${nominee.slug}&count=${voteCount}`}
                className="w-full bg-[#007A4D] hover:bg-[#006640] text-white font-extrabold py-4 rounded-full text-center block shadow-lg transition-all text-base"
              >
                Proceed to Checkout ({voteCount} Votes)
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
