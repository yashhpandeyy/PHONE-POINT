
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function WelcomePage() {
  return (
    <div
      className="relative flex h-screen w-full flex-col items-center justify-end bg-contain bg-no-repeat bg-center"
      style={{ backgroundImage: "url('/phonepoint.png')" }}
    >
      <div className="absolute inset-0 bg-black/30" />
      <div className="relative z-10 p-8">
        <Button asChild size="lg">
          <Link href="/home">Enter Store</Link>
        </Button>
      </div>
    </div>
  );
}
