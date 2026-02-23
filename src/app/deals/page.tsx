'use client';

import { AuthGuard } from '@/components/auth-guard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, Sparkles, TrendingDown } from 'lucide-react';
import Link from 'next/link';

export default function DealsPage() {
  const dealCategories = [
    {
      icon: TrendingDown,
      title: "Price Drops",
      description: "Recently reduced prices on popular models. Save up to 30% on select devices.",
      link: "/phones",
      badge: "Hot"
    },
    {
      icon: Tag,
      title: "Budget Picks",
      description: "Quality phones under ₹15,000. Great value without compromising on reliability.",
      link: "/phones",
      badge: "Value"
    },
    {
      icon: Sparkles,
      title: "Like-New Deals",
      description: "Premium phones in excellent condition. Look and feel brand new at refurbished prices.",
      link: "/phones",
      badge: "Premium"
    }
  ];

  return (
    <AuthGuard>
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Top Deals</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Check out our latest offers on refurbished phones and accessories. New deals added weekly!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {dealCategories.map((deal) => (
            <Link href={deal.link} key={deal.title}>
              <Card className="bg-card/50 border-border hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 h-full cursor-pointer group">
                <CardContent className="p-8 flex flex-col items-center text-center gap-4">
                  <Badge variant="secondary" className="bg-primary/10 text-primary border-0">{deal.badge}</Badge>
                  <div className="p-4 rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <deal.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{deal.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{deal.description}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-primary/5 via-accent/10 to-primary/5 border-primary/20">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2">Don&apos;t Miss Out!</h2>
            <p className="text-muted-foreground">
              Browse our full collection of phones to find the best deal for you.
            </p>
          </CardContent>
        </Card>
      </div>
    </AuthGuard>
  );
}
