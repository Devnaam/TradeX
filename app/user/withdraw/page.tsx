'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';


export default function WithdrawPage() {
  const router = useRouter();
  const [amount, setAmount] = useState('');
  const [method, setMethod] = useState<'upi' | 'bank'>('upi');
  const [incomeBalance, setIncomeBalance] = useState(0);
  const [hasBankDetails, setHasBankDetails] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWalletData();
    checkBankDetails();
  }, []);

  const fetchWalletData = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/dashboard', {
        headers: {
          'x-user-id': user.id.toString(),
        },
      });

      const data = await response.json();
      if (data.success) {
        setIncomeBalance(data.data.wallet.incomeBalance);
      }
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    }
  };

  const checkBankDetails = async () => {
    const userData = localStorage.getItem('user');
    if (!userData) return;

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/bank', {
        headers: {
          'x-user-id': user.id.toString(),
        },
      });

      const data = await response.json();
      if (data.success && data.data.bankDetails) {
        setHasBankDetails(true);
      }
    } catch (error) {
      console.error('Failed to check bank details:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const amountNum = parseFloat(amount);

    if (!amount || isNaN(amountNum)) {
      setError('Please enter a valid amount');
      return;
    }

    if (amountNum < 300) {
      setError('Minimum withdrawal amount is ₹300');
      return;
    }

    if (amountNum > incomeBalance) {
      setError('Insufficient income balance');
      return;
    }

    if (!hasBankDetails) {
      setError('Please add your bank details first');
      return;
    }

    setLoading(true);

    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/withdraw/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString(),
        },
        body: JSON.stringify({
          amount: amountNum,
          method,
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert('Withdrawal request submitted successfully!');
        router.push('/user/withdraw/history');
      } else {
        setError(data.error || 'Failed to create withdrawal request');
      }
    } catch (err) {
      console.error('Withdraw error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/user/dashboard">
            <button className="text-white hover:opacity-80">← Back</button>
          </Link>
          <h1 className="text-lg font-semibold">Withdraw Funds</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-6">
        {/* Balance Card */}
        <div className="card bg-gradient-to-r from-secondary/10 to-primary/10 border-secondary/20">
          <div className="text-center">
            <p className="text-sm text-neutral-600 mb-1">Available Balance</p>
            <p className="text-3xl font-bold text-secondary">
              {formatCurrency(incomeBalance)}
            </p>
          </div>
        </div>

        {/* Withdraw Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-button text-sm">
                {error}
              </div>
            )}

            {/* Amount Input */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                Withdrawal Amount (Min: ₹300)
              </label>
              <input
                type="number"
                className="input-field"
                placeholder="Enter withdrawal amount"
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setError('');
                }}
                min="300"
                max={incomeBalance}
                required
              />
            </div>

            {/* Quick Amount */}
            <div>
              <button
                type="button"
                onClick={() => setAmount(incomeBalance.toString())}
                className="text-sm text-primary hover:underline"
              >
                Withdraw all available balance
              </button>
            </div>

            {/* Withdrawal Method */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Withdrawal Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 border-2 rounded-button cursor-pointer hover:border-primary">
                  <input
                    type="radio"
                    name="method"
                    value="upi"
                    checked={method === 'upi'}
                    onChange={(e) => setMethod(e.target.value as 'upi')}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">UPI Transfer</p>
                    <p className="text-xs text-neutral-600">Fast & instant</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-3 border-2 rounded-button cursor-pointer hover:border-primary">
                  <input
                    type="radio"
                    name="method"
                    value="bank"
                    checked={method === 'bank'}
                    onChange={(e) => setMethod(e.target.value as 'bank')}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-xs text-neutral-600">1-2 business days</p>
                  </div>
                </label>
              </div>
            </div>

            {/* Bank Details Warning */}
            {!hasBankDetails && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-button text-sm">
                ⚠️ Please add your bank details before withdrawing.{' '}
                <Link href="/user/bank" className="underline font-medium">
                  Add Now
                </Link>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading || !hasBankDetails}
            >
              {loading ? 'Processing...' : 'Withdraw Now'}
            </button>
          </form>
        </div>

        {/* Info */}
        <div className="card bg-blue-50 border-blue-200">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">Important:</h3>
          <ul className="text-xs text-blue-800 space-y-1">
            <li>• Minimum withdrawal: ₹300</li>
            <li>• Processing time: 5-30 minutes</li>
            <li>• Amount will be deducted immediately</li>
            <li>• Refunded if rejected by admin</li>
          </ul>
        </div>
      </div>
      <BottomNav />
    </div>
  );
}
