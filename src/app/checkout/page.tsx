import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CreditCard } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-center">Checkout</h1>
       <div className="mt-12 flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed rounded-lg">
        <CreditCard className="h-16 w-16 text-muted-foreground" />
        <p className="text-muted-foreground mt-4">This is a demo. Checkout is not implemented.</p>
         <Button asChild className="mt-6" variant="outline">
          <Link href="/cart">Back to Cart</Link>
        </Button>
      </div>
    </div>
  );
}
