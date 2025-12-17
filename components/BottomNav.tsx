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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 md:hidden z-50">
      <div className="grid grid-cols-5 h-16">
        {navItems.map((item) => (
          <Link key={item.path} href={item.path}>
            <button
              className={`h-full flex flex-col items-center justify-center gap-1 transition-colors ${
                isActive(item.path)
                  ? 'text-primary bg-blue-50'
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
  );
}
