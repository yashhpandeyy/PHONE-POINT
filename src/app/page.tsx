import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {phones} from '@/lib/data';
import {ProductCard} from '@/components/product-card';
import {ArrowRight} from 'lucide-react';

export default function Home() {
  const featuredPhones = phones.slice(0, 4);
  const brands = [
    {name: 'Apple', logo: '/apple.png'},
    {name: 'Samsung', logo: '/samsung.png'},
    {name: 'Google', logo: '/google.png'},
  ];

  return (
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
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {featuredPhones.map(phone => (
              <ProductCard key={phone.id} phone={phone} />
            ))}
          </div>
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
                    <CardContent className="p-8 flex justify-center items-center h-32 relative">
                       <Image
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        fill
                        className="object-contain p-4"
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
  );
}
