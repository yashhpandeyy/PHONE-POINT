import { Twitter, Github, Dribbble } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-border/40">
      <div className="container py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          <div className="sm:col-span-2">
            <Logo />
            <p className="mt-4 text-muted-foreground max-w-sm">
              Your trusted source for certified refurbished smartphones at unbeatable prices.
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/phones" className="text-muted-foreground hover:text-primary">All Phones</Link></li>
              <li><Link href="/deals" className="text-muted-foreground hover:text-primary">Deals</Link></li>
              <li><Link href="/about" className="text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground">Follow Us</h3>
            <div className="flex items-center gap-4 mt-4">
              <Link href="#" aria-label="Twitter"><Twitter className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
              <Link href="#" aria-label="GitHub"><Github className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
              <Link href="#" aria-label="Dribbble"><Dribbble className="h-6 w-6 text-muted-foreground hover:text-primary" /></Link>
            </div>
          </div>
        </div>
        <div className="mt-12 pt-8 border-t border-border/40 text-center text-muted-foreground text-sm">
          <p>&copy; {new Date().getFullYear()} Phone Point. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
