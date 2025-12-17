'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        router.push('/admin/dashboard');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">TradeX Admin</h1>
          <p className="text-neutral-600">Admin Control Panel</p>
        </div>

        {/* Login Card */}
        <div className="card">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">Admin Login</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Username
              </label>
              <input
                type="text"
                className="input-field"
                placeholder="Enter admin username"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Password
              </label>
              <input
                type="password"
                className="input-field"
                placeholder="Enter admin password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="btn-primary w-full"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        </div>

        {/* Credentials Info */}
        <div className="card bg-blue-50 border-blue-200 mt-4">
          <p className="text-xs text-blue-800">
            🔒 <strong>Admin Access Only:</strong> This area is restricted to authorized administrators.
          </p>
          <div className="mt-2 text-xs text-blue-700">
            <p><strong>Username:</strong> tradex_admin</p>
            <p><strong>Password:</strong> TrX@2025#Secure</p>
          </div>
        </div>
      </div>
    </div>
  );
}
