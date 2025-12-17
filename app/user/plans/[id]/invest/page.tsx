'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';

interface Plan {
  id: number;
  name: string;
  minInvestment: number;
  maxInvestment: number;
  dailyReturn: number;
  duration: number;
  totalReturn: number;
}

export default function InvestPage() {
  const router = useRouter();
  const params = useParams();
  const planId = params.id as string;

  const [plan, setPlan] = useState<Plan | null>(null);
  const [amount, setAmount] = useState('');
  const [rechargeBalance, setRechargeBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [investing, setInvesting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchPlanDetails();
    fetchWallet();
  }, []);

  const fetchPlanDetails = async () => {
    try {
      const response = await fetch('/api/plans');
      const data = await response.json();
      if (data.success) {
        const selectedPlan = data.data.plans.find((p: Plan) => p.id === parseInt(planId));
        if (selectedPlan) {
          setPlan(selectedPlan);
        } else {
          router.push('/user/plans');
        }
      }
    } catch (error) {
      console.error('Failed to fetch plan:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchWallet = async () => {
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
        setRechargeBalance(data.data.wallet.rechargeBalance);
      }
    } catch (error) {
      console.error('Failed to fetch wallet:', error);
    }
  };

  const handleInvest = async () => {
    if (!plan) return;

    setError('');
    const investAmount = parseFloat(amount);

    // Validation
    if (!amount || investAmount <= 0) {
      setError('Please enter a valid amount');
      return;
    }

    if (investAmount < plan.minInvestment) {
      setError(`Minimum investment is ${formatCurrency(plan.minInvestment)}`);
      return;
    }

    if (investAmount > plan.maxInvestment) {
      setError(`Maximum investment is ${formatCurrency(plan.maxInvestment)}`);
      return;
    }

    if (investAmount > rechargeBalance) {
      setError('Insufficient balance. Please recharge first.');
      return;
    }

    setInvesting(true);

    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/invest', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString(),
        },
        body: JSON.stringify({
          planId: plan.id,
          amount: investAmount,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Show success and redirect
        alert('Investment successful! 🎉');
        router.push('/user/investments');
      } else {
        setError(data.error || 'Investment failed');
      }
    } catch (err) {
      console.error('Investment error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setInvesting(false);
    }
  };

  const calculateReturns = () => {
    if (!plan || !amount) return null;

    const investAmount = parseFloat(amount);
    if (isNaN(investAmount)) return null;

    const dailyIncome = (investAmount * plan.dailyReturn) / 100;
    const totalIncome = (investAmount * plan.totalReturn) / 100;
    const finalAmount = investAmount + totalIncome;

    return { dailyIncome, totalIncome, finalAmount };
  };

  const returns = calculateReturns();

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

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/user/plans">
            <button className="text-white hover:opacity-80">← Back</button>
          </Link>
          <h1 className="text-lg font-semibold">Invest in {plan.name}</h1>
        </div>
      </div>

      <div className="max-w-md mx-auto p-4 space-y-4">
        {/* Balance Card */}
        <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <p className="text-sm text-neutral-600">Available Balance</p>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(rechargeBalance)}
          </p>
        </div>

        {/* Plan Details */}
        <div className="card">
          <h3 className="text-lg font-bold text-primary mb-3">{plan.name}</h3>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <div className="bg-neutral-50 p-3 rounded-button text-center">
              <p className="text-xs text-neutral-600">Daily Return</p>
              <p className="text-xl font-bold text-secondary">{plan.dailyReturn}%</p>
            </div>
            <div className="bg-neutral-50 p-3 rounded-button text-center">
              <p className="text-xs text-neutral-600">Duration</p>
              <p className="text-xl font-bold text-secondary">{plan.duration} days</p>
            </div>
          </div>

          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Min Investment:</span>
              <span className="font-medium">{formatCurrency(plan.minInvestment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Max Investment:</span>
              <span className="font-medium">{formatCurrency(plan.maxInvestment)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Total Return:</span>
              <span className="font-medium text-secondary">{plan.totalReturn}%</span>
            </div>
          </div>
        </div>

        {/* Investment Amount Input */}
        <div className="card">
          <label className="block text-sm font-medium text-neutral-700 mb-2">
            Investment Amount
          </label>
          <input
            type="number"
            className="input-field text-lg font-semibold"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={plan.minInvestment}
            max={plan.maxInvestment}
          />

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2 mt-3">
            {[plan.minInvestment, 1000, 5000, plan.maxInvestment].map((quickAmount, idx) => (
              <button
                key={idx}
                onClick={() => setAmount(quickAmount.toString())}
                className="py-2 px-2 text-xs font-medium bg-neutral-100 hover:bg-neutral-200 rounded-button transition-colors"
              >
                ₹{quickAmount >= 1000 ? `${quickAmount / 1000}k` : quickAmount}
              </button>
            ))}
          </div>
        </div>

        {/* Returns Calculation */}
        {returns && (
          <div className="card bg-green-50 border-green-200">
            <h4 className="text-sm font-semibold text-green-900 mb-3">Expected Returns</h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-green-700">Daily Income:</span>
                <span className="font-bold text-green-900">{formatCurrency(returns.dailyIncome)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-green-700">Total Income:</span>
                <span className="font-bold text-green-900">{formatCurrency(returns.totalIncome)}</span>
              </div>
              <div className="flex justify-between border-t border-green-300 pt-2">
                <span className="text-green-700 font-semibold">You'll Receive:</span>
                <span className="font-bold text-green-900 text-lg">
                  {formatCurrency(returns.finalAmount)}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-button text-sm">
            {error}
          </div>
        )}

        {/* Invest Button */}
        <button
          onClick={handleInvest}
          className="btn-primary w-full py-4 text-lg"
          disabled={investing}
        >
          {investing ? 'Processing...' : 'Invest Now'}
        </button>

        {/* Info Card */}
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-xs text-blue-800">
            💡 <strong>Note:</strong> Daily returns will be credited automatically at 00:00 IST. 
            Principal amount will be returned after {plan.duration} days.
          </p>
        </div>
      </div>
    </div>
  );
}
