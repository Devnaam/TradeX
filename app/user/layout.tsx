import BottomNav from '@/components/BottomNav';

export default function UserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      {/* BottomNav lives HERE — above all pages, never unmounts */}
      <BottomNav />
      {children}
    </div>
  );
}
