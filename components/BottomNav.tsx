'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    {
      name: 'Dashboard',
      icon: '🏠',
      path: '/user/dashboard',
    },
    {
      name: 'Plans',
      icon: '📊',
      path: '/user/plans',
    },
    {
      name: 'Recharge',
      icon: '💰',
      path: '/user/deposit',
    },
    {
      name: 'Withdraw',
      icon: '💸',
      path: '/user/withdraw',
    },
    {
      name: 'Profile',
      icon: '👤',
      path: '/user/profile',
    },
  ];

  const isActive = (path: string) => {
    return pathname === path || pathname?.startsWith(path + '/');
  };

  return (
    <>
      {/* Mobile & iPad Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 lg:hidden z-50 shadow-lg">
        <div className="grid grid-cols-5 h-16">
          {navItems.map((item) => (
            <Link key={item.path} href={item.path}>
              <button
                className={`h-full flex flex-col items-center justify-center gap-1 transition-all ${
                  isActive(item.path)
                    ? 'text-emerald-600 bg-emerald-50 font-bold'
                    : 'text-neutral-600 hover:bg-neutral-50'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs font-medium">{item.name}</span>
              </button>
            </Link>
          ))}
        </div>
      </nav>

      {/* Laptop & Monitor Sidebar Navigation */}
      <nav className="hidden lg:block fixed left-0 top-0 h-screen w-20 bg-white border-r border-neutral-200 z-40 shadow-lg">
        <div className="flex flex-col h-full py-4">
          {/* Logo/Brand */}
          <div className="flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white text-2xl font-bold">T</span>
            </div>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 flex flex-col gap-2 px-2">
            {navItems.map((item) => (
              <Link key={item.path} href={item.path}>
                <button
                  className={`w-full flex flex-col items-center justify-center gap-1 py-3 rounded-lg transition-all ${
                    isActive(item.path)
                      ? 'text-emerald-600 bg-emerald-50 font-bold'
                      : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-xs font-medium text-center">{item.name}</span>
                </button>
              </Link>
            ))}
          </div>
        </div>
      </nav>
    </>
  );
}
