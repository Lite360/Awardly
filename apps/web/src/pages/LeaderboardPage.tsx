import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';
import { getLeaderboard } from '../services/public';
import type { LeaderboardEntry } from '@awardly/shared-types';

export default function LeaderboardPage() {
  const [standings, setStandings] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    getLeaderboard('default-event').then(res => {
      const firstCategory = res?.categories?.[0];
      if (firstCategory?.entries) {
        setStandings(firstCategory.entries);
      }
    }).catch(() => {});
  }, []);

  const top1 = standings[0];
  const top2 = standings[1];
  const top3 = standings[2];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-[#F4FAF5]">
      <Helmet>
        <title>Live Leaderboard | Awardly</title>
        <meta name="description" content="Real-time rankings and voting leaderboard." />
      </Helmet>

      {/* Hero Banner */}
      <div className="relative py-20 bg-[#051A10] text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[radial-gradient(#007A4D_1px,transparent_1px)] [background-size:16px_16px] opacity-15 pointer-events-none" />
        <div className="relative container max-w-3xl mx-auto px-4">
          <span className="inline-flex items-center gap-2 text-xs font-extrabold text-[#EBF700] uppercase tracking-widest bg-white/10 px-3.5 py-1.5 rounded-full mb-3">
            🔥 REAL-TIME STANDINGS
          </span>
          <h1 className="text-4xl md:text-5xl font-display font-extrabold tracking-tight mb-3">
            Live Leaderboard
          </h1>
          <p className="text-emerald-100 text-base max-w-xl mx-auto">
            Track top nominees across all categories as fans cast their votes in real time.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top 3 Podium */}
        {standings.length >= 3 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 items-end">
            {/* Rank 2 */}
            {top2 && (
              <div className="bg-white rounded-3xl p-6 text-center border border-[#E2EFE7] shadow-sm order-2 md:order-1">
                <div className="w-12 h-12 rounded-full bg-[#F4FAF5] border-2 border-[#E2EFE7] text-[#526c60] font-display font-extrabold text-lg flex items-center justify-center mx-auto mb-3">
                  #2
                </div>
                {top2.nomineeImageUrl && (
                  <img
                    src={top2.nomineeImageUrl}
                    alt={top2.nomineeName}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-3 border-[#E2EFE7] shadow-md"
                  />
                )}
                <h3 className="text-lg font-display font-extrabold text-[#0B2B1B]">{top2.nomineeName}</h3>
                <div className="text-xl font-extrabold text-[#007A4D] mb-4">{(top2.voteCount || 0).toLocaleString()} Votes</div>
                <Link to={`/vote?nominee=${top2.nomineeSlug}`} className="w-full border-2 border-[#007A4D] text-[#007A4D] hover:bg-[#007A4D] hover:text-white font-extrabold text-xs py-2.5 rounded-full block text-center transition-all">
                  Vote Now
                </Link>
              </div>
            )}

            {/* Rank 1 */}
            {top1 && (
              <div className="bg-white rounded-3xl p-8 text-center border-2 border-[#007A4D] shadow-xl order-1 md:order-2 relative">
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-[#EBF700] text-[#0B2B1B] text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider flex items-center gap-1 shadow-sm">
                  👑 Leader
                </div>
                <div className="w-16 h-16 rounded-full bg-[#007A4D] text-white font-display font-extrabold text-2xl flex items-center justify-center mx-auto mb-4 mt-2 shadow-lg">
                  #1
                </div>
                {top1.nomineeImageUrl && (
                  <img
                    src={top1.nomineeImageUrl}
                    alt={top1.nomineeName}
                    className="w-28 h-28 rounded-full object-cover mx-auto mb-4 border-4 border-[#007A4D] shadow-lg"
                  />
                )}
                <h3 className="text-xl font-display font-extrabold text-[#0B2B1B]">{top1.nomineeName}</h3>
                <div className="text-2xl font-extrabold text-[#007A4D] mb-4">{(top1.voteCount || 0).toLocaleString()} Votes</div>
                <Link to={`/vote?nominee=${top1.nomineeSlug}`} className="w-full bg-[#007A4D] hover:bg-[#006640] text-white font-extrabold text-sm py-3 rounded-full block text-center shadow-md transition-all">
                  Vote Now
                </Link>
              </div>
            )}

            {/* Rank 3 */}
            {top3 && (
              <div className="bg-white rounded-3xl p-6 text-center border border-[#E2EFE7] shadow-sm order-3">
                <div className="w-12 h-12 rounded-full bg-[#F4FAF5] border-2 border-[#E2EFE7] text-[#526c60] font-display font-extrabold text-lg flex items-center justify-center mx-auto mb-3">
                  #3
                </div>
                {top3.nomineeImageUrl && (
                  <img
                    src={top3.nomineeImageUrl}
                    alt={top3.nomineeName}
                    className="w-24 h-24 rounded-full object-cover mx-auto mb-4 border-3 border-[#E2EFE7] shadow-md"
                  />
                )}
                <h3 className="text-lg font-display font-extrabold text-[#0B2B1B]">{top3.nomineeName}</h3>
                <div className="text-xl font-extrabold text-[#007A4D] mb-4">{(top3.voteCount || 0).toLocaleString()} Votes</div>
                <Link to={`/vote?nominee=${top3.nomineeSlug}`} className="w-full border-2 border-[#007A4D] text-[#007A4D] hover:bg-[#007A4D] hover:text-white font-extrabold text-xs py-2.5 rounded-full block text-center transition-all">
                  Vote Now
                </Link>
              </div>
            )}
          </div>
        )}

        {/* Full Table */}
        <div className="bg-white rounded-3xl p-6 border border-[#E2EFE7] shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-[#E2EFE7] text-[#526c60] text-xs uppercase tracking-wider font-extrabold">
                  <th className="py-3 px-4">Rank</th>
                  <th className="py-3 px-4">Nominee</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-right">Votes</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2EFE7] text-sm">
                {standings.map((item: LeaderboardEntry) => (
                  <tr key={item.nomineeId} className="hover:bg-[#F4FAF5] transition-colors">
                    <td className="py-4 px-4 font-display font-extrabold text-[#007A4D]">#{item.rank}</td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        {item.nomineeImageUrl && (
                          <img
                            src={item.nomineeImageUrl}
                            alt={item.nomineeName}
                            className="w-9 h-9 rounded-full object-cover border border-[#E2EFE7]"
                          />
                        )}
                        <span className="font-bold text-[#0B2B1B]">{item.nomineeName}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-[#526c60]">{item.categoryName}</td>
                    <td className="py-4 px-4 text-right font-mono font-extrabold text-[#0B2B1B]">
                      {(item.voteCount || 0).toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Link
                        to={`/vote?nominee=${item.nomineeSlug}`}
                        className="text-xs text-[#007A4D] hover:underline font-extrabold"
                      >
                        Vote
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
