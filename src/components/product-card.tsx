
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { PhoneDocument } from "@/lib/types";
import { Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const hasSale = phone.tag === 'sale' && phone.new_price;
  const tagColors: Record<string, string> = {
    'sale': 'bg-red-500 text-white',
    'budget': 'bg-green-500 text-white',
    'like-new': 'bg-purple-500 text-white',
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
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              <Badge variant="secondary" className="capitalize bg-primary text-primary-foreground w-fit">{condition}</Badge>
              {phone.tag && phone.tag !== 'none' && (
                <Badge className={cn("capitalize w-fit border-0", tagColors[phone.tag])}>
                  {phone.tag.replace('-', ' ')}
                </Badge>
              )}
            </div>
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
            {hasSale ? (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground line-through">₹{phone.price}</span>
                <span className="text-xl font-bold text-red-600">₹{phone.new_price}</span>
              </div>
            ) : (
              <p className="text-xl font-bold text-primary">₹{phone.price}</p>
            )}
          </div>
          <Button variant="outline" className="border-accent hover:bg-accent hover:text-accent-foreground">View</Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
