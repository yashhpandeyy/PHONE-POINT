
"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Menu,
  Search,
  MessageSquare,
  User,
  LogOut,
  CircleUser,
  Settings,
  ClipboardList,
  Sun,
  Moon,
} from "lucide-react";
import { Logo } from "@/components/logo";
import { account } from "@/lib/appwrite";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/auth-context";
import { useTheme } from "@/context/theme-context";
import { useState } from "react";

import { useUnreadMessages } from "@/hooks/use-unread-messages";

export function Header() {
  const { user, refetchUser } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const hasUnread = useUnreadMessages();
  const { theme, toggleTheme } = useTheme();
  const [headerSearch, setHeaderSearch] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleHeaderSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (headerSearch.trim()) {
      router.push(`/phones?search=${encodeURIComponent(headerSearch.trim())}`);
      setHeaderSearch('');
    }
  };

  const handleLogout = async () => {
    try {
      await account.deleteSession('current');
      await refetchUser();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push('/login');
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to log out.",
        variant: "destructive",
      });
    }
  };

  // Define base navigation links
  const baseNavLinks = [
    { href: "/phones", label: "All Phones" },
    { href: "/accessories", label: "Accessories" },
    { href: "/repair", label: "Repair" },
    { href: "/deals", label: "Deals" },
    { href: "/wheel", label: "Lucky Wheel" },
  ];

  // Get user role from labels, default to 'user' if not logged in or no role is set
  const userLabels = user?.labels || [];

  const navLinks = [...baseNavLinks];

  // Add role-specific links
  if (user && (userLabels.includes('admin') || userLabels.includes('developer'))) {
    navLinks.push({ href: "/sell", label: "Sell" });
    navLinks.push({ href: "/admin/stock", label: "Stock" });
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-lg supports-[backdrop-filter]:bg-background/60 shadow-sm shadow-black/10 pt-safe">
      <div className="container flex h-16 items-center px-4">
        <div className="flex items-center md:hidden w-1/5">
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2 hover:bg-primary/10">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs bg-background p-6">
              <SheetHeader className="mb-8 text-left">
                <SheetTitle><Logo /></SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <SheetClose asChild key={link.href}>
                    <Link
                      href={link.href}
                      className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </SheetClose>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>

        <div className="hidden md:flex items-center gap-6 mr-auto">
          <Logo />
          <nav className="items-center gap-6 text-sm flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-foreground/80 transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex-1 flex justify-center md:hidden">
          <Logo />
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-4 w-auto">
          <form onSubmit={handleHeaderSearch} className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search phones..."
              className="w-40 sm:w-64 pl-10 h-9"
              value={headerSearch}
              onChange={(e) => setHeaderSearch(e.target.value)}
            />
          </form>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="text-foreground">
            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            <span className="sr-only">Toggle theme</span>
          </Button>
          <div className="flex items-center justify-end w-full">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Account</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {user ? (
                  <>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/account"><CircleUser className="mr-2 h-4 w-4" />Account</Link>
                    </DropdownMenuItem>
                    {(userLabels.includes('admin') || userLabels.includes('developer')) && (
                      <>
                        <DropdownMenuItem asChild>
                          <Link href="/admin/stock"><ClipboardList className="mr-2 h-4 w-4" />Stock Inventory</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href="/setup"><Settings className="mr-2 h-4 w-4" />Database Setup</Link>
                        </DropdownMenuItem>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </>
                ) : (
                  <DropdownMenuItem asChild>
                    <Link href="/login">Login</Link>
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button asChild variant="ghost" size="icon" className="relative">
              <Link href="/messages">
                <MessageSquare className="h-5 w-5" />
                {hasUnread && (
                  <span className="absolute top-1 right-1 h-2.5 w-2.5 rounded-full bg-yellow-400 animate-pulse ring-2 ring-background" />
                )}
                <span className="sr-only">Messages</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
