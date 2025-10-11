import Image from "next/image";
import Link from "next/link";
import type { Phone } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  phone: Phone;
}

export function ProductCard({ phone }: ProductCardProps) {
  const image = PlaceHolderImages.find((p) => p.id === phone.image);

  return (
    <Card className="w-full overflow-hidden flex flex-col group border-2 border-card hover:border-primary/50 transition-all duration-300">
      <Link href={`/phones/${phone.id}`} className="flex flex-col h-full">
        <CardHeader className="p-0 border-b">
          <div className="relative aspect-square w-full">
            {image && (
              <Image
                src={image.imageUrl}
                alt={phone.name}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                data-ai-hint={image.imageHint}
              />
            )}
            <Badge variant="secondary" className="absolute top-3 right-3 bg-primary text-primary-foreground">{phone.condition}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg leading-tight font-semibold mb-1 group-hover:text-primary transition-colors">
            {phone.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{phone.storage} - {phone.color}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div>
            <p className="text-xl font-bold text-primary">${phone.price}</p>
            <p className="text-xs text-muted-foreground line-through">${phone.originalPrice}</p>
          </div>
          <Button variant="outline" className="border-accent hover:bg-accent hover:text-accent-foreground">View</Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
