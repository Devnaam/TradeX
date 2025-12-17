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
        return 'text-secondary';
      case 'pending':
        return 'text-neutral-500';
      case 'rejected':
        return 'text-neutral-500';
      default:
        return 'text-neutral-500';
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
          <Link href="/user/dashboard">
            <button className="text-white hover:opacity-80">← Back</button>
          </Link>
          <h1 className="text-lg font-semibold">Withdrawal History</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Filter Tabs */}
        <div className="card p-2">
          <div className="grid grid-cols-4 gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`py-2 px-3 rounded-button text-sm font-medium transition-colors capitalize ${
                  filter === tab
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Withdrawals List */}
        {filteredWithdrawals.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-3">💸</div>
            <p className="text-neutral-600">No withdrawal records found</p>
            <Link href="/user/withdraw">
              <button className="btn-primary mt-4">Make a Withdrawal</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredWithdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(withdrawal.amount)}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatDateTime(withdrawal.createdAt)}
                    </p>
                  </div>
                  <span className={`text-sm font-medium capitalize ${getStatusColor(withdrawal.status)}`}>
                    {withdrawal.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Method:</span>
                    <span className="font-medium capitalize">{withdrawal.method}</span>
                  </div>

                  {withdrawal.adminRemark && (
                    <div className="pt-2 border-t border-neutral-200">
                      <p className="text-xs text-neutral-600 mb-1">Admin Remark:</p>
                      <p className="text-sm text-neutral-800">{withdrawal.adminRemark}</p>
                    </div>
                  )}

                  {withdrawal.status === 'pending' && (
                    <div className="pt-2 border-t border-neutral-200">
                      <p className="text-xs text-yellow-700 bg-yellow-50 p-2 rounded">
                        ⏳ Waiting for admin approval
                      </p>
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
