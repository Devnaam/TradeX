'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Stats {
  totalUsers: number;
  blockedUsers: number;
  totalDeposits: { 
    pending: number; 
    approved: number; 
    rejected: number;
    totalAmount: number;
  };
  totalWithdrawals: { 
    pending: number; 
    approved: number; 
    rejected: number;
    totalAmount: number;
  };
  activePlans: number;
  totalPlans: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [cronLoading, setCronLoading] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data.stats);
      } else {
        console.error('Failed to fetch stats:', data.error);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  };

  const handleTriggerCron = async () => {
    const confirmed = window.confirm(
      '⚠️ This will manually trigger daily income distribution.\n\nAre you sure you want to continue?'
    );

    if (!confirmed) return;

    setCronLoading(true);

    try {
      const response = await fetch('/api/admin/trigger-cron', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        const result = data.data.data;
        alert(
          `✅ Cron Job Executed Successfully!\n\n` +
          `📊 Plans Processed: ${result.processed}\n` +
          `⏰ Plans Expired: ${result.expired}\n` +
          `⏭️ Plans Skipped: ${result.skipped}\n` +
          `💰 Total Income Added: ₹${result.totalIncomeAdded}`
        );
        // Refresh stats after cron execution
        fetchStats();
      } else {
        alert('❌ Failed to trigger cron job: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Cron trigger error:', error);
      alert('❌ Something went wrong. Please try again.');
    } finally {
      setCronLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">TradeX Admin Panel</h1>
            <p className="text-sm text-white/80">Control Dashboard</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-blue-700 font-medium">Total Users</p>
              <span className="text-2xl">👥</span>
            </div>
            <p className="text-3xl font-bold text-blue-900">{stats?.totalUsers || 0}</p>
            <p className="text-xs text-blue-600 mt-1">
              {stats?.blockedUsers || 0} blocked
            </p>
          </div>

          {/* Pending Deposits */}
          <div className="card bg-yellow-50 border-yellow-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-yellow-700 font-medium">Pending Deposits</p>
              <span className="text-2xl">💰</span>
            </div>
            <p className="text-3xl font-bold text-yellow-900">
              {stats?.totalDeposits.pending || 0}
            </p>
            <p className="text-xs text-yellow-600 mt-1">Awaiting approval</p>
          </div>

          {/* Pending Withdrawals */}
          <div className="card bg-orange-50 border-orange-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-orange-700 font-medium">Pending Withdrawals</p>
              <span className="text-2xl">💸</span>
            </div>
            <p className="text-3xl font-bold text-orange-900">
              {stats?.totalWithdrawals.pending || 0}
            </p>
            <p className="text-xs text-orange-600 mt-1">Awaiting approval</p>
          </div>

          {/* Active Plans */}
          <div className="card bg-green-50 border-green-200">
            <div className="flex justify-between items-start mb-2">
              <p className="text-sm text-green-700 font-medium">Active Plans</p>
              <span className="text-2xl">📊</span>
            </div>
            <p className="text-3xl font-bold text-green-900">{stats?.activePlans || 0}</p>
            <p className="text-xs text-green-600 mt-1">
              of {stats?.totalPlans || 0} total
            </p>
          </div>
        </div>

        {/* Deposit & Withdrawal Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deposits Breakdown */}
          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              💰 Deposit Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-yellow-700 font-medium">Pending</span>
                <span className="text-xl font-bold text-yellow-900">
                  {stats?.totalDeposits.pending || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-green-700 font-medium">Approved</span>
                <span className="text-xl font-bold text-green-900">
                  {stats?.totalDeposits.approved || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="text-red-700 font-medium">Rejected</span>
                <span className="text-xl font-bold text-red-900">
                  {stats?.totalDeposits.rejected || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Withdrawals Breakdown */}
          <div className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-4 flex items-center gap-2">
              💸 Withdrawal Statistics
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                <span className="text-yellow-700 font-medium">Pending</span>
                <span className="text-xl font-bold text-yellow-900">
                  {stats?.totalWithdrawals.pending || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200">
                <span className="text-green-700 font-medium">Approved</span>
                <span className="text-xl font-bold text-green-900">
                  {stats?.totalWithdrawals.approved || 0}
                </span>
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-200">
                <span className="text-red-700 font-medium">Rejected</span>
                <span className="text-xl font-bold text-red-900">
                  {stats?.totalWithdrawals.rejected || 0}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/admin/users">
            <div className="card hover:shadow-lg transition-all cursor-pointer bg-blue-50 border-blue-200">
              <div className="flex items-center gap-4">
                <div className="text-4xl">👥</div>
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-900 text-lg">Manage Users</h3>
                  <p className="text-sm text-neutral-600">View, block, unblock users</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/deposits">
            <div className="card hover:shadow-lg transition-all cursor-pointer bg-green-50 border-green-200">
              <div className="flex items-center gap-4">
                <div className="text-4xl">💰</div>
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-900 text-lg">Manage Deposits</h3>
                  <p className="text-sm text-neutral-600">Approve/reject deposits</p>
                </div>
              </div>
            </div>
          </Link>

          <Link href="/admin/withdrawals">
            <div className="card hover:shadow-lg transition-all cursor-pointer bg-orange-50 border-orange-200">
              <div className="flex items-center gap-4">
                <div className="text-4xl">💸</div>
                <div className="flex-1">
                  <h3 className="font-bold text-neutral-900 text-lg">Manage Withdrawals</h3>
                  <p className="text-sm text-neutral-600">Approve/reject withdrawals</p>
                </div>
              </div>
            </div>
          </Link>
        </div>

        {/* Manual Cron Trigger - Testing Only */}
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex items-start gap-3 mb-3">
            <span className="text-2xl">⚙️</span>
            <div className="flex-1">
              <h3 className="text-base font-bold text-yellow-900 mb-1">
                Manual Daily Income Distribution
              </h3>
              <p className="text-sm text-yellow-800 mb-3">
                This manually triggers the daily income cron job. Normally runs automatically at 12:00 AM IST. 
                Use this for testing or emergency income distribution.
              </p>
              <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 mb-3">
                <p className="text-xs text-yellow-900 font-medium mb-1">⚠️ What this does:</p>
                <ul className="text-xs text-yellow-800 space-y-1">
                  <li>• Adds daily income to all active plans</li>
                  <li>• Marks expired plans (95+ days)</li>
                  <li>• Skips blocked users</li>
                  <li>• Creates income logs for tracking</li>
                </ul>
              </div>
            </div>
          </div>
          <button
            onClick={handleTriggerCron}
            disabled={cronLoading}
            className={`w-full px-4 py-3 rounded-lg font-medium transition-colors ${
              cronLoading
                ? 'bg-neutral-300 text-neutral-500 cursor-not-allowed'
                : 'bg-primary text-white hover:bg-blue-700'
            }`}
          >
            {cronLoading ? (
              <span className="flex items-center justify-center gap-2">
                <div className="inline-block animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                Running Daily Income Distribution...
              </span>
            ) : (
              '▶️ Trigger Daily Income Cron Job'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
