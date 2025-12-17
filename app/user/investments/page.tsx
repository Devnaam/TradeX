'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Investment {
  id: number;
  planNumber: number;
  planName: string;
  amount: number;
  dailyIncome: number;
  earnedReturn: number;
  startDate: string;
  endDate: string;
  status: string;
  validityDays: number;
}

export default function MyInvestmentPage() {
  const router = useRouter();
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'expired' | 'blocked'>('all');

  useEffect(() => {
    fetchInvestments();
  }, []);

  const fetchInvestments = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/investments', {
        headers: {
          'x-user-id': user.id.toString(),
        },
      });

      const data = await response.json();
      if (data.success) {
        setInvestments(data.data.investments);
      }
    } catch (error) {
      console.error('Failed to fetch investments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredInvestments = investments.filter((inv) => {
    if (filter === 'all') return true;
    return inv.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-secondary bg-green-50';
      case 'expired':
        return 'text-neutral-600 bg-neutral-50';
      case 'blocked':
        return 'text-neutral-600 bg-neutral-50';
      default:
        return 'text-neutral-600 bg-neutral-50';
    }
  };

  const getDaysRemaining = (endDate: string, status: string) => {
    if (status !== 'active') return 0;
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
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
          <h1 className="text-lg font-semibold">My Investment</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Filter Tabs */}
        <div className="card p-2">
          <div className="grid grid-cols-4 gap-2">
            {(['all', 'active', 'expired', 'blocked'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`py-2 px-3 rounded-lg text-sm font-medium transition-colors capitalize ${
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

        {/* Investments List */}
        {filteredInvestments.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-3">📊</div>
            <p className="text-neutral-600 mb-4">
              {filter === 'all' ? 'No investments yet' : `No ${filter} investments`}
            </p>
            <Link href="/user/plans">
              <button className="btn-primary">Browse Plans</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredInvestments.map((investment) => (
              <div key={investment.id} className="card">
                {/* Investment Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-primary">{investment.planName}</h3>
                    <p className="text-xs text-neutral-500 mt-1">
                      Start: {formatDate(investment.startDate)}
                    </p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded capitalize font-medium ${getStatusColor(investment.status)}`}>
                    {investment.status}
                  </span>
                </div>

                {/* Amount Cards */}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="bg-neutral-50 p-3 rounded-lg">
                    <p className="text-xs text-neutral-600">Invested</p>
                    <p className="text-lg font-bold text-primary">
                      {formatCurrency(investment.amount)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-xs text-green-700">Earned</p>
                    <p className="text-lg font-bold text-secondary">
                      {formatCurrency(investment.earnedReturn)}
                    </p>
                  </div>
                </div>

                {/* Investment Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Daily Income:</span>
                    <span className="font-medium text-secondary">{formatCurrency(investment.dailyIncome)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Validity:</span>
                    <span className="font-medium">{investment.validityDays} days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">End Date:</span>
                    <span className="font-medium">{formatDate(investment.endDate)}</span>
                  </div>

                  {investment.status === 'active' && (
                    <div className="pt-2 border-t border-neutral-200">
                      <div className="flex justify-between items-center">
                        <span className="text-neutral-600">Days Remaining:</span>
                        <span className="font-bold text-primary">
                          {getDaysRemaining(investment.endDate, investment.status)} days
                        </span>
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
