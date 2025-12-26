'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

interface ReferralIncome {
  id: number;
  amount: number;
  createdAt: string;
  referredUserName: string;
  referredUserPhone: string;
  depositAmount: number;
  depositId: number;
}

export default function ReferralIncomeHistoryPage() {
  const router = useRouter();
  const [referralIncomes, setReferralIncomes] = useState<ReferralIncome[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    fetchReferralIncome();
  }, []);

  const fetchReferralIncome = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/referral/income', {
        headers: {
          'x-user-id': user.id.toString(),
        },
      });

      const data = await response.json();
      if (data.success) {
        setReferralIncomes(data.data.referralIncomes);
        setTotalIncome(data.data.totalIncome);
      }
    } catch (error) {
      console.error('Failed to fetch referral income:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-emerald-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/user/referrals">
              <button className="text-white hover:text-white/80 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </button>
            </Link>
            <div className="flex items-center gap-2 flex-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-lg font-bold">Referral Income History</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Total Referral Income Card */}
        <div className="card !p-6 bg-green-50 border-2 border-green-200">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-green-700 font-bold mb-2">Total Referral Income Earned</p>
            <p className="text-4xl font-bold text-green-600 mb-2">{formatCurrency(totalIncome)}</p>
            <p className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block">
              From {referralIncomes.length} referral deposits (10% commission)
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="card !p-5 bg-emerald-50 border-2 border-emerald-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-900 mb-2">How Referral Income Works</p>
              <p className="text-sm text-emerald-800">
                You earn <strong>10% commission</strong> on every approved deposit made by users
                who registered using your referral link. Commission is added instantly to your
                income balance.
              </p>
            </div>
          </div>
        </div>

        {/* Referral Income List */}
        {referralIncomes.length === 0 ? (
          <div className="card !p-12 text-center border-2 border-neutral-200">
            <div className="text-6xl mb-4">🔗</div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Referral Income Yet</h3>
            <p className="text-neutral-600 mb-1">
              Share your referral link to start earning commissions!
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              Earn 10% commission on every deposit
            </p>
            <Link href="/user/referrals">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-8 rounded-button transition-all shadow-lg hover:shadow-xl">
                View Referral Link
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {referralIncomes.map((income) => (
              <div key={income.id} className="card !p-5 border-2 border-neutral-200 hover:border-emerald-600/30 transition-all">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                      <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-bold text-foreground">{income.referredUserName}</h4>
                      <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                        </svg>
                        {income.referredUserPhone}
                      </p>
                      <p className="text-xs text-neutral-500 flex items-center gap-1 mt-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {formatDate(income.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-600">
                      +{formatCurrency(income.amount)}
                    </p>
                    <p className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded font-medium">
                      10% Commission
                    </p>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-background p-3 rounded-lg border-2 border-neutral-200">
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-xs text-neutral-600 mb-1 font-medium">Their Deposit</p>
                      <p className="font-bold text-foreground">
                        {formatCurrency(income.depositAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600 mb-1 font-medium">Deposit ID</p>
                      <p className="font-bold text-foreground">#{income.depositId}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Share Referral Link CTA */}
        {referralIncomes.length > 0 && (
          <Link href="/user/referrals">
            <button className="w-full bg-white hover:bg-neutral-50 text-emerald-600 font-bold h-14 px-6 rounded-button border-2 border-emerald-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              <span>Share Referral Link to Earn More</span>
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
