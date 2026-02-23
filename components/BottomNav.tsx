'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type IconProps = { className?: string };

const HomeIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V9.5z" />
    <path d="M9 21V12h6v9" />
  </svg>
);

const PlansIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="12" width="4" height="9" rx="1" />
    <rect x="10" y="7" width="4" height="14" rx="1" />
    <rect x="17" y="3" width="4" height="18" rx="1" />
  </svg>
);

const RechargeIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
    <path d="M6 3h12" />
    <circle cx="17" cy="15.5" r="1" fill="currentColor" stroke="none" />
  </svg>
);

const WithdrawIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="6" width="20" height="14" rx="2" />
    <path d="M2 10h20" />
    <path d="M12 14v3m0 0-1.5-1.5M12 17l1.5-1.5" />
    <path d="M6 3h12" />
  </svg>
);

const ProfileIcon = ({ className }: IconProps) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="4" />
    <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
  </svg>
);

const navItems = [
  { name: 'Dashboard', Icon: HomeIcon,     path: '/user/dashboard' },
  { name: 'Plans',     Icon: PlansIcon,    path: '/user/plans'     },
  { name: 'Recharge',  Icon: RechargeIcon, path: '/user/deposit'   },
  { name: 'Withdraw',  Icon: WithdrawIcon, path: '/user/withdraw'  },
  { name: 'Profile',   Icon: ProfileIcon,  path: '/user/profile'   },
];

export default function BottomNav() {
  const pathname = usePathname();

  const isActive = (path: string) =>
    pathname === path || pathname?.startsWith(path + '/');

  // Derive active index — drives both sliding indicators
  const activeIndex = navItems.findIndex((item) => isActive(item.path));
  const safeIndex = activeIndex === -1 ? 0 : activeIndex;

  return (
    <>
      {/* ── Mobile & iPad: Bottom Navigation ── */}
      <nav
        className="fixed bottom-0 left-0 right-0 lg:hidden z-50 bg-white/95 backdrop-blur-xl border-t border-neutral-100/80"
        style={{ boxShadow: '0 -1px 0 rgba(0,0,0,0.04), 0 -8px 32px rgba(0,0,0,0.06)' }}
      >
        <div className="relative grid grid-cols-5 h-16">

          {/* ── Sliding pill background ─────────────────────────────
              Each column = 20% of nav width.
              Pill sits with 4px margin each side inside its column.
              Moving to next tab = shifting left by one column width (20%).
          ── */}
          <span
            className="absolute inset-y-1.5 bg-emerald-50 rounded-2xl pointer-events-none"
            style={{
              width: 'calc(20% - 8px)',
              left: `calc(${safeIndex} * 20% + 4px)`,
              transition: 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />

          {/* ── Sliding top bar indicator ───────────────────────────
              Centered in column: column center = safeIndex * 20% + 10%
              Bar is 32px wide, so offset left by 16px to center it.
          ── */}
          <span
            className="absolute top-0 h-[3px] w-8 bg-emerald-500 rounded-b-full pointer-events-none"
            style={{
              left: `calc(${safeIndex} * 20% + 10% - 16px)`,
              transition: 'left 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
            }}
          />

          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} href={item.path} className="flex items-center justify-center">
                <button className="relative z-10 w-full h-full flex flex-col items-center justify-center gap-[3px] transition-transform duration-150 active:scale-90">
                  <item.Icon className={`w-[22px] h-[22px] transition-all duration-300 ease-out ${active ? 'text-emerald-600 scale-110 -translate-y-0.5 stroke-[2.3px]' : 'text-neutral-400 scale-100 translate-y-0 stroke-2'}`} />
                  <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-300 ${active ? 'text-emerald-600' : 'text-neutral-400'}`}>
                    {item.name}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* ── Desktop & Laptop: Sidebar Navigation ── */}
      <nav
        className="hidden lg:flex fixed left-0 top-0 h-screen w-[76px] flex-col bg-white border-r border-neutral-100 z-40"
        style={{ boxShadow: '1px 0 0 rgba(0,0,0,0.04), 4px 0 24px rgba(0,0,0,0.03)' }}
      >
        {/* Logo */}
        <div className="flex items-center justify-center py-5 shrink-0">
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center bg-gradient-to-br from-emerald-400 to-emerald-700 shadow-md shadow-emerald-200/80">
            <span className="text-white text-base font-black">T</span>
          </div>
        </div>

        <div className="mx-4 h-px bg-neutral-100 shrink-0" />

        {/* Nav Items */}
        <div className="flex-1 flex flex-col gap-1 px-2.5 pt-4 pb-4">
          {navItems.map((item) => {
            const active = isActive(item.path);
            return (
              <Link key={item.path} href={item.path}>
                <button className={`relative w-full flex flex-col items-center justify-center gap-1.5 py-3.5 rounded-2xl transition-all duration-200 group active:scale-95 ${active ? 'bg-emerald-50' : 'hover:bg-neutral-50'}`}>
                  <span className={`absolute left-0 top-1/2 -translate-y-1/2 w-[3px] rounded-r-full bg-emerald-500 transition-all duration-300 ease-out ${active ? 'h-7 opacity-100' : 'h-0 opacity-0'}`} />
                  <item.Icon className={`w-[22px] h-[22px] transition-all duration-200 ${active ? 'text-emerald-600 scale-110 stroke-[2.3px]' : 'text-neutral-400 stroke-2 group-hover:scale-110 group-hover:text-neutral-500'}`} />
                  <span className={`text-[10px] font-semibold tracking-wide transition-colors duration-200 ${active ? 'text-emerald-600' : 'text-neutral-400 group-hover:text-neutral-500'}`}>
                    {item.name}
                  </span>
                </button>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
