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
          <h1 className="text-lg font-semibold">Daily Income History</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Total Income Card */}
        <div className="card bg-green-50 border-green-200">
          <div className="text-center">
            <p className="text-sm text-green-700 mb-1">Total Daily Income Earned</p>
            <p className="text-3xl font-bold text-secondary">{formatCurrency(totalIncome)}</p>
            <p className="text-xs text-green-600 mt-1">From {incomeLogs.length} transactions</p>
          </div>
        </div>

        {/* Income List */}
        {incomeLogs.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-3">💰</div>
            <p className="text-neutral-600">No income history yet</p>
            <p className="text-sm text-neutral-500 mt-2">
              Daily income will appear here once you activate a plan
            </p>
            <Link href="/user/plans">
              <button className="btn-primary mt-4">View Plans</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(groupedLogs).map(([date, logs]) => (
              <div key={date}>
                {/* Date Header */}
                <div className="bg-neutral-100 px-4 py-2 rounded-lg mb-2">
                  <p className="text-sm font-medium text-neutral-700">{date}</p>
                </div>

                {/* Income Logs for this date */}
                <div className="space-y-2">
                  {logs.map((log) => (
                    <div key={log.id} className="card">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-medium text-neutral-900">{log.planName}</h4>
                          <p className="text-xs text-neutral-500">Plan #{log.planNumber}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-secondary">
                            +{formatCurrency(log.amount)}
                          </p>
                          <p className="text-xs text-green-600">Daily Income</p>
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
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <span className="text-2xl">ℹ️</span>
            <div>
              <p className="text-sm font-bold text-blue-900 mb-1">About Daily Income</p>
              <p className="text-sm text-blue-700">
                Daily income is automatically added to your account every day at 12:00 AM IST
                based on your active plans.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
