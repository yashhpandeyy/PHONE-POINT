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
        <div className="absolute inset-0 bg-gradient-to-t from-background to-background/30" />
        <div className="relative container h-full flex flex-col items-center justify-end text-center pb-12 md:pb-24">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl lg:text-7xl">
            Premium Tech, Second Life
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-primary/80 md:text-xl">
            Discover certified refurbished phones that look and feel like new. All at a fraction of the cost.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-4 w-full max-w-md sm:max-w-none px-4 sm:px-0">
            <Button asChild size="lg" className="text-lg py-6 px-8 flex-1 sm:flex-initial">
              <Link href="/phones">Browse All Phones</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg py-6 px-8 border-primary/50 text-primary hover:bg-primary/10 hover:text-primary flex-1 sm:flex-initial">
              <Link href="/deals">View Top Deals</Link>
            </Button>
          </div>
        </div>
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
