import { Button } from "@/components/ui/button";
import Link from "next/link";
import { User } from "lucide-react";

export default function AccountPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-center">My Account</h1>
      <div className="mt-12 flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed rounded-lg">
        <User className="h-16 w-16 text-muted-foreground" />
        <p className="text-muted-foreground mt-4">This is a demo. User accounts are not yet implemented.</p>
        <Button asChild className="mt-6">
          <Link href="/">Go Home</Link>
        </Button>
      </div>
    </div>
  );
}
