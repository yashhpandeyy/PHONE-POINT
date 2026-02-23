'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, TicketPercent, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUnreadMessages } from '@/hooks/use-unread-messages';

const navLinks = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/deals', icon: TicketPercent, label: 'Deals' },
  { href: '/account', icon: User, label: 'Account' },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const hasUnread = useUnreadMessages();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-[0_-4px_10px_rgba(0,0,0,0.1)] md:hidden pb-safe">
      <div className="flex h-16 items-center justify-around">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const showBadge = link.href === '/messages' && hasUnread;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'relative flex flex-col items-center justify-center gap-1 text-xs font-medium w-full h-full',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-primary transition-colors'
              )}
            >
              <link.icon className="h-6 w-6" />
              {showBadge && (
                <span className="absolute top-2 right-1/2 translate-x-4 h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse ring-2 ring-background" />
              )}
              <span className="sr-only">{link.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
