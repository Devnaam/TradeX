'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Deposit {
  id: number;
  amount: number;
  utrNumber: string;
  screenshotUrl: string;
  status: string;
  adminRemark: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
    phone: string;
  };
}

export default function AdminDepositsPage() {
  const router = useRouter();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [remarkModal, setRemarkModal] = useState<{
    depositId: number;
    action: 'approve' | 'reject';
    remark: string;
  } | null>(null);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/deposits');
      const data = await response.json();
      if (data.success) {
        setDeposits(data.data.deposits);
      }
    } catch (error) {
      console.error('Failed to fetch deposits:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (depositId: number, action: 'approve' | 'reject') => {
    const remark = remarkModal?.remark || '';

    if (action === 'reject' && !remark.trim()) {
      alert('Remark is required for rejection');
      return;
    }

    setActionLoading(depositId);

    try {
      const response = await fetch('/api/admin/deposits/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ depositId, action, remark }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Deposit ${action}d successfully!`);
        setRemarkModal(null);
        fetchDeposits();
      } else {
        alert(data.error || `Failed to ${action} deposit`);
      }
    } catch (error) {
      console.error(`${action} deposit error:`, error);
      alert('Something went wrong. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const openRemarkModal = (depositId: number, action: 'approve' | 'reject') => {
    setRemarkModal({ depositId, action, remark: '' });
  };

  const filteredDeposits = deposits.filter((deposit) => {
    if (filter === 'all') return true;
    return deposit.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading deposits...</p>
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
            <h1 className="text-xl font-bold">Deposit Management</h1>
            <p className="text-sm text-white/80">Approve or reject deposit requests</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 space-y-4">
        {/* Filter Tabs */}
        <div className="card">
          <div className="flex gap-2 overflow-x-auto">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize whitespace-nowrap ${
                  filter === tab
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                }`}
              >
                {tab} ({deposits.filter((d) => tab === 'all' || d.status === tab).length})
              </button>
            ))}
          </div>
        </div>

        {/* Deposits Count */}
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">
            💰 Showing <strong>{filteredDeposits.length}</strong> deposit requests
          </p>
        </div>

        {/* Deposits List */}
        {filteredDeposits.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-3">💰</div>
            <p className="text-neutral-600">No deposits found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDeposits.map((deposit) => (
              <div key={deposit.id} className="card hover:shadow-md transition-shadow">
                {/* Deposit Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">{deposit.user.name}</h3>
                    <p className="text-sm text-neutral-600">📱 {deposit.user.phone}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Requested: {formatDate(deposit.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getStatusColor(deposit.status)}`}>
                      {deposit.status.toUpperCase()}
                    </span>
                    <p className="text-xs text-neutral-500 mt-2">ID: {deposit.id}</p>
                  </div>
                </div>

                {/* Deposit Details */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                    <p className="text-xs text-blue-700">Amount</p>
                    <p className="text-lg font-bold text-primary mt-1">
                      {formatCurrency(deposit.amount)}
                    </p>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                    <p className="text-xs text-neutral-600">UTR Number</p>
                    <p className="text-sm font-bold text-neutral-900 mt-1">{deposit.utrNumber}</p>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 col-span-2">
                    <p className="text-xs text-neutral-600 mb-2">Payment Screenshot</p>
                    <a
                      href={deposit.screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:underline font-medium"
                    >
                      📷 View Screenshot →
                    </a>
                  </div>
                </div>

                {/* Admin Remark (if exists) */}
                {deposit.adminRemark && (
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 mb-4">
                    <p className="text-xs text-neutral-600 font-medium mb-1">Admin Remark:</p>
                    <p className="text-sm text-neutral-700">{deposit.adminRemark}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {deposit.status === 'pending' && (
                  <div className="flex gap-3 pt-3 border-t border-neutral-200">
                    <button
                      onClick={() => openRemarkModal(deposit.id, 'approve')}
                      className="flex-1 bg-secondary text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                      disabled={actionLoading === deposit.id}
                    >
                      {actionLoading === deposit.id ? 'Processing...' : '✓ Approve'}
                    </button>
                    <button
                      onClick={() => openRemarkModal(deposit.id, 'reject')}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                      disabled={actionLoading === deposit.id}
                    >
                      {actionLoading === deposit.id ? 'Processing...' : '✗ Reject'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Remark Modal */}
      {remarkModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              {remarkModal.action === 'approve' ? 'Approve Deposit' : 'Reject Deposit'}
            </h3>
            <textarea
              className="input-field min-h-24"
              placeholder={
                remarkModal.action === 'approve'
                  ? 'Add remark (optional)'
                  : 'Add rejection reason (required)'
              }
              value={remarkModal.remark}
              onChange={(e) => setRemarkModal({ ...remarkModal, remark: e.target.value })}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setRemarkModal(null)}
                className="flex-1 bg-neutral-200 text-neutral-700 px-4 py-2 rounded-lg font-medium hover:bg-neutral-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApproveReject(remarkModal.depositId, remarkModal.action)}
                className={`flex-1 px-4 py-2 rounded-lg font-medium text-white transition-colors ${
                  remarkModal.action === 'approve'
                    ? 'bg-secondary hover:bg-green-600'
                    : 'bg-red-600 hover:bg-red-700'
                }`}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
