'use client';

import { useRouter } from 'next/navigation';

export default function AdminDashboard() {
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/admin');
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-page-title text-primary">Admin Dashboard</h1>
          <button onClick={handleLogout} className="btn-secondary">
            Logout
          </button>
        </div>

        {/* Success Card */}
        <div className="card text-center py-12">
          <div className="text-6xl mb-4">👑</div>
          <h2 className="text-section-title mb-2">Admin Access Granted!</h2>
          <p className="text-neutral-600 mb-6">
            You are successfully logged in as admin.
          </p>
          <div className="inline-block px-4 py-2 bg-primary/10 text-primary rounded-button">
            ✅ Admin Panel Access Granted
          </div>
        </div>

        {/* Info */}
        <div className="mt-6 text-center text-sm text-neutral-500">
          This is a temporary dashboard. Full admin features coming next!
        </div>
      </div>
    </div>
  );
}
