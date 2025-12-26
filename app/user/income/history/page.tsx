'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

interface IncomeLog {
  id: number;
  amount: number;
  date: string;
  planName: string;
  planNumber: number;
}

export default function IncomeHistoryPage() {
  const router = useRouter();
  const [incomeLogs, setIncomeLogs] = useState<IncomeLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalIncome, setTotalIncome] = useState(0);

  useEffect(() => {
    fetchIncomeHistory();
  }, []);

  const fetchIncomeHistory = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/income/history', {
        headers: {
          'x-user-id': user.id.toString(),
        },
      });

      const data = await response.json();
      if (data.success) {
        setIncomeLogs(data.data.incomeLogs);
        setTotalIncome(data.data.totalIncome);
      }
    } catch (error) {
      console.error('Failed to fetch income history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Group by date
  const groupedLogs = incomeLogs.reduce((groups, log) => {
    const date = formatDate(log.date);
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(log);
    return groups;
  }, {} as Record<string, IncomeLog[]>);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-foreground font-medium">Loading income history...</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-lg font-bold">Daily Income History</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Total Income Card */}
        <div className="card !p-6 bg-green-50 border-2 border-green-200">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm text-green-700 font-bold mb-2">Total Daily Income Earned</p>
            <p className="text-4xl font-bold text-green-600 mb-2">{formatCurrency(totalIncome)}</p>
            <p className="text-xs text-green-600 bg-green-100 px-3 py-1 rounded-full inline-block">
              From {incomeLogs.length} transactions
            </p>
          </div>
        </div>

        {/* Income List */}
        {incomeLogs.length === 0 ? (
          <div className="card !p-12 text-center border-2 border-neutral-200">
            <div className="text-6xl mb-4">💰</div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Income History Yet</h3>
            <p className="text-neutral-600 mb-1">
              Daily income will appear here once you activate a plan
            </p>
            <p className="text-sm text-neutral-500 mb-6">
              Start earning passive income by activating investment plans
            </p>
            <Link href="/user/plans">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-8 rounded-button transition-all shadow-lg hover:shadow-xl">
                View Plans
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedLogs).map(([date, logs]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="bg-emerald-50 px-4 py-3 rounded-lg mb-3 border-2 border-emerald-200">
                  <div className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p className="text-sm font-bold text-emerald-900">{date}</p>
                  </div>
                </div>

                {/* Income Logs for this date */}
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="card !p-4 border-2 border-neutral-200 hover:border-emerald-600/30 transition-all">
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <h4 className="font-bold text-foreground">{log.planName}</h4>
                            <p className="text-xs text-neutral-500 flex items-center gap-1">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                              </svg>
                              Plan #{log.planNumber}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-xl font-bold text-green-600">
                            +{formatCurrency(log.amount)}
                          </p>
                          <p className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded font-medium">
                            Daily Income
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Info Card */}
        <div className="card !p-5 bg-emerald-50 border-2 border-emerald-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-emerald-900 mb-2">About Daily Income</p>
              <p className="text-sm text-emerald-800">
                Daily income is automatically added to your account every day at <strong>12:00 AM IST</strong> based on your active plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
