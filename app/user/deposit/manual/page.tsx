'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ManualPaymentPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshot, setScreenshot] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingSettings, setLoadingSettings] = useState(true);
  const [error, setError] = useState('');
  const [paymentSettings, setPaymentSettings] = useState({
    qrCodeUrl: '',
    upiId: '',
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

    // Fetch payment settings (QR code and UPI ID from admin)
    fetchPaymentSettings();
  }, [router]);

  const fetchPaymentSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();
      
      if (data.success && data.data.settings) {
        setPaymentSettings({
          qrCodeUrl: data.data.settings.qrCodeUrl,
          upiId: data.data.settings.upiId,
        });
      } else {
        // Fallback if admin hasn't set payment details yet
        setPaymentSettings({
          qrCodeUrl: 'https://via.placeholder.com/300?text=QR+Code+Not+Set',
          upiId: 'admin@paytm',
        });
        setError('⚠️ Admin has not configured payment settings yet. Please contact support.');
      }
    } catch (error) {
      console.error('Failed to fetch payment settings:', error);
      setPaymentSettings({
        qrCodeUrl: 'https://via.placeholder.com/300?text=Error+Loading+QR',
        upiId: 'Contact Support',
      });
      setError('Failed to load payment settings. Please try again or contact support.');
    } finally {
      setLoadingSettings(false);
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
      // Get user data
      const userData = localStorage.getItem('user');
      if (!userData) {
        router.push('/login');
        return;
      }
      const user = JSON.parse(userData);

      // Create FormData for file upload
      const formData = new FormData();
      formData.append('amount', amount);
      formData.append('utrNumber', utrNumber);
      formData.append('screenshot', screenshot);
      formData.append('paymentMethod', paymentMethod);

      // Create deposit request
      const response = await fetch('/api/user/deposit/create', {
        method: 'POST',
        headers: {
          'x-user-id': user.id.toString(),
        },
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        // Clear session
        sessionStorage.removeItem('recharge-amount');
        sessionStorage.removeItem('payment-method');
        
        // Redirect to history
        alert('✅ Recharge request submitted successfully! Waiting for admin approval.');
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
    if (paymentSettings.upiId === 'Contact Support') {
      alert('⚠️ UPI ID not configured. Please contact support.');
      return;
    }
    navigator.clipboard.writeText(paymentSettings.upiId);
    alert('✅ UPI ID copied to clipboard!');
  };

  const downloadQR = () => {
    if (!paymentSettings.qrCodeUrl || paymentSettings.qrCodeUrl.includes('placeholder')) {
      alert('⚠️ QR Code not available. Please contact support.');
      return;
    }
    const link = document.createElement('a');
    link.href = paymentSettings.qrCodeUrl;
    link.download = 'payment-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loadingSettings) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading payment details...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/user/deposit">
            <button className="text-white hover:opacity-80">← Back</button>
          </Link>
          <h1 className="text-lg font-semibold">Complete Payment</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 pb-20 space-y-6">
        {/* Amount Card */}
        <div className="card bg-primary text-white text-center">
          <p className="text-sm mb-1 opacity-90">Recharge Amount</p>
          <p className="text-3xl font-bold">₹{parseFloat(amount).toLocaleString('en-IN')}</p>
          <p className="text-xs mt-2 opacity-80">
            Please pay this exact amount for successful recharge
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="card bg-red-50 border-red-200">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        {/* QR Code */}
        <div className="card text-center">
          <h3 className="text-base font-bold text-neutral-900 mb-3">Scan QR Code to Pay</h3>
          <div className="bg-white p-4 inline-block rounded-lg border-2 border-neutral-200">
            <img
              src={paymentSettings.qrCodeUrl}
              alt="Payment QR Code"
              className="w-64 h-64 object-contain mx-auto"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300?text=QR+Code+Error';
              }}
            />
          </div>
          <button
            onClick={downloadQR}
            className="btn-secondary w-full mt-3"
          >
            📥 Download QR Code
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-200"></div>
          <span className="text-xs text-neutral-500 font-medium">OR</span>
          <div className="flex-1 h-px bg-neutral-200"></div>
        </div>

        {/* UPI ID */}
        <div className="card">
          <h3 className="text-base font-bold text-neutral-900 mb-3">Pay via UPI ID</h3>
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <p className="text-xs text-green-700 mb-2">UPI ID</p>
            <p className="text-lg font-mono font-bold text-green-900 mb-3">
              {paymentSettings.upiId}
            </p>
            <button
              onClick={copyUpiId}
              className="w-full bg-white text-primary border border-primary px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors"
            >
              📋 Copy UPI ID
            </button>
          </div>
        </div>

        {/* Submit Form */}
        <div className="card">
          <h3 className="text-base font-bold text-neutral-900 mb-4">
            Submit Payment Details
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* UTR Number */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                UTR / Transaction ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter 12-digit UTR number"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                required
              />
              <p className="text-xs text-neutral-500 mt-1">
                Reference number from your payment app
              </p>
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Payment Screenshot <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
                className="w-full text-sm text-neutral-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-primary file:text-white hover:file:bg-blue-700 cursor-pointer"
                required
              />
              {screenshot && (
                <p className="text-xs text-green-600 mt-2">✓ {screenshot.name}</p>
              )}
              <p className="text-xs text-neutral-500 mt-1">
                Max size: 5MB (JPG, PNG only)
              </p>
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

        {/* Important Note */}
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="text-sm font-bold text-yellow-900 mb-1">Important Instructions</p>
              <ul className="text-sm text-yellow-800 space-y-1">
                <li>• Complete payment before submitting details</li>
                <li>• Screenshot must be clear and readable</li>
                <li>• UTR number must be correct</li>
                <li>• Wrong details will lead to rejection</li>
                <li>• Admin will verify within 24 hours</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
