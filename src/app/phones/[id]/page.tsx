import Image from "next/image";
import { notFound } from "next/navigation";
import { phones } from "@/lib/data";
import { PlaceHolderImages } from "@/lib/placeholder-images";
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

export default function PhoneDetailPage({ params }: { params: { id: string } }) {
  const phone = phones.find((p) => p.id === params.id);

  if (!phone) {
    notFound();
  }

  const image = PlaceHolderImages.find((p) => p.id === phone.image);

  return (
    <div className="container py-12">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Card className="overflow-hidden border-2">
            <div className="relative aspect-square w-full">
              {image && (
                <Image
                  src={image.imageUrl}
                  alt={phone.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  data-ai-hint={image.imageHint}
                />
              )}
            </div>
          </Card>
          {/* In a real app, this would be a carousel */}
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
