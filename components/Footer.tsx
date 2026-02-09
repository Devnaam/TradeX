import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
    return (
        <footer className="bg-slate-50 border-t border-slate-200 mb-10">
            {/* Top Section - Animated Journey */}
           
            {/* Main Footer Content */}
            <div className="bg-white py-12 sm:py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Footer Grid */}


                    {/* Bottom Bar */}
                    <div className="border-t border-slate-200 pt-8">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-4">

                            {/* Copyright */}
                            <div className="text-center md:text-left">
                                <p className="text-sm text-slate-600 mb-2">
                                    © 2025 TradeX. All rights reserved.
                                </p>
                            </div>

                            {/* Trust Badges */}
                            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600">
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                    <span>SEBII Registered</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                    </svg>
                                    <span>Bank-Grade Security</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                    <span>24/7 Support</span>
                                </div>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}
