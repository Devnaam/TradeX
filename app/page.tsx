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

            {/* Right Image Section - Shows FIRST on mobile */}
            <div className="relative w-full h-[350px] sm:h-[450px] md:h-[500px] lg:h-[600px] order-1 lg:order-2">
              {/* Main Container with Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-teal-50 rounded-3xl shadow-2xl overflow-hidden border-4 border-white">

                {/* Animated Background Circles */}
                <div className="absolute top-10 right-10 w-40 h-40 bg-emerald-200/30 rounded-full blur-3xl animate-[pulse_4s_ease-in-out_infinite]"></div>
                <div className="absolute bottom-20 left-10 w-60 h-60 bg-blue-200/30 rounded-full blur-3xl animate-[pulse_5s_ease-in-out_infinite]"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl animate-[pulse_6s_ease-in-out_infinite]"></div>

                {/* Floating Money Icons with Animation */}
                <div className="absolute top-[15%] left-[10%] text-3xl sm:text-4xl animate-[float_3s_ease-in-out_infinite] opacity-40">
                  💰
                </div>
                <div className="absolute top-[25%] right-[15%] text-2xl sm:text-3xl animate-[float_4s_ease-in-out_infinite] opacity-40" style={{ animationDelay: '0.5s' }}>
                  📈
                </div>
                <div className="absolute bottom-[30%] left-[15%] text-3xl sm:text-4xl animate-[float_3.5s_ease-in-out_infinite] opacity-40" style={{ animationDelay: '1s' }}>
                  💵
                </div>
                <div className="absolute bottom-[20%] right-[10%] text-2xl sm:text-3xl animate-[float_4.5s_ease-in-out_infinite] opacity-40" style={{ animationDelay: '1.5s' }}>
                  💎
                </div>
                <div className="absolute top-[40%] right-[8%] text-3xl sm:text-4xl animate-[float_3.8s_ease-in-out_infinite] opacity-40" style={{ animationDelay: '2s' }}>
                  🪙
                </div>

                {/* Central Content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 sm:p-8 md:p-10">

                  {/* Growing Plant/Money Tree Icon */}
                  <div className="mb-6 sm:mb-8 animate-[scaleUp_2s_ease-out] relative">
                    <div className="text-7xl sm:text-8xl md:text-9xl animate-[float_3s_ease-in-out_infinite]">
                      🌱
                    </div>
                    {/* Sparkle Effect */}
                    <div className="absolute -top-2 -right-2 text-3xl sm:text-4xl animate-[pulse_2s_ease-in-out_infinite]">
                      ✨
                    </div>
                    <div className="absolute -bottom-2 -left-2 text-3xl sm:text-4xl animate-[pulse_2s_ease-in-out_infinite]" style={{ animationDelay: '1s' }}>
                      ✨
                    </div>
                  </div>

                  {/* Main Text - Animated */}
                  <div className="text-center space-y-3 sm:space-y-4">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 animate-[fadeIn_1.5s_ease-out] leading-tight px-4">
                      Your Money
                    </h2>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-emerald-600 to-teal-600 animate-[fadeIn_1.8s_ease-out] leading-tight px-4">
                      Grows Here
                    </h2>
                  </div>

                  {/* Animated Arrow pointing up with growth percentage */}
                  <div className="mt-6 sm:mt-8 flex items-center gap-3 animate-[fadeIn_2.2s_ease-out]">
                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg border border-emerald-200">
                      <svg className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-600 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                      <span className="text-xl sm:text-2xl md:text-3xl font-bold text-emerald-600">+95%</span>
                    </div>
                  </div>

                  {/* Subtitle */}
                  <p className="mt-4 sm:mt-6 text-sm sm:text-base md:text-lg text-slate-600 font-semibold animate-[fadeIn_2.5s_ease-out] px-4 text-center">
                    Daily Returns • Global Markets • Secure
                  </p>
                </div>

                {/* Decorative Corner Elements */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-emerald-400/20 to-transparent rounded-bl-full"></div>
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-blue-400/20 to-transparent rounded-tr-full"></div>

              </div>

              {/* Floating Badge - Partnership */}
              <div className="absolute -bottom-4 -left-4 sm:-bottom-6 sm:-left-6 bg-white rounded-2xl shadow-2xl p-3 sm:p-4 border-2 border-emerald-500 animate-[slideRight_1.5s_ease-out]">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                    <svg className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>

                </div>
              </div>


            </div>

            {/* Left Content - Shows SECOND on mobile */}
            <div className="text-center lg:text-left order-2 lg:order-1">
              {/* Partnership Badge */}
              <div className="inline-flex flex-col sm:flex-row items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-emerald-600 text-white px-4 sm:px-5 py-2.5 sm:py-3 rounded-full mb-4 sm:mb-6 shadow-lg animate-[fadeIn_0.8s_ease-out]">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-bold">Official Partner</span>
                </div>
                <div className="hidden sm:block w-px h-5 bg-white/30"></div>
                <span className="text-xs sm:text-sm font-bold">Grow Capital</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight px-2 sm:px-0 animate-[fadeIn_1s_ease-out]">
                Invest Globally with <span className="text-emerald-600">Grow Capital</span> Partnership
              </h1>

              <p className="text-sm sm:text-base lg:text-lg text-slate-600 mb-4 sm:mb-5 leading-relaxed max-w-xl mx-auto lg:mx-0 px-2 sm:px-0 animate-[fadeIn_1.2s_ease-out]">
                TradeX has partnered with <span className="font-bold text-slate-900">Grow Capital</span>, a trusted global investment consulting firm.
                Your funds are professionally managed and invested in international stock markets, cryptocurrencies, and real estate opportunities.
              </p>

              {/* Trust Indicators */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-3 sm:gap-4 mb-6 sm:mb-8 px-2 sm:px-0 animate-[fadeIn_1.4s_ease-out]">
                <div className="flex items-center gap-2 bg-emerald-50 px-3 sm:px-4 py-2 rounded-lg border border-emerald-200">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs sm:text-sm font-bold text-emerald-900">12+ Years Experience</span>
                </div>
                <div className="flex items-center gap-2 bg-blue-50 px-3 sm:px-4 py-2 rounded-lg border border-blue-200">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                  </svg>
                  <span className="text-xs sm:text-sm font-bold text-blue-900">2,500+ Investors</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-500 mb-6 sm:mb-8 px-2 sm:px-0 max-w-xl mx-auto lg:mx-0 animate-[fadeIn_1.6s_ease-out]">
                <span className="font-semibold text-red-600">⚠️ Risk Disclaimer:</span> Trading and investments involve substantial risk of loss. Market fluctuations can affect returns. Invest only what you can afford to lose. Past performance does not guarantee future results.
              </p>


              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start px-4 sm:px-0 animate-[fadeIn_1.8s_ease-out]">
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

          </div>
        </div>
      </section>


      {/* Partnership Trust Section - NEW */}
      <section className="py-8 sm:py-10 bg-gradient-to-r from-blue-50 via-emerald-50 to-blue-50 border-y border-neutral-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-6">
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
              Powered by Grow Capital's Global Investment Expertise
            </h3>
            <p className="text-sm sm:text-base text-slate-600 max-w-3xl mx-auto">
              Your investments are managed by Grow Capital's experienced team with access to international markets,
              ensuring diversified portfolio and professional risk management.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 text-center">
              <div className="text-2xl sm:text-3xl mb-2">🌍</div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Global Markets</p>
              <p className="text-xs text-slate-600">Multi-country investments</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 text-center">
              <div className="text-2xl sm:text-3xl mb-2">📊</div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Stock Trading</p>
              <p className="text-xs text-slate-600">Professional analysis</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 text-center">
              <div className="text-2xl sm:text-3xl mb-2">₿</div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Crypto Markets</p>
              <p className="text-xs text-slate-600">Expert crypto trading</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl border border-neutral-200 text-center">
              <div className="text-2xl sm:text-3xl mb-2">🏢</div>
              <p className="text-xs sm:text-sm font-bold text-slate-900 mb-1">Real Estate</p>
              <p className="text-xs text-slate-600">Property investments</p>
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
              We make investing simple. Your money is professionally managed by Grow Capital's expert traders,
              generating consistent returns from global markets.
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
                Select from 6 plans. Grow Capital invests globally for you.
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
              Choose a plan that fits your budget. All plans run for 365 days.
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
                  <span className="text-secondary">✓</span> Total Return: ₹18,250
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <span className="text-secondary">✓</span> 365 Days Validity
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
              <h3 className="text-3xl font-bold text-white mb-4">₹10,000</h3>
              <div className="bg-white/10 backdrop-blur-sm border border-white/20 p-4 rounded-lg mb-6">
                <p className="text-sm text-blue-200 mb-1">Daily Income</p>
                <p className="text-2xl font-bold text-green-400">₹100</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-white">
                  <span className="text-green-400">✓</span> Total Return: ₹54,750
                </li>
                <li className="flex items-center gap-2 text-sm text-white">
                  <span className="text-green-400">✓</span> 365 Days Validity
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
              <h3 className="text-3xl font-bold text-neutral-900 mb-4">₹50,000</h3>
              <div className="bg-green-50 border border-green-200 p-4 rounded-lg mb-6">
                <p className="text-sm text-green-700 mb-1">Daily Income</p>
                <p className="text-2xl font-bold text-secondary">₹1,500</p>
              </div>
              <ul className="space-y-3 mb-6">
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <span className="text-secondary">✓</span> Total Return: ₹5,47,500
                </li>
                <li className="flex items-center gap-2 text-sm text-neutral-700">
                  <span className="text-secondary">✓</span> 365 Days Validity
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
                Grow Capital's team of professional traders has 12+ years of experience in global stock markets and
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
            Join 2,500+ investors who are already making passive income with TradeX and Grow Capital.
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
                  </Link>
                </div>
                <span className="text-white font-bold">TradeX</span>
              </div>
              <p className="text-sm">
                Smart investments in stocks and crypto through our partnership with Grow Capital. Earn daily returns with complete transparency.
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
            <p className="mt-2 text-xs text-neutral-500">Powered by Grow Capital | Global Investment Consulting</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
