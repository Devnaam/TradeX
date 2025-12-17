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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/user/referrals">
            <button className="text-white hover:opacity-80">← Back</button>
          </Link>
          <h1 className="text-lg font-semibold">Referral Income History</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Total Referral Income Card */}
        <div className="card bg-green-50 border-green-200">
          <div className="text-center">
            <p className="text-sm text-green-700 mb-1">Total Referral Income Earned</p>
            <p className="text-3xl font-bold text-secondary">{formatCurrency(totalIncome)}</p>
            <p className="text-xs text-green-600 mt-1">
              From {referralIncomes.length} referral deposits (10% commission)
            </p>
          </div>
        </div>

        {/* How it Works */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-blue-900 mb-1">How Referral Income Works</p>
              <p className="text-sm text-blue-700">
                You earn <strong>10% commission</strong> on every approved deposit made by users
                who registered using your referral link. Commission is added instantly to your
                income balance.
              </p>
            </div>
          </div>
        </div>

        {/* Referral Income List */}
        {referralIncomes.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-3">🔗</div>
            <p className="text-neutral-600">No referral income yet</p>
            <p className="text-sm text-neutral-500 mt-2">
              Share your referral link to start earning commissions!
            </p>
            <Link href="/user/referrals">
              <button className="btn-primary mt-4">View Referral Link</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {referralIncomes.map((income) => (
              <div key={income.id} className="card">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-neutral-900">{income.referredUserName}</h4>
                    <p className="text-xs text-neutral-500">📱 {income.referredUserPhone}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatDate(income.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-secondary">
                      +{formatCurrency(income.amount)}
                    </p>
                    <p className="text-xs text-green-600">10% Commission</p>
                  </div>
                </div>

                {/* Details */}
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div>
                      <p className="text-xs text-neutral-600">Their Deposit</p>
                      <p className="font-medium text-neutral-900">
                        {formatCurrency(income.depositAmount)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-neutral-600">Deposit ID</p>
                      <p className="font-medium text-neutral-900">#{income.depositId}</p>
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
            <button className="btn-secondary w-full">
              🔗 Share Referral Link to Earn More
            </button>
          </Link>
        )}
      </div>
    </div>
  );
}
