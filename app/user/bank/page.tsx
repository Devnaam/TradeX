'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';


interface BankDetails {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

export default function BankDetailsPage() {
  const router = useRouter();
  const [bankDetails, setBankDetails] = useState<BankDetails | null>(null);
  const [formData, setFormData] = useState({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchBankDetails();
  }, []);

  const fetchBankDetails = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/bank', {
        headers: {
          'x-user-id': user.id.toString(),
        },
      });

      const data = await response.json();
      
      if (data.success && data.data.bankDetails) {
        setBankDetails(data.data.bankDetails);
        setFormData(data.data.bankDetails);
      } else {
        // No bank details exist, show form
        setEditing(true);
      }
    } catch (error) {
      console.error('Failed to fetch bank details:', error);
      setEditing(true); // Show form if error
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/bank', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString(),
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('✅ Bank details saved successfully!');
        setEditing(false);
        setBankDetails(formData);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to save bank details');
      }
    } catch (err) {
      console.error('Save error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
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
          <h1 className="text-lg font-semibold">Bank Details</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Info Card */}
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">
            🏦 Add your bank or UPI details for withdrawals. All information is encrypted and secure.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="card bg-green-50 border-green-200">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Display Mode - Show Saved Details */}
        {!editing && bankDetails ? (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-neutral-900">Your Bank Details</h3>
              <button
                onClick={() => setEditing(true)}
                className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ✏️ Edit
              </button>
            </div>

            <div className="space-y-3">
              {/* Account Holder Name */}
              {bankDetails.accountHolderName && (
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="text-xs text-neutral-600 mb-1">Account Holder Name</p>
                  <p className="text-base font-medium text-neutral-900">
                    {bankDetails.accountHolderName}
                  </p>
                </div>
              )}

              {/* Bank Name */}
              {bankDetails.bankName && (
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="text-xs text-neutral-600 mb-1">Bank Name</p>
                  <p className="text-base font-medium text-neutral-900">{bankDetails.bankName}</p>
                </div>
              )}

              {/* Account Number */}
              {bankDetails.accountNumber && (
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="text-xs text-neutral-600 mb-1">Account Number</p>
                  <p className="text-base font-medium text-neutral-900 font-mono">
                    {bankDetails.accountNumber}
                  </p>
                </div>
              )}

              {/* IFSC Code */}
              {bankDetails.ifscCode && (
                <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                  <p className="text-xs text-neutral-600 mb-1">IFSC Code</p>
                  <p className="text-base font-medium text-neutral-900 font-mono">
                    {bankDetails.ifscCode}
                  </p>
                </div>
              )}

              {/* UPI ID */}
              {bankDetails.upiId && (
                <div className="bg-green-50 p-3 rounded-lg border border-green-200">
                  <p className="text-xs text-green-700 mb-1">UPI ID</p>
                  <p className="text-base font-medium text-green-900 font-mono">
                    {bankDetails.upiId}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Edit Mode - Form */
          <form onSubmit={handleSubmit} className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              {bankDetails ? 'Edit Bank Details' : 'Add Bank Details'}
            </h3>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* Account Holder Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="As per bank account"
                  value={formData.accountHolderName}
                  onChange={(e) =>
                    setFormData({ ...formData, accountHolderName: e.target.value })
                  }
                  required
                />
              </div>

              {/* Bank Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., State Bank of India"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter account number"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                />
              </div>

              {/* IFSC Code */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  IFSC Code
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., SBIN0001234"
                  value={formData.ifscCode}
                  onChange={(e) =>
                    setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })
                  }
                />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-neutral-200"></div>
                <span className="text-xs text-neutral-500 font-medium">OR</span>
                <div className="flex-1 h-px bg-neutral-200"></div>
              </div>

              {/* UPI ID */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="yourname@paytm"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Example: 1234567890@paytm, yourname@ybl, etc.
                </p>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                {bankDetails && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setError('');
                      setFormData(bankDetails);
                    }}
                    className="flex-1 bg-neutral-200 text-neutral-700 px-4 py-3 rounded-lg font-medium hover:bg-neutral-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 btn-primary"
                >
                  {saving ? 'Saving...' : 'Save Bank Details'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Security Note */}
        <div className="card bg-green-50 border-green-200">
          <div className="flex gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <p className="text-sm font-bold text-green-900 mb-1">Your Data is Secure</p>
              <p className="text-sm text-green-700">
                All bank details are encrypted and stored securely. We never share your
                information with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
      <BottomNav />
    </div>
  );
}
