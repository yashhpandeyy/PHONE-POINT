
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-4xl font-bold mb-8">Welcome to Phone Point</h1>
      <Button asChild size="lg">
        <Link href="/home">Enter Store</Link>
      </Button>
    </div>
  );
}
