import Image from 'next/image';
import Link from 'next/link';
import {Button} from '@/components/ui/button';
import {Card, CardContent} from '@/components/ui/card';
import {phones} from '@/lib/data';
import {ProductCard} from '@/components/product-card';
import {ArrowRight} from 'lucide-react';

const AppleLogo = () => (
  <svg className="h-16 w-auto text-white" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.01,2.02c-1.28-0.01-2.5,0.48-3.52,1.57c-1.6,1.72-2.93,4.24-2.93,6.89c0,2.18,0.96,4.29,2.44,5.63 c0.99,0.89,2.2,1.36,3.48,1.33c0.1,0,0.2,0,0.3,0c1.23-0.08,2.3-0.56,3.23-1.41c1.45-1.3,2.23-3.2,2.25-5.11 c-0.02-0.09-0.03-0.19-0.03-0.28c-0.01-0.21-0.01-0.42-0.02-0.63c-2.3,0.08-4.22-1.63-4.32-3.83 c0.6-1.36,1.86-2.23,3.31-2.25c-0.8-1.27-2.02-2.03-3.41-2.05C12.11,2.02,12.06,2.02,12.01,2.02z M15.93,1.01 c-1.29-0.3-2.62-0.13-3.8,0.49c-0.03,0.02-0.06,0.03-0.09,0.05c-1.1,0.57-2.05,1.44-2.73,2.56c1.47,0.1,2.8,1,3.49,2.33 c0.13,0.25,0.22,0.52,0.27,0.79c-0.02,0-0.05,0-0.07,0c-2.92,0-5.28,2.48-5.28,5.54c0,2.57,1.59,4.86,3.87,5.78 c1.2,0.48,2.49,0.5,3.75,0.02c0.01,0,0.02-0.01,0.03-0.01c1.32-0.51,2.44-1.46,3.18-2.69c-1.42-0.89-2.28-2.5-2.28-4.2 c0-0.1,0-0.2,0-0.3c0.03-3.22,2.56-5.83,5.65-5.96C17.38,3.43,16.71,2.04,15.93,1.01z"></path>
  </svg>
);

const SamsungLogo = () => (
  <svg
    className="h-12 w-auto text-white"
    fill="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M21.11,6.08h-4.33c-0.2,0-0.38,0.1-0.49,0.26l-3.32,5.19l-1.95-3.31c-0.1-0.17-0.28-0.27-0.48-0.27H6.21 c-0.3,0-0.55,0.25-0.55,0.55c0,0.14,0.05,0.27,0.15,0.38l3.96,4.45l-4.08,4.48c-0.1,0.11-0.15,0.24-0.15,0.38 c0,0.3,0.25,0.55,0.55,0.55h4.33c0.2,0,0.38-0.1,0.49-0.26l3.32-5.19l1.95,3.31c0.1,0.17,0.28,0.27,0.48,0.27h4.33 c0.3,0,0.55-0.25,0.55-0.55c0-0.14-0.05-0.27-0.15-0.38l-3.96-4.45l4.08-4.48c0.1-0.11,0.15-0.24,0.15-0.38 C21.66,6.33,21.41,6.08,21.11,6.08z" />
  </svg>
);


const GoogleLogo = () => (
    <svg className="h-12 w-auto" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M21.35,11.1h-9.2v2.7h5.3c-0.5,2.4-2.6,3.9-5.3,3.9c-3.1,0-5.6-2.5-5.6-5.6s2.5-5.6,5.6-5.6c1.4,0,2.7,0.5,3.7,1.5 l2.1-2.1C15.8,2.7,14,2,12,2C6.5,2,2,6.5,2,12s4.5,10,10,10c5.3,0,9.6-4.2,9.6-9.6C21.6,11.7,21.5,11.4,21.35,11.1z" fill="#4285F4"></path>
        <path d="M21.35,11.1h-9.2v2.7h5.3c-0.5,2.4-2.6,3.9-5.3,3.9c-1.1,0-2.1-0.3-3-0.8l-2.4,1.9c1.5,1,3.5,1.6,5.4,1.6 c5.3,0,9.6-4.2,9.6-9.6C21.6,11.7,21.5,11.4,21.35,11.1z" fill="#34A853"></path>
        <path d="M6.4,14.2c-0.3-0.9-0.3-1.8,0-2.7l-2.4-1.9c-1.2,2.1-1.2,4.7,0,6.8L6.4,14.2z" fill="#FBBC05"></path>
        <path d="M12,17.7c1.9,0,3.6-0.7,4.9-1.9l-2.1-2.1c-0.8,0.5-1.7,0.8-2.8,0.8c-1.8,0-3.3-1-4.2-2.5L2.4,12 C4.1,15.6,7.7,18,12,18L12,17.7z" fill="#EA4335"></path>
    </svg>
);


export default function Home() {
  const featuredPhones = phones.slice(0, 4);
  const brands = [
    {name: 'Apple', logo: <AppleLogo />},
    {name: 'Samsung', logo: <SamsungLogo />},
    {name: 'Google', logo: <GoogleLogo />},
  ];

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[40vh] flex items-center justify-center text-center">
        <Image
          src="/phonepoint.png"
          alt="Phone Point hero image"
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
      </section>

      <section className="py-16 md:py-24 bg-background">
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

      <section className="py-16 md:py-24 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight">Shop By Brand</h2>
          <p className="mt-2 text-muted-foreground max-w-lg mx-auto">
            Find your favorite brands and their best models.
          </p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {brands.map(brand => (
                <Link href={`/phones?brand=${brand.name}`} key={brand.name}>
                  <Card className="bg-card hover:bg-accent/20 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1 h-full">
                    <CardContent className="p-8 flex justify-center items-center h-full">
                      {brand.logo}
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
