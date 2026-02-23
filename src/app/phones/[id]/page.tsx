
"use client";

import Image from "next/image";
import { notFound, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { MessageCircle, ShieldCheck, Loader2, Save } from "lucide-react";
import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { databases } from "@/lib/appwrite";
import type { PhoneDocument } from "@/lib/types";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { useToast } from "@/hooks/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AuthGuard } from '@/components/auth-guard';

const DATABASE_ID = process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!;
const COLLECTION_ID_PHONES = "products";

export default function PhoneDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const { user } = useAuth();
  const { toast } = useToast();

  const [phone, setPhone] = useState<PhoneDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const [formData, setFormData] = useState<Partial<PhoneDocument>>({});

  const isAdmin = user && (user.labels.includes('admin') || user.labels.includes('developer'));

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }
    const fetchPhone = async () => {
      setLoading(true);
      try {
        const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID_PHONES, id);
        const phoneData = response as unknown as PhoneDocument;
        setPhone(phoneData);
        setFormData(phoneData);

      } catch (error) {
        console.error("Failed to fetch phone details:", error);
        setPhone(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPhone();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    const isNumberField = name === 'price' || name === 'Battery';
    setFormData(prev => ({
      ...prev,
      [name]: isNumberField ? Number(value) : value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageClick = (clickedImageUrl: string, index: number) => {
    // All users can select a thumbnail to view it as the main image
    setSelectedImageIndex(index);

    // Admins can also reorder images (the selected image becomes the first/cover)
    if (isAdmin && formData.image) {
      const newImageOrder = [
        clickedImageUrl,
        ...formData.image.filter(url => url !== clickedImageUrl)
      ];

      setFormData(prev => ({
        ...prev,
        image: newImageOrder
      }));
      setSelectedImageIndex(0); // After reorder, the clicked image is now at index 0
    }
  }

  const handleApplyChanges = async () => {
    setIsUpdating(true);
    try {
      const { $id, $collectionId, $databaseId, $createdAt, $updatedAt, ...payload } = formData;
      await databases.updateDocument(DATABASE_ID, COLLECTION_ID_PHONES, id, payload);
      toast({
        title: 'Success!',
        description: 'Phone details have been updated.',
      });
      const response = await databases.getDocument(DATABASE_ID, COLLECTION_ID_PHONES, id);
      const phoneData = response as unknown as PhoneDocument;
      setPhone(phoneData);
      setFormData(phoneData);

    } catch (err: any) {
      console.error("Failed to update phone:", err);
      toast({
        title: 'Error',
        description: err.message || 'Could not update phone details.',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };


  if (loading) {
    return (
      <div className="container py-12 flex justify-center items-center min-h-[80vh]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!phone) {
    notFound();
  }

  const isPhone = phone.type === 'phone';
  const storageLabel = phone.storage === '1TB' ? '1TB' : `${phone.storage}GB`;
  const images = formData.image && formData.image.length > 0 ? formData.image : [];
  const mainImageUrl = images.length > 0 ? images[selectedImageIndex] || images[0] : "https://picsum.photos/seed/default-product/800/600";

  return (
    <AuthGuard>
      <div className="container py-8 md:py-12">
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16">
          <div className="flex flex-col gap-4">
            <Card className="overflow-hidden border-2">
              <div className="relative aspect-square w-full">
                <Image
                  src={mainImageUrl}
                  alt={phone.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover transition-opacity duration-300"
                  key={mainImageUrl}
                  priority
                />
              </div>
            </Card>
            {images.length > 1 && (
              <div className="grid grid-cols-6 gap-2">
                {images.map((imageUrl, index) => (
                  <button
                    key={`${id}-image-${index}`}
                    className={cn(
                      "relative aspect-square rounded-md overflow-hidden border-2 transition-all cursor-pointer",
                      index === selectedImageIndex
                        ? "border-primary ring-2 ring-primary/30"
                        : "border-transparent hover:border-primary/50"
                    )}
                    onClick={() => handleImageClick(imageUrl, index)}
                  >
                    <Image
                      src={imageUrl}
                      alt={`${phone.name} thumbnail ${index + 1}`}
                      fill
                      sizes="20vw"
                      className="object-cover"
                    />
                    {isAdmin && (
                      <div className="absolute top-0 left-0 bg-black/60 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-br-md">
                        {index + 1}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-8 md:gap-10">
            <div>
              {isAdmin ? (
                <div className="grid gap-2 mb-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" name="brand" value={formData.brand || ''} onChange={handleInputChange} />
                </div>
              ) : (
                phone.brand && <Badge variant="secondary" className="mb-2">{phone.brand}</Badge>
              )}

              {isAdmin ? (
                <div className="grid gap-2 mt-2">
                  <Label htmlFor="name">Product Name</Label>
                  <Input id="name" name="name" value={formData.name || ''} onChange={handleInputChange} className="text-3xl lg:text-4xl font-bold h-auto p-0 border-0" />
                </div>
              ) : (
                <h1 className="text-3xl lg:text-4xl font-bold">{phone.name}</h1>
              )}

              {isAdmin ? (
                <div className="grid md:grid-cols-3 gap-4 mt-2">
                  <div className="grid gap-2">
                    <Label htmlFor="Condition">Condition</Label>
                    <Select name="Condition" value={formData.Condition || ''} onValueChange={(value) => handleSelectChange('Condition', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="used">Used</SelectItem>
                        <SelectItem value="damaged">Damaged</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {isPhone && (
                    <div className="grid gap-2">
                      <Label htmlFor="storage">Storage</Label>
                      <Select name="storage" value={formData.storage || ''} onValueChange={(value) => handleSelectChange('storage', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select storage" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="32">32GB</SelectItem>
                          <SelectItem value="64">64GB</SelectItem>
                          <SelectItem value="128">128GB</SelectItem>
                          <SelectItem value="256">256GB</SelectItem>
                          <SelectItem value="512">512GB</SelectItem>
                          <SelectItem value="1TB">1TB</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                  <div className="grid gap-2">
                    <Label htmlFor="Colour">Colour</Label>
                    <Input id="Colour" name="Colour" value={formData.Colour || ''} onChange={handleInputChange} />
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-4 mt-2">
                  {phone.Condition && <Badge variant="outline" className="text-base border-primary text-primary capitalize">{phone.Condition}</Badge>}
                  {isPhone && phone.storage && <p className="text-muted-foreground">{storageLabel} | {phone.Colour}</p>}
                  {!isPhone && phone.Colour && <p className="text-muted-foreground">{phone.Colour}</p>}
                </div>
              )}
            </div>

            <div className="flex items-baseline gap-4 mt-2">
              {isAdmin ? (
                <div className="grid gap-2">
                  <Label htmlFor="price">Price</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-4xl font-bold text-primary">₹</span>
                    <Input id="price" name="price" type="number" value={formData.price || ''} onChange={handleInputChange} className="text-4xl font-bold text-primary h-auto p-0 border-0" />
                  </div>
                </div>
              ) : (
                <span className="text-4xl font-bold text-primary">₹{phone.price}</span>
              )}
            </div>

            {isAdmin ? (
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" value={formData.description || ''} onChange={handleInputChange} rows={4} />
              </div>
            ) : (
              <p className="text-muted-foreground">{phone.description}</p>
            )}

            <Card className="bg-card">
              <CardContent className="p-6 md:p-8">
                {isAdmin ? (
                  <Button size="lg" className="w-full text-lg py-6" onClick={handleApplyChanges} disabled={isUpdating}>
                    {isUpdating ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Save className="mr-2 h-5 w-5" />}
                    Apply Changes
                  </Button>
                ) : (
                  <Button size="lg" className="w-full text-lg py-6" asChild>
                    <Link href="/messages">
                      <MessageCircle className="mr-2 h-5 w-5" />
                      Message Patil
                    </Link>
                  </Button>
                )}
                <div className="flex items-center justify-center gap-2 mt-4 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4 text-green-400" />
                  <span>Quality Inspection Certified</span>
                </div>
              </CardContent>
            </Card>

            <Accordion type="single" collapsible defaultValue="item-1">
              {isPhone && (
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-lg font-medium">Specifications</AccordionTrigger>
                  <AccordionContent>
                    {isAdmin ? (
                      <div className="space-y-4">
                        <div className="grid gap-2">
                          <Label htmlFor="camera">Camera</Label>
                          <Input id="camera" name="camera" value={formData.camera || ''} onChange={handleInputChange} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="Processor">Processor</Label>
                          <Input id="Processor" name="Processor" value={formData.Processor || ''} onChange={handleInputChange} />
                        </div>
                        <div className="grid gap-2">
                          <Label htmlFor="Battery">Battery (hours)</Label>
                          <Input id="Battery" name="Battery" type="number" value={formData.Battery || ''} onChange={handleInputChange} />
                        </div>
                      </div>
                    ) : (
                      <ul className="space-y-4 text-muted-foreground mt-2">
                        {phone.camera && <li><strong>Camera:</strong> {phone.camera}</li>}
                        {phone.Processor && <li><strong>Processor:</strong> {phone.Processor}</li>}
                        {phone.Battery && <li><strong>Battery:</strong> {phone.Battery} hours video playback</li>}
                        <li><strong>Display:</strong> High-resolution display</li>
                      </ul>
                    )}
                  </AccordionContent>
                </AccordionItem>
              )}

            </Accordion>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}
