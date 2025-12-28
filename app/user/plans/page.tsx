'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import BottomNav from '@/components/BottomNav';
import Footer from '@/components/Footer';

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

  // Plan name mapping
  const getPlanName = (planNumber: number): string => {
    const planNames: { [key: number]: string } = {
      1: 'Core',
      2: 'Plus',
      3: 'Prime',
      4: 'Ultra',
      5: 'Apex',
      6: 'Zenith',
    };
    return planNames[planNumber] || `Plan ${planNumber}`;
  };

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
    const planName = getPlanName(plan.planNumber);
    const confirmed = window.confirm(
      `Activate ${planName} Plan for ${formatCurrency(plan.amount)}?`
    );

    if (!confirmed) return;

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
        alert(`✅ ${planName} Plan activated successfully!`);
        fetchWallet();
        router.push('/user/investments');
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent"></div>
          <p className="mt-4 text-foreground font-medium">Loading plans...</p>
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h1 className="text-lg font-bold">Investment Plans</h1>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        
        {/* Balance Card */}
        <div className="card !p-6 bg-white border-2 border-neutral-200 shadow-lg">
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                <p className="text-sm font-bold text-neutral-600">Available Balance</p>
              </div>
              <p className="text-4xl font-bold text-emerald-600">
                {formatCurrency(rechargeBalance)}
              </p>
            </div>
            <Link href="/user/deposit">
              <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 px-6 rounded-button transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 whitespace-nowrap">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                <span>Recharge</span>
              </button>
            </Link>
          </div>
        </div>

        {/* Info Note */}
        <div className="card !p-5 bg-emerald-50 border-2 border-emerald-200">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-bold text-emerald-900 mb-2">Plan Information</h4>
              <ul className="text-xs text-emerald-800 space-y-1.5">
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>All plans have <strong>365 days (1 year)</strong> validity</span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>Daily income credited at <strong>12:00 AM IST</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <svg className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span>You can purchase the same plan multiple times</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Plans Grid */}
        {plans.length === 0 ? (
          <div className="card !p-12 text-center border-2 border-neutral-200 shadow-lg">
            <div className="text-6xl mb-4">📊</div>
            <h3 className="text-xl font-bold text-foreground mb-2">No Plans Available</h3>
            <p className="text-neutral-600">Investment plans will appear here when available</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {plans.map((plan) => {
              const planName = getPlanName(plan.planNumber);
              return (
                <div
                  key={plan.id}
                  className={`card !p-6 transition-all shadow-lg ${
                    plan.isActive 
                      ? 'border-2 border-neutral-200 hover:border-emerald-600 hover:shadow-xl' 
                      : 'border-2 border-neutral-300 opacity-60'
                  }`}
                >
                  {/* Plan Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-14 h-14 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg border-2 border-emerald-500">
                          <span className="text-white font-bold text-2xl">{plan.planNumber}</span>
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-emerald-600">
                            {planName}
                          </h3>
                          <p className="text-xs text-neutral-500 font-medium">Investment Plan {plan.planNumber}</p>
                        </div>
                      </div>
                      <p className="text-3xl font-bold text-foreground">
                        {formatCurrency(plan.amount)}
                      </p>
                    </div>
                    {!plan.isActive && (
                      <span className="px-3 py-1.5 bg-neutral-200 text-neutral-600 text-xs font-bold rounded-full border-2 border-neutral-300">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Daily Income Highlight */}
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-4 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-sm font-bold text-green-900">Daily Income</span>
                      </div>
                      <span className="text-2xl font-bold text-green-600">
                        {formatCurrency(plan.dailyIncome)}
                      </span>
                    </div>
                  </div>

                  {/* Plan Details */}
                  <div className="space-y-3 mb-5">
                    <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                      <span className="text-sm text-neutral-600 font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        Validity
                      </span>
                      <span className="font-bold text-foreground">{plan.validityDays} Days</span>
                    </div>
                    
                    <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                      <span className="text-sm text-neutral-600 font-medium flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                        Total Income
                      </span>
                      <span className="font-bold text-green-600">
                        {formatCurrency(calculateTotalIncome(plan.dailyIncome, plan.validityDays))}
                      </span>
                    </div>
                    
                    <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border-2 border-green-200 shadow-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-green-900">Total Return</span>
                        <span className="text-2xl font-bold text-green-600">
                          {formatCurrency(calculateTotalIncome(plan.dailyIncome, plan.validityDays))}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Activate Button */}
                  {plan.isActive ? (
                    <button
                      onClick={() => handleActivatePlan(plan)}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-14 px-6 rounded-button transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      disabled={activating === plan.id}
                    >
                      {activating === plan.id ? (
                        <>
                          <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Activating...</span>
                        </>
                      ) : (
                        <>
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          <span>Activate {planName}</span>
                        </>
                      )}
                    </button>
                  ) : (
                    <button className="w-full h-14 bg-neutral-200 text-neutral-500 font-bold rounded-button cursor-not-allowed border-2 border-neutral-300" disabled>
                      Currently Unavailable
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
      
      <Footer />
      <BottomNav />
    </div>
  );
}
