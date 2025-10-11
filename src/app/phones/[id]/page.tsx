

"use client";

import Image from "next/image";
import { notFound } from "next/navigation";
import { phones } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ShoppingCart, ShieldCheck, Star } from "lucide-react";
import React from "react";
import { cn } from "@/lib/utils";

// Hardcoded images for simplicity
const hardcodedImages = [
  { id: 'img1', imageUrl: '/first.jpg', description: 'iPhone 14 Pro front', imageHint: 'iphone front' },
  { id: 'img2', imageUrl: '/second.jpg', description: 'iPhone 14 Pro back', imageHint: 'iphone purple' },
  { id: 'img3', imageUrl: '/iphone-14-pro-3.jpg', description: 'iPhone 14 Pro cameras', imageHint: 'iphone purple back' },
  { id: 'img4', imageUrl: '/iphone-14-pro-4.jpg', description: 'iPhone 14 Pro side', imageHint: 'iphone purple side' },
];

export default function PhoneDetailPage({ params }: { params: { id: string } }) {
  const phone = phones.find((p) => p.id === params.id);

  if (!phone) {
    notFound();
  }

  // Use hardcoded images if it's the iPhone 14 Pro, otherwise use the existing logic
  const useHardcoded = phone.id === 'iphone-14-pro';
  const phoneImages = useHardcoded
    ? hardcodedImages
    : phone.images
        .map((imageId) => hardcodedImages.find((p) => p.id === imageId)) // This part is a placeholder, will use real images if not iphone 14 pro
        .filter(Boolean);

  const [activeImage, setActiveImage] = React.useState(phoneImages[0]);


  if (!activeImage) {
    // Handle case where no images are found, though data structure should prevent this
    return <div>Image data not available.</div>;
  }

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="flex flex-col gap-4">
          <Card className="overflow-hidden border-2">
            <div className="relative aspect-square w-full">
              <Image
                src={activeImage.imageUrl}
                alt={phone.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-opacity duration-300"
                data-ai-hint={activeImage.imageHint}
                key={activeImage.id}
                unoptimized
              />
            </div>
          </Card>
          <div className="grid grid-cols-5 gap-2">
            {phoneImages.map((image) => (
              image && (
                <button
                  key={image.id}
                  className={cn(
                    "relative aspect-square rounded-md overflow-hidden border-2 transition",
                    activeImage.id === image.id ? "border-primary" : "border-transparent hover:border-primary/50"
                  )}
                  onClick={() => setActiveImage(image)}
                >
                  <Image
                    src={image.imageUrl}
                    alt={image.description}
                    fill
                    sizes="20vw"
                    className="object-cover"
                    data-ai-hint={image.imageHint}
                    unoptimized
                  />
                </button>
              )
            ))}
          </div>
        </div>
        
        <div className="flex flex-col gap-6">
          <div>
            <Badge variant="secondary" className="mb-2">{phone.brand}</Badge>
            <h1 className="text-3xl lg:text-4xl font-bold">{phone.name}</h1>
            <div className="flex items-center gap-4 mt-2">
              <Badge variant="outline" className="text-base border-primary text-primary">{phone.condition}</Badge>
              <p className="text-muted-foreground">{phone.storage} | {phone.color}</p>
            </div>
          </div>
          
          <div className="flex items-baseline gap-4">
             <span className="text-4xl font-bold text-primary">${phone.price}</span>
             <span className="text-lg text-muted-foreground line-through">${phone.originalPrice}</span>
          </div>

          <p className="text-muted-foreground">{phone.description}</p>
          
          <Card className="bg-card">
            <CardContent className="p-4">
              <Button size="lg" className="w-full text-lg py-6">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                <ShieldCheck className="h-4 w-4 text-green-400" />
                <span>12-Month Warranty Included</span>
              </div>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible defaultValue="item-1">
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-lg font-medium">Specifications</AccordionTrigger>
              <AccordionContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li><strong>Display:</strong> {phone.specs.display}</li>
                  <li><strong>Camera:</strong> {phone.specs.camera}</li>
                  <li><strong>Processor:</strong> {phone.specs.processor}</li>
                  <li><strong>Battery:</strong> {phone.specs.battery}</li>
                </ul>
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger className="text-lg font-medium">Customer Reviews</AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <div className="flex text-primary">
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5 fill-current" />
                      <Star className="h-5 w-5" />
                    </div>
                    <span className="font-medium">4.8 (125 Reviews)</span>
                  </div>
                  <p className="text-muted-foreground">Reviews coming soon...</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </div>
  );
}
