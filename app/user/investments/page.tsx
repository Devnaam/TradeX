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
        return 'bg-green-100 text-green-700 border-green-300';
      case 'expired':
        return 'bg-neutral-100 text-neutral-700 border-neutral-300';
      case 'blocked':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return '✅';
      case 'expired':
        return '⏱️';
      case 'blocked':
        return '🚫';
      default:
        return '📋';
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-foreground font-medium">Loading investments...</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <h1 className="text-lg font-bold">My Investments</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Stats Summary */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="card !p-5 bg-emerald-50 border-2 border-emerald-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-neutral-600 font-medium">Active Plans</p>
                <p className="text-2xl font-bold text-emerald-600">
                  {investments.filter((i) => i.status === 'active').length}
                </p>
              </div>
            </div>
          </div>
          
          <div className="card !p-5 bg-green-50 border-2 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-neutral-600 font-medium">Total Earned</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(
                    investments.reduce((sum, inv) => sum + inv.earnedReturn, 0)
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="card !p-3">
          <div className="grid grid-cols-4 gap-2">
            {(['all', 'active', 'expired', 'blocked'] as const).map((tab) => (
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

        {/* New Investment Button */}
        <Link href="/user/plans">
          <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 px-6 rounded-button transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>New Investment</span>
          </button>
        </Link>

        {/* Investments List */}
        {filteredInvestments.length === 0 ? (
          <div className="card !p-12 text-center border-2 border-neutral-200">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Investments Found</h3>
            <p className="text-neutral-600 mb-6">
              {filter === 'all' ? 'Start your investment journey today!' : `No ${filter} investments`}
            </p>
            <Link href="/user/plans">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-8 rounded-button transition-all shadow-lg hover:shadow-xl">
                Browse Plans
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredInvestments.map((investment) => {
              const daysRemaining = getDaysRemaining(investment.endDate, investment.status);
              const progressPercentage = getProgressPercentage(
                investment.startDate,
                investment.endDate,
                investment.validityDays
              );

              return (
                <div key={investment.id} className="card !p-5 border-2 border-neutral-200 hover:border-emerald-600/30 transition-all">
                  
                  {/* Investment Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
                        <span className="text-white font-bold text-lg">{investment.planNumber}</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-foreground">{investment.planName}</h3>
                        <p className="text-xs text-neutral-500">Plan #{investment.planNumber}</p>
                      </div>
                    </div>
                    <span
                      className={`text-xs px-3 py-1.5 rounded-full capitalize font-bold border-2 flex items-center gap-1 ${getStatusColor(
                        investment.status
                      )}`}
                    >
                      <span>{getStatusIcon(investment.status)}</span>
                      {investment.status}
                    </span>
                  </div>

                  {/* Amount Cards */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-200">
                      <p className="text-xs text-neutral-600 mb-1 font-medium">Invested</p>
                      <p className="text-xl font-bold text-emerald-600">
                        {formatCurrency(investment.amount)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
                      <p className="text-xs text-neutral-600 mb-1 font-medium">Earned</p>
                      <p className="text-xl font-bold text-green-600">
                        {formatCurrency(investment.earnedReturn)}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar - Only for Active */}
                  {investment.status === 'active' && (
                    <div className="bg-background p-4 rounded-lg border-2 border-neutral-200 mb-4">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-sm font-bold text-foreground flex items-center gap-2">
                          <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Progress
                        </span>
                        <span className="text-sm font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                          {daysRemaining} days left
                        </span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-3">
                        <div
                          className="bg-emerald-600 h-3 rounded-full transition-all shadow-sm"
                          style={{ width: `${progressPercentage}%` }}
                        ></div>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-neutral-600">
                          {Math.round(progressPercentage)}% Complete
                        </span>
                        <span className="text-xs text-neutral-600">
                          {investment.validityDays} days total
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Investment Details */}
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                      <span className="text-neutral-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Daily Income
                      </span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(investment.dailyIncome)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                      <span className="text-neutral-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Validity
                      </span>
                      <span className="font-bold text-foreground">
                        {investment.validityDays} days
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                      <span className="text-neutral-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Start Date
                      </span>
                      <span className="font-bold text-foreground">
                        {formatDate(investment.startDate)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="text-neutral-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        End Date
                      </span>
                      <span className="font-bold text-foreground">
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
