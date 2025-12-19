'use client';

import Link from 'next/link';

export default function SupportPage() {
  const telegramLink = 'https://t.me/tradex_support'; // Update with your actual Telegram link

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <Link href="/user/dashboard">
            <button className="text-white hover:opacity-80">← Back</button>
          </Link>
          <h1 className="text-lg font-semibold">Support</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Main Support Card */}
        <div className="card text-center py-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-50 rounded-full border-2 border-blue-200 mb-4">
              <svg
                className="w-12 h-12 text-primary"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Need Help?</h2>
            <p className="text-neutral-600">
              Our support team is here to assist you with any questions or issues.
            </p>
          </div>

          <a
            href={telegramLink}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block"
          >
            <button className="btn-primary px-8 py-4 text-base">
              💬 Contact Support on Telegram
            </button>
          </a>
        </div>

        {/* Quick Help Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* FAQ Card */}
          <div className="card">
            <div className="flex items-start gap-3">
              <div className="text-3xl">❓</div>
              <div>
                <h3 className="font-bold text-neutral-900 mb-1">Common Questions</h3>
                <ul className="text-sm text-neutral-600 space-y-2">
                  <li>• How to recharge my wallet?</li>
                  <li>• How to activate a plan?</li>
                  <li>• How to withdraw money?</li>
                  <li>• When do I receive daily income?</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Contact Info Card */}
          <div className="card">
            <div className="flex items-start gap-3">
              <div className="text-3xl">⏰</div>
              <div>
                <h3 className="font-bold text-neutral-900 mb-1">Support Hours</h3>
                <p className="text-sm text-neutral-600 mb-2">
                  Our team is available to help you:
                </p>
                <p className="text-sm font-medium text-neutral-900">
                  Monday - Sunday<br />
                  9:00 AM - 10:00 PM IST
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Response Time */}
        <div className="card bg-green-50 border-green-200">
          <div className="flex gap-3">
            <span className="text-2xl">⚡</span>
            <div>
              <p className="text-sm font-bold text-green-900 mb-1">Quick Response</p>
              <p className="text-sm text-green-700">
                We typically respond within <strong>1-2 hours</strong> during business hours.
              </p>
            </div>
          </div>
        </div>

        {/* What to Include */}
        <div className="card bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <span className="text-2xl">📝</span>
            <div>
              <p className="text-sm font-bold text-blue-900 mb-2">
                When contacting support, please include:
              </p>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• Your registered phone number</li>
                <li>• Transaction ID (if applicable)</li>
                <li>• Screenshots of the issue</li>
                <li>• Detailed description of the problem</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Support Button (Sticky at bottom on mobile) */}
        <div className="fixed bottom-4 left-4 right-4 md:hidden">
          <a
            href="https://t.me/Stakesbs"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button className="btn-primary w-full shadow-lg">
              💬 Open Telegram Support
            </button>
          </a>
        </div>
      </div>
    </div>
  );
}
