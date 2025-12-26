'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';

interface UserProfile {
  id: number;
  name: string;
  phone: string;
  referralCode: string;
  createdAt: string;
  rechargeBalance: number;
  incomeBalance: number;
  totalWithdraw: number;
}

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/profile', {
        headers: {
          'x-user-id': user.id.toString(),
        },
      });

      const data = await response.json();
      if (data.success) {
        setProfile(data.data.profile);
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('auth-token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-foreground font-medium">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <h1 className="text-lg font-bold">My Profile</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Profile Header Card */}
        <div className="card !p-8 text-center border-2 border-neutral-200 shadow-lg">
          <div className="inline-flex items-center justify-center w-24 h-24 bg-emerald-600 text-white rounded-full text-4xl font-bold mb-4 shadow-lg">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">{profile.name}</h2>
          <div className="flex items-center justify-center gap-2 text-neutral-600 mb-3">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="font-medium">{profile.phone}</span>
          </div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-background rounded-lg">
            <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span className="text-sm text-neutral-600">Member since {formatDate(profile.createdAt)}</span>
          </div>
        </div>

        {/* Account Information */}
        <div className="card !p-6 border-2 border-neutral-200">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
            </svg>
            Account Information
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center py-3 border-b border-neutral-200">
              <span className="text-sm text-neutral-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                User ID
              </span>
              <span className="text-sm font-bold text-foreground">#{profile.id}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-neutral-200">
              <span className="text-sm text-neutral-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Phone Number
              </span>
              <span className="text-sm font-bold text-foreground">{profile.phone}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-neutral-200">
              <span className="text-sm text-neutral-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Referral Code
              </span>
              <span className="text-sm font-mono font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded">
                {profile.referralCode}
              </span>
            </div>
            <div className="flex justify-between items-center py-3">
              <span className="text-sm text-neutral-600 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Joined On
              </span>
              <span className="text-sm font-bold text-foreground">
                {formatDate(profile.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Wallet Summary */}
        <div className="card !p-6 border-2 border-neutral-200">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            Wallet Summary
          </h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center bg-emerald-50 p-4 rounded-lg border-2 border-emerald-200">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-emerald-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <p className="text-xs text-neutral-600 mb-1 font-medium">Recharge</p>
              <p className="text-lg font-bold text-emerald-600">₹{profile.rechargeBalance}</p>
            </div>
            <div className="text-center bg-green-50 p-4 rounded-lg border-2 border-green-200">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-green-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-neutral-600 mb-1 font-medium">Income</p>
              <p className="text-lg font-bold text-green-600">₹{profile.incomeBalance}</p>
            </div>
            <div className="text-center bg-background p-4 rounded-lg border-2 border-neutral-300">
              <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-neutral-200 flex items-center justify-center">
                <svg className="w-5 h-5 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-xs text-neutral-600 mb-1 font-medium">Withdrawn</p>
              <p className="text-lg font-bold text-foreground">₹{profile.totalWithdraw}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card !p-6 border-2 border-neutral-200">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link href="/user/bank">
              <button className="w-full bg-background hover:bg-white border-2 border-neutral-300 hover:border-emerald-600 text-foreground px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center justify-between group">
                <span className="flex items-center gap-3">
                  <span className="text-2xl">🏦</span>
                  <span>Bank Details</span>
                </span>
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
            <Link href="/user/change-password">
              <button className="w-full bg-background hover:bg-white border-2 border-neutral-300 hover:border-emerald-600 text-foreground px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center justify-between group">
                <span className="flex items-center gap-3">
                  <span className="text-2xl">🔒</span>
                  <span>Change Password</span>
                </span>
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
            <Link href="/user/referrals">
              <button className="w-full bg-background hover:bg-white border-2 border-neutral-300 hover:border-emerald-600 text-foreground px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center justify-between group">
                <span className="flex items-center gap-3">
                  <span className="text-2xl">🔗</span>
                  <span>My Referrals</span>
                </span>
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
            <Link href="/user/support">
              <button className="w-full bg-background hover:bg-white border-2 border-neutral-300 hover:border-emerald-600 text-foreground px-4 py-3 rounded-lg text-left font-medium transition-all flex items-center justify-between group">
                <span className="flex items-center gap-3">
                  <span className="text-2xl">💬</span>
                  <span>Support 24/7</span>
                </span>
                <svg className="w-5 h-5 text-neutral-400 group-hover:text-emerald-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </Link>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 border-2 border-red-200 hover:border-red-300 text-red-600 px-4 py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Logout
        </button>

        {/* App Version */}
        <div className="text-center">
          <p className="text-xs text-neutral-500">TradeX Platform v1.0</p>
        </div>
      </div>
      
      <Footer />
      <BottomNav />
    </div>
  );
}
