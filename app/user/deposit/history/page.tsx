'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface Deposit {
  id: number;
  amount: number;
  utrNumber: string;
  screenshotUrl: string;
  status: string;
  adminRemark: string | null;
  createdAt: string;
}

export default function DepositHistoryPage() {
  const router = useRouter();
  const [deposits, setDeposits] = useState<Deposit[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');

  // Resubmit modal state
  const [resubmitModal, setResubmitModal] = useState<{
    show: boolean;
    depositId: number | null;
    amount: number;
  }>({
    show: false,
    depositId: null,
    amount: 0,
  });
  const [resubmitData, setResubmitData] = useState({
    utrNumber: '',
    screenshot: null as File | null,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchDeposits();
  }, []);

  const fetchDeposits = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/deposit/history', {
        headers: {
          'x-user-id': user.id.toString(),
        },
      });

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

  const handleResubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);

    const userData = localStorage.getItem('user');
    if (!userData) return;

    const user = JSON.parse(userData);

    try {
      const formData = new FormData();
      formData.append('depositId', resubmitModal.depositId!.toString());
      formData.append('utrNumber', resubmitData.utrNumber);
      if (resubmitData.screenshot) {
        formData.append('screenshot', resubmitData.screenshot);
      }

      const response = await fetch('/api/user/deposit/resubmit', {
        method: 'POST',
        headers: {
          'x-user-id': user.id.toString(),
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Deposit resubmitted successfully! Waiting for admin approval.');
        setResubmitModal({ show: false, depositId: null, amount: 0 });
        setResubmitData({ utrNumber: '', screenshot: null });
        fetchDeposits(); // Refresh list
      } else {
        alert(data.error || 'Failed to resubmit');
      }
    } catch (error) {
      console.error('Resubmit error:', error);
      alert('Something went wrong. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const filteredDeposits = deposits.filter((deposit) => {
    if (filter === 'all') return true;
    return deposit.status === filter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'pending':
        return 'bg-neutral-100 text-neutral-700 border-neutral-200';
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
          <h1 className="text-lg font-semibold">Recharge History</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 pb-20 space-y-4">
        {/* Filter Tabs */}
        <div className="card p-2">
          <div className="grid grid-cols-4 gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`py-2 px-2 rounded-lg text-xs md:text-sm font-medium transition-colors capitalize ${
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

        {/* Deposits List */}
        {filteredDeposits.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-neutral-600 mb-2">
              {filter === 'all' ? 'No recharge records found' : `No ${filter} deposits`}
            </p>
            <Link href="/user/deposit">
              <button className="btn-primary mt-4">Make a Recharge</button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredDeposits.map((deposit) => (
              <div key={deposit.id} className="card">
                {/* Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="text-xl font-bold text-primary">
                      {formatCurrency(deposit.amount)}
                    </p>
                    <p className="text-xs text-neutral-500 mt-1">
                      {formatDateTime(deposit.createdAt)}
                    </p>
                  </div>
                  <span
                    className={`text-xs px-3 py-1 rounded-full font-medium capitalize border ${getStatusColor(
                      deposit.status
                    )}`}
                  >
                    {deposit.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">UTR Number:</span>
                    <span className="font-medium font-mono">{deposit.utrNumber}</span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-neutral-600">Screenshot:</span>
                    <a
                      href={deposit.screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary text-xs hover:underline"
                    >
                      View Image
                    </a>
                  </div>

                  {/* Admin Remark */}
                  {deposit.adminRemark && (
                    <div className="pt-2 border-t border-neutral-200">
                      <p className="text-xs text-neutral-600 mb-1">Admin Remark:</p>
                      <p className="text-sm text-neutral-800 bg-neutral-50 p-2 rounded">
                        {deposit.adminRemark}
                      </p>
                    </div>
                  )}

                  {/* Resubmit Button for Rejected Deposits */}
                  {deposit.status === 'rejected' && (
                    <button
                      onClick={() =>
                        setResubmitModal({
                          show: true,
                          depositId: deposit.id,
                          amount: deposit.amount,
                        })
                      }
                      className="w-full bg-blue-50 text-primary border border-blue-200 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition-colors mt-2"
                    >
                      🔄 Resubmit Deposit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Resubmit Modal */}
      {resubmitModal.show && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-bold text-neutral-900 mb-2">Resubmit Deposit</h3>
            <p className="text-sm text-neutral-600 mb-4">
              Amount: <span className="font-bold text-primary">{formatCurrency(resubmitModal.amount)}</span>
            </p>

            <form onSubmit={handleResubmit} className="space-y-4">
              {/* Info */}
              <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  ℹ️ Previous deposit was rejected. Please submit new payment details with correct information.
                </p>
              </div>

              {/* New UTR Number */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  New UTR Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter new UTR number"
                  value={resubmitData.utrNumber}
                  onChange={(e) =>
                    setResubmitData({ ...resubmitData, utrNumber: e.target.value })
                  }
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  UTR/Transaction ID from your payment app
                </p>
              </div>

              {/* New Screenshot */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  New Payment Screenshot <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  className="input-field"
                  accept="image/*"
                  onChange={(e) =>
                    setResubmitData({
                      ...resubmitData,
                      screenshot: e.target.files?.[0] || null,
                    })
                  }
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  JPG, PNG (Max 5MB)
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setResubmitModal({ show: false, depositId: null, amount: 0 });
                    setResubmitData({ utrNumber: '', screenshot: null });
                  }}
                  className="flex-1 bg-neutral-200 text-neutral-700 px-4 py-3 rounded-lg font-medium hover:bg-neutral-300 transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 btn-primary"
                >
                  {uploading ? 'Submitting...' : 'Resubmit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
