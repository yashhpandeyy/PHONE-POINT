
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ProductCard } from '@/components/product-card';
import { CategoryTabs } from '@/components/category-tabs';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardContent } from '@/components/ui/card';
import { databases } from '@/lib/appwrite';
import type { PhoneDocument } from '@/lib/types';
import { Query } from 'appwrite';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import Autoplay from 'embla-carousel-autoplay';
import { cn } from '@/lib/utils';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID_PHONES = "products";

export default function Home() {
  const [featuredPhones, setFeaturedPhones] = useState<PhoneDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        // Fetch a larger batch to sort locally
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID_PHONES,
          [
            Query.orderDesc('$createdAt'),
            Query.limit(20)
          ]
        );

        const allProducts = response.documents as unknown as PhoneDocument[];

        // Sort locally: Phones first, then everything else. Within groups, by recency.
        const sortedProducts = [...allProducts].sort((a, b) => {
          const aPriority = a.type === 'phone' ? 0 : 1;
          const bPriority = b.type === 'phone' ? 0 : 1;

          if (aPriority !== bPriority) return aPriority - bPriority;

          // If same priority, use createdAt (should already be mostly handled by query, but being explicit)
          return new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
        });

        // Show up to 8 featured products (2 rows on desktop)
        setFeaturedPhones(sortedProducts.slice(0, 8));
        console.log("✅ Prioritized products for home:", sortedProducts.slice(0, 8).map(p => ({ n: p.name, t: p.type })));
      } catch (error) {
        console.error("Failed to fetch featured phones:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPhones();
  }, []);

  const brands = [
    { name: 'Apple', logo: '/apple.png' },
    { name: 'Samsung', logo: '/samsung.png' },
    { name: 'Google', logo: '/google.png' },
  ];

  return (
    <AuthGuard>
      <div className="flex flex-col min-h-[100dvh] bg-background">
        {/* HERO CAROUSEL replacing the static poster */}
        <section className="relative w-full overflow-hidden bg-muted">
          <Carousel
            opts={{ align: "start", loop: true }}
            plugins={[Autoplay({ delay: 3000 })]}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {[
                '/Gemini_Generated_Image_3p6ugh3p6ugh3p6u (1).png',
                '/Gemini_Generated_Image_3p6ugh3p6ugh3p6u.png',
                '/Gemini_Generated_Image_e2vpoue2vpoue2vp.png',
                '/Gemini_Generated_Image_jujamjjujamjjuja.png',
                '/Gemini_Generated_Image_ynp1ibynp1ibynp1.png'
              ].map((src, index) => (
                <CarouselItem key={index} className="relative w-full aspect-[21/9] md:aspect-[3/1] max-h-[70vh] select-none pl-0">
                  <Image
                    src={src}
                    alt={`Banner ${index + 1}`}
                    fill
                    className="object-cover md:object-contain"
                    priority={index === 0}
                    sizes="100vw"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </section>

        <CategoryTabs />

        {/* FEATURED DEALS SECTION */}
        <section className="py-16 md:py-24 bg-gradient-to-b from-primary/5 to-transparent relative">
          {/* Decorative blur orb */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

          <div className="container px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-200">
                Featured <span className="text-orange-500">Deals</span>
              </h2>
              <Link
                href="/phones"
                className="flex items-center gap-1 text-orange-500 hover:text-orange-600 font-bold"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {featuredPhones.map(phone => (
                  <ProductCard key={phone.$id} phone={phone} />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* SHOP BY BRAND SECTION */}
        <section className="py-16 md:py-24 bg-gradient-to-t from-secondary/10 to-transparent relative">
          <div className="container text-center relative z-10">
            <h2 className="text-3xl font-black tracking-tight text-slate-800 dark:text-slate-200">Shop By <span className="text-primary">Brand</span></h2>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
              Find your favorite brands and their best models.
            </p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {brands.map((brand, i) => (
                <Link href={`/phones?brand=${brand.name}`} key={brand.name}>
                  <Card
                    className={cn(
                      "hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 h-full border border-border/20 relative overflow-hidden group bg-black rounded-3xl"
                    )}
                  >
                    {/* Hover Glow Effect inside the card */}
                    <div className="absolute inset-0 bg-white/40 dark:bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <CardContent className="p-8 flex justify-center items-center h-32 relative z-10">
                      <Image
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        fill
                        className="object-contain p-6 group-hover:scale-110 transition-transform duration-500 drop-shadow-md"
                        sizes="(max-width: 640px) 100vw, 33vw"
                      />
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      </div>
    </AuthGuard >
  );
}
