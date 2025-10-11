import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";

export default function CartPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-center">Your Cart</h1>
      <div className="mt-12 flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed rounded-lg">
        <ShoppingCart className="h-16 w-16 text-muted-foreground" />
        <p className="text-muted-foreground mt-4">Your cart is empty.</p>
        <Button asChild className="mt-6">
          <Link href="/phones">Start Shopping</Link>
        </Button>
      </div>
    </div>
  );
}
