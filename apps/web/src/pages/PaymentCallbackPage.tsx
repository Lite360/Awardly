import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, Link } from 'react-router-dom';

export default function PaymentCallbackPage() {
  const [searchParams] = useSearchParams();
  const trxref = searchParams.get('trxref') || searchParams.get('reference') || '';
  const [verificationResult, setVerificationResult] = useState<{
    status: string;
    reference: string;
    amountPaid?: number;
    metadata?: { nomineeSlug?: string; voteCount?: number };
  } | null>(null);

  useEffect(() => {
    if (!trxref) return;

    fetch(`/api/public/vote/verify/${encodeURIComponent(trxref)}`)
      .then((res) => res.json())
      .then((resData) => {
        if (resData.success && resData.data) {
          setVerificationResult(resData.data);
        }
      })
      .catch(() => {});
  }, [trxref]);

  const count = searchParams.get('count') || verificationResult?.metadata?.voteCount || '10';
  const nominee = searchParams.get('nominee') || verificationResult?.metadata?.nomineeSlug || 'Nominee';
  const isSuccess = verificationResult ? verificationResult.status === 'verified' : true;

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#F4FAF5] flex items-center justify-center">
      <Helmet>
        <title>{isSuccess ? 'Payment Successful' : 'Payment Failed'} | Awardly</title>
      </Helmet>

      <div className="max-w-md w-full px-4">
        <div className="bg-white rounded-3xl p-8 text-center space-y-6 border border-[#E2EFE7] shadow-md">
          {isSuccess ? (
            <>
              <div className="w-20 h-20 bg-[#007A4D]/10 text-[#007A4D] rounded-full flex items-center justify-center mx-auto text-4xl border-2 border-[#007A4D]/20">
                ✓
              </div>

              <div>
                <h1 className="text-2xl font-display font-extrabold text-[#0B2B1B] mb-2">Vote Confirmed!</h1>
                <p className="text-sm text-[#526c60]">
                  Thank you! Your <strong className="text-[#0B2B1B]">{count} votes</strong> for{' '}
                  <strong className="text-[#007A4D] capitalize">{String(nominee).replace(/-/g, ' ')}</strong> have been successfully cast.
                </p>
              </div>

              <div className="bg-[#F4FAF5] p-4 rounded-2xl text-left text-xs space-y-2 border border-[#E2EFE7]">
                <div className="flex justify-between text-[#526c60]">
                  <span>Reference:</span>
                  <span className="font-mono text-[#0B2B1B] font-bold">{trxref}</span>
                </div>
                <div className="flex justify-between text-[#526c60]">
                  <span>Status:</span>
                  <span className="text-[#007A4D] font-bold uppercase">Verified</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link to="/leaderboard" className="w-full bg-[#007A4D] hover:bg-[#006640] text-white font-extrabold py-3.5 rounded-full flex items-center justify-center gap-2 transition-all shadow-md">
                  🏆 View Live Leaderboard
                </Link>
                <Link to="/" className="w-full border-2 border-[#007A4D] text-[#007A4D] hover:bg-[#007A4D] hover:text-white font-extrabold py-3 rounded-full flex items-center justify-center gap-2 transition-all">
                  🏠 Return Home
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto text-4xl border-2 border-red-100">
                ✕
              </div>

              <div>
                <h1 className="text-2xl font-display font-extrabold text-[#0B2B1B] mb-2">Payment Cancelled</h1>
                <p className="text-sm text-[#526c60]">
                  Your transaction was cancelled or could not be verified. No charges were made.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <Link to="/vote" className="w-full bg-[#007A4D] hover:bg-[#006640] text-white font-extrabold py-3.5 rounded-full text-center transition-all shadow-md">
                  Try Again
                </Link>
                <Link to="/" className="w-full border-2 border-[#007A4D] text-[#007A4D] hover:bg-[#007A4D] hover:text-white font-extrabold py-3 rounded-full text-center transition-all">
                  Back to Home
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
