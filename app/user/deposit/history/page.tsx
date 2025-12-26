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
        fetchDeposits();
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
        return 'bg-green-100 text-green-700 border-green-300';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'rejected':
        return 'bg-red-100 text-red-700 border-red-300';
      default:
        return 'bg-neutral-100 text-neutral-700 border-neutral-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return '✅';
      case 'pending':
        return '⏳';
      case 'rejected':
        return '❌';
      default:
        return '📋';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-foreground font-medium">Loading history...</p>
        </div>
      </div>
    );
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <h1 className="text-lg font-bold">Recharge History</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Filter Tabs */}
        <div className="card !p-3">
          <div className="grid grid-cols-4 gap-2">
            {(['all', 'pending', 'approved', 'rejected'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilter(tab)}
                className={`py-2.5 px-2 rounded-lg text-xs md:text-sm font-bold transition-all capitalize ${
                  filter === tab
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-background text-foreground hover:bg-neutral-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Deposits List */}
        {filteredDeposits.length === 0 ? (
          <div className="card !p-12 text-center border-2 border-neutral-200">
            <div className="text-6xl mb-4">📭</div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Records Found</h3>
            <p className="text-neutral-600 mb-6">
              {filter === 'all' ? 'No recharge records found' : `No ${filter} deposits`}
            </p>
            <Link href="/user/deposit">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 px-8 rounded-button transition-all shadow-lg hover:shadow-xl">
                Make a Recharge
              </button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredDeposits.map((deposit) => (
              <div key={deposit.id} className="card !p-5 border-2 border-neutral-200 hover:border-emerald-600/30 transition-all">
                
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <p className="text-2xl font-bold text-emerald-600">
                      {formatCurrency(deposit.amount)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xs text-neutral-500 font-medium">
                        {formatDateTime(deposit.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`text-xs px-3 py-1.5 rounded-full font-bold capitalize border-2 flex items-center gap-1 ${getStatusColor(
                      deposit.status
                    )}`}
                  >
                    <span>{getStatusIcon(deposit.status)}</span>
                    {deposit.status}
                  </span>
                </div>

                {/* Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                    <span className="text-neutral-600 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                      UTR Number
                    </span>
                    <span className="font-mono font-bold text-foreground">{deposit.utrNumber}</span>
                  </div>

                  <div className="flex justify-between items-center py-2">
                    <span className="text-neutral-600 flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Screenshot
                    </span>
                    <a
                      href={deposit.screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-emerald-600 text-sm font-bold hover:underline flex items-center gap-1"
                    >
                      View Image
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>

                  {/* Admin Remark */}
                  {deposit.adminRemark && (
                    <div className="pt-3 border-t border-neutral-200">
                      <p className="text-xs font-bold text-neutral-700 mb-2 flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                        </svg>
                        Admin Remark:
                      </p>
                      <p className="text-sm text-foreground bg-neutral-100 p-3 rounded-lg border border-neutral-200">
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
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg text-sm font-bold transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 mt-3"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Resubmit Deposit
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
          <div className="card max-w-md w-full max-h-[90vh] overflow-y-auto !p-6 border-2 border-emerald-600">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground">Resubmit Deposit</h3>
                <p className="text-sm text-neutral-600">
                  Amount: <span className="font-bold text-emerald-600">{formatCurrency(resubmitModal.amount)}</span>
                </p>
              </div>
            </div>

            <form onSubmit={handleResubmit} className="space-y-4">
              {/* Info */}
              <div className="bg-emerald-50 border-2 border-emerald-200 p-4 rounded-lg">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm text-emerald-800">
                    Previous deposit was rejected. Please submit new payment details with correct information.
                  </p>
                </div>
              </div>

              {/* New UTR Number */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  New UTR Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input-field border-2 border-emerald-600/30 focus:border-emerald-600"
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
                <label className="block text-sm font-bold text-foreground mb-2">
                  New Payment Screenshot <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  className="w-full text-sm text-foreground file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer border-2 border-emerald-600/30 rounded-lg"
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
                  className="flex-1 bg-neutral-200 text-foreground px-4 py-3 rounded-lg font-bold hover:bg-neutral-300 transition-colors"
                  disabled={uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-bold transition-all shadow-md disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {uploading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Submitting...</span>
                    </>
                  ) : (
                    'Resubmit'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
