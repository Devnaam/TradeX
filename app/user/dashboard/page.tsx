'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';

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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-foreground font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Sticky Header - Updated to match deposit page style */}
      <div className="sticky top-0 z-50 bg-emerald-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center text-white font-bold text-lg shadow-md border-2 border-white/30">
                {data.user.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-base font-bold text-white leading-tight">
                  {data.user.name}
                </h1>
                <p className="text-xs text-white/80">{data.user.phone}</p>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-bold text-white hover:text-white hover:bg-white/20 border-2 border-white/30 rounded-button transition-all"
            >
              <span className="hidden sm:inline">Logout</span>
              <span className="sm:hidden">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Wallet Card - Hero Section with gradient */}
        <div className="card !p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0 shadow-xl">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              MY WALLET
            </h2>
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center border-2 border-white/30">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          {/* Wallet Balances */}
          <div className="space-y-3">
            <div className="bg-white/10 rounded-lg p-3 border-2 border-white/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/90 font-medium">Total Recharge</span>
                <span className="text-xl font-bold">{formatCurrency(data.wallet.rechargeBalance)}</span>
              </div>
            </div>

            <div className="bg-white/10 rounded-lg p-3 border-2 border-white/20">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/90 font-medium">Total Withdraw</span>
                <span className="text-xl font-bold">{formatCurrency(data.wallet.totalWithdraw)}</span>
              </div>
            </div>

            <div className="bg-white rounded-lg p-4 border-2 border-white shadow-md">
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-emerald-600">Available Income</span>
                <span className="text-2xl font-bold text-emerald-600">{formatCurrency(data.wallet.incomeBalance)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Link href="/user/deposit" className="block">
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 px-6 rounded-button transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              <span>Recharge</span>
            </button>
          </Link>
          
          <Link href="/user/withdraw" className="block">
            <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 px-6 rounded-button transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Withdraw</span>
            </button>
          </Link>
          
          <Link href="/user/plans" className="block">
            <button className="w-full bg-white hover:bg-neutral-50 text-emerald-600 font-bold h-14 px-6 rounded-button border-2 border-emerald-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Plans</span>
            </button>
          </Link>
          
          <Link href="/user/referrals" className="block">
            <button className="w-full bg-white hover:bg-neutral-50 text-emerald-600 font-bold h-14 px-6 rounded-button border-2 border-emerald-600 transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span>Referral</span>
            </button>
          </Link>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="card text-center !p-5 border-2 border-neutral-200 shadow-lg hover:border-emerald-600 transition-all">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-emerald-50 flex items-center justify-center border-2 border-emerald-200">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-emerald-600 mb-1">{data.stats.activePlans}</p>
            <p className="text-sm text-neutral-600 font-medium">Active Plans</p>
          </div>

          <div className="card text-center !p-5 border-2 border-neutral-200 shadow-lg hover:border-emerald-600 transition-all">
            <div className="w-12 h-12 mx-auto mb-3 rounded-lg bg-emerald-50 flex items-center justify-center border-2 border-emerald-200">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-3xl font-bold text-emerald-600 mb-1">{data.stats.totalReferrals}</p>
            <p className="text-sm text-neutral-600 font-medium">Total Referrals</p>
          </div>
        </div>

        {/* Quick Access Grid */}
        <div className="card !p-6 border-2 border-neutral-200 shadow-lg">
          <h3 className="text-base font-bold mb-4 flex items-center gap-2 text-foreground">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Access
          </h3>
          
          <div className="grid grid-cols-3 gap-3">
            <Link href="/user/deposit/history" className="block group">
              <div className="p-4 bg-background hover:bg-emerald-50 border-2 border-neutral-200 hover:border-emerald-600 rounded-lg text-center transition-all">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💰</div>
                <p className="text-xs font-medium text-foreground leading-tight">Recharge<br/>Record</p>
              </div>
            </Link>

            <Link href="/user/withdraw/history" className="block group">
              <div className="p-4 bg-background hover:bg-emerald-50 border-2 border-neutral-200 hover:border-emerald-600 rounded-lg text-center transition-all">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💸</div>
                <p className="text-xs font-medium text-foreground leading-tight">Withdraw<br/>Record</p>
              </div>
            </Link>

            <Link href="/user/investments" className="block group">
              <div className="p-4 bg-background hover:bg-emerald-50 border-2 border-neutral-200 hover:border-emerald-600 rounded-lg text-center transition-all">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">📊</div>
                <p className="text-xs font-medium text-foreground leading-tight">My<br/>Investment</p>
              </div>
            </Link>

            <Link href="/user/bank" className="block group">
              <div className="p-4 bg-background hover:bg-emerald-50 border-2 border-neutral-200 hover:border-emerald-600 rounded-lg text-center transition-all">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🏦</div>
                <p className="text-xs font-medium text-foreground leading-tight">My<br/>Bank</p>
              </div>
            </Link>

            <Link href="/user/referrals" className="block group">
              <div className="p-4 bg-background hover:bg-emerald-50 border-2 border-neutral-200 hover:border-emerald-600 rounded-lg text-center transition-all">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">🔗</div>
                <p className="text-xs font-medium text-foreground leading-tight">Referrals<br/>Network</p>
              </div>
            </Link>

            <Link href="/user/support" className="block group">
              <div className="p-4 bg-background hover:bg-emerald-50 border-2 border-neutral-200 hover:border-emerald-600 rounded-lg text-center transition-all">
                <div className="text-3xl mb-2 group-hover:scale-110 transition-transform">💬</div>
                <p className="text-xs font-medium text-foreground leading-tight">Support<br/>24/7</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Referral Code Card */}
        <div className="card !p-6 bg-gradient-to-br from-emerald-600 to-emerald-700 text-white border-0 shadow-xl">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-lg bg-white/20 flex items-center justify-center border-2 border-white/30">
              <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
              </svg>
            </div>
            
            <p className="text-sm text-white/90 mb-2 font-bold">Your Referral Code</p>
            <div className="bg-white/20 rounded-lg px-6 py-3 mb-3 inline-block border-2 border-white/30">
              <p className="text-3xl font-bold tracking-wider">{data.user.referralCode}</p>
            </div>
            
            <div className="bg-white/10 rounded-lg p-3 mb-4 border-2 border-white/20">
              <p className="text-sm text-white/90 flex items-center justify-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <strong>Earn 10% commission</strong> on every deposit!
              </p>
            </div>
            
            <button
              onClick={handleCopyReferralLink}
              className="w-full bg-white text-emerald-600 hover:bg-white/90 font-bold h-12 px-6 rounded-button transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Referral Link
            </button>
          </div>
        </div>
      </div>

      <Footer />
      <BottomNav />
    </div>
  );
}
