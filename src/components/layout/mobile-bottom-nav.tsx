
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, ShoppingCart, User, TicketPercent } from 'lucide-react';
import { cn } from '@/lib/utils';

const navLinks = [
  { href: '/', icon: Home, label: 'Home' },
  { href: '/account', icon: User, label: 'Account' },
  { href: '/deals', icon: TicketPercent, label: 'Deals' },
  { href: '/cart', icon: ShoppingCart, label: 'Cart' },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
      <div className="flex h-16 items-center justify-around">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs font-medium w-full h-full',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary transition-colors'
              )}
            >
              <link.icon className="h-6 w-6" />
              <span className="sr-only">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
