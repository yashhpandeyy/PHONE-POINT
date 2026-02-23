
'use client';

import { useEffect, useMemo, useState } from 'react';
import { ProductCard } from "@/components/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Loader2, Search, X, SlidersHorizontal, Trash2, Tag } from "lucide-react";
import { SoldForm } from "@/components/admin/sold-form";
import Link from "next/link";
import { useSearchParams } from 'next/navigation';
import { databases, DATABASE_ID, COLLECTION_ID_PHONES } from '@/lib/appwrite';
import type { PhoneDocument } from '@/lib/types';
import { Query } from 'appwrite';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/components/auth-guard';
import { cn } from '@/lib/utils';

import { Suspense } from 'react';
import { ListingPageSkeleton } from '@/components/ui/listing-skeleton';

function PhonesList() {
  const searchParams = useSearchParams();
  const brand = searchParams.get('brand');
  const urlSearch = searchParams.get('search') || '';
  const { user } = useAuth();
  const { toast } = useToast();

  const [phones, setPhones] = useState<PhoneDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [phoneToDelete, setPhoneToDelete] = useState<string | null>(null);
  const [isSoldFormOpen, setIsSoldFormOpen] = useState(false);
  const [phoneToSold, setPhoneToSold] = useState<PhoneDocument | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Filter & sort state
  const [searchQuery, setSearchQuery] = useState(urlSearch);
  const [sortBy, setSortBy] = useState('featured');
  const [conditionFilter, setConditionFilter] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const isAdmin = !!(user && (user.labels.includes('admin') || user.labels.includes('developer')));

  const fetchPhones = async () => {
    setLoading(true);
    try {
      const queries = [Query.orderDesc('$createdAt'), Query.limit(100)];
      if (brand) {
        queries.push(Query.equal('brand', brand));
      }

      const response = await databases.listDocuments(
        DATABASE_ID,
        COLLECTION_ID_PHONES,
        queries
      );

      setPhones(response.documents as unknown as PhoneDocument[]);
    } catch (error) {
      console.error("Failed to fetch phones:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhones();
  }, [brand]);

  // Client-side filtering & sorting
  const filteredPhones = useMemo(() => {
    let result = [...phones];

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(p =>
        p.name.toLowerCase().includes(q) ||
        (p.brand && p.brand.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    }

    // Condition filter
    if (conditionFilter) {
      result = result.filter(p =>
        p.Condition && p.Condition.toLowerCase() === conditionFilter.toLowerCase()
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
    } else if (sortBy === 'featured') {
      // Prioritize phones, then others. Recency within each.
      result.sort((a, b) => {
        const aPriority = a.type === 'phone' ? 0 : 1;
        const bPriority = b.type === 'phone' ? 0 : 1;
        if (aPriority !== bPriority) return aPriority - bPriority;
        return new Date(b.$createdAt).getTime() - new Date(a.$createdAt).getTime();
      });
    }

    return result;
  }, [phones, searchQuery, sortBy, conditionFilter, minPrice, maxPrice]);

  const handleDelete = async () => {
    if (!phoneToDelete) return;

    const phoneData = phones.find(p => p.$id === phoneToDelete);

    try {
      await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_PHONES, phoneToDelete);
      setPhones(prev => prev.filter(p => p.$id !== phoneToDelete));
      toast({ title: "Success", description: "Phone listing deleted." });

      if (phoneData && phoneData.image && phoneData.image.length > 0) {
        const res = await fetch('/api/delete-images', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrls: phoneData.image }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          console.error('Image cleanup failed:', errorData.error);
        }
      }
    } catch (error: any) {
      console.error("Failed to delete phone:", error);
      toast({ title: "Error", description: error.message || "Could not delete phone.", variant: 'destructive' });
    } finally {
      setPhoneToDelete(null);
    }
  }

  const conditions = ['new', 'used', 'damaged'];



  const FilterContent = () => (
    <div className="space-y-6">
      <h2 className="text-lg font-semibold border-b border-border pb-3 hidden md:block">Filters</h2>
      <div>
        <h3 className="font-medium mb-2 text-sm uppercase tracking-wider text-muted-foreground">Brand</h3>
        <ul className="space-y-2 text-sm">
          <li><Link href="/phones?brand=Apple" onClick={() => setIsFilterOpen(false)} className="text-foreground/80 hover:text-primary transition-colors">Apple</Link></li>
          <li><Link href="/phones?brand=Samsung" onClick={() => setIsFilterOpen(false)} className="text-foreground/80 hover:text-primary transition-colors">Samsung</Link></li>
          <li><Link href="/phones?brand=Google" onClick={() => setIsFilterOpen(false)} className="text-foreground/80 hover:text-primary transition-colors">Google</Link></li>
          <li><Link href="/phones" onClick={() => setIsFilterOpen(false)} className="text-foreground/80 hover:text-primary transition-colors">All Brands</Link></li>
        </ul>
      </div>
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
        <h3 className="font-medium mb-2 text-sm uppercase tracking-wider text-muted-foreground">Condition</h3>
        <ul className="space-y-2 text-sm">
          {conditions.map((c) => (
            <li key={c}>
              <button
                onClick={() => {
                  setConditionFilter(conditionFilter === c ? null : c);
                  // Optionally close on mobile if it's a small screen
                  if (window.innerWidth < 768) setIsFilterOpen(false);
                }}
                className={cn(
                  "capitalize transition-colors text-left w-full",
                  conditionFilter === c
                    ? "text-primary font-semibold"
                    : "text-foreground/80 hover:text-primary"
                )}
              >
                {c}
              </button>
            </li>
          ))}
          {conditionFilter && (
            <li>
              <button
                onClick={() => {
                  setConditionFilter(null);
                  if (window.innerWidth < 768) setIsFilterOpen(false);
                }}
                className="text-xs text-destructive flex items-center gap-1 hover:underline"
              >
                <X className="h-3 w-3" /> Clear
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );

  return (
    <AuthGuard>
      <div className="container py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold">All Our Phones</h1>
          <p className="text-muted-foreground mt-2">Find your next device from our curated collection of refurbished tech.</p>
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

          {/* Products Grid */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search phones..."
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
                  {filteredPhones.map((phone, index) => (
                    <ProductCard
                      key={phone.$id}
                      phone={phone}
                      isAdmin={isAdmin}
                      onDelete={() => setPhoneToDelete(phone.$id)}
                      priority={index < 4}
                    />
                  ))}
                  {filteredPhones.length === 0 && <p className="col-span-full text-center text-muted-foreground py-12">No phones found.</p>}
                </div>

                <AlertDialog open={!!(phoneToDelete !== null)} onOpenChange={(open) => { if (!open) setPhoneToDelete(null); }}>
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
                          const phone = phones.find(p => p.$id === phoneToDelete);
                          if (phone) {
                            setPhoneToSold(phone);
                            setIsSoldFormOpen(true);
                          }
                          setPhoneToDelete(null);
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

                {phoneToSold && (
                  <SoldForm
                    product={phoneToSold}
                    open={!!isSoldFormOpen}
                    onOpenChange={setIsSoldFormOpen}
                    onSuccess={() => {
                      fetchPhones(); // Refresh listing
                      setPhoneToSold(null);
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

export default function PhonesPage() {
  return (
    <Suspense fallback={<ListingPageSkeleton />}>
      <PhonesList />
    </Suspense>
  );
}
