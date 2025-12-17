'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';

interface Withdrawal {
  id: number;
  amount: number;
  method: string;
  status: string;
  adminRemark: string | null;
  createdAt: string;
  user: {
    id: number;
    name: string;
    phone: string;
  };
  bankDetails: {
    bankName: string | null;
    accountHolderName: string | null;
    accountNumber: string | null;
    ifscCode: string | null;
    upiId: string | null;
  } | null;
}

export default function AdminWithdrawalsPage() {
  const router = useRouter();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [remarkModal, setRemarkModal] = useState<{
    withdrawalId: number;
    action: 'approve' | 'reject';
    remark: string;
  } | null>(null);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const fetchWithdrawals = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/admin/withdrawals');
      const data = await response.json();
      if (data.success) {
        setWithdrawals(data.data.withdrawals);
      }
    } catch (error) {
      console.error('Failed to fetch withdrawals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApproveReject = async (withdrawalId: number, action: 'approve' | 'reject') => {
    const remark = remarkModal?.remark || '';

    if (action === 'reject' && !remark.trim()) {
      alert('Remark is required for rejection');
      return;
    }

    setActionLoading(withdrawalId);

    try {
      const response = await fetch('/api/admin/withdrawals/action', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ withdrawalId, action, remark }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`Withdrawal ${action}d successfully!`);
        setRemarkModal(null);
        fetchWithdrawals();
      } else {
        alert(data.error || `Failed to ${action} withdrawal`);
      }
    } catch (error) {
      console.error(`${action} withdrawal error:`, error);
      alert('Something went wrong. Please try again.');
    } finally {
      setActionLoading(null);
    }
  };

  const openRemarkModal = (withdrawalId: number, action: 'approve' | 'reject') => {
    setRemarkModal({ withdrawalId, action, remark: '' });
  };

  const filteredWithdrawals = withdrawals.filter((withdrawal) => {
    if (filter === 'all') return true;
    return withdrawal.status === filter;
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
          <p className="mt-4 text-neutral-600">Loading withdrawals...</p>
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
            <h1 className="text-xl font-bold">Withdrawal Management</h1>
            <p className="text-sm text-white/80">Approve or reject withdrawal requests</p>
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
                {tab} ({withdrawals.filter((w) => tab === 'all' || w.status === tab).length})
              </button>
            ))}
          </div>
        </div>

        {/* Withdrawals Count */}
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">
            💸 Showing <strong>{filteredWithdrawals.length}</strong> withdrawal requests
          </p>
        </div>

        {/* Withdrawals List */}
        {filteredWithdrawals.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-3">💸</div>
            <p className="text-neutral-600">No withdrawals found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredWithdrawals.map((withdrawal) => (
              <div key={withdrawal.id} className="card hover:shadow-md transition-shadow">
                {/* Withdrawal Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-neutral-900">{withdrawal.user.name}</h3>
                    <p className="text-sm text-neutral-600">📱 {withdrawal.user.phone}</p>
                    <p className="text-xs text-neutral-500 mt-1">
                      Requested: {formatDate(withdrawal.createdAt)}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getStatusColor(withdrawal.status)}`}>
                      {withdrawal.status.toUpperCase()}
                    </span>
                    <p className="text-xs text-neutral-500 mt-2">ID: {withdrawal.id}</p>
                  </div>
                </div>

                {/* Withdrawal Details */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <p className="text-xs text-orange-700">Withdrawal Amount</p>
                    <p className="text-lg font-bold text-orange-900 mt-1">
                      {formatCurrency(withdrawal.amount)}
                    </p>
                  </div>
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                    <p className="text-xs text-neutral-600">Method</p>
                    <p className="text-sm font-bold text-neutral-900 mt-1 capitalize">
                      {withdrawal.method}
                    </p>
                  </div>
                </div>

                {/* Bank Details */}
                {withdrawal.bankDetails && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200 mb-4">
                    <p className="text-sm font-bold text-blue-900 mb-3">Bank Details:</p>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {withdrawal.method === 'upi' && withdrawal.bankDetails.upiId && (
                        <div className="col-span-2">
                          <p className="text-xs text-blue-700">UPI ID:</p>
                          <p className="font-medium text-blue-900">{withdrawal.bankDetails.upiId}</p>
                        </div>
                      )}
                      {withdrawal.method === 'bank' && (
                        <>
                          {withdrawal.bankDetails.bankName && (
                            <div>
                              <p className="text-xs text-blue-700">Bank Name:</p>
                              <p className="font-medium text-blue-900">{withdrawal.bankDetails.bankName}</p>
                            </div>
                          )}
                          {withdrawal.bankDetails.accountHolderName && (
                            <div>
                              <p className="text-xs text-blue-700">Account Holder:</p>
                              <p className="font-medium text-blue-900">{withdrawal.bankDetails.accountHolderName}</p>
                            </div>
                          )}
                          {withdrawal.bankDetails.accountNumber && (
                            <div>
                              <p className="text-xs text-blue-700">Account Number:</p>
                              <p className="font-medium text-blue-900">{withdrawal.bankDetails.accountNumber}</p>
                            </div>
                          )}
                          {withdrawal.bankDetails.ifscCode && (
                            <div>
                              <p className="text-xs text-blue-700">IFSC Code:</p>
                              <p className="font-medium text-blue-900">{withdrawal.bankDetails.ifscCode}</p>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}

                {/* Admin Remark (if exists) */}
                {withdrawal.adminRemark && (
                  <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200 mb-4">
                    <p className="text-xs text-neutral-600 font-medium mb-1">Admin Remark:</p>
                    <p className="text-sm text-neutral-700">{withdrawal.adminRemark}</p>
                  </div>
                )}

                {/* Action Buttons */}
                {withdrawal.status === 'pending' && (
                  <div className="flex gap-3 pt-3 border-t border-neutral-200">
                    <button
                      onClick={() => openRemarkModal(withdrawal.id, 'approve')}
                      className="flex-1 bg-secondary text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
                      disabled={actionLoading === withdrawal.id}
                    >
                      {actionLoading === withdrawal.id ? 'Processing...' : '✓ Approve & Transfer'}
                    </button>
                    <button
                      onClick={() => openRemarkModal(withdrawal.id, 'reject')}
                      className="flex-1 bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 transition-colors"
                      disabled={actionLoading === withdrawal.id}
                    >
                      {actionLoading === withdrawal.id ? 'Processing...' : '✗ Reject'}
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
              {remarkModal.action === 'approve' ? 'Approve Withdrawal' : 'Reject Withdrawal'}
            </h3>
            {remarkModal.action === 'approve' && (
              <div className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg mb-4">
                <p className="text-sm text-yellow-800">
                  ⚠️ Make sure you have manually transferred the money to the user's bank/UPI before approving.
                </p>
              </div>
            )}
            <textarea
              className="input-field min-h-24"
              placeholder={
                remarkModal.action === 'approve'
                  ? 'Add remark (e.g., "Transferred to UPI")'
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
                onClick={() => handleApproveReject(remarkModal.withdrawalId, remarkModal.action)}
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
