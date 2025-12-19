'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';


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
        return 'bg-green-100 text-green-700 border-green-200';
      case 'expired':
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
      case 'blocked':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  const getDaysRemaining = (endDate: string, status: string) => {
    if (status !== 'active') return 0;
    const end = new Date(endDate);
    const today = new Date();
    const diff = Math.ceil((end.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  };

  const getProgressPercentage = (startDate: string, endDate: string, validityDays: number) => {
    const start = new Date(startDate).getTime();
    const end = new Date(endDate).getTime();
    const today = new Date().getTime();
    
    const totalDuration = end - start;
    const elapsed = today - start;
    
    const percentage = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    return percentage;
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
          <h1 className="text-lg font-semibold">My Investments</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card bg-blue-50 border-blue-200">
            <p className="text-xs text-blue-700 mb-1">Active Plans</p>
            <p className="text-2xl font-bold text-primary">
              {investments.filter((i) => i.status === 'active').length}
            </p>
          </div>
          <div className="card bg-green-50 border-green-200">
            <p className="text-xs text-green-700 mb-1">Total Earned</p>
            <p className="text-2xl font-bold text-secondary">
              {formatCurrency(
                investments.reduce((sum, inv) => sum + inv.earnedReturn, 0)
              )}
            </p>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="card">
          <div className="grid grid-cols-4 gap-2">
            {(['all', 'active', 'expired', 'blocked'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`py-2 px-2 rounded-lg text-xs md:text-sm font-medium transition-colors capitalize ${
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

        {/* New Investment Button */}
        <Link href="/user/plans">
          <button className="btn-primary w-full">+ New Investment</button>
        </Link>

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
            {filteredInvestments.map((investment) => {
              const daysRemaining = getDaysRemaining(investment.endDate, investment.status);
              const progressPercentage = getProgressPercentage(
                investment.startDate,
                investment.endDate,
                investment.validityDays
              );

              return (
                <div key={investment.id} className="card">
                  {/* Investment Header */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-neutral-900">{investment.planName}</h3>
                      <p className="text-xs text-neutral-500 mt-1">
                        Plan #{investment.planNumber}
                      </p>
                    </div>
                    <span
                      className={`text-xs px-3 py-1 rounded-full capitalize font-medium border ${getStatusColor(
                        investment.status
                      )}`}
                    >
                      {investment.status}
                    </span>
                  </div>

                  {/* Amount Cards */}
                  <div className="grid grid-cols-2 gap-3 mb-3">
                    <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-700">Invested</p>
                      <p className="text-lg font-bold text-primary">
                        {formatCurrency(investment.amount)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                      <p className="text-xs text-green-700">Earned</p>
                      <p className="text-lg font-bold text-secondary">
                        {formatCurrency(investment.earnedReturn)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar - Only for Active */}
                  {investment.status === 'active' && (
                    <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 mb-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-neutral-600">Progress</span>
                        <span className="text-xs font-medium text-neutral-900">
                          {daysRemaining} days left
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {/* Investment Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Daily Income:</span>
                      <span className="font-medium text-secondary">
                        {formatCurrency(investment.dailyIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Validity:</span>
                      <span className="font-medium text-neutral-900">
                        {investment.validityDays} days
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Start Date:</span>
                      <span className="font-medium text-neutral-900">
                        {formatDate(investment.startDate)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">End Date:</span>
                      <span className="font-medium text-neutral-900">
                        {formatDate(investment.endDate)}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}
