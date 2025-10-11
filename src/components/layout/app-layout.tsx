'use client';

import { usePathname } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  if (isHomePage) {
    return <main>{children}</main>;
  }

  return (
    <div className="relative flex min-h-screen flex-col pb-16 md:pb-0">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
      <MobileBottomNav />
    </div>
  );
}
