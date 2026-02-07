'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';

export default function PolicyPage() {
    const [activeTab, setActiveTab] = useState<'privacy' | 'terms'>('privacy');

    return (
        <div className="min-h-screen bg-neutral-50">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm">
                <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
                            <Image
                                src="/Trade_logo-removebg-preview.png"
                                alt="TradeX Logo"
                                width={48}
                                height={48}
                                className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                                priority
                            />
                            <span className="text-xl sm:text-2xl font-bold text-slate-900">TradeX</span>
                        </Link>
                        <Link
                            href="/"
                            className="text-sm sm:text-base text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-2"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Back to Home
                        </Link>
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
                {/* Page Title */}
                <div className="text-center mb-8 sm:mb-12">
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-3">
                        Legal Information
                    </h1>
                    <p className="text-slate-600 text-sm sm:text-base">
                        Last updated: February 7, 2026
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden mb-6">
                    <div className="flex border-b border-slate-200">
                        <button
                            onClick={() => setActiveTab('privacy')}
                            className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all ${activeTab === 'privacy'
                                    ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            Privacy Policy
                        </button>
                        <button
                            onClick={() => setActiveTab('terms')}
                            className={`flex-1 px-4 sm:px-6 py-3 sm:py-4 text-sm sm:text-base font-semibold transition-all ${activeTab === 'terms'
                                    ? 'bg-emerald-50 text-emerald-700 border-b-2 border-emerald-600'
                                    : 'text-slate-600 hover:bg-slate-50'
                                }`}
                        >
                            Terms & Conditions
                        </button>
                    </div>

                    {/* Content Area */}
                    <div className="p-6 sm:p-8 lg:p-10">
                        {activeTab === 'privacy' ? <PrivacyPolicy /> : <TermsAndConditions />}
                    </div>
                </div>

                {/* Contact Section */}
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 text-center">
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2">
                        Questions or Concerns?
                    </h3>
                    <p className="text-slate-600 text-sm sm:text-base mb-4">
                        If you have any questions about our policies, please contact us
                    </p>
                    <a
                        href="mailto:support@tradex.com"
                        className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-lg transition-all"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        support@tradex.com
                    </a>
                </div>
            </div>
        </div>
    );
}

// Privacy Policy Content Component
function PrivacyPolicy() {
    return (
        <div className="prose prose-slate max-w-none">
            <div className="space-y-8">
                {/* Introduction */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Introduction</h2>
                    <p className="text-slate-700 leading-relaxed">
                        Welcome to TradeX. We are committed to protecting your personal information and your right to privacy.
                        This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use
                        our investment platform and services. Please read this privacy policy carefully.
                    </p>
                </section>

                {/* Information We Collect */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Information We Collect</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Personal Information</h3>
                            <p className="text-slate-700 leading-relaxed mb-2">
                                We collect personal information that you voluntarily provide to us when registering on the platform:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 text-slate-700">
                                <li>Full name</li>
                                <li>Phone number</li>
                                <li>Email address</li>
                                <li>Password (encrypted)</li>
                                <li>Referral code (if applicable)</li>
                                <li>Banking and payment information</li>
                                <li>Investment preferences and history</li>
                                <li>Tax identification numbers</li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-lg font-semibold text-slate-800 mb-2">Automatic Information</h3>
                            <p className="text-slate-700 leading-relaxed mb-2">
                                We automatically collect certain information when you visit, use, or navigate the platform:
                            </p>
                            <ul className="list-disc pl-6 space-y-1 text-slate-700">
                                <li>Device and usage information (IP address, browser type, operating system)</li>
                                <li>Location data</li>
                                <li>Login and access times</li>
                                <li>Transaction history</li>
                                <li>Cookies and similar tracking technologies</li>
                            </ul>
                        </div>
                    </div>
                </section>

                {/* How We Use Your Information */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Use Your Information</h2>
                    <p className="text-slate-700 leading-relaxed mb-2">
                        We use the information we collect or receive for the following purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li>To facilitate account creation and authentication</li>
                        <li>To process your transactions and manage investments</li>
                        <li>To send administrative information and account updates</li>
                        <li>To fulfill and manage your orders and requests</li>
                        <li>To comply with legal and regulatory requirements (KYC, AML, tax reporting)</li>
                        <li>To protect against fraudulent or illegal activity</li>
                        <li>To improve our services and develop new features</li>
                        <li>To send marketing and promotional communications (with your consent)</li>
                        <li>To respond to customer service requests and support needs</li>
                    </ul>
                </section>

                {/* Information Sharing */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">How We Share Your Information</h2>
                    <p className="text-slate-700 leading-relaxed mb-2">
                        We may share your information in the following situations:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li><strong>With Service Providers:</strong> Payment processors, data analytics, customer service platforms</li>
                        <li><strong>For Legal Compliance:</strong> Government authorities, regulatory bodies, law enforcement when required by law</li>
                        <li><strong>Business Transfers:</strong> In connection with mergers, acquisitions, or asset sales</li>
                        <li><strong>With Your Consent:</strong> For any other purpose disclosed with your consent</li>
                    </ul>
                    <p className="text-slate-700 leading-relaxed mt-3">
                        <strong>We do not sell your personal information to third parties.</strong>
                    </p>
                </section>

                {/* Data Security */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Security</h2>
                    <p className="text-slate-700 leading-relaxed">
                        We implement appropriate technical and organizational security measures designed to protect your personal
                        information. However, no electronic transmission over the internet or information storage technology can be
                        guaranteed to be 100% secure. We use industry-standard encryption (SSL/TLS), secure authentication systems
                        (JWT tokens), and regular security audits to protect your data.
                    </p>
                </section>

                {/* Data Retention */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Retention</h2>
                    <p className="text-slate-700 leading-relaxed">
                        We retain your personal information for as long as necessary to fulfill the purposes outlined in this
                        Privacy Policy, unless a longer retention period is required or permitted by law. We will retain and use
                        your information to comply with our legal obligations (tax, accounting, regulatory requirements), resolve
                        disputes, and enforce our agreements.
                    </p>
                </section>

                {/* Your Privacy Rights */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Your Privacy Rights</h2>
                    <p className="text-slate-700 leading-relaxed mb-2">
                        Depending on your location, you may have the following rights:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li><strong>Access:</strong> Request a copy of your personal information</li>
                        <li><strong>Correction:</strong> Request correction of inaccurate or incomplete data</li>
                        <li><strong>Deletion:</strong> Request deletion of your personal information (subject to legal obligations)</li>
                        <li><strong>Portability:</strong> Request transfer of your data to another service</li>
                        <li><strong>Objection:</strong> Object to processing of your personal information</li>
                        <li><strong>Withdraw Consent:</strong> Withdraw consent for data processing at any time</li>
                    </ul>
                    <p className="text-slate-700 leading-relaxed mt-3">
                        To exercise these rights, please contact us at support@tradex.com
                    </p>
                </section>

                {/* Cookies */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Cookies and Tracking Technologies</h2>
                    <p className="text-slate-700 leading-relaxed">
                        We use cookies and similar tracking technologies to track activity on our platform and store certain
                        information. Cookies help us improve user experience, analyze usage patterns, and provide personalized
                        features. You can instruct your browser to refuse all cookies or indicate when a cookie is being sent,
                        but some features may not function properly without cookies.
                    </p>
                </section>

                {/* Third-Party Services */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Third-Party Services</h2>
                    <p className="text-slate-700 leading-relaxed">
                        Our platform may contain links to third-party websites or services. We are not responsible for the privacy
                        practices of these third parties. We encourage you to review their privacy policies before providing any
                        personal information.
                    </p>
                </section>

                {/* Children's Privacy */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Children's Privacy</h2>
                    <p className="text-slate-700 leading-relaxed">
                        Our services are not intended for individuals under the age of 18. We do not knowingly collect personal
                        information from children. If you believe we have collected information from a child, please contact us
                        immediately.
                    </p>
                </section>

                {/* Changes to Policy */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to This Privacy Policy</h2>
                    <p className="text-slate-700 leading-relaxed">
                        We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
                        Privacy Policy on this page and updating the "Last updated" date. We encourage you to review this Privacy
                        Policy periodically for any changes.
                    </p>
                </section>
            </div>
        </div>
    );
}

// Terms and Conditions Content Component
function TermsAndConditions() {
    return (
        <div className="prose prose-slate max-w-none">
            <div className="space-y-8">
                {/* Introduction */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Agreement to Terms</h2>
                    <p className="text-slate-700 leading-relaxed">
                        These Terms and Conditions constitute a legally binding agreement between you and TradeX ("Company", "we",
                        "us", or "our") regarding your use of our investment platform and services. By accessing or using the
                        platform, you agree to be bound by these Terms. If you do not agree with these Terms, you must not use
                        our services.
                    </p>
                </section>

                {/* Eligibility */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">User Eligibility</h2>
                    <p className="text-slate-700 leading-relaxed mb-2">
                        To use our platform, you must:
                    </p>
                    <ul className="list-disc pl-6 space-y-1 text-slate-700">
                        <li>Be at least 18 years of age</li>
                        <li>Have the legal capacity to enter into binding contracts</li>
                        <li>Not be prohibited from using the services under applicable laws</li>
                        <li>Provide accurate and complete registration information</li>
                        <li>Maintain the confidentiality of your account credentials</li>
                    </ul>
                </section>

                {/* Account Registration */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Account Registration and Security</h2>
                    <p className="text-slate-700 leading-relaxed mb-3">
                        When you create an account with us, you agree to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li>Provide accurate, current, and complete information</li>
                        <li>Maintain and update your information to keep it accurate</li>
                        <li>Maintain the security of your password and account</li>
                        <li>Immediately notify us of any unauthorized access or security breach</li>
                        <li>Accept responsibility for all activities that occur under your account</li>
                    </ul>
                    <p className="text-slate-700 leading-relaxed mt-3">
                        We reserve the right to suspend or terminate accounts that violate these Terms or engage in fraudulent activity.
                    </p>
                </section>

                {/* Services Description */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Description of Services</h2>
                    <p className="text-slate-700 leading-relaxed">
                        TradeX provides an investment platform that allows users to access trading and investment opportunities.
                        Our services include portfolio management, market analysis tools, transaction execution, and account
                        monitoring. We reserve the right to modify, suspend, or discontinue any part of our services at any time
                        without prior notice.
                    </p>
                </section>

                {/* Investment Risks */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Investment Risk Disclosure</h2>
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-4 mb-4">
                        <p className="text-amber-900 font-semibold mb-2">⚠️ Important Risk Warning</p>
                        <p className="text-amber-800 text-sm">
                            Trading and investing involve substantial risk of loss and are not suitable for every investor.
                            Past performance does not guarantee future results.
                        </p>
                    </div>
                    <p className="text-slate-700 leading-relaxed mb-2">
                        By using our platform, you acknowledge and accept the following risks:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li><strong>Market Risk:</strong> Investment values can fluctuate due to market conditions</li>
                        <li><strong>Loss of Capital:</strong> You may lose some or all of your invested capital</li>
                        <li><strong>Liquidity Risk:</strong> You may not be able to sell investments when desired</li>
                        <li><strong>No Guaranteed Returns:</strong> Past performance does not indicate future results</li>
                        <li><strong>Platform Risk:</strong> Technical issues may affect access to your account</li>
                    </ul>
                    <p className="text-slate-700 leading-relaxed mt-3">
                        <strong>We do not provide investment advice.</strong> All investment decisions are made solely by you
                        at your own risk.
                    </p>
                </section>

                {/* User Obligations */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">User Obligations and Prohibited Activities</h2>
                    <p className="text-slate-700 leading-relaxed mb-2">
                        You agree not to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-slate-700">
                        <li>Use the platform for any illegal or unauthorized purpose</li>
                        <li>Violate any laws in your jurisdiction</li>
                        <li>Infringe upon the rights of others</li>
                        <li>Transmit viruses, malware, or harmful code</li>
                        <li>Attempt to gain unauthorized access to the platform</li>
                        <li>Manipulate or interfere with the proper functioning of the platform</li>
                        <li>Use automated systems (bots, scrapers) without permission</li>
                        <li>Engage in market manipulation or fraudulent trading practices</li>
                        <li>Share your account credentials with others</li>
                    </ul>
                </section>

                {/* Fees and Payments */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Fees and Payments</h2>
                    <p className="text-slate-700 leading-relaxed">
                        Our platform may charge fees for certain services, including transaction fees, management fees, or
                        subscription charges. All applicable fees will be clearly disclosed before you complete a transaction.
                        You agree to pay all fees and charges incurred under your account. We reserve the right to change our
                        fee structure with reasonable notice.
                    </p>
                </section>

                {/* Intellectual Property */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Intellectual Property Rights</h2>
                    <p className="text-slate-700 leading-relaxed">
                        All content, features, and functionality on the platform (including text, graphics, logos, software, and
                        design) are owned by TradeX and are protected by copyright, trademark, and other intellectual property laws.
                        You may not copy, modify, distribute, or create derivative works without our express written permission.
                    </p>
                </section>

                {/* Disclaimer of Warranties */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Disclaimer of Warranties</h2>
                    <p className="text-slate-700 leading-relaxed">
                        THE PLATFORM IS PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS WITHOUT WARRANTIES OF ANY KIND. WE DO NOT
                        WARRANT THAT THE PLATFORM WILL BE UNINTERRUPTED, ERROR-FREE, OR SECURE. WE DISCLAIM ALL WARRANTIES,
                        EXPRESS OR IMPLIED, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
                    </p>
                </section>

                {/* Limitation of Liability */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Limitation of Liability</h2>
                    <p className="text-slate-700 leading-relaxed">
                        TO THE MAXIMUM EXTENT PERMITTED BY LAW, TRADEX SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL,
                        CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR OTHER INTANGIBLE LOSSES ARISING
                        FROM YOUR USE OF THE PLATFORM OR ANY INVESTMENT LOSSES. OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT
                        YOU PAID TO US IN THE 12 MONTHS PRECEDING THE CLAIM.
                    </p>
                </section>

                {/* Indemnification */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Indemnification</h2>
                    <p className="text-slate-700 leading-relaxed">
                        You agree to indemnify and hold harmless TradeX and its officers, directors, employees, and agents from
                        any claims, damages, losses, liabilities, and expenses (including legal fees) arising from your use of
                        the platform, violation of these Terms, or infringement of any rights of another party.
                    </p>
                </section>

                {/* Termination */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Termination</h2>
                    <p className="text-slate-700 leading-relaxed">
                        We may terminate or suspend your account and access to the platform immediately, without prior notice,
                        for any reason, including breach of these Terms. You may also terminate your account at any time by
                        contacting us. Upon termination, your right to use the platform will immediately cease.
                    </p>
                </section>

                {/* Governing Law */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Governing Law and Dispute Resolution</h2>
                    <p className="text-slate-700 leading-relaxed">
                        These Terms shall be governed by and construed in accordance with the laws of India. Any disputes arising
                        from these Terms or your use of the platform shall be subject to the exclusive jurisdiction of the courts
                        in Hyderabad, Telangana, India.
                    </p>
                </section>

                {/* Changes to Terms */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Changes to Terms</h2>
                    <p className="text-slate-700 leading-relaxed">
                        We reserve the right to modify these Terms at any time. We will notify you of any material changes by
                        posting the updated Terms on the platform and updating the "Last updated" date. Your continued use of
                        the platform after changes constitute acceptance of the new Terms.
                    </p>
                </section>

                {/* Contact Information */}
                <section>
                    <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact Us</h2>
                    <p className="text-slate-700 leading-relaxed">
                        If you have questions about these Terms, please contact us at:
                    </p>
                    <div className="bg-slate-50 p-4 rounded-lg mt-3">
                        <p className="text-slate-700"><strong>Email:</strong> support@tradex.com</p>
                        <p className="text-slate-700"><strong>Address:</strong> TradeX, Hyderabad, Telangana, India</p>
                    </div>
                </section>
            </div>
        </div>
    );
}
