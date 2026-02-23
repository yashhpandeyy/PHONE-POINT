
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Loader2 } from 'lucide-react';
import { useEffect, useState } from 'react';

import { ProductCard } from '@/components/product-card';
import { AuthGuard } from '@/components/auth-guard';
import { Card, CardContent } from '@/components/ui/card';
import { databases } from '@/lib/appwrite';
import type { PhoneDocument } from '@/lib/types';
import { Query } from 'appwrite';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID_PHONES = "products";

export default function Home() {
  const [featuredPhones, setFeaturedPhones] = useState<PhoneDocument[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhones = async () => {
      try {
        const response = await databases.listDocuments(
          DATABASE_ID,
          COLLECTION_ID_PHONES,
          [Query.limit(4)] // Fetch only 4 for the featured section
        );
        setFeaturedPhones(response.documents as PhoneDocument[]);
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
      <div className="flex flex-col min-h-[100dvh]">
        <section className="relative w-full h-[60vh] md:h-[70vh]">
          <Image
            src="/phonepoint.png"
            alt="Phone Point hero image"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
        </section>

        <section className="py-16 md:py-24 bg-card/50">
          <div className="container px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold tracking-tight">
                Featured Deals
              </h2>
              <Link
                href="/phones"
                className="flex items-center gap-2 text-primary hover:underline"
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

        <section className="py-16 md:py-24">
          <div className="container text-center">
            <h2 className="text-3xl font-bold tracking-tight">Shop By Brand</h2>
            <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
              Find your favorite brands and their best models.
            </p>
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
              {brands.map(brand => (
                <Link href={`/phones?brand=${brand.name}`} key={brand.name}>
                  <Card className="bg-card hover:bg-accent/20 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 h-full">
                    <CardContent className="p-8 flex justify-center items-center h-24 relative">
                      <Image
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        fill
                        className="object-contain p-6"
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
    </AuthGuard>
  );
}
