'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';


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
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/user/dashboard">
            <button className="text-white hover:opacity-80">← Back</button>
          </Link>
          <h1 className="text-lg font-semibold">My Profile</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Profile Header */}
        <div className="card text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-primary text-white rounded-full text-3xl font-bold mb-3">
            {profile.name.charAt(0).toUpperCase()}
          </div>
          <h2 className="text-xl font-bold text-neutral-900">{profile.name}</h2>
          <p className="text-sm text-neutral-600">📱 {profile.phone}</p>
          <p className="text-xs text-neutral-500 mt-2">
            Member since {formatDate(profile.createdAt)}
          </p>
        </div>

        {/* Account Info */}
        <div className="card">
          <h3 className="text-base font-bold text-neutral-900 mb-4">Account Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-sm text-neutral-600">User ID</span>
              <span className="text-sm font-medium text-neutral-900">#{profile.id}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-sm text-neutral-600">Phone Number</span>
              <span className="text-sm font-medium text-neutral-900">{profile.phone}</span>
            </div>
            <div className="flex justify-between items-center pb-3 border-b border-neutral-200">
              <span className="text-sm text-neutral-600">Referral Code</span>
              <span className="text-sm font-mono font-bold text-primary">
                {profile.referralCode}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-neutral-600">Joined On</span>
              <span className="text-sm font-medium text-neutral-900">
                {formatDate(profile.createdAt)}
              </span>
            </div>
          </div>
        </div>

        {/* Wallet Summary */}
        <div className="card">
          <h3 className="text-base font-bold text-neutral-900 mb-4">Wallet Summary</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="text-center bg-blue-50 p-3 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700 mb-1">Recharge</p>
              <p className="text-base font-bold text-primary">₹{profile.rechargeBalance}</p>
            </div>
            <div className="text-center bg-green-50 p-3 rounded-lg border border-green-200">
              <p className="text-xs text-green-700 mb-1">Income</p>
              <p className="text-base font-bold text-secondary">₹{profile.incomeBalance}</p>
            </div>
            <div className="text-center bg-neutral-50 p-3 rounded-lg border border-neutral-200">
              <p className="text-xs text-neutral-600 mb-1">Withdrawn</p>
              <p className="text-base font-bold text-neutral-900">₹{profile.totalWithdraw}</p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h3 className="text-base font-bold text-neutral-900 mb-4">Quick Actions</h3>
          <div className="space-y-2">
            <Link href="/user/bank">
              <button className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-900 px-4 py-3 rounded-lg text-left font-medium transition-colors flex items-center justify-between">
                <span>🏦 Bank Details</span>
                <span className="text-neutral-400">→</span>
              </button>
            </Link>
            <Link href="/user/change-password">
              <button className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-900 px-4 py-3 rounded-lg text-left font-medium transition-colors flex items-center justify-between">
                <span>🔒 Change Password</span>
                <span className="text-neutral-400">→</span>
              </button>
            </Link>
            <Link href="/user/referrals">
              <button className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-900 px-4 py-3 rounded-lg text-left font-medium transition-colors flex items-center justify-between">
                <span>🔗 My Referrals</span>
                <span className="text-neutral-400">→</span>
              </button>
            </Link>
            <Link href="/user/support">
              <button className="w-full bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-900 px-4 py-3 rounded-lg text-left font-medium transition-colors flex items-center justify-between">
                <span>💬 Support</span>
                <span className="text-neutral-400">→</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="w-full bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 px-4 py-3 rounded-lg font-medium transition-colors"
        >
          🚪 Logout
        </button>

        {/* App Version */}
        <div className="text-center">
          <p className="text-xs text-neutral-500">TradeX Platform v1.0</p>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
