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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-foreground font-medium">Loading payment details...</p>
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
            <Link href="/user/deposit">
              <button className="text-white hover:text-white/80 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </button>
            </Link>
            <div className="flex items-center gap-2 flex-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-lg font-bold">Complete Payment</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Amount Card */}
        <div className="card !p-6 bg-emerald-600 text-white text-center border-0 shadow-xl">
          <p className="text-sm mb-1 opacity-90">Recharge Amount</p>
          <p className="text-4xl font-bold mb-2">₹{parseFloat(amount).toLocaleString('en-IN')}</p>
          <div className="bg-white/20 rounded-lg p-3 border border-white/30">
            <p className="text-xs opacity-90">
              Please pay this exact amount for successful recharge
            </p>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="card !p-4 bg-red-50 border-2 border-red-200">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
            </div>
          </div>
        )}

        {/* QR Code */}
        <div className="card !p-6 text-center border-2 border-neutral-200">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center justify-center gap-2">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            Scan QR Code to Pay
          </h3>
          <div className="bg-white p-4 inline-block rounded-lg border-2 border-emerald-200">
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
            className="w-full bg-white hover:bg-neutral-50 text-emerald-600 font-bold h-12 px-6 rounded-button border-2 border-emerald-600 transition-all shadow-md hover:shadow-lg mt-4 flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Download QR Code
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-neutral-300"></div>
          <span className="text-xs text-neutral-600 font-bold">OR</span>
          <div className="flex-1 h-px bg-neutral-300"></div>
        </div>

        {/* UPI ID */}
        <div className="card !p-6 border-2 border-neutral-200">
          <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
            </svg>
            Pay via UPI ID
          </h3>
          <div className="bg-green-50 p-4 rounded-lg border-2 border-green-200">
            <p className="text-xs text-green-700 mb-2 font-bold">UPI ID</p>
            <p className="text-lg font-mono font-bold text-green-900 mb-3 break-all">
              {paymentSettings.upiId}
            </p>
            <button
              onClick={copyUpiId}
              className="w-full bg-white text-green-700 border-2 border-green-600 px-4 py-3 rounded-lg font-bold hover:bg-green-50 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy UPI ID
            </button>
          </div>
        </div>

        {/* Submit Form */}
        <div className="card !p-6 border-2 border-emerald-200 bg-emerald-50/30">
          <h3 className="text-lg font-bold text-foreground mb-5 flex items-center gap-2">
            <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Submit Payment Details
          </h3>
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* UTR Number */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                UTR / Transaction ID <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                className="input-field border-2 border-neutral-300 focus:border-emerald-600"
                placeholder="Enter 12-digit UTR number"
                value={utrNumber}
                onChange={(e) => setUtrNumber(e.target.value)}
                required
              />
              <p className="text-xs text-neutral-600 mt-2">
                Reference number from your payment app
              </p>
            </div>

            {/* Screenshot Upload */}
            <div>
              <label className="block text-sm font-bold text-foreground mb-2">
                Payment Screenshot <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/jpg"
                onChange={handleFileChange}
                className="w-full text-sm text-foreground file:mr-4 file:py-3 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-700 cursor-pointer border-2 border-neutral-300 rounded-lg"
                required
              />
              {screenshot && (
                <div className="mt-2 flex items-center gap-2 text-xs text-green-700 bg-green-50 p-2 rounded border border-green-200">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  {screenshot.name}
                </div>
              )}
              <p className="text-xs text-neutral-600 mt-2">
                Max size: 5MB (JPG, PNG only)
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 px-6 rounded-button transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Submitting...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Submit Payment</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Important Note */}
        <div className="card !p-5 bg-yellow-50 border-2 border-yellow-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-yellow-500 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-yellow-900 mb-2">Important Instructions</p>
              <ul className="text-xs text-yellow-800 space-y-1.5">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Complete payment before submitting details</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Screenshot must be clear and readable</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>UTR number must be correct</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Wrong details will lead to rejection</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Admin will verify within <strong>24 hours</strong></span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
