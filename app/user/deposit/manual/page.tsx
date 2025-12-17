'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { put } from '@vercel/blob';

export default function ManualPaymentPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [paymentSettings, setPaymentSettings] = useState({
    qrCodeUrl: '/placeholder-qr.png',
    upiId: 'admin@upi',
  });

  useEffect(() => {
    // Get recharge details from session
    const storedAmount = sessionStorage.getItem('recharge-amount');
    const storedMethod = sessionStorage.getItem('payment-method');

    if (!storedAmount) {
      router.push('/user/deposit');
      return;
    }

    setAmount(storedAmount);
    setPaymentMethod(storedMethod || 'upi');

    // Fetch payment settings (QR code and UPI ID)
    fetchPaymentSettings();
  }, [router]);

  const fetchPaymentSettings = async () => {
    try {
      const response = await fetch('/api/payment-settings');
      const data = await response.json();
      if (data.success) {
        setPaymentSettings(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch payment settings:', error);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
        setError('Only JPG and PNG files are allowed');
        return;
      }
      setScreenshot(file);
      setError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!utrNumber.trim()) {
      setError('Please enter UTR number');
      return;
    }

    if (!screenshot) {
      setError('Please upload payment screenshot');
      return;
    }

    setLoading(true);

    try {
      // Upload screenshot to Vercel Blob (or handle it differently for now)
      // For now, we'll use a placeholder URL
      const screenshotUrl = `https://placeholder.com/${Date.now()}.jpg`;
      
      // Get user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }
      const user = JSON.parse(userData);

      // Create deposit request
      const response = await fetch('/api/user/deposit/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString(),
        },
        body: JSON.stringify({
          amount: parseFloat(amount),
          utrNumber,
          screenshotUrl,
          paymentMethod,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Clear session
        sessionStorage.removeItem('recharge-amount');
        sessionStorage.removeItem('payment-method');
        
        // Redirect to history
        alert('Recharge request submitted successfully! Waiting for admin approval.');
        router.push('/user/deposit/history');
      } else {
        setError(data.error || 'Failed to submit recharge request');
      }
    } catch (err) {
      console.error('Submit error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(paymentSettings.upiId);
    alert('UPI ID copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/user/deposit">
            <button className="text-white hover:opacity-80">
              ← Back
            </button>
          </Link>
          <h1 className="text-lg font-semibold">Complete Payment</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Amount Card */}
        <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="text-center">
            <p className="text-sm text-neutral-600 mb-1">Recharge Amount</p>
            <p className="text-3xl font-bold text-primary">₹{parseFloat(amount).toLocaleString('en-IN')}</p>
            <p className="text-xs text-neutral-600 mt-2">
              Please pay this exact amount for successful recharge
            </p>
          </div>
        </div>

        {/* QR Code */}
        <div className="card text-center">
          <h3 className="text-section-title mb-3">Scan QR Code</h3>
          <div className="bg-white p-4 inline-block rounded-button border-2 border-neutral-200">
            <img
              src={paymentSettings.qrCodeUrl}
              alt="Payment QR Code"
              className="w-48 h-48 mx-auto"
            />
          </div>
          <button
            onClick={() => window.open(paymentSettings.qrCodeUrl, '_blank')}
            className="btn-secondary mt-3 w-full"
          >
            Download QR Code
          </button>
        </div>

        {/* UPI ID */}
        <div className="card">
          <h3 className="text-sm font-medium text-neutral-700 mb-2">UPI ID</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={paymentSettings.upiId}
              readOnly
              className="input-field flex-1 bg-neutral-50"
            />
            <button
              onClick={copyUpiId}
              className="btn-secondary whitespace-nowrap"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Submit Form */}
        <div className="card">
          <h3 className="text-section-title mb-4">Submit Payment Details</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-button text-sm">
                {error}
              </div>
            )}

            {/* UTR Number */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                UTR Number / Transaction ID
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter 12-digit UTR number"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                required
              />
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Payment Screenshot
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
                className="w-full text-sm text-neutral-700 file:mr-4 file:py-2 file:px-4 file:rounded-button file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-primary-dark cursor-pointer"
                required
              />
              {screenshot && (
                <p className="text-xs text-secondary mt-1">✓ {screenshot.name}</p>
              )}
              <p className="text-xs text-neutral-500 mt-1">Max size: 5MB (JPG, PNG only)</p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Submitting...' : 'Submit Payment'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
