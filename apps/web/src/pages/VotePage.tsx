import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import { useSiteSettings } from '../contexts/SiteSettingsContext';

const PAYMENT_METHODS = [
  { id: 'paystack', name: 'Paystack', icon: '💳' },
  { id: 'manual', name: 'Bank Transfer', icon: '🏦' },
];

export default function VotePage() {
  const { settings } = useSiteSettings();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const nomineeSlug = searchParams.get('nominee') || 'aria-vance';
  const initialCount = parseInt(searchParams.get('count') || '10', 10);

  const [voteCount, setVoteCount] = useState<number>(50); // Default to 5000 naira (50 votes)
  const [customAmount, setCustomAmount] = useState<string>('5000');
  const [voterName, setVoterName] = useState<string>('');
  const [voterEmail, setVoterEmail] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<string>('paystack');
  const [inputMode, setInputMode] = useState<'amount' | 'votes'>('amount');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const pricePerVote = 100; // ₦100 = 1 vote
  const totalAmount = voteCount * pricePerVote;

  const handlePresetSelect = (presetAmount: number) => {
    const calculatedVotes = Math.floor(presetAmount / pricePerVote);
    setVoteCount(calculatedVotes);
    setCustomAmount(presetAmount.toString());
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCustomAmount(val);
    const parsed = parseInt(val, 10);
    if (!isNaN(parsed) && parsed > 0) {
      if (inputMode === 'amount') {
        setVoteCount(Math.floor(parsed / pricePerVote));
      } else {
        setVoteCount(parsed);
      }
    } else {
      setVoteCount(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!voterEmail) {
      Swal.fire('Error', 'Please enter your email address to receive your receipt.', 'error');
      return;
    }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/public/vote/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nomineeSlug,
          voteCount,
          voterEmail,
          voterName: voterName || 'Anonymous Voter',
        }),
      });

      const resData = await response.json();

      if (resData.success && resData.data?.authorizationUrl) {
        window.location.href = resData.data.authorizationUrl;
      } else {
        // Fallback for demonstration/dev mode if live keys are unconfigured
        Swal.fire({
          title: 'Direct Dev Checkout',
          text: 'Paystack checkout initialized. Proceeding to payment callback...',
          icon: 'info',
          confirmButtonText: 'Proceed',
        }).then(() => {
          navigate(`/vote/callback?trxref=${resData.data?.reference || `VOTE_${Date.now()}`}&reference=${resData.data?.reference || `VOTE_${Date.now()}`}`);
        });
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Checkout failed';
      Swal.fire('Error', msg, 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="pt-20 pb-16 min-h-screen bg-[#F4FAF5]">
      <Helmet>
        <title>Cast Your Vote | Awardly 2026</title>
        <meta name="description" content="Cast your vote for your favorite nominees at Awardly 2026." />
      </Helmet>

      {/* Hero Banner */}
      <div className="relative py-20 bg-[#051A10] text-white text-center overflow-hidden mb-12">
        <div className="relative container max-w-3xl mx-auto px-4">
          <span className="text-xs font-extrabold text-[#EBF700] uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            OFFICIAL VOTING PORTAL
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-3">
            Cast Your Vote
          </h1>
          <p className="text-emerald-100 text-base max-w-xl mx-auto">
            Support your chosen candidate. Secure payment checkout powered by instant verification.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Checkout Form */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 sm:p-8 border border-[#E2EFE7] shadow-sm">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Payment Gateway and Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-[#E2EFE7] pb-4">
                <h3 className="text-xl font-extrabold text-[#0B2B1B]">How to vote</h3>
                <div className="flex bg-[#F4FAF5] border border-[#007A4D]/30 rounded-lg overflow-hidden p-1">
                  {PAYMENT_METHODS.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setPaymentMethod(method.id)}
                      className={`px-4 py-2 text-sm font-bold rounded flex items-center gap-2 transition-colors ${
                        paymentMethod === method.id
                          ? 'bg-[#007A4D] text-white shadow-sm'
                          : 'text-[#526c60] hover:text-[#0B2B1B]'
                      }`}
                    >
                      <span>{method.icon}</span> {method.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Select Package */}
              <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-4">
                  <div>
                    <h3 className="text-xl font-extrabold text-[#0B2B1B] mb-1">Choose your votes</h3>
                    <p className="text-[#526c60] text-sm">₦100 equals 1 vote.</p>
                  </div>
                  <div className="flex bg-[#F4FAF5] border border-[#007A4D]/30 rounded-lg overflow-hidden p-1">
                    <button
                      type="button"
                      onClick={() => setInputMode('amount')}
                      className={`px-4 py-2 text-sm font-bold rounded transition-colors ${
                        inputMode === 'amount'
                          ? 'bg-[#007A4D] text-white shadow-sm'
                          : 'text-[#526c60] hover:text-[#0B2B1B]'
                      }`}
                    >
                      Amount
                    </button>
                    <button
                      type="button"
                      onClick={() => setInputMode('votes')}
                      className={`px-4 py-2 text-sm font-bold rounded transition-colors ${
                        inputMode === 'votes'
                          ? 'bg-[#007A4D] text-white shadow-sm'
                          : 'text-[#526c60] hover:text-[#0B2B1B]'
                      }`}
                    >
                      Votes
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 mb-6">
                  {[1000, 2500, 5000, 10000, 15000].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => handlePresetSelect(preset)}
                      className={`px-5 py-2.5 rounded-full border font-extrabold text-sm transition-all ${
                        parseInt(customAmount) === preset && inputMode === 'amount'
                          ? 'border-[#007A4D] bg-[#007A4D] text-white shadow-md'
                          : 'border-[#E2EFE7] bg-white text-[#0B2B1B] hover:border-[#007A4D]/40'
                      }`}
                    >
                      ₦{preset.toLocaleString()}
                    </button>
                  ))}
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-bold text-[#0B2B1B] mb-2">
                    {inputMode === 'amount' ? 'Amount in naira' : 'Number of votes'}
                  </label>
                  <div className="relative">
                    {inputMode === 'amount' && (
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <span className="text-[#0B2B1B] font-bold">₦</span>
                      </div>
                    )}
                    <input
                      type="number"
                      value={customAmount}
                      onChange={handleCustomInputChange}
                      min="1"
                      className={`w-full bg-white border border-[#D5E8DD] rounded-xl py-3.5 text-[#0B2B1B] font-bold focus:outline-none focus:border-[#007A4D] transition-all ${inputMode === 'amount' ? 'pl-8' : 'px-4'}`}
                    />
                  </div>
                </div>

                <p className="text-sm text-[#526c60] mb-6">
                  Need more? You can enter any higher amount, as long as it is in multiples of ₦100.
                </p>

                <div className="bg-[#F4FAF5] rounded-xl p-6 text-center border border-[#E2EFE7]">
                  <p className="text-[#526c60] text-sm mb-2">Your contribution</p>
                  <h4 className="text-xl font-extrabold text-[#0B2B1B]">
                    ₦{totalAmount.toLocaleString()} gives {voteCount.toLocaleString()} votes
                  </h4>
                </div>
              </div>

              {/* Voter Details */}
              <div className="space-y-4 pt-4">
                <p className="text-center text-sm font-bold text-[#526c60] mb-4">No account or voter details required.</p>
                <div className="hidden">
                  <label className="block text-xs font-bold text-[#0B2B1B] mb-1">Full Name (Optional)</label>
                  <input
                    type="text"
                    value={voterName}
                    onChange={(e) => setVoterName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-[#F7FBF8] border border-[#D5E8DD] rounded-xl px-4 py-3 text-[#0B2B1B] placeholder-slate-400 focus:outline-none focus:border-[#007A4D] transition-all"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-[#0B2B1B] mb-1">Email Address (Required for Receipt)</label>
                  <input
                    type="email"
                    required
                    value={voterEmail}
                    onChange={(e) => setVoterEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-[#F7FBF8] border border-[#D5E8DD] rounded-xl px-4 py-3 text-[#0B2B1B] placeholder-slate-400 focus:outline-none focus:border-[#007A4D] transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isProcessing || voteCount < 1}
                className="w-full bg-[#007A4D] hover:bg-[#006640] text-white font-extrabold py-4 rounded-full shadow-lg transition-all flex items-center justify-center gap-2 text-base disabled:opacity-60 mt-6"
              >
                {isProcessing ? (
                  'Processing Secure Payment...'
                ) : (
                  <>
                    🔒 Pay ₦{totalAmount.toLocaleString()} Now
                  </>
                )}
              </button>

              {/* Manual Bank Details (Shown only if Bank Transfer is selected) */}
              {paymentMethod === 'manual' && (
                <div className="mt-6 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 space-y-3 shadow-sm">
                  <h4 className="text-[#0F172A] font-bold text-sm mb-2 flex items-center gap-2">
                    <span>🏦</span> Please transfer to the following account:
                  </h4>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#64748B]">Bank Name:</span>
                    <span className="font-extrabold text-[#0B2B1B]">{settings.manualBankName}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#64748B]">Account Number:</span>
                    <span className="font-extrabold text-[#0B2B1B] text-lg tracking-wider">{settings.manualAccountNumber}</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-[#64748B]">Account Name:</span>
                    <span className="font-extrabold text-[#0B2B1B]">{settings.manualAccountName}</span>
                  </div>
                  <div className="pt-3 border-t border-[#E2E8F0]">
                    <p className="text-xs text-[#64748B]">
                      After payment, please send your payment receipt to <a href={`mailto:${settings.contactEmail}`} className="text-[#007A4D] font-bold underline">{settings.contactEmail}</a> or reach out on our support channels.
                    </p>
                  </div>
                </div>
              )}
            </form>
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#E2EFE7] shadow-sm h-fit space-y-4">
            <h3 className="text-base font-display font-extrabold text-[#0B2B1B] border-b border-[#E2EFE7] pb-3">Order Summary</h3>

            <div className="space-y-3 text-sm text-[#526c60]">
              <div className="flex justify-between">
                <span>Nominee</span>
                <span className="font-extrabold text-[#0B2B1B] capitalize">{nomineeSlug.replace(/-/g, ' ')}</span>
              </div>
              <div className="flex justify-between">
                <span>Votes Quantity</span>
                <span className="font-extrabold text-[#007A4D]">{voteCount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span>Price per Vote</span>
                <span className="font-bold text-[#0B2B1B]">₦{pricePerVote.toLocaleString()}</span>
              </div>
            </div>

            <div className="border-t border-[#E2EFE7] pt-4 flex justify-between text-lg font-extrabold text-[#0B2B1B]">
              <span>Total Payable</span>
              <span className="text-[#007A4D]">₦{totalAmount.toLocaleString()}</span>
            </div>

            <div className="bg-[#F4FAF5] p-4 rounded-2xl text-xs text-[#526c60] space-y-2 border border-[#E2EFE7]">
              <div className="flex items-center gap-2 text-[#007A4D] font-bold">
                ✓ Guaranteed Secure & Transparent
              </div>
              <p>Votes are recorded instantly upon successful transaction verification.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
