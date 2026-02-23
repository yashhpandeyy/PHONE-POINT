// This page is no longer used. The application has been updated to an inquiry platform.
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { MessageSquare } from "lucide-react";

export default function CheckoutPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-center">Checkout Removed</h1>
       <div className="mt-12 flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed rounded-lg">
        <MessageSquare className="h-16 w-16 text-muted-foreground" />
        <p className="text-muted-foreground mt-4">This page is no longer in use. Please visit the messages page.</p>
         <Button asChild className="mt-6" variant="outline">
          <Link href="/messages">Go to Messages</Link>
        </Button>
      </div>
    </div>
  );
}
