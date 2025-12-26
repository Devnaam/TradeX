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
        setEditing(true);
      }
    } catch (error) {
      console.error('Failed to fetch bank details:', error);
      setEditing(true);
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-foreground font-medium">Loading bank details...</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <h1 className="text-lg font-bold">Bank Details</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Info Card */}
        <div className="card !p-4 bg-emerald-50 border-2 border-emerald-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <p className="text-sm text-emerald-800">
              Add your bank or UPI details for withdrawals. All information is encrypted and secure.
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="card !p-4 bg-green-50 border-2 border-green-200">
            <div className="flex items-center gap-3">
              <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-bold text-green-800">{success}</p>
            </div>
          </div>
        )}

        {/* Display Mode - Show Saved Details */}
        {!editing && bankDetails ? (
          <div className="card !p-6 border-2 border-neutral-200">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-foreground flex items-center gap-2">
                <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Your Bank Details
              </h3>
              <button
                onClick={() => setEditing(true)}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
            </div>

            <div className="space-y-3">
              {/* Account Holder Name */}
              {bankDetails.accountHolderName && (
                <div className="bg-background p-4 rounded-lg border-2 border-neutral-200">
                  <p className="text-xs font-bold text-neutral-600 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Account Holder Name
                  </p>
                  <p className="text-base font-bold text-foreground">
                    {bankDetails.accountHolderName}
                  </p>
                </div>
              )}

              {/* Bank Name */}
              {bankDetails.bankName && (
                <div className="bg-background p-4 rounded-lg border-2 border-neutral-200">
                  <p className="text-xs font-bold text-neutral-600 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Bank Name
                  </p>
                  <p className="text-base font-bold text-foreground">{bankDetails.bankName}</p>
                </div>
              )}

              {/* Account Number */}
              {bankDetails.accountNumber && (
                <div className="bg-background p-4 rounded-lg border-2 border-neutral-200">
                  <p className="text-xs font-bold text-neutral-600 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Account Number
                  </p>
                  <p className="text-base font-bold text-foreground font-mono">
                    {bankDetails.accountNumber}
                  </p>
                </div>
              )}

              {/* IFSC Code */}
              {bankDetails.ifscCode && (
                <div className="bg-background p-4 rounded-lg border-2 border-neutral-200">
                  <p className="text-xs font-bold text-neutral-600 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    IFSC Code
                  </p>
                  <p className="text-base font-bold text-foreground font-mono">
                    {bankDetails.ifscCode}
                  </p>
                </div>
              )}

              {/* UPI ID */}
              {bankDetails.upiId && (
                <div className="bg-emerald-50 p-4 rounded-lg border-2 border-emerald-200">
                  <p className="text-xs font-bold text-neutral-600 mb-2 flex items-center gap-2">
                    <svg className="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                    UPI ID
                  </p>
                  <p className="text-base font-bold text-emerald-600 font-mono">
                    {bankDetails.upiId}
                  </p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* Edit Mode - Form */
          <form onSubmit={handleSubmit} className="card !p-6 border-2 border-neutral-200">
            <h3 className="text-xl font-bold text-foreground mb-6 flex items-center gap-2">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              {bankDetails ? 'Edit Bank Details' : 'Add Bank Details'}
            </h3>

            {/* Error Message */}
            {error && (
              <div className="card !p-4 bg-red-50 border-2 border-red-500 mb-4">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
                </div>
              </div>
            )}

            <div className="space-y-5">
              {/* Account Holder Name */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Account Holder Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input-field border-2 border-neutral-300 focus:border-emerald-600"
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
                <label className="block text-sm font-bold text-foreground mb-2">
                  Bank Name
                </label>
                <input
                  type="text"
                  className="input-field border-2 border-neutral-300 focus:border-emerald-600"
                  placeholder="e.g., State Bank of India"
                  value={formData.bankName}
                  onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                />
              </div>

              {/* Account Number */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  Account Number
                </label>
                <input
                  type="text"
                  className="input-field border-2 border-neutral-300 focus:border-emerald-600"
                  placeholder="Enter account number"
                  value={formData.accountNumber}
                  onChange={(e) => setFormData({ ...formData, accountNumber: e.target.value })}
                />
              </div>

              {/* IFSC Code */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  IFSC Code
                </label>
                <input
                  type="text"
                  className="input-field border-2 border-neutral-300 focus:border-emerald-600"
                  placeholder="e.g., SBIN0001234"
                  value={formData.ifscCode}
                  onChange={(e) =>
                    setFormData({ ...formData, ifscCode: e.target.value.toUpperCase() })
                  }
                />
              </div>

              {/* Divider */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-px bg-neutral-300"></div>
                <span className="text-xs text-neutral-600 font-bold">OR</span>
                <div className="flex-1 h-px bg-neutral-300"></div>
              </div>

              {/* UPI ID */}
              <div>
                <label className="block text-sm font-bold text-foreground mb-2">
                  UPI ID
                </label>
                <input
                  type="text"
                  className="input-field border-2 border-neutral-300 focus:border-emerald-600"
                  placeholder="yourname@paytm"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                />
                <p className="text-xs text-neutral-500 mt-2">
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
                    className="flex-1 bg-neutral-200 text-foreground px-4 py-3 rounded-lg font-bold hover:bg-neutral-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-lg font-bold transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Save Bank Details</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Security Note */}
        <div className="card !p-5 bg-green-50 border-2 border-green-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
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
