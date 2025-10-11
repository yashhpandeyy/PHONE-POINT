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
    { href: "/#recommend", label: "AI Recommender" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Logo />
        </div>
        
        {/* Mobile Menu */}
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden mr-4">
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

        <div className="flex flex-1 items-center justify-between">
          <div className="md:hidden">
            <Logo />
          </div>
          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-6 text-sm md:flex">
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

          <div className="flex items-center gap-2 sm:gap-4">
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search phones..."
                className="w-40 sm:w-64 pl-10 h-9"
              />
            </div>
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
