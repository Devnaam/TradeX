'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminChangePasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const response = await fetch('/api/admin/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('✅ Password updated successfully!');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });

        // Optional: Redirect to dashboard after 2 seconds
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      } else {
        setError(data.error || 'Failed to update password');
      }
    } catch (err) {
      console.error('Change password error:', err);
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="bg-primary text-white p-4">
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <Link href="/admin/dashboard">
            <button className="text-white hover:opacity-80">← Back</button>
          </Link>
          <h1 className="text-lg font-semibold">Change Password</h1>
        </div>
      </div>

      <div className="max-w-2xl mx-auto p-4">
        {/* Info Card */}
        <div className="card bg-blue-50 border-blue-200 mb-6">
          <p className="text-sm text-blue-800">
            🔐 Update your admin password. Make sure to remember your new password as it will be
            required for future logins.
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="card bg-green-50 border-green-200 mb-6">
            <p className="text-green-700 font-medium">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="card bg-red-50 border-red-200 mb-6">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Change Password Form */}
        <div className="card">
          <h2 className="text-lg font-bold text-neutral-900 mb-4">Update Your Password</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Current Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Current Password *
              </label>
              <input
                type="password"
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                className="input"
                placeholder="Enter current password"
                required
                autoComplete="current-password"
              />
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                New Password *
              </label>
              <input
                type="password"
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                className="input"
                placeholder="Enter new password (min 6 characters)"
                required
                minLength={6}
                autoComplete="new-password"
              />
              <p className="text-xs text-neutral-500 mt-1">Must be at least 6 characters</p>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Confirm New Password *
              </label>
              <input
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="input"
                placeholder="Re-enter new password"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-3 pt-2">
              <Link href="/admin/dashboard" className="flex-1">
                <button
                  type="button"
                  className="w-full bg-neutral-200 text-neutral-700 px-4 py-3 rounded-lg font-medium hover:bg-neutral-300 transition-colors"
                >
                  Cancel
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>

        {/* Security Tips */}
        <div className="card bg-neutral-50 mt-6">
          <h3 className="text-sm font-bold text-neutral-800 mb-2">Password Security Tips:</h3>
          <ul className="text-xs text-neutral-600 space-y-1">
            <li>• Use a strong password with a mix of letters, numbers, and symbols</li>
            <li>• Don't reuse passwords from other accounts</li>
            <li>• Change your password regularly for better security</li>
            <li>• Never share your admin password with anyone</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
