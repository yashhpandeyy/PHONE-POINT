
'use client';

import { useEffect, useMemo, useState } from 'react';
import { RepairCard } from "@/components/repair-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Loader2, Search, SlidersHorizontal, Trash2, Tag } from "lucide-react";
import { SoldForm } from "@/components/admin/sold-form";
import { databases, DATABASE_ID, COLLECTION_ID_PRODUCTS } from '@/lib/appwrite';
import type { PhoneDocument } from '@/lib/types';
import { Query } from 'appwrite';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/components/auth-guard';

import { Suspense } from 'react';
import { ListingPageSkeleton } from '@/components/ui/listing-skeleton';

function RepairList() {
  const { user } = useAuth();
  const { toast } = useToast();

  const [services, setServices] = useState<PhoneDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isSoldFormOpen, setIsSoldFormOpen] = useState(false);
  const [productToSold, setProductToSold] = useState<PhoneDocument | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter & sort state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('featured');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const isAdmin = !!(user && (user.labels.includes('admin') || user.labels.includes('developer')));

  const fetchServices = async () => {
    setLoading(true);
    try {
      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_PRODUCTS,
        [Query.equal('type', 'repair'), Query.orderDesc('$createdAt'), Query.limit(100)]
      );
      setServices(response.documents as unknown as PhoneDocument[]);
    } catch (error) {
      console.error("Failed to fetch repair services:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  // Client-side filtering & sorting
  const filteredServices = useMemo(() => {
    let result = [...services];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Price filter
    const min = minPrice ? Number(minPrice) : null;
    const max = maxPrice ? Number(maxPrice) : null;
    if (min !== null) {
      result = result.filter(p => p.price >= min);
    }
    if (max !== null) {
      result = result.filter(p => p.price <= max);
    }

    // Sort
    if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    }

    return result;
  }, [services, searchQuery, sortBy, minPrice, maxPrice]);

  const handleDelete = async () => {
    if (!productToDelete) return;

    const productData = services.find(p => p.$id === productToDelete);

    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_PRODUCTS, productToDelete);
      setServices(prev => prev.filter(p => p.$id !== productToDelete));
      toast({ title: "Success", description: "Repair service listing deleted." });

      if (productData && productData.image && productData.image.length > 0) {
        const res = await fetch('/api/delete-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrls: productData.image }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error('Image cleanup failed:', errorData.error);
        }
      }
    } catch (error: any) {
      console.error("Failed to delete service:", error);
      toast({ title: "Error", description: error.message || "Could not delete service.", variant: 'destructive' });
    } finally {
      setProductToDelete(null);
    }
  }



  const FilterContent = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold border-b border-border pb-3 hidden md:block">Filters</h2>
      <div>
        <h3 className="font-medium mb-2 text-sm uppercase tracking-wider text-muted-foreground">Price</h3>
        <div className="flex items-center gap-2">
          <Input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="h-8 text-sm"
          />
          <span className="text-muted-foreground text-sm">-</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="h-8 text-sm"
          />
        </div>
      </div>
      <div>
        <h3 className="font-medium mb-2 text-sm uppercase tracking-wider text-muted-foreground">Service Type</h3>
        <ul className="space-y-2 text-sm">
          <li><span className="text-foreground/80">Screen Repair</span></li>
          <li><span className="text-foreground/80">Battery Replacement</span></li>
          <li><span className="text-foreground/80">Diagnostics</span></li>
        </ul>
      </div>
    </div>
  );

  return (
    <AuthGuard>
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">Repair Services</h1>
          <p className="text-muted-foreground mt-2">Get your devices repaired by our expert technicians.</p>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <div className="md:hidden mb-4">
            <Sheet open={!!isFilterOpen} onOpenChange={setIsFilterOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  Filters
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-full max-w-xs bg-background p-6 overflow-y-auto">
                <SheetHeader className="mb-6 text-left border-b pb-4">
                  <SheetTitle>Filters</SheetTitle>
                </SheetHeader>
                <FilterContent />
              </SheetContent>
            </Sheet>
          </div>

          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden md:block w-full md:w-1/4 lg:w-1/5">
            <div className="md:sticky md:top-24 rounded-xl border border-border bg-card/50 p-5 space-y-6">
              <FilterContent />
            </div>
          </aside>

          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search services..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="featured">Featured</SelectItem>
                  <SelectItem value="price-asc">Price: Low to High</SelectItem>
                  <SelectItem value="price-desc">Price: High to Low</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {loading ? (
              <div className="flex justify-center items-center h-96">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
                  {filteredServices.map((service, index) => (
                    <RepairCard
                      key={service.$id}
                      service={service}
                      isAdmin={isAdmin}
                      onDelete={() => setProductToDelete(service.$id)}
                      priority={index < 4}
                    />
                  ))}
                  {filteredServices.length === 0 && <div className="col-span-full text-center text-muted-foreground py-12">No repair services found.</div>}
                </div>

                <AlertDialog open={!!(productToDelete !== null)} onOpenChange={(open) => { if (!open) setProductToDelete(null); }}>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Manage Listing</AlertDialogTitle>
                      <AlertDialogDescription>
                        What would you like to do with this listing? You can permanently delete it or mark it as sold to record the sale.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                      <AlertDialogCancel className="sm:mt-0">Cancel</AlertDialogCancel>
                      <Button
                        variant="secondary"
                        onClick={() => {
                          const product = services.find(p => p.$id === productToDelete);
                          if (product) {
                            setProductToSold(product);
                            setIsSoldFormOpen(true);
                          }
                          setProductToDelete(null);
                        }}
                        className="gap-2"
                      >
                        <Tag className="h-4 w-4" />
                        Mark as Sold
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDelete}
                        className="gap-2"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Permanently
                      </Button>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {productToSold && (
                  <SoldForm
                    product={productToSold}
                    open={!!isSoldFormOpen}
                    onOpenChange={setIsSoldFormOpen}
                    onSuccess={() => {
                      fetchServices();
                      setProductToSold(null);
                    }}
                  />
                )}
              </>
            )}
          </main>
        </div>
      </div>
    </AuthGuard>
  );

}

export default function RepairPage() {
  return (
    <Suspense fallback={<ListingPageSkeleton />}>
      <RepairList />
    </Suspense>
  );
}