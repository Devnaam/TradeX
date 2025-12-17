'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';


interface DashboardData {
  user: {
    id: number;
    name: string;
    phone: string;
    referralCode: string;
  };
  wallet: {
    rechargeBalance: number;
    incomeBalance: number;
    totalWithdraw: number;
  };
  stats: {
    activePlans: number;
    totalReferrals: number;
    referralIncome: number;
  };
}

export default function UserDashboard() {
  const router = useRouter();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      const token = localStorage.getItem('auth-token');
      const userData = localStorage.getItem('user');

      if (!token || !userData) {
        router.push('/login');
        return;
      }

      const user = JSON.parse(userData);

      try {
        const response = await fetch('/api/user/dashboard', {
          headers: {
            'x-user-id': user.id.toString(),
          },
        });

        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          console.error('Failed to fetch dashboard:', result.error);
          if (response.status === 401) {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Dashboard fetch error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const handleCopyReferralLink = () => {
    if (data) {
      const link = `${window.location.origin}/signup?ref=${data.user.referralCode}`;
      navigator.clipboard.writeText(link);
      alert('✓ Referral link copied to clipboard!');
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

  if (!data) {
    return null;
  }

  return (

    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-lg font-semibold">Welcome, {data.user.name}!</h1>
            <p className="text-sm opacity-90">{data.user.phone}</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded-button text-sm transition-colors"
          >
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-6">
        {/* My Wallet Card */}
        <div className="card">
          <h2 className="text-section-title text-primary mb-4">MY WALLET</h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">Total Recharge:</span>
              <span className="text-amount">{formatCurrency(data.wallet.rechargeBalance)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">Total Withdraw:</span>
              <span className="text-amount">{formatCurrency(data.wallet.totalWithdraw)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
              <span className="text-base font-medium text-neutral-700">Income:</span>
              <span className="text-income text-xl">{formatCurrency(data.wallet.incomeBalance)}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <Link href="/user/deposit">
            <button className="btn-primary w-full">Recharge</button>
          </Link>
          <Link href="/user/withdraw">
            <button className="btn-primary w-full">Withdraw</button>
          </Link>
          <Link href="/user/plans">
            <button className="btn-secondary w-full">Plans</button>
          </Link>
          <Link href="/user/referrals">
            <button className="btn-secondary w-full">Referral</button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="card text-center">
            <p className="text-2xl font-bold text-primary">{data.stats.activePlans}</p>
            <p className="text-sm text-neutral-600 mt-1">Active Plans</p>
          </div>
          <div className="card text-center">
            <p className="text-2xl font-bold text-secondary">{data.stats.totalReferrals}</p>
            <p className="text-sm text-neutral-600 mt-1">Total Referrals</p>
          </div>
        </div>

        {/* Quick Access */}
        <div className="card">
          <h3 className="text-section-title mb-3">Quick Access</h3>
          <div className="grid grid-cols-2 gap-2">
            <Link
              href="/user/deposit/history"
              className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-button text-center transition-colors"
            >
              <div className="text-2xl mb-1">💰</div>
              <p className="text-xs font-medium">Recharge Record</p>
            </Link>

            <Link
              href="/user/withdraw/history"
              className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-button text-center transition-colors"
            >
              <div className="text-2xl mb-1">💸</div>
              <p className="text-xs font-medium">Withdraw Record</p>
            </Link>

            <Link
              href="/user/investments"
              className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-button text-center transition-colors"
            >
              <div className="text-2xl mb-1">📊</div>
              <p className="text-xs font-medium">My Investment</p>
            </Link>

            <Link
              href="/user/bank"
              className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-button text-center transition-colors"
            >
              <div className="text-2xl mb-1">🏦</div>
              <p className="text-xs font-medium">My Bank</p>
            </Link>

            <Link
              href="/user/referrals"
              className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-button text-center transition-colors"
            >
              <div className="text-2xl mb-1">🔗</div>
              <p className="text-xs font-medium">Referrals</p>
            </Link>

            <Link href="/user/support">
              <button className="p-3 bg-neutral-50 hover:bg-neutral-100 rounded-lg text-center transition-colors w-full">
                <div className="flex flex-col items-center gap-2">
                  <span className="text-2xl">💬</span>
                  <span className="text-sm font-medium text-neutral-900">Support</span>
                </div>
              </button>
            </Link>

          </div>
        </div>

        {/* Referral Code Card */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="text-center">
            <p className="text-sm text-neutral-600 mb-1">Your Referral Code</p>
            <p className="text-2xl font-bold text-primary mb-2">{data.user.referralCode}</p>
            <p className="text-xs text-neutral-500 mb-3">
              Earn 10% commission on every deposit!
            </p>
            <button
              onClick={handleCopyReferralLink}
              className="btn-secondary w-full"
            >
              📋 Copy Referral Link
            </button>
          </div>
        </div>
      </div>
      {/* Bottom Navigation - Mobile Only */}
      <BottomNav />
    </div>
  );
}
