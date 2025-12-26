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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-foreground font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  if (!plan) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-20">
      
      {/* Header */}
      <div className="sticky top-0 z-50 bg-emerald-600 text-white shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Link href="/user/plans">
              <button className="text-white hover:text-white/80 transition-colors flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                <span className="hidden sm:inline">Back</span>
              </button>
            </Link>
            <div className="flex items-center gap-2 flex-1">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h1 className="text-lg font-bold">Invest in {plan.name}</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Balance Card */}
        <div className="card !p-6 bg-white border-2 border-emerald-200 shadow-lg">
          <div className="flex items-center gap-2 mb-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
            <p className="text-sm font-medium text-neutral-600">Available Balance</p>
          </div>
          <p className="text-3xl font-bold text-emerald-600">
            {formatCurrency(rechargeBalance)}
          </p>
        </div>

        {/* Plan Details Card */}
        <div className="card !p-6 border-2 border-emerald-200">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center shadow-md">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-600">{plan.name}</h3>
              <p className="text-xs text-neutral-500">Investment Plan</p>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-green-50 border-2 border-green-500 p-3 rounded-lg text-center">
              <p className="text-xs text-green-700 font-medium mb-1">Daily Return</p>
              <p className="text-2xl font-bold text-green-600">{plan.dailyReturn}%</p>
            </div>
            <div className="bg-background border-2 border-neutral-300 p-3 rounded-lg text-center">
              <p className="text-xs text-neutral-600 font-medium mb-1">Duration</p>
              <p className="text-2xl font-bold text-foreground">{plan.duration} days</p>
            </div>
          </div>

          {/* Plan Limits */}
          <div className="space-y-2 text-sm pt-3 border-t border-neutral-200">
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Min Investment:</span>
              <span className="font-bold text-foreground">{formatCurrency(plan.minInvestment)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-neutral-600">Max Investment:</span>
              <span className="font-bold text-foreground">{formatCurrency(plan.maxInvestment)}</span>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-neutral-200">
              <span className="text-neutral-600">Total Return:</span>
              <span className="font-bold text-green-600 text-lg">{plan.totalReturn}%</span>
            </div>
          </div>
        </div>

        {/* Investment Amount Input */}
        <div className="card !p-6 border-2 border-emerald-200">
          <label className="block text-sm font-bold text-foreground mb-3 flex items-center gap-2">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Investment Amount
          </label>
          <input
            type="number"
            className="input-field text-2xl font-bold text-center border-2 border-emerald-600/30 focus:border-emerald-600"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            min={plan.minInvestment}
            max={plan.maxInvestment}
          />

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-4 gap-2 mt-4">
            {[plan.minInvestment, 1000, 5000, plan.maxInvestment].map((quickAmount, idx) => (
              <button
                key={idx}
                onClick={() => setAmount(quickAmount.toString())}
                className="py-2.5 px-2 text-sm font-bold bg-background hover:bg-emerald-600 hover:text-white border-2 border-neutral-300 hover:border-emerald-600 rounded-lg transition-all"
              >
                ₹{quickAmount >= 1000 ? `${quickAmount / 1000}k` : quickAmount}
              </button>
            ))}
          </div>
        </div>

        {/* Returns Calculation */}
        {returns && (
          <div className="card !p-6 bg-green-50 border-2 border-green-500">
            <div className="flex items-center gap-2 mb-4">
              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <h4 className="text-base font-bold text-green-900">Expected Returns</h4>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-green-300">
                <span className="text-sm text-green-700 font-medium">Daily Income:</span>
                <span className="text-lg font-bold text-green-900">{formatCurrency(returns.dailyIncome)}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-green-300">
                <span className="text-sm text-green-700 font-medium">Total Income:</span>
                <span className="text-lg font-bold text-green-900">{formatCurrency(returns.totalIncome)}</span>
              </div>
              <div className="bg-white rounded-lg p-4 mt-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-green-700 font-bold">You'll Receive:</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(returns.finalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="card !p-4 bg-red-50 border-2 border-red-500">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-sm font-medium text-red-800 flex-1">{error}</p>
            </div>
          </div>
        )}

        {/* Invest Button */}
        <button
          onClick={handleInvest}
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 px-6 rounded-button transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          disabled={investing}
        >
          {investing ? (
            <>
              <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>Invest Now</span>
            </>
          )}
        </button>

        {/* Info Card */}
        <div className="card !p-5 bg-emerald-50 border-2 border-emerald-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-emerald-900 mb-1">Important Information</h4>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Daily returns will be credited automatically at <strong>00:00 IST</strong>. 
                Your principal amount will be returned after <strong>{plan.duration} days</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
