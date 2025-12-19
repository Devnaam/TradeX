'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Image from 'next/image';

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
          <Link href="/" className="flex items-center gap-2 cursor-pointer">
            <Image
              src="/Trade_logo-removebg-preview.png"
              alt="TradeX Logo"
              width={80}
              height={80}
              className="w-100 h-100 object-contain"
              priority
            />
            {/* <span className="text-xl font-bold text-primary">TradeX</span> */}
          </Link>
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
      <section className="relative bg-white text-slate-900 py-12 sm:py-16 md:py-24 overflow-hidden">
        {/* Subtle Money Background */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <div className="absolute top-[8%] left-[5%] text-4xl sm:text-5xl text-emerald-600">💰</div>
          <div className="absolute top-[15%] right-[8%] text-3xl sm:text-4xl text-emerald-600">💵</div>
          <div className="absolute top-[35%] left-[12%] text-3xl sm:text-4xl text-emerald-600">💸</div>
          <div className="absolute top-[55%] right-[15%] text-4xl sm:text-5xl text-emerald-600">💳</div>
          <div className="absolute top-[68%] left-[20%] text-3xl sm:text-4xl text-emerald-600">📈</div>
          <div className="absolute top-[25%] right-[3%] text-2xl sm:text-3xl text-emerald-600">💎</div>
          <div className="absolute bottom-[8%] left-[8%] text-4xl sm:text-5xl text-emerald-600">🪙</div>
          <div className="absolute bottom-[15%] right-[10%] text-3xl sm:text-4xl text-emerald-600">💰</div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-16 items-center">

            {/* Left Content - Perfect! */}
            <div className="text-center lg:text-left">
              <div className="inline-block bg-emerald-600 text-white px-4 py-2 rounded-full mb-4 sm:mb-6">
                <p className="text-xs sm:text-sm font-medium">🚀 Trusted by 2,500+ Investors</p>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2 sm:px-0">
                Grow Your Wealth with <span className="text-emerald-600">Smart Investments</span>
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-6 sm:mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0 px-2 sm:px-0">
                We invest your money in stock markets and cryptocurrencies, generating consistent
                daily returns. Start earning passive income today with plans starting from just ₹5,000.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0">
                <Link href="/signup" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-bold text-base sm:text-lg shadow-lg transition-all transform hover:scale-105">
                    Start Investing Now →
                  </button>
                </Link>
                <a href="#how-it-works" className="w-full sm:w-auto">
                  <button className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-lg font-medium text-base sm:text-lg transition-all">
                    Learn How It Works
                  </button>
                </a>
              </div>
            </div>

            {/* Right - Mobile First Animated Trading Chart */}
            <div className="relative w-full h-[300px] sm:h-[400px] md:h-[450px] lg:h-[550px] xl:h-[600px]">

              {/* Chart Container - Mobile First */}
              <div className="absolute inset-0 bg-white border-2 sm:border-3 lg:border-4 border-slate-900 rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-xl lg:shadow-2xl p-3 sm:p-4 md:p-6 lg:p-8 overflow-hidden">

                {/* Animated Trading Chart */}
                <svg viewBox="0 0 800 600" className="w-full h-full" preserveAspectRatio="xMidYMid meet">

                  {/* Grid Background */}
                  <defs>
                    <pattern id="grid" width="80" height="60" patternUnits="userSpaceOnUse">
                      <path d="M 80 0 L 0 0 0 60" fill="none" stroke="#E2E8F0" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="800" height="600" fill="url(#grid)" />

                  {/* Horizontal Reference Lines */}
                  <line x1="0" y1="120" x2="800" y2="120" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="8,4" />
                  <line x1="0" y1="240" x2="800" y2="240" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="8,4" />
                  <line x1="0" y1="360" x2="800" y2="360" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="8,4" />
                  <line x1="0" y1="480" x2="800" y2="480" stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="8,4" />

                  {/* Animated Candlesticks */}
                  <g className="animate-[fadeIn_1s_ease-out]">
                    {/* Candle 1 - Green */}
                    <line x1="80" y1="420" x2="80" y2="360" stroke="#059669" strokeWidth="2.5" className="animate-[grow_2s_ease-out]" />
                    <rect x="67" y="380" width="26" height="40" fill="#059669" className="animate-[grow_2s_ease-out]" />

                    {/* Candle 2 - Red */}
                    <line x1="160" y1="340" x2="160" y2="400" stroke="#DC2626" strokeWidth="2.5" className="animate-[grow_2.2s_ease-out]" />
                    <rect x="147" y="340" width="26" height="50" fill="#DC2626" className="animate-[grow_2.2s_ease-out]" />

                    {/* Candle 3 - Green */}
                    <line x1="240" y1="380" x2="240" y2="300" stroke="#059669" strokeWidth="2.5" className="animate-[grow_2.4s_ease-out]" />
                    <rect x="227" y="320" width="26" height="60" fill="#059669" className="animate-[grow_2.4s_ease-out]" />

                    {/* Candle 4 - Green */}
                    <line x1="320" y1="340" x2="320" y2="260" stroke="#059669" strokeWidth="2.5" className="animate-[grow_2.6s_ease-out]" />
                    <rect x="307" y="280" width="26" height="60" fill="#059669" className="animate-[grow_2.6s_ease-out]" />

                    {/* Candle 5 - Red */}
                    <line x1="400" y1="280" x2="400" y2="340" stroke="#DC2626" strokeWidth="2.5" className="animate-[grow_2.8s_ease-out]" />
                    <rect x="387" y="280" width="26" height="50" fill="#DC2626" className="animate-[grow_2.8s_ease-out]" />

                    {/* Candle 6 - Green */}
                    <line x1="480" y1="320" x2="480" y2="220" stroke="#059669" strokeWidth="2.5" className="animate-[grow_3s_ease-out]" />
                    <rect x="467" y="240" width="26" height="80" fill="#059669" className="animate-[grow_3s_ease-out]" />

                    {/* Candle 7 - Green */}
                    <line x1="560" y1="260" x2="560" y2="180" stroke="#059669" strokeWidth="2.5" className="animate-[grow_3.2s_ease-out]" />
                    <rect x="547" y="200" width="26" height="60" fill="#059669" className="animate-[grow_3.2s_ease-out]" />

                    {/* Candle 8 - Green */}
                    <line x1="640" y1="220" x2="640" y2="140" stroke="#059669" strokeWidth="2.5" className="animate-[grow_3.4s_ease-out]" />
                    <rect x="627" y="160" width="26" height="60" fill="#059669" className="animate-[grow_3.4s_ease-out]" />

                    {/* Candle 9 - Red */}
                    <line x1="720" y1="160" x2="720" y2="200" stroke="#DC2626" strokeWidth="2.5" className="animate-[grow_3.6s_ease-out]" />
                    <rect x="707" y="160" width="26" height="40" fill="#DC2626" className="animate-[grow_3.6s_ease-out]" />
                  </g>

                  {/* Moving Trend Line */}
                  <polyline
                    points="40,450 120,400 200,350 280,300 360,280 440,250 520,220 600,190 680,160 760,180"
                    fill="none"
                    stroke="#3B82F6"
                    strokeWidth="3"
                    strokeLinecap="round"
                    className="animate-[drawLine_4s_ease-out_forwards]"
                    opacity="0.6"
                  />

                  {/* Glowing Data Points */}
                  <circle cx="280" cy="300" r="6" fill="#059669" className="animate-[pulse_2s_ease-in-out_infinite]">
                    <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="520" cy="220" r="6" fill="#059669" className="animate-[pulse_2s_ease-in-out_infinite]">
                    <animate attributeName="r" values="6;10;6" dur="2s" repeatCount="indefinite" begin="0.5s" />
                  </circle>

                  {/* Volume Bars at Bottom */}
                  <g opacity="0.3" className="animate-[fadeIn_3s_ease-out]">
                    <rect x="62" y="520" width="16" height="40" fill="#059669" />
                    <rect x="142" y="540" width="16" height="20" fill="#DC2626" />
                    <rect x="222" y="510" width="16" height="50" fill="#059669" />
                    <rect x="302" y="500" width="16" height="60" fill="#059669" />
                    <rect x="382" y="530" width="16" height="30" fill="#DC2626" />
                    <rect x="462" y="495" width="16" height="65" fill="#059669" />
                    <rect x="542" y="490" width="16" height="70" fill="#059669" />
                    <rect x="622" y="485" width="16" height="75" fill="#059669" />
                    <rect x="702" y="525" width="16" height="35" fill="#DC2626" />
                  </g>

                </svg>

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
                  <Link href="/" className="flex items-center gap-2 cursor-pointer">
                    <Image
                      src="/Trade_logo-removebg-preview.png"
                      alt="TradeX Logo"
                      width={80}
                      height={80}
                      className="w-100 h-100 object-contain bg whitespace-normal"
                      priority
                    />
                    {/* <span className="text-xl font-bold text-primary">TradeX</span> */}
                  </Link>
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
