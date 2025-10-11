import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { phones } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { ArrowRight } from "lucide-react";

export default function Home() {
  const featuredPhones = phones.slice(0, 4);
  const heroImage = PlaceHolderImages.find(p => p.id === 'hero-image');
  const brands = [
    { name: "Apple", logoId: "apple-logo" },
    { name: "Samsung", logoId: "samsung-logo" },
    { name: "Google", logoId: "google-logo" },
  ];

  return (
    <div className="flex flex-col min-h-[100dvh]">
      <section className="relative w-full h-[60vh] md:h-[70vh]">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            data-ai-hint={heroImage.imageHint}
            priority
          />
        )}
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container">
          <div className="flex justify-between items-center mb-8">
             <h2 className="text-3xl font-bold tracking-tight">Featured Deals</h2>
             <Link href="/phones" className="flex items-center gap-2 text-primary hover:underline">
               View All <ArrowRight className="w-4 h-4"/>
             </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredPhones.map((phone) => (
              <ProductCard key={phone.id} phone={phone} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container text-center">
          <h2 className="text-3xl font-bold tracking-tight">Shop By Brand</h2>
          <p className="mt-2 text-muted-foreground max-w-lg mx-auto">Find your favorite brands and their best models.</p>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {brands.map((brand) => {
              const brandLogo = PlaceHolderImages.find(p => p.id === brand.logoId);
              return (
                <Link href={`/phones?brand=${brand.name}`} key={brand.name}>
                  <Card className="bg-card hover:bg-accent/20 hover:border-primary/50 transition-all duration-300 transform hover:-translate-y-1">
                    <CardContent className="p-8 flex justify-center items-center">
                      {brandLogo && (
                        <Image
                          src={brandLogo.imageUrl}
                          alt={`${brand.name} logo`}
                          width={120}
                          height={120}
                          className="h-16 w-auto object-contain invert brightness-0 filter"
                          data-ai-hint={brandLogo.imageHint}
                          style={{ color: 'white' }}
                        />
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
