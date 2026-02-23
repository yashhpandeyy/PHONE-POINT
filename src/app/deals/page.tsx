'use client';

import { AuthGuard } from '@/components/auth-guard';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tag, Sparkles, TrendingDown, Loader2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { databases, DATABASE_ID, COLLECTION_ID_PHONES } from '@/lib/appwrite';
import { Query } from 'appwrite';
import type { PhoneDocument } from '@/lib/types';
import { ProductCard } from '@/components/product-card';
import { cn } from '@/lib/utils';

export default function DealsPage() {
  const [activeTag, setActiveTag] = useState<'sale' | 'budget' | 'like-new'>('sale');
  const [products, setProducts] = useState<PhoneDocument[]>([]);
  const [loading, setLoading] = useState(true);

  const dealCategories = [
    {
      id: 'sale',
      icon: TrendingDown,
      title: "Price Drops",
      description: "Recently reduced prices on popular models.",
      badge: "Hot",
      color: "bg-red-500"
    },
    {
      id: 'budget',
      icon: Tag,
      title: "Budget Picks",
      description: "Quality phones under ₹15,000.",
      badge: "Value",
      color: "bg-green-500"
    },
    {
      id: 'like-new',
      icon: Sparkles,
      title: "Like-New",
      description: "Premium phones in excellent condition.",
      badge: "Premium",
      color: "bg-purple-500"
    }
  ];

  useEffect(() => {
    const fetchDeals = async () => {
      setLoading(true);
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID_PHONES,
          [
            Query.equal('tag', activeTag),
            Query.orderDesc('$createdAt'),
            Query.limit(20)
          ]
        );
        setProducts(response.documents as unknown as PhoneDocument[]);
      } catch (error) {
        console.error("Failed to fetch deals:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDeals();
  }, [activeTag]);

  return (
    <AuthGuard>
      <div className="container py-8 md:py-12">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent italic">Exclusive Deals</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Hand-picked offers on refurbished tech. New deals added weekly!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
          {dealCategories.map((deal) => (
            <button
              key={deal.id}
              onClick={() => setActiveTag(deal.id as any)}
              className={cn(
                "text-left transition-all duration-300 transform hover:-translate-y-1",
                activeTag === deal.id ? "scale-105" : "opacity-80"
              )}
            >
              <Card className={cn(
                "border-2 transition-colors overflow-hidden h-full",
                activeTag === deal.id ? "border-primary bg-primary/5 shadow-md shadow-primary/10" : "border-border hover:border-primary/30"
              )}>
                <CardContent className="p-6 flex flex-col items-center text-center gap-3">
                  <Badge className={cn("border-0", deal.color)}>{deal.badge}</Badge>
                  <div className={cn(
                    "p-3 rounded-xl transition-colors",
                    activeTag === deal.id ? "bg-primary text-primary-foreground" : "bg-primary/10 text-primary"
                  )}>
                    <deal.icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold">{deal.title}</h3>
                  <p className="text-xs text-muted-foreground">{deal.description}</p>
                </CardContent>
              </Card>
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="h-10 w-10 animate-spin text-primary" />
            <p className="text-muted-foreground animate-pulse">Hunting for best deals...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {products.map((product) => (
              <ProductCard key={product.$id} phone={product} />
            ))}
            {products.length === 0 && (
              <div className="col-span-full py-20 text-center bg-muted/30 rounded-2xl border-2 border-dashed border-border/50">
                <Tag className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <h3 className="text-xl font-semibold opacity-60">No {dealCategories.find(d => d.id === activeTag)?.title} available right now.</h3>
                <p className="text-muted-foreground mt-1">Check back soon or browse other categories!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AuthGuard>
  );
}
