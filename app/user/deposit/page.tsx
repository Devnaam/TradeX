'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DepositPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'bank'>('upi');
  const [error, setError] = useState('');

  const quickAmounts = [300, 1000, 5000, 10000, 20000];

  const handleQuickAmount = (value: number) => {
    setAmount(value.toString());
    setError('');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amountNum = parseFloat(amount);

    if (!amount || isNaN(amountNum)) {
      setError('Please enter a valid amount');
      return;
    }

    if (amountNum < 300) {
      setError('Minimum recharge amount is ₹300');
      return;
    }

    // Store recharge details in session and navigate to manual payment page
    sessionStorage.setItem('recharge-amount', amount);
    sessionStorage.setItem('payment-method', paymentMethod);
    router.push('/user/deposit/manual');
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/user/dashboard">
            <button className="text-white hover:opacity-80">
              ← Back
            </button>
          </Link>
          <h1 className="text-lg font-semibold">Recharge Wallet</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Recharge Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-button text-sm">
                {error}
              </div>
            )}

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Enter Amount (Min: ₹300)
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="Enter recharge amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                min="300"
                required
              />
            </div>

            {/* Quick Amount Buttons */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Quick Select
              </label>
              <div className="grid grid-cols-3 gap-2">
                {quickAmounts.map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleQuickAmount(value)}
                    className={`py-2 px-3 rounded-button text-sm font-medium transition-colors ${
                      amount === value.toString()
                        ? 'bg-primary text-white'
                        : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'
                    }`}
                  >
                    ₹{value.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Payment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border-2 rounded-button cursor-pointer transition-colors hover:border-primary">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="upi"
                    checked={paymentMethod === 'upi'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'upi')}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">UPI</p>
                    <p className="text-xs text-neutral-600">Pay via UPI apps</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border-2 rounded-button cursor-pointer transition-colors hover:border-primary">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank"
                    checked={paymentMethod === 'bank'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'bank')}
                    className="w-4 h-4 text-primary"
                  />
                  <div className="flex-1">
                    <p className="font-medium text-neutral-900">Bank Transfer</p>
                    <p className="text-xs text-neutral-600">Direct bank transfer</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <button type="submit" className="btn-primary w-full">
              Recharge Now
            </button>
          </form>
        </div>

        {/* Info Card */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Important Notes:</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Minimum recharge amount is ₹300</li>
            <li>• Your recharge will be activated after admin approval</li>
            <li>• Please keep your payment receipt/screenshot ready</li>
            <li>• Processing time: 5-30 minutes</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
