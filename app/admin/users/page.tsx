'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

interface User {
  id: number;
  name: string;
  phone: string;
  password: string;
  referralCode: string;
  rechargeBalance: number;
  incomeBalance: number;
  totalWithdraw: number;
  isBlocked: boolean;
  createdAt: string;
  activePlansCount: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'active' | 'blocked'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (data.success) {
        setUsers(data.data.users);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUnblock = async (userId: number, currentStatus: boolean) => {
    const action = currentStatus ? 'unblock' : 'block';
    const confirmed = window.confirm(
      `Are you sure you want to ${action} this user? ${
        !currentStatus ? '\n\nBlocking will:\n- Stop user login\n- Cancel all active plans\n- Stop daily income' : ''
      }`
    );

    if (!confirmed) return;

    try {
      const response = await fetch('/api/admin/users/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, block: !currentStatus }),
      });

      const data = await response.json();
      if (data.success) {
        alert(`User ${action}ed successfully!`);
        fetchUsers();
      } else {
        alert(data.error || `Failed to ${action} user`);
      }
    } catch (error) {
      console.error('Block/Unblock error:', error);
      alert('Something went wrong. Please try again.');
    }
  };

  const filteredUsers = users
    .filter((user) => {
      if (filter === 'active') return !user.isBlocked;
      if (filter === 'blocked') return user.isBlocked;
      return true;
    })
    .filter((user) => {
      if (!searchQuery) return true;
      return (
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.phone.includes(searchQuery)
      );
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/admin/dashboard">
            <button className="text-white hover:opacity-80">← Back</button>
          </Link>
          <div>
            <h1 className="text-xl font-bold">User Management</h1>
            <p className="text-sm text-white/80">View and manage all users</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Search & Filter */}
        <div className="card">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <input
                type="text"
                className="input-field"
                placeholder="Search by name or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2">
              {(['all', 'active', 'blocked'] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setFilter(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    filter === tab
                      ? 'bg-primary text-white'
                      : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Users Count */}
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">
            📊 Showing <strong>{filteredUsers.length}</strong> of <strong>{users.length}</strong> users
          </p>
        </div>

        {/* Users List */}
        {filteredUsers.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-3">👥</div>
            <p className="text-neutral-600">No users found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredUsers.map((user) => (
              <div key={user.id} className="card hover:shadow-md transition-shadow">
                {/* User Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">{user.name}</h3>
                    <p className="text-sm text-neutral-600">📱 {user.phone}</p>
                    <p className="text-sm text-neutral-600">
                      🔑 Password: <span className="font-mono font-medium text-primary">{user.password}</span>
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Joined: {formatDate(user.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span
                      className={`text-xs px-3 py-1 rounded-full font-medium ${
                        user.isBlocked
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}
                    >
                      {user.isBlocked ? '🔒 Blocked' : '✅ Active'}
                    </span>
                    <p className="text-xs text-neutral-500 mt-2">ID: {user.id}</p>
                  </div>
                </div>

                {/* Wallet Info */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                    <p className="text-xs text-neutral-600">Recharge Balance</p>
                    <p className="text-base font-bold text-primary mt-1">
                      {formatCurrency(user.rechargeBalance)}
                    </p>
                  </div>
                  <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                    <p className="text-xs text-green-700">Income Balance</p>
                    <p className="text-base font-bold text-secondary mt-1">
                      {formatCurrency(user.incomeBalance)}
                    </p>
                  </div>
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700">Total Withdrawn</p>
                    <p className="text-base font-bold text-blue-900 mt-1">
                      {formatCurrency(user.totalWithdraw)}
                    </p>
                  </div>
                </div>

                {/* Stats & Actions */}
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 pt-3 border-t border-neutral-200">
                  <div className="flex flex-wrap gap-4 text-sm">
                    <span className="text-neutral-600">
                      📊 <strong>{user.activePlansCount}</strong> active plans
                    </span>
                    <span className="text-neutral-600">
                      🔗 Referral: <strong>{user.referralCode}</strong>
                    </span>
                  </div>

                  {/* Block/Unblock Button */}
                  <button
                    onClick={() => handleBlockUnblock(user.id, user.isBlocked)}
                    className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors ${
                      user.isBlocked
                        ? 'bg-secondary text-white hover:bg-green-600'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                  >
                    {user.isBlocked ? 'Unblock User' : 'Block User'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
