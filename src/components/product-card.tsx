
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PhoneDocument } from "@/lib/types";
import { Trash2 } from "lucide-react";

interface ProductCardProps {
  phone: PhoneDocument;
  isAdmin?: boolean;
  onDelete?: (phoneId: string) => void;
  priority?: boolean;
}

export function ProductCard({ phone, isAdmin, onDelete, priority }: ProductCardProps) {
  // Use the first image from the array as the display image.
  // Fallback to a default placeholder if the array is empty.
  const imageUrl = phone.image && phone.image.length > 0
    ? phone.image[0]
    : "https://picsum.photos/seed/default-product/800/600";

  const condition = phone.Condition || 'used';
  const color = phone.Colour || 'N/A';

  const storageLabel = phone.storage === '1TB' ? '1TB' : `${phone.storage}GB`;

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete?.(phone.$id);
  };

  return (
    <Card className="w-full overflow-hidden flex flex-col group border-2 border-card hover:border-primary/50 transition-all duration-300 relative hover:shadow-lg hover:shadow-primary/5 hover:-translate-y-1">
      {isAdmin && (
        <Button
          variant="destructive"
          size="icon"
          className="absolute top-3 right-3 z-10 h-8 w-8 opacity-80 hover:opacity-100"
          onClick={handleDeleteClick}
        >
          <Trash2 className="h-4 w-4" />
          <span className="sr-only">Delete</span>
        </Button>
      )}
      <Link href={`/phones/${phone.$id}`} className="flex flex-col h-full">
        <CardHeader className="p-0 border-b">
          <div className="relative aspect-square w-full">
            <Image
              src={imageUrl}
              alt={phone.name}
              fill
              priority={priority}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {/* We move the condition badge to avoid being overlapped by delete button */}
            <Badge variant="secondary" className="absolute top-3 left-3 capitalize bg-primary text-primary-foreground">{condition}</Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg leading-tight font-semibold mb-1 group-hover:text-primary transition-colors">
            {phone.name}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{storageLabel} - {color}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div>
            <p className="text-xl font-bold text-primary">₹{phone.price}</p>
          </div>
          <Button variant="outline" className="border-accent hover:bg-accent hover:text-accent-foreground">View</Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
