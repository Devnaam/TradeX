'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    totalUsers: 2547,
    totalInvested: 12500000,
    dailyReturns: 450000,
  });

  useEffect(() => {
    // Check if user is already logged in
    const userData = localStorage.getItem('user');
    if (userData) {
      router.push('/user/dashboard');
    }
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header/Navbar */}
      <nav className="bg-white border-b border-neutral-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <span className="text-white text-xl font-bold">T</span>
            </div>
            <span className="text-xl font-bold text-primary">TradeX</span>
          </div>
          <div className="flex gap-3">
            <Link href="/login">
              <button className="text-sm text-neutral-700 px-4 py-2 rounded-lg hover:bg-neutral-100 font-medium">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="btn-primary text-sm">Get Started</button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-primary to-blue-800 text-white py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-block bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <p className="text-sm font-medium">🚀 Trusted by 2,500+ Investors</p>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                Grow Your Wealth with <span className="text-green-400">Smart Investments</span>
              </h1>
              <p className="text-lg text-blue-100 mb-8 leading-relaxed">
                We invest your money in stock markets and cryptocurrencies, generating consistent
                daily returns. Start earning passive income today with plans starting from just ₹5,000.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/signup">
                  <button className="bg-secondary hover:bg-green-600 text-white px-8 py-4 rounded-lg font-bold text-lg shadow-lg transition-all transform hover:scale-105">
                    Start Investing Now →
                  </button>
                </Link>
                <a href="#how-it-works">
                  <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-8 py-4 rounded-lg font-medium border border-white/30 transition-all">
                    Learn How It Works
                  </button>
                </a>
              </div>
            </div>

            {/* Right - Stats Cards */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="text-3xl mb-2">📈</div>
                <p className="text-3xl font-bold text-green-400">₹{(stats.totalInvested / 10000000).toFixed(1)}Cr+</p>
                <p className="text-sm text-blue-200">Total Invested</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="text-3xl mb-2">👥</div>
                <p className="text-3xl font-bold text-green-400">{stats.totalUsers.toLocaleString()}+</p>
                <p className="text-sm text-blue-200">Active Investors</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="text-3xl mb-2">💰</div>
                <p className="text-3xl font-bold text-green-400">₹{(stats.dailyReturns / 100000).toFixed(1)}L</p>
                <p className="text-sm text-blue-200">Daily Returns</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm p-6 rounded-xl border border-white/20">
                <div className="text-3xl mb-2">⚡</div>
                <p className="text-3xl font-bold text-green-400">95 Days</p>
                <p className="text-sm text-blue-200">ROI Period</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-6 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap justify-center items-center gap-8 text-center">
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span className="text-sm font-medium text-neutral-700">100% Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span className="text-sm font-medium text-neutral-700">Verified Platform</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">💳</span>
              <span className="text-sm font-medium text-neutral-700">Instant Withdrawals</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">📊</span>
              <span className="text-sm font-medium text-neutral-700">Daily Returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 md:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              How TradeX Works
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              We make investing simple. Your money works for you while our expert traders
              generate consistent returns from stock markets and crypto.
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            {/* Step 1 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📝</span>
              </div>
              <div className="text-primary font-bold text-sm mb-2">STEP 1</div>
              <h3 className="text-lg font-bold text-neutral-900 mb-3">Sign Up Free</h3>
              <p className="text-sm text-neutral-600">
                Create your account in less than 2 minutes. No hidden charges.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💰</span>
              </div>
              <div className="text-primary font-bold text-sm mb-2">STEP 2</div>
              <h3 className="text-lg font-bold text-neutral-900 mb-3">Recharge Wallet</h3>
              <p className="text-sm text-neutral-600">
                Add funds via UPI, bank transfer. Minimum ₹300 only.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              <div className="text-primary font-bold text-sm mb-2">STEP 3</div>
              <h3 className="text-lg font-bold text-neutral-900 mb-3">Choose a Plan</h3>
              <p className="text-sm text-neutral-600">
                Select from 6 plans. We invest in stocks & crypto for you.
              </p>
            </div>

            {/* Step 4 */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-neutral-200 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🎉</span>
              </div>
              <div className="text-secondary font-bold text-sm mb-2">STEP 4</div>
              <h3 className="text-lg font-bold text-neutral-900 mb-3">Earn Daily</h3>
              <p className="text-sm text-neutral-600">
                Get daily returns at 12 AM IST. Withdraw anytime.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Investment Plans Preview */}
      <section className="py-16 md:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Investment Plans
            </h2>
            <p className="text-lg text-neutral-600">
              Choose a plan that fits your budget. All plans run for 95 days.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {/* Starter Plan */}
            <div className="bg-neutral-50 p-8 rounded-xl border-2 border-neutral-200 hover:border-primary transition-all">
              <div className="text-sm font-bold text-primary mb-2">STARTER</div>
              <h3 className="text-3xl font-bold text-neutral-900 mb-4">₹5,000</h3>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-700 mb-1">Daily Income</p>
                <p className="text-2xl font-bold text-secondary">₹50</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <span className="text-secondary">✓</span> Total Return: ₹4,750
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <span className="text-secondary">✓</span> 95 Days Validity
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <span className="text-secondary">✓</span> Daily Auto Credit
                </li>
              </ul>
              <Link href="/signup">
                <button className="w-full btn-secondary">Start Now</button>
              </Link>
            </div>

            {/* Popular Plan */}
            <div className="bg-primary p-8 rounded-xl border-2 border-primary shadow-xl transform md:scale-105 relative">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-secondary text-white px-4 py-1 rounded-full text-xs font-bold">
                MOST POPULAR
              </div>
              <div className="text-sm font-bold text-green-400 mb-2">GROWTH</div>
              <h3 className="text-3xl font-bold text-white mb-4">₹20,000</h3>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-200 mb-1">Daily Income</p>
                <p className="text-2xl font-bold text-green-400">₹400</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-white">
                  <span className="text-green-400">✓</span> Total Return: ₹38,000
                </li>
                <li className="flex items-center gap-2 text-sm text-white">
                  <span className="text-green-400">✓</span> 95 Days Validity
                </li>
                <li className="flex items-center gap-2 text-sm text-white">
                  <span className="text-green-400">✓</span> Priority Support
                </li>
              </ul>
              <Link href="/signup">
                <button className="w-full bg-secondary hover:bg-green-600 text-white px-6 py-3 rounded-lg font-bold transition-all">
                  Invest Now
                </button>
              </Link>
            </div>

            {/* Premium Plan */}
            <div className="bg-neutral-50 p-8 rounded-xl border-2 border-neutral-200 hover:border-primary transition-all">
              <div className="text-sm font-bold text-primary mb-2">PREMIUM</div>
              <h3 className="text-3xl font-bold text-neutral-900 mb-4">₹1,00,000</h3>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-700 mb-1">Daily Income</p>
                <p className="text-2xl font-bold text-secondary">₹5,000</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <span className="text-secondary">✓</span> Total Return: ₹4,75,000
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <span className="text-secondary">✓</span> 95 Days Validity
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <span className="text-secondary">✓</span> VIP Support
                </li>
              </ul>
              <Link href="/signup">
                <button className="w-full btn-secondary">Start Now</button>
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/signup">
              <button className="btn-primary px-8 py-4 text-lg">
                View All 6 Plans →
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-neutral-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Why Choose TradeX?
            </h2>
            <p className="text-lg text-neutral-600">
              We're not just another investment platform. Here's what makes us different.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Expert Traders</h3>
              <p className="text-neutral-600">
                Our team of professional traders has 10+ years of experience in stock markets and
                cryptocurrency trading.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">💎</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Transparent System</h3>
              <p className="text-neutral-600">
                Track your investments in real-time. See exactly where your money is going and how
                much you're earning.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Instant Withdrawals</h3>
              <p className="text-neutral-600">
                Withdraw your earnings anytime. All withdrawal requests are processed within 24
                hours.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">🔐</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">100% Secure</h3>
              <p className="text-neutral-600">
                Your data and money are protected with bank-level encryption. We never share your
                information.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">🎁</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">Referral Rewards</h3>
              <p className="text-neutral-600">
                Earn 10% commission on every deposit made by users you refer. Unlimited earning
                potential.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm">
              <div className="text-4xl mb-4">📞</div>
              <h3 className="text-xl font-bold text-neutral-900 mb-3">24/7 Support</h3>
              <p className="text-neutral-600">
                Our support team is always available on Telegram to help you with any questions or
                issues.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 md:py-24 bg-gradient-to-br from-primary via-blue-800 to-blue-900 text-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Ready to Start Earning Daily Income?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join 2,500+ investors who are already making passive income with TradeX.
            No experience needed. Start with just ₹5,000.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <button className="bg-secondary hover:bg-green-600 text-white px-10 py-4 rounded-lg font-bold text-lg shadow-lg transition-all transform hover:scale-105">
                Create Free Account →
              </button>
            </Link>
            <Link href="/login">
              <button className="bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white px-10 py-4 rounded-lg font-medium border border-white/30 transition-all">
                Already a Member? Login
              </button>
            </Link>
          </div>
          <p className="text-sm text-blue-200 mt-6">
            ✓ No credit card required  •  ✓ Start in 2 minutes  •  ✓ Withdraw anytime
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold">T</span>
                </div>
                <span className="text-white font-bold">TradeX</span>
              </div>
              <p className="text-sm">
                Smart investments in stocks and crypto. Earn daily returns with complete transparency.
              </p>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/signup" className="hover:text-white">Get Started</Link></li>
                <li><Link href="/login" className="hover:text-white">Login</Link></li>
                <li><a href="#how-it-works" className="hover:text-white">How It Works</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Help Center</a></li>
                <li><a href="#" className="hover:text-white">Contact Us</a></li>
                <li><a href="#" className="hover:text-white">Telegram Support</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Risk Disclosure</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 pt-8 text-center text-sm">
            <p>© 2025 TradeX. All rights reserved. Investments are subject to market risks.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
