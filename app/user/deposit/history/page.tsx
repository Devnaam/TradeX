'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface Deposit {
  id: number;
  amount: number;
  utrNumber: string;
  screenshotUrl: string;
  status: string;
  adminRemark: string | null;
  createdAt: string;
}

export default function DepositHistoryPage() {
  const router = useRouter();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/deposit/history', {
        headers: {
          'x-user-id': user.id.toString(),
        },
      });

      const data = await response.json();
      if (data.success) {
        setDeposits(data.data.deposits);
      }
    } catch (error) {
      console.error('Failed to fetch deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredDeposits = deposits.filter((deposit) => {
    if (filter === 'all') return true;
    return deposit.status === filter;
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
          <h1 className="text-lg font-semibold">Recharge History</h1>
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

        {/* Deposits List */}
        {filteredDeposits.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-neutral-600">No recharge records found</p>
            <Link href="/user/deposit">
              <button className="btn-primary mt-4">Make a Recharge</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDeposits.map((deposit) => (
              <div key={deposit.id} className="card">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(deposit.amount)}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatDateTime(deposit.createdAt)}
                    </p>
                  </div>
                  <span className={`text-sm font-medium capitalize ${getStatusColor(deposit.status)}`}>
                    {deposit.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">UTR Number:</span>
                    <span className="font-medium">{deposit.utrNumber}</span>
                  </div>

                  {deposit.adminRemark && (
                    <div className="pt-2 border-t border-neutral-200">
                      <p className="text-xs text-neutral-600 mb-1">Admin Remark:</p>
                      <p className="text-sm text-neutral-800">{deposit.adminRemark}</p>
                    </div>
                  )}

                  {deposit.status === 'rejected' && (
                    <button className="btn-secondary w-full mt-2 text-sm">
                      Resubmit
                    </button>
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
