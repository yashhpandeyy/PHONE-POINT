
import { Package } from "lucide-react";

export default function AccessoriesPage() {
  return (
    <div className="container py-12">
      <h1 className="text-4xl font-bold text-center">Accessories</h1>
      <p className="text-center text-muted-foreground mt-4">Find the perfect accessories to complement your device.</p>
      <div className="mt-12 flex flex-col items-center justify-center min-h-[40vh] border-2 border-dashed rounded-lg">
        <Package className="h-16 w-16 text-muted-foreground" />
        <p className="text-muted-foreground mt-4">Accessories coming soon!</p>
      </div>
    </div>
  );
}
