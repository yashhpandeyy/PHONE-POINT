
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

  const bgColors = [
    'bg-amber-100 hover:bg-amber-200 dark:bg-amber-900/20 dark:hover:bg-amber-900/40',
    'bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40',
    'bg-cyan-100 hover:bg-cyan-200 dark:bg-cyan-900/20 dark:hover:bg-cyan-900/40',
    'bg-rose-100 hover:bg-rose-200 dark:bg-rose-900/20 dark:hover:bg-rose-900/40',
    'bg-fuchsia-100 hover:bg-fuchsia-200 dark:bg-fuchsia-900/20 dark:hover:bg-fuchsia-900/40',
    'bg-indigo-100 hover:bg-indigo-200 dark:bg-indigo-900/20 dark:hover:bg-indigo-900/40',
    'bg-teal-100 hover:bg-teal-200 dark:bg-teal-900/20 dark:hover:bg-teal-900/40',
    'bg-lime-100 hover:bg-lime-200 dark:bg-lime-900/20 dark:hover:bg-lime-900/40',
  ];

  // Hash the ID to assign a consistent random color from the array
  const colorIndex = phone.$id
    ? Array.from(phone.$id).reduce((acc, char) => acc + char.charCodeAt(0), 0) % bgColors.length
    : 0;
  const cardBgColor = bgColors[colorIndex];

  return (
    <Card className={cn(
      "w-full overflow-hidden flex flex-col group border-2 border-border/50 hover:border-primary/50 transition-all duration-500 relative hover:shadow-[0_0_20px_rgba(246,147,29,0.15)] hover:-translate-y-1",
      cardBgColor
    )}>
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
              <Badge
                className={cn(
                  "capitalize w-fit font-bold rounded-full px-3",
                  condition.toLowerCase().includes('like') ? "bg-purple-500 hover:bg-purple-600 text-white" : "bg-orange-500 hover:bg-orange-600 text-white"
                )}
              >
                {condition}
              </Badge>
              {phone.tag && phone.tag !== 'none' && (
                <Badge className={cn("capitalize w-fit border-0", tagColors[phone.tag])}>
                  {phone.tag.replace('-', ' ')}
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-4 flex-grow">
          <CardTitle className="text-lg leading-tight font-bold text-slate-800 dark:text-slate-200 mb-1 group-hover:text-primary transition-colors">
            {phone.name.toUpperCase()}
          </CardTitle>
          <p className="text-sm text-slate-500 font-medium">{storageLabel} - {color.toUpperCase()}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between items-center">
          <div>
            {hasSale ? (
              <div className="flex flex-col">
                <span className="text-xs text-muted-foreground line-through">₹{phone.price}</span>
                <span className="text-xl font-black text-red-600">₹{phone.new_price}</span>
              </div>
            ) : (
              <p className="text-xl font-black text-orange-500">₹{phone.price}</p>
            )}
          </div>
          <Button variant="outline" className="border-2 border-slate-800 text-slate-800 dark:border-slate-200 dark:text-slate-200 bg-transparent hover:bg-slate-800 hover:text-white dark:hover:bg-slate-200 dark:hover:text-slate-800 rounded-full px-6 py-2 md:px-8 md:py-2.5 text-sm md:text-base font-bold shadow-sm">View</Button>
        </CardFooter>
      </Link>
    </Card>
  );
}
