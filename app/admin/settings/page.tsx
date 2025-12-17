'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PaymentSettings {
  id: number;
  qrCodeUrl: string;
  upiId: string;
}

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState<PaymentSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    qrCodeUrl: '',
    upiId: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings');
      const data = await response.json();

      if (data.success && data.data.settings) {
        setSettings(data.data.settings);
        setFormData({
          qrCodeUrl: data.data.settings.qrCodeUrl,
          upiId: data.data.settings.upiId,
        });
      } else {
        // No settings exist, show form
        setEditing(true);
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error);
      setEditing(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const response = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('✅ Payment settings updated successfully!');
        setEditing(false);
        setSettings(formData as any);
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to update settings');
      }
    } catch (err) {
      console.error('Update settings error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
          <p className="mt-4 text-neutral-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <Link href="/admin/dashboard">
            <button className="text-white hover:opacity-80">← Back</button>
          </Link>
          <h1 className="text-xl font-bold">Platform Settings</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 space-y-4">
        {/* Info Card */}
        <div className="card bg-blue-50 border-blue-200">
          <p className="text-sm text-blue-800">
            ⚙️ Configure payment settings for user deposits. QR code and UPI ID will be shown to
            users during manual payment.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="card bg-green-50 border-green-200">
            <p className="text-sm text-green-800">{success}</p>
          </div>
        )}

        {/* Display Mode */}
        {!editing && settings ? (
          <div className="card">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-neutral-900">Current Payment Settings</h3>
              <button
                onClick={() => setEditing(true)}
                className="text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                ✏️ Edit Settings
              </button>
            </div>

            <div className="space-y-4">
              {/* QR Code */}
              <div>
                <p className="text-sm font-medium text-neutral-700 mb-2">Payment QR Code</p>
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 inline-block">
                  <img
                    src={settings.qrCodeUrl}
                    alt="Payment QR Code"
                    className="w-48 h-48 object-contain"
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-2">{settings.qrCodeUrl}</p>
              </div>

              {/* UPI ID */}
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <p className="text-sm font-medium text-green-900 mb-2">UPI ID</p>
                <p className="text-base font-mono font-bold text-green-900">{settings.upiId}</p>
              </div>
            </div>
          </div>
        ) : (
          /* Edit Mode */
          <form onSubmit={handleSubmit} className="card">
            <h3 className="text-lg font-bold text-neutral-900 mb-4">
              {settings ? 'Edit Payment Settings' : 'Setup Payment Settings'}
            </h3>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            <div className="space-y-4">
              {/* QR Code URL */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  QR Code Image URL <span className="text-red-500">*</span>
                </label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://example.com/qr-code.png"
                  value={formData.qrCodeUrl}
                  onChange={(e) => setFormData({ ...formData, qrCodeUrl: e.target.value })}
                  required
                />
                <p className="text-xs text-neutral-500 mt-1">
                  Upload your QR code to a service like Imgur, ImgBB, or use Vercel Blob
                </p>
              </div>

              {/* UPI ID */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 mb-2">
                  UPI ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="yourname@paytm"
                  value={formData.upiId}
                  onChange={(e) => setFormData({ ...formData, upiId: e.target.value })}
                  required
                />
              </div>

              {/* Preview */}
              {formData.qrCodeUrl && (
                <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200">
                  <p className="text-sm font-medium text-neutral-700 mb-2">QR Code Preview:</p>
                  <img
                    src={formData.qrCodeUrl}
                    alt="QR Preview"
                    className="w-32 h-32 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '';
                      (e.target as HTMLImageElement).alt = 'Invalid URL';
                    }}
                  />
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                {settings && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditing(false);
                      setError('');
                      setFormData({
                        qrCodeUrl: settings.qrCodeUrl,
                        upiId: settings.upiId,
                      });
                    }}
                    className="flex-1 bg-neutral-200 text-neutral-700 px-4 py-3 rounded-lg font-medium hover:bg-neutral-300 transition-colors"
                  >
                    Cancel
                  </button>
                )}
                <button type="submit" disabled={saving} className="flex-1 btn-primary">
                  {saving ? 'Saving...' : 'Save Settings'}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Help Card */}
        <div className="card bg-yellow-50 border-yellow-200">
          <div className="flex gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-yellow-900 mb-2">How to Upload QR Code:</p>
              <ol className="text-sm text-yellow-800 space-y-1">
                <li>1. Upload your QR code to <strong>Imgur.com</strong> or <strong>ImgBB.com</strong></li>
                <li>2. Copy the direct image URL</li>
                <li>3. Paste it in the QR Code URL field above</li>
                <li>4. Save settings</li>
              </ol>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
