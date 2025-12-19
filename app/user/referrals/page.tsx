'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';


interface ReferralData {
  referralCode: string;
  referralLink: string;
  totalReferrals: number;
  totalReferralIncome: number;
  referredUsers: {
    id: number;
    name: string;
    phone: string;
    joinDate: string;
    totalDeposits: number;
    commissionEarned: number;
  }[];
}

export default function UserReferralsPage() {
  const router = useRouter();
  const [data, setData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/referrals', {
        headers: {
          'x-user-id': user.id.toString(),
        },
      });

      const result = await response.json();
      if (result.success) {
        setData(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch referral data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    if (data) {
      navigator.clipboard.writeText(data.referralLink);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
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

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/user/dashboard">
            <button className="text-white hover:opacity-80">← Back</button>
          </Link>
          <h1 className="text-lg font-semibold">Referrals</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Referral Link Card */}
        <div className="card">
          <h3 className="text-lg font-bold text-neutral-900 mb-3">Your Referral Link</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={data?.referralLink || ''}
              readOnly
              className="input-field flex-1 font-mono text-sm bg-neutral-50"
            />
            <button
              onClick={handleCopyLink}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                copySuccess
                  ? 'bg-secondary text-white'
                  : 'bg-primary text-white hover:bg-blue-700'
              }`}
            >
              {copySuccess ? '✓ Copied!' : 'Copy'}
            </button>
          </div>
          <p className="text-xs text-neutral-600 mt-2">
            💡 Share this link with friends. You'll earn 10% commission on their deposits!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Referrals */}
          <div className="card bg-blue-50 border-blue-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">👥</span>
              <p className="text-sm text-blue-700 font-medium">Total Referrals</p>
            </div>
            <p className="text-3xl font-bold text-blue-900">{data?.totalReferrals || 0}</p>
            <p className="text-xs text-blue-600 mt-1">Friends joined</p>
          </div>

          {/* Referral Income */}
          <div className="card bg-green-50 border-green-200">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">💰</span>
              <p className="text-sm text-green-700 font-medium">Referral Income</p>
            </div>
            <p className="text-3xl font-bold text-secondary">
              {formatCurrency(data?.totalReferralIncome || 0)}
            </p>
            <p className="text-xs text-green-600 mt-1">Total earned</p>
          </div>
        </div>

        {/* How it Works */}
        <div className="card bg-yellow-50 border-yellow-200">
          <h3 className="text-sm font-bold text-yellow-900 mb-2">💡 How Referral Works</h3>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• Share your referral link with friends</li>
            <li>• When they register and make a deposit</li>
            <li>• You earn 10% commission immediately after admin approval</li>
            <li>• Commission is added to your Income Balance (withdrawable)</li>
          </ul>
        </div>

        {/* Referred Users List */}
        <div className="card">
          <h3 className="text-lg font-bold text-neutral-900 mb-4">
            Referred Users ({data?.referredUsers.length || 0})
          </h3>

          {!data?.referredUsers || data.referredUsers.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">🔗</div>
              <p className="text-neutral-600">No referrals yet</p>
              <p className="text-sm text-neutral-500 mt-2">
                Share your referral link to start earning!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {data.referredUsers.map((user) => (
                <div
                  key={user.id}
                  className="bg-neutral-50 p-4 rounded-lg border border-neutral-200"
                >
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-bold text-neutral-900">{user.name}</h4>
                      <p className="text-sm text-neutral-600">📱 {user.phone}</p>
                      <p className="text-xs text-neutral-500 mt-1">
                        Joined: {formatDate(user.joinDate)}
                      </p>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                      Active
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white p-2 rounded border border-neutral-200">
                      <p className="text-xs text-neutral-600">Total Deposits</p>
                      <p className="text-base font-bold text-primary">
                        {formatCurrency(user.totalDeposits)}
                      </p>
                    </div>
                    <div className="bg-green-50 p-2 rounded border border-green-200">
                      <p className="text-xs text-green-700">Your Commission</p>
                      <p className="text-base font-bold text-secondary">
                        {formatCurrency(user.commissionEarned)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}
