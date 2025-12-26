'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface Withdrawal {
  id: number;
  amount: number;
  method: string;
  status: string;
  adminRemark: string | null;
  createdAt: string;
}

export default function WithdrawHistoryPage() {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/withdraw/history', {
        headers: {
          'x-user-id': user.id.toString(),
        },
      });

      const data = await response.json();
      if (data.success) {
        setWithdrawals(data.data.withdrawals);
      }
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    if (filter === 'all') return true;
    return withdrawal.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '❌';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-foreground font-medium">Loading history...</p>
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
            <Link href="/user/dashboard">
              <button className="text-white hover:text-white/80 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </button>
            </Link>
            <div className="flex items-center gap-2 flex-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
              </svg>
              <h1 className="text-lg font-bold">Withdrawal History</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Filter Tabs */}
        <div className="card !p-3">
          <div className="grid grid-cols-4 gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`py-2.5 px-2 rounded-lg text-xs md:text-sm font-bold transition-all capitalize ${
                  filter === tab
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-background text-foreground hover:bg-neutral-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Withdrawals List */}
        {filteredWithdrawals.length === 0 ? (
          <div className="card !p-12 text-center border-2 border-neutral-200">
            <div className="text-6xl mb-4">💸</div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Records Found</h3>
            <p className="text-neutral-600 mb-6">
              {filter === 'all' ? 'No withdrawal records found' : `No ${filter} withdrawals`}
            </p>
            <Link href="/user/withdraw">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-8 rounded-button transition-all shadow-lg hover:shadow-xl">
                Make a Withdrawal
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWithdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="card !p-5 border-2 border-neutral-200 hover:border-emerald-600/30 transition-all">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(withdrawal.amount)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-neutral-500 font-medium">
                        {formatDateTime(withdrawal.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-bold capitalize border-2 flex items-center gap-1 ${getStatusColor(
                      withdrawal.status
                    )}`}
                  >
                    <span>{getStatusIcon(withdrawal.status)}</span>
                    {withdrawal.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                    <span className="text-neutral-600 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Method
                    </span>
                    <span className="font-bold text-foreground capitalize">{withdrawal.method}</span>
                  </div>

                  {/* Admin Remark */}
                  {withdrawal.adminRemark && (
                    <div className="pt-3 border-t border-neutral-200">
                      <p className="text-xs font-bold text-neutral-700 mb-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Admin Remark:
                      </p>
                      <p className="text-sm text-foreground bg-neutral-100 p-3 rounded-lg border border-neutral-200">
                        {withdrawal.adminRemark}
                      </p>
                    </div>
                  )}

                  {/* Pending Status Info */}
                  {withdrawal.status === 'pending' && (
                    <div className="pt-3 border-t border-neutral-200">
                      <div className="bg-yellow-50 border-2 border-yellow-200 p-3 rounded-lg">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-yellow-900 mb-1">Processing</p>
                            <p className="text-xs text-yellow-800">
                              Your withdrawal request is being reviewed by admin. This usually takes 5-30 minutes.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Approved Status Info */}
                  {withdrawal.status === 'approved' && (
                    <div className="pt-3 border-t border-neutral-200">
                      <div className="bg-green-50 border-2 border-green-200 p-3 rounded-lg">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-green-900 mb-1">Completed</p>
                            <p className="text-xs text-green-800">
                              Your withdrawal has been approved and processed successfully!
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Rejected Status Info */}
                  {withdrawal.status === 'rejected' && (
                    <div className="pt-3 border-t border-neutral-200">
                      <div className="bg-red-50 border-2 border-red-200 p-3 rounded-lg">
                        <div className="flex items-start gap-3">
                          <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                          </svg>
                          <div className="flex-1">
                            <p className="text-sm font-bold text-red-900 mb-1">Rejected</p>
                            <p className="text-xs text-red-800">
                              Your withdrawal was rejected. Amount has been refunded to your wallet.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
