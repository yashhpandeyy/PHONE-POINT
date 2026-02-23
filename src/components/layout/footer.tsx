import { Twitter, Github, Dribbble, Phone, Mail, MapPin } from "lucide-react";
import Link from "next/link";
import { Logo } from "@/components/logo";

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-card/30 backdrop-blur-sm pb-safe">
      <div className="container py-16 px-4">
        <div className="grid grid-cols-2 md:grid-cols-12 gap-x-4 gap-y-12 md:gap-12 text-center md:text-left">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 flex flex-col items-center md:items-start">
            <Logo />
            <p className="mt-4 text-muted-foreground max-w-sm leading-relaxed">
              Your trusted source for certified refurbished smartphones at unbeatable prices. Quality guaranteed.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <Link href="#" aria-label="Twitter" className="p-2 rounded-lg bg-accent/30 hover:bg-primary/20 transition-colors">
                <Twitter className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="GitHub" className="p-2 rounded-lg bg-accent/30 hover:bg-primary/20 transition-colors">
                <Github className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
              <Link href="#" aria-label="Dribbble" className="p-2 rounded-lg bg-accent/30 hover:bg-primary/20 transition-colors">
                <Dribbble className="h-5 w-5 text-muted-foreground hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Quick Links</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/phones" className="text-muted-foreground hover:text-primary transition-colors text-sm">All Phones</Link></li>
              <li><Link href="/accessories" className="text-muted-foreground hover:text-primary transition-colors text-sm">Accessories</Link></li>
              <li><Link href="/repair" className="text-muted-foreground hover:text-primary transition-colors text-sm">Repair</Link></li>
              <li><Link href="/deals" className="text-muted-foreground hover:text-primary transition-colors text-sm">Deals</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div className="col-span-1 md:col-span-2 flex flex-col items-center md:items-start">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider">Company</h3>
            <ul className="mt-4 space-y-3">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors text-sm">About Us</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors text-sm">Contact</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="col-span-2 md:col-span-4 flex flex-col items-start">
            <h3 className="font-semibold text-foreground text-sm uppercase tracking-wider w-full text-center md:text-left">Get in Touch</h3>
            <ul className="mt-4 space-y-4 text-left w-full flex flex-col items-center md:items-start">
              <li className="flex items-center gap-3 text-sm text-muted-foreground w-full max-w-xs md:max-w-none">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+91 820 018 7929</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground w-full max-w-xs md:max-w-none">
                <Mail className="h-4 w-4 text-primary shrink-0" />
                <span className="truncate">phonepointsilvassa@gmail.com</span>
              </li>
              <li className="flex items-start gap-3 text-sm text-muted-foreground w-full max-w-xs md:max-w-none">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span className="leading-relaxed">
                  Shop no. 5, prem gali,<br />
                  opp. jain temple, char rasta,<br />
                  Silvassa, Dadra and Nagar Haveli,<br />
                  396230
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border/40 flex flex-col sm:flex-row justify-between items-center gap-4 text-muted-foreground text-xs">
          <p>&copy; {new Date().getFullYear()} Phone Point. All Rights Reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
