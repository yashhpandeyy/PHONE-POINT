
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";

export function ProductGridSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="w-full overflow-hidden flex flex-col border-2">
                    <CardHeader className="p-0 border-b">
                        <Skeleton className="aspect-square w-full" />
                    </CardHeader>
                    <CardContent className="p-4 flex-grow space-y-2">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex justify-between items-center">
                        <Skeleton className="h-6 w-20" />
                        <Skeleton className="h-9 w-16" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}

export function ListingPageSkeleton() {
    return (
        <div className="container py-8 md:py-12 space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-10 w-48" />
                    <Skeleton className="h-5 w-64" />
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <Skeleton className="h-10 flex-grow md:w-64" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>

            <div className="flex gap-6">
                {/* Sidebar skeleton for desktop */}
                <div className="hidden lg:block w-64 shrink-0 space-y-6">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-64 w-full" />
                </div>

                {/* Main grid */}
                <div className="flex-grow">
                    <ProductGridSkeleton />
                </div>
            </div>
        </div>
    );
}
