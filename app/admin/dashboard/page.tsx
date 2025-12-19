'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DashboardStats {
  totalUsers: number;
  blockedUsers: number;
  totalDeposits: {
    pending: number;
    approved: number;
    rejected: number;
  };
  totalWithdrawals: {
    pending: number;
    approved: number;
    rejected: number;
  };
  activePlans: number;
  totalPlans: number;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [triggeringCron, setTriggeringCron] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard');
      const data = await response.json();

      if (data.success) {
        setStats(data.data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerCron = async () => {
    if (!confirm('⚠️ This will trigger daily income for all active plans. Continue?')) {
      return;
    }

    setTriggeringCron(true);

    try {
      const response = await fetch('/api/cron/daily-income', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-cron-secret': process.env.NEXT_PUBLIC_CRON_SECRET || 'tradex_cron_secret_2025_super_secure',
        },
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Daily income distributed!\n\n${data.message}`);
        fetchStats(); // Refresh stats
      } else {
        alert('❌ Error: ' + data.error);
      }
    } catch (error) {
      console.error('Cron trigger error:', error);
      alert('❌ Failed to trigger cron job');
    } finally {
      setTriggeringCron(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin-token');
    router.push('/admin');
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
      <div className="bg-primary text-white p-4 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">Admin Control Panel</h1>
            <p className="text-sm text-blue-200">TradeX Platform Management</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Users */}
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-start justify-between mb-2">
              <div className="text-3xl">👥</div>
              <Link href="/admin/users">
                <button className="text-xs text-primary hover:underline">View All →</button>
              </Link>
            </div>
            <p className="text-sm text-neutral-600 mb-1">Total Users</p>
            <p className="text-3xl font-bold text-primary">{stats?.totalUsers || 0}</p>
            <p className="text-xs text-neutral-500 mt-1">
              {stats?.blockedUsers || 0} blocked
            </p>
          </div>

          {/* Pending Deposits */}
          <div className="card bg-green-50 border-green-200">
            <div className="flex items-start justify-between mb-2">
              <div className="text-3xl">💰</div>
              <Link href="/admin/deposits">
                <button className="text-xs text-secondary hover:underline">Manage →</button>
              </Link>
            </div>
            <p className="text-sm text-neutral-600 mb-1">Pending Deposits</p>
            <p className="text-3xl font-bold text-secondary">
              {stats?.totalDeposits.pending || 0}
            </p>
            <p className="text-xs text-neutral-500 mt-1">Awaiting approval</p>
          </div>

          {/* Pending Withdrawals */}
          <div className="card bg-yellow-50 border-yellow-200">
            <div className="flex items-start justify-between mb-2">
              <div className="text-3xl">💸</div>
              <Link href="/admin/withdrawals">
                <button className="text-xs text-yellow-700 hover:underline">Manage →</button>
              </Link>
            </div>
            <p className="text-sm text-neutral-600 mb-1">Pending Withdrawals</p>
            <p className="text-3xl font-bold text-yellow-700">
              {stats?.totalWithdrawals.pending || 0}
            </p>
            <p className="text-xs text-neutral-500 mt-1">Awaiting approval</p>
          </div>

          {/* Active Plans */}
          <div className="card bg-purple-50 border-purple-200">
            <div className="flex items-start justify-between mb-2">
              <div className="text-3xl">📊</div>
              <span className="text-xs text-purple-700">Live Stats</span>
            </div>
            <p className="text-sm text-neutral-600 mb-1">Active Plans</p>
            <p className="text-3xl font-bold text-purple-700">{stats?.activePlans || 0}</p>
            <p className="text-xs text-neutral-500 mt-1">
              of {stats?.totalPlans || 0} total
            </p>
          </div>
        </div>

        {/* Quick Links */}
        <div className="card">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            <Link href="/admin/users">
              <button className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 p-4 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">👥</span>
                  <div>
                    <p className="font-bold text-neutral-900">Manage Users</p>
                    <p className="text-xs text-neutral-600">View, block, unblock users</p>
                  </div>
                </div>
              </button>
            </Link>

            <Link href="/admin/deposits">
              <button className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 p-4 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💰</span>
                  <div>
                    <p className="font-bold text-neutral-900">Deposits</p>
                    <p className="text-xs text-neutral-600">Approve/reject deposits</p>
                  </div>
                </div>
              </button>
            </Link>

            <Link href="/admin/withdrawals">
              <button className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 p-4 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">💸</span>
                  <div>
                    <p className="font-bold text-neutral-900">Withdrawals</p>
                    <p className="text-xs text-neutral-600">Approve/reject withdrawals</p>
                  </div>
                </div>
              </button>
            </Link>

            <Link href="/admin/settings">
              <button className="w-full bg-blue-50 hover:bg-blue-100 border border-blue-200 p-4 rounded-lg text-left transition-colors">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚙️</span>
                  <div>
                    <p className="font-bold text-primary">Platform Settings</p>
                    <p className="text-xs text-blue-700">QR Code & UPI ID</p>
                  </div>
                </div>
              </button>
            </Link>
            {/* Add this card alongside your other quick links */}
            <Link href="/admin/change-password">
              <div className="card hover:shadow-lg transition-all cursor-pointer bg-purple-50 border-purple-200">
                <div className="flex items-center gap-4">
                  <div className="text-4xl">🔐</div>
                  <div className="flex-1">
                    <h3 className="font-bold text-neutral-900 text-lg">Change Password</h3>
                    <p className="text-sm text-neutral-600">Update admin credentials</p>
                  </div>
                </div>
              </div>
            </Link>

          </div>
        </div>

        {/* Manual Cron Trigger */}
        <div className="card bg-yellow-50 border-yellow-200">
          <h2 className="text-lg font-bold text-neutral-900 mb-2">
            ⚡ Manual Daily Income Trigger
          </h2>
          <p className="text-sm text-neutral-600 mb-4">
            This manually triggers the daily income cron job. Normally runs automatically at
            12:00 AM IST. Use this for testing or emergency income distribution.
          </p>

          <div className="bg-white p-4 rounded-lg border border-yellow-300 mb-4">
            <p className="text-sm font-bold text-yellow-900 mb-2">⚠️ What this does:</p>
            <ul className="text-sm text-yellow-800 space-y-1">
              <li>• Adds daily income to all active plans</li>
              <li>• Auto-expires plans that completed 95 days</li>
              <li>• Skips blocked users</li>
              <li>• Creates income log entries</li>
            </ul>
          </div>

          <button
            onClick={handleTriggerCron}
            disabled={triggeringCron}
            className="btn-primary w-full md:w-auto"
          >
            {triggeringCron ? 'Processing...' : '⚡ Trigger Daily Income Now'}
          </button>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Deposits Stats */}
          <div className="card">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Deposit Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Pending</span>
                <span className="text-lg font-bold text-yellow-600">
                  {stats?.totalDeposits.pending || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Approved</span>
                <span className="text-lg font-bold text-secondary">
                  {stats?.totalDeposits.approved || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Rejected</span>
                <span className="text-lg font-bold text-neutral-500">
                  {stats?.totalDeposits.rejected || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Withdrawals Stats */}
          <div className="card">
            <h3 className="text-base font-bold text-neutral-900 mb-4">Withdrawal Statistics</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Pending</span>
                <span className="text-lg font-bold text-yellow-600">
                  {stats?.totalWithdrawals.pending || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Approved</span>
                <span className="text-lg font-bold text-secondary">
                  {stats?.totalWithdrawals.approved || 0}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-neutral-600">Rejected</span>
                <span className="text-lg font-bold text-neutral-500">
                  {stats?.totalWithdrawals.rejected || 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
