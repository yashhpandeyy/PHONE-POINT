"use client";

import Link from "next/link";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Menu,
  Search,
  ShoppingCart,
  User,
} from "lucide-react";
import { Logo } from "@/components/logo";

export function Header() {
  const navLinks = [
    { href: "/phones", label: "All Phones" },
    { href: "/deals", label: "Deals" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center md:hidden w-1/5">
           <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="mr-2">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-full max-w-xs bg-background p-6">
              <div className="mb-8">
                <Logo />
              </div>
              <nav className="flex flex-col gap-4">
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="text-lg font-medium text-foreground/80 hover:text-primary transition-colors"
                  >
                    {link.label}
                  </Link>
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

        <div className="flex items-center justify-end gap-2 sm:gap-4 w-1/5">
          <div className="relative hidden sm:block">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search phones..."
              className="w-40 sm:w-64 pl-10 h-9"
            />
          </div>
          <div className="flex md:hidden items-center justify-end w-full">
            <Button asChild variant="ghost" size="icon">
              <Link href="/account"><User className="h-5 w-5" /><span className="sr-only">Account</span></Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link href="/cart"><ShoppingCart className="h-5 w-5" /><span className="sr-only">Cart</span></Link>
            </Button>
          </div>
          <div className="hidden md:flex items-center justify-end gap-2 sm:gap-4">
            <Button asChild variant="ghost" size="icon">
              <Link href="/account"><User className="h-5 w-5" /><span className="sr-only">Account</span></Link>
            </Button>
            <Button asChild variant="ghost" size="icon">
              <Link href="/cart"><ShoppingCart className="h-5 w-5" /><span className="sr-only">Cart</span></Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
