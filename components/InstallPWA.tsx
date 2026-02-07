'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

interface BeforeInstallPromptEvent extends Event {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPWA() {
    const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
    const [showInstallPrompt, setShowInstallPrompt] = useState(false);

    useEffect(() => {
        // Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return;
        }

        // Check if user has already dismissed the prompt
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (dismissed === 'true') {
            return;
        }

        const handler = (e: Event) => {
            e.preventDefault();
            const promptEvent = e as BeforeInstallPromptEvent;
            setDeferredPrompt(promptEvent);

            // Show prompt after 3 seconds
            setTimeout(() => {
                setShowInstallPrompt(true);
            }, 3000);
        };

        window.addEventListener('beforeinstallprompt', handler);

        return () => {
            window.removeEventListener('beforeinstallprompt', handler);
        };
    }, []);

    const handleInstall = async () => {
        if (!deferredPrompt) return;

        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;

        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }

        setDeferredPrompt(null);
        setShowInstallPrompt(false);
    };

    const handleDismiss = () => {
        setShowInstallPrompt(false);
        localStorage.setItem('pwa-install-dismissed', 'true');
    };

    if (!showInstallPrompt) return null;

    return (
        <>
            {/* Backdrop Overlay */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] animate-fadeIn"
                onClick={handleDismiss}
            />

            {/* Install Prompt Card */}
            <div className="fixed inset-x-0 bottom-0 z-[101] px-4 pb-4 sm:pb-6 animate-slide-up">
                <div className="max-w-sm mx-auto bg-white rounded-3xl shadow-2xl overflow-hidden">

                    {/* Close Button - Floating */}
                    <button
                        onClick={handleDismiss}
                        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 transition-all duration-200 hover:scale-110"
                        aria-label="Close"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Header with App Icon */}
                    <div className="relative pt-8 pb-6 px-6 bg-gradient-to-br from-emerald-500 via-emerald-600 to-teal-600 overflow-hidden">
                        {/* Decorative circles */}
                        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />

                        <div className="relative flex flex-col items-center text-center">
                            {/* App Logo */}
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-4 ring-4 ring-white/20">
                                <Image
                                    src="/Trade_logo-removebg-preview.png"
                                    alt="TradeX"
                                    width={48}
                                    height={48}
                                    className="w-12 h-12 object-contain"
                                />
                            </div>

                            {/* Title */}
                            <h3 className="text-white font-bold text-xl mb-1">
                                Install TradeX
                            </h3>
                            <p className="text-emerald-50 text-sm font-medium">
                                Get instant access on your device
                            </p>
                        </div>
                    </div>

                    {/* Features List */}
                    <div className="px-6 pt-6 pb-5">
                        <div className="space-y-3.5">
                            <div className="flex items-start gap-3 group">
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                                    <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <div className="flex-1 pt-1">
                                    <h4 className="font-semibold text-slate-900 text-sm mb-0.5">Lightning Fast</h4>
                                    <p className="text-slate-500 text-xs leading-relaxed">Instant loading with offline support</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 group">
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div className="flex-1 pt-1">
                                    <h4 className="font-semibold text-slate-900 text-sm mb-0.5">Home Screen Access</h4>
                                    <p className="text-slate-500 text-xs leading-relaxed">Launch directly from your device</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 group">
                                <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                                    <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                    </svg>
                                </div>
                                <div className="flex-1 pt-1">
                                    <h4 className="font-semibold text-slate-900 text-sm mb-0.5">Native Experience</h4>
                                    <p className="text-slate-500 text-xs leading-relaxed">Feels like a real mobile app</p>
                                </div>
                            </div>
                        </div>

                        {/* Stats/Trust Indicator */}
                        <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-center gap-2 text-xs text-slate-500">
                            <svg className="w-4 h-4 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                            </svg>
                            <span className="font-medium">Secure & Privacy Focused</span>
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="px-6 pb-6">
                        <button
                            onClick={handleInstall}
                            className="w-full h-12 bg-gradient-to-r from-emerald-600 to-emerald-700 hover:from-emerald-700 hover:to-emerald-800 text-white font-bold text-[15px] rounded-xl transition-all duration-200 shadow-lg shadow-emerald-600/25 hover:shadow-xl hover:shadow-emerald-600/30 hover:scale-[1.02] active:scale-[0.98] mb-2.5"
                        >
                            Install Now
                        </button>
                        <button
                            onClick={handleDismiss}
                            className="w-full h-11 text-slate-600 hover:text-slate-900 font-semibold text-sm transition-colors"
                        >
                            Maybe Later
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
