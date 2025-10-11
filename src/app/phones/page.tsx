import { phones } from "@/lib/data";
import { ProductCard } from "@/components/product-card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import Link from "next/link";

export default function PhonesPage({
  searchParams,
}: {
  searchParams?: { [key: string]: string | string[] | undefined };
}) {
  // Dummy filtering logic
  const brand = searchParams?.brand as string | undefined;
  const filteredPhones = brand
    ? phones.filter((p) => p.brand.toLowerCase() === brand.toLowerCase())
    : phones;

  return (
    <div className="container py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold">All Our Phones</h1>
        <p className="text-muted-foreground mt-2">Find your next device from our curated collection of refurbished tech.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full md:w-1/4 lg:w-1/5">
          <h2 className="text-lg font-semibold mb-4">Filters</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium mb-2">Brand</h3>
              <ul className="space-y-2 text-sm">
                <li><Link href="/phones?brand=Apple" className="text-muted-foreground hover:text-primary">Apple</Link></li>
                <li><Link href="/phones?brand=Samsung" className="text-muted-foreground hover:text-primary">Samsung</Link></li>
                <li><Link href="/phones?brand=Google" className="text-muted-foreground hover:text-primary">Google</Link></li>
                <li><Link href="/phones" className="text-muted-foreground hover:text-primary">All Brands</Link></li>
              </ul>
            </div>
             <div>
              <h3 className="font-medium mb-2">Price</h3>
               <div className="text-sm text-muted-foreground">Price filter coming soon.</div>
            </div>
             <div>
              <h3 className="font-medium mb-2">Condition</h3>
               <ul className="space-y-2 text-sm">
                <li><span className="text-muted-foreground">Excellent</span></li>
                <li><span className="text-muted-foreground">Good</span></li>
                <li><span className="text-muted-foreground">Fair</span></li>
              </ul>
            </div>
          </div>
        </aside>

        {/* Products Grid */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <div className="relative">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search..." className="pl-10"/>
            </div>
            <Select>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPhones.map((phone) => (
              <ProductCard key={phone.id} phone={phone} />
            ))}
            {filteredPhones.length === 0 && <p>No phones found for this brand.</p>}
          </div>
        </main>
      </div>
    </div>
  );
}
