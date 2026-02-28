'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, User, TicketPercent, MessageSquare, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useUnreadMessages } from '@/hooks/use-unread-messages';

const navLinks = [
  { href: '/home', icon: Home, label: 'Home' },
  { href: '/messages', icon: MessageSquare, label: 'Messages' },
  { href: '/wheel', icon: Sparkles, label: 'Wheel' },
  { href: '/deals', icon: TicketPercent, label: 'Deals' },
  { href: '/account', icon: User, label: 'Account' },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const hasUnread = useUnreadMessages();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-sky-300/50 dark:border-sky-800/50 bg-[#9bcffc] dark:bg-slate-900 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] md:hidden pb-safe">
      <div className="flex h-16 items-center justify-around px-2">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          const showBadge = link.href === '/messages' && hasUnread;
          return (
            <Link
              key={link.href}
              href={link.href}
              className="relative flex flex-col items-center justify-center gap-1 w-full h-full group"
            >
              <div
                className={cn(
                  "p-2 rounded-full transition-all duration-300 relative",
                  isActive ? "bg-orange-500 text-white shadow-lg transform -translate-y-4 shadow-orange-500/30 ring-4 ring-[#F4F6FB] dark:ring-slate-900" : "text-slate-500 group-hover:text-primary group-hover:-translate-y-1"
                )}
              >
                <link.icon className="h-6 w-6" />
                {showBadge && (
                  <span className="absolute top-0 right-0 -translate-y-1 translate-x-1 h-3 w-3 rounded-full bg-red-500 ring-2 ring-white" />
                )}
              </div>
              <span className={cn("text-[10px] font-bold transition-all duration-300", isActive ? "text-orange-500 transform -translate-y-2" : "text-slate-500")}>
                {link.label.toUpperCase()}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
