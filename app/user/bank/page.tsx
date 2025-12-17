'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface BankDetails {
  bankName: string;
  accountHolderName: string;
  accountNumber: string;
  ifscCode: string;
  upiId: string;
}

export default function BankDetailsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<BankDetails>({
    bankName: '',
    accountHolderName: '',
    accountNumber: '',
    ifscCode: '',
    upiId: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
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
        setFormData(data.data.bankDetails);
      }
    } catch (error) {
      console.error('Failed to fetch bank details:', error);
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
        setSuccess('Bank details saved successfully!');
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

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Info Card */}
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">
            💡 Add your bank details to enable withdrawals. All information is encrypted and secure.
          </p>
        </div>

        {/* Form Card */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Success Message */}
            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-button text-sm">
                ✓ {success}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-button text-sm">
                {error}
              </div>
            )}

            {/* Account Holder Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Account Holder Name *
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="As per bank records"
                value={formData.accountHolderName}
                onChange={(e) => setFormData({ ...formData, accountHolderName: e.target.value })}
                required
              />
            </div>

            {/* Bank Name */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
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
              <label className="block text-sm font-medium text-neutral-700 mb-1">
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
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                IFSC Code
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g., SBIN0001234"
                value={formData.ifscCode}
                onChange={(e) => setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })}
              />
            </div>

            {/* UPI ID */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                UPI ID
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="yourname@upi"
                value={formData.upiId}
                onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Bank Details'}
            </button>
          </form>
        </div>

        {/* Security Note */}
        <div className="card bg-neutral-50">
          <div className="flex gap-3">
            <span className="text-2xl">🔒</span>
            <div>
              <h3 className="text-sm font-semibold text-neutral-900 mb-1">
                Your data is secure
              </h3>
              <p className="text-xs text-neutral-600">
                All bank details are encrypted and stored securely. We never share your information with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
