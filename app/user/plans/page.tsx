'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';


interface Plan {
  id: number;
  planNumber: number;
  amount: number;
  dailyIncome: number;
  validityDays: number;
  isActive: boolean;
}

export default function PlansPage() {
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [rechargeBalance, setRechargeBalance] = useState(0);
  const [activating, setActivating] = useState<number | null>(null);

  useEffect(() => {
    fetchPlans();
    fetchWallet();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await fetch('/api/plans');
      const data = await response.json();
      if (data.success) {
        setPlans(data.data.plans);
      }
    } catch (error) {
      console.error('Failed to fetch plans:', error);
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

  const handleActivatePlan = async (plan: Plan) => {
    // Confirmation popup as per PRD
    const confirmed = window.confirm(
      `Activate Plan ${plan.planNumber} for ${formatCurrency(plan.amount)}?`
    );

    if (!confirmed) return;

    // Check balance first
    if (plan.amount > rechargeBalance) {
      alert('Insufficient recharge balance. Please recharge first.');
      return;
    }

    setActivating(plan.id);

    const userData = localStorage.getItem('user');
    if (!userData) {
      router.push('/login');
      return;
    }

    const user = JSON.parse(userData);

    try {
      const response = await fetch('/api/user/plans/activate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-user-id': user.id.toString(),
        },
        body: JSON.stringify({ planId: plan.id }),
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Plan ${plan.planNumber} activated successfully!`);
        // Refresh balance
        fetchWallet();
        // Redirect to My Investment
        router.push('/user/investment');
      } else {
        alert(data.error || 'Failed to activate plan');
      }
    } catch (err) {
      console.error('Activation error:', err);
      alert('Something went wrong. Please try again.');
    } finally {
      setActivating(null);
    }
  };

  const calculateTotalIncome = (dailyIncome: number, days: number) => {
    return dailyIncome * days;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading plans...</p>
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
          <h1 className="text-lg font-semibold">Investment Plans</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Balance Card */}
        <div className="card bg-gradient-to-r from-primary/10 to-secondary/10 border-primary/20">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm text-neutral-600">Recharge Balance</p>
              <p className="text-2xl font-bold text-primary">
                {formatCurrency(rechargeBalance)}
              </p>
            </div>
            <Link href="/user/deposit">
              <button className="btn-secondary text-sm px-4 py-2">+ Recharge</button>
            </Link>
          </div>
        </div>

        {/* Info Note */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> All plans have <strong>365 days (1 year)</strong> validity.
            Daily income credited at 12:00 AM IST.
            You can buy the same plan multiple times.
          </p>
        </div>


        {/* Plans Grid */}
        {plans.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-5xl mb-3">📊</div>
            <p className="text-neutral-600">No investment plans available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plans.map((plan) => (
              <div
                key={plan.id}
                className={`card hover:shadow-md transition-shadow ${!plan.isActive && 'opacity-50'}`}
              >
                {/* Plan Header */}
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-primary">
                      Plan {plan.planNumber}
                    </h3>
                    <p className="text-2xl font-bold text-primary mt-1">
                      {formatCurrency(plan.amount)}
                    </p>
                  </div>
                  {!plan.isActive && (
                    <span className="text-xs bg-neutral-200 text-neutral-600 px-2 py-1 rounded">
                      Inactive
                    </span>
                  )}
                </div>

                {/* Daily Income Highlight */}
                <div className="bg-green-50 border border-green-200 p-3 rounded-lg mb-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700 font-medium">Daily Income</span>
                    <span className="text-xl font-bold text-secondary">
                      {formatCurrency(plan.dailyIncome)}
                    </span>
                  </div>
                </div>

                {/* Plan Details */}
                <div className="space-y-2 text-sm mb-4">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Validity:</span>
                    <span className="font-medium">{plan.validityDays} Days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Total Income:</span>
                    <span className="font-medium text-secondary">
                      {formatCurrency(calculateTotalIncome(plan.dailyIncome, plan.validityDays))}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-neutral-200">
                    <span className="text-neutral-700 font-semibold">Total Return:</span>
                    <span className="font-bold text-secondary text-lg">
                      {formatCurrency(
                        calculateTotalIncome(plan.dailyIncome, plan.validityDays)
                      )}
                    </span>
                  </div>
                </div>

                {/* Activate Button */}
                {plan.isActive ? (
                  <button
                    onClick={() => handleActivatePlan(plan)}
                    className="btn-primary w-full"
                    disabled={activating === plan.id}
                  >
                    {activating === plan.id ? 'Activating...' : 'Activate Plan'}
                  </button>
                ) : (
                  <button className="btn-primary w-full opacity-50" disabled>
                    Currently Unavailable
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
