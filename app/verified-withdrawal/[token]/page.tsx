'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface VerifiedWithdrawal {
  amount: number;
  userName: string;
  date: string;
  method: string;
  isValid: boolean;
  expiresAt: string;
}

export default function VerifiedWithdrawalPage() {
  const params = useParams();
  const token = params.token as string;

  const [withdrawal, setWithdrawal] = useState<VerifiedWithdrawal | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVerifiedWithdrawal();
  }, [token]);

  const fetchVerifiedWithdrawal = async () => {
    try {
      const response = await fetch(`/api/verified-withdrawal/${token}`);
      const data = await response.json();

      if (data.success) {
        setWithdrawal(data.data);
      } else {
        setError(data.error || 'Invalid or expired verification link');
      }
    } catch (err) {
      setError('Failed to verify withdrawal');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-emerald-600 border-t-transparent mb-4"></div>
          <p className="text-base font-semibold text-foreground">Verifying withdrawal...</p>
          <p className="text-sm text-neutral-600 mt-2">Please wait</p>
        </div>
      </div>
    );
  }

  if (error || !withdrawal) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <div className="max-w-md w-full card !p-6 sm:!p-8 border-2 border-red-500 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold text-red-600 mb-3">Verification Failed</h1>
          <p className="text-sm text-neutral-600 mb-6">{error}</p>
          <Link href="/">
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-button transition-all shadow-lg">
              Return to TradeX
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-6 px-4">
      <div className="max-w-lg mx-auto space-y-6">
        
        {/* Main Verification Card */}
        <div className="card !p-0 border-2 border-emerald-600 shadow-lg overflow-hidden">
          
          {/* Header */}
          <div className="bg-emerald-600 px-4 py-6 sm:px-6 sm:py-8 text-center">
            <div className="mb-4">
              <Image
                src="/Trade_logo-removebg-preview.png"
                alt="TradeX Logo"
                width={64}
                height={64}
                className="w-16 h-16 sm:w-20 sm:h-20 mx-auto"
                priority
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white mb-1">TradeX</h1>
            <p className="text-sm text-white/90 font-medium">Verified Withdrawal Certificate</p>
          </div>

          {/* Verification Badge */}
          <div className="flex justify-center -mt-8 relative z-10 mb-6">
            <div className="bg-white rounded-full p-3 sm:p-4 shadow-xl border-4 border-emerald-600">
              <svg className="w-10 h-10 sm:w-12 sm:h-12 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="px-4 sm:px-6 pb-6 sm:pb-8">
            
            {/* Amount Section */}
            <div className="text-center mb-6">
              <p className="text-xs sm:text-sm text-neutral-600 mb-2 font-semibold uppercase tracking-wide">
                Withdrawal Amount
              </p>
              <p className="text-4xl sm:text-5xl font-black text-emerald-600 mb-3">
                {formatCurrency(withdrawal.amount)}
              </p>
              <div className="inline-flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border-2 border-green-200">
                <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-xs sm:text-sm font-bold text-green-700">Verified & Approved</span>
              </div>
            </div>

            {/* Details Card */}
            <div className="card !p-4 sm:!p-5 border-2 border-neutral-200 mb-5">
              <h3 className="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Withdrawal Details
              </h3>
              
              <div className="space-y-3">
                {/* User */}
                <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                  <span className="text-xs sm:text-sm text-neutral-600 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    User
                  </span>
                  <span className="text-sm sm:text-base font-bold text-foreground">{withdrawal.userName}</span>
                </div>

                {/* Method */}
                <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                  <span className="text-xs sm:text-sm text-neutral-600 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Method
                  </span>
                  <span className="text-sm sm:text-base font-bold text-foreground capitalize">{withdrawal.method}</span>
                </div>

                {/* Date */}
                <div className="flex justify-between items-center py-2 border-b border-neutral-200">
                  <span className="text-xs sm:text-sm text-neutral-600 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Date
                  </span>
                  <span className="text-xs sm:text-sm font-bold text-foreground">{formatDateTime(withdrawal.date)}</span>
                </div>

                {/* Status */}
                <div className="flex justify-between items-center pt-2">
                  <span className="text-xs sm:text-sm text-neutral-600 font-medium flex items-center gap-2">
                    <svg className="w-4 h-4 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Status
                  </span>
                  <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 px-2.5 py-1 rounded-full text-xs font-bold border border-green-300">
                    <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Approved
                  </span>
                </div>
              </div>
            </div>

            {/* Verification Info */}
            <div className="card !p-4 bg-emerald-50 border-2 border-emerald-200 mb-5">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-emerald-900 mb-2">✓ Verified by TradeX</h3>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    This withdrawal has been officially verified and approved by TradeX. This verification link will expire on <strong>{formatDateTime(withdrawal.expiresAt)}</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            <Link href="/signup">
              <button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-12 sm:h-14 px-6 rounded-button transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2">
                <span className="text-sm sm:text-base">Start Your Investment Journey</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>
            <p className="text-xs text-center text-neutral-600 mt-3">
              Join 2,500+ investors earning daily returns with TradeX
            </p>
          </div>

          {/* Footer */}
          <div className="bg-neutral-100 px-4 py-3 text-center border-t border-neutral-200">
            <p className="text-xs text-neutral-600">
              © 2026 TradeX. All rights reserved. Investments subject to market risks.
            </p>
          </div>
        </div>

        {/* Bottom Notice */}
        <div className="flex items-center justify-center gap-2 text-sm text-neutral-600">
          <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">Verified Proof • Share Responsibly</span>
        </div>
      </div>
    </div>
  );
}
