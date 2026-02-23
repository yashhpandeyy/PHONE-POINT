'use client';

import { useEffect, useState } from 'react';
import { databases, DATABASE_ID, COLLECTION_ID_PRODUCTS } from '@/lib/appwrite';
import type { PhoneDocument } from '@/lib/types';
import { Query } from 'appwrite';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import {
    Loader2,
    Trash2,
    Tag,
    Smartphone,
    Package,
    Wrench,
    Search,
    Filter
} from "lucide-react";
import { Button } from '@/components/ui/button';
import { AuthGuard } from '@/components/auth-guard';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle
} from '@/components/ui/alert-dialog';
import { SoldForm } from "@/components/admin/sold-form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";

export default function StockPage() {
    const { user } = useAuth();
    const { toast } = useToast();
    const [products, setProducts] = useState<PhoneDocument[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState<'all' | 'phone' | 'accessory' | 'repair'>('all');

    // Deletion/Sold state
    const [productToDelete, setProductToDelete] = useState<string | null>(null);
    const [isSoldFormOpen, setIsSoldFormOpen] = useState(false);
    const [productToSold, setProductToSold] = useState<PhoneDocument | null>(null);

    const isAdmin = user && (user.labels.includes('admin') || user.labels.includes('developer'));

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const response = await databases.listDocuments(
                DATABASE_ID,
                COLLECTION_ID_PRODUCTS,
                [Query.orderDesc('$createdAt'), Query.limit(100)]
            );
            setProducts(response.documents as unknown as PhoneDocument[]);
        } catch (error) {
            console.error("Failed to fetch inventory:", error);
            toast({ title: "Error", description: "Could not load inventory.", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleDelete = async () => {
        if (!productToDelete) return;
        try {
            const product = products.find(p => p.$id === productToDelete);
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_PRODUCTS, productToDelete);

            // Cleanup images if present
            if (product && product.image && product.image.length > 0) {
                await fetch('/api/delete-images', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ imageUrls: product.image }),
                });
            }

            setProducts(prev => prev.filter(p => p.$id !== productToDelete));
            toast({ title: "Success", description: "Item deleted successfully." });
        } catch (error: any) {
            toast({ title: "Error", description: error.message || "Failed to delete item.", variant: "destructive" });
        } finally {
            setProductToDelete(null);
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesType = filterType === 'all' || p.type === filterType;
        return matchesSearch && matchesType;
    });

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'phone': return <Smartphone className="h-4 w-4" />;
            case 'accessory': return <Package className="h-4 w-4" />;
            case 'repair': return <Wrench className="h-4 w-4" />;
            default: return null;
        }
    };

    if (!isAdmin && !loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-4">
                <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
                <p className="text-muted-foreground">You do not have permission to view this page.</p>
                <Button asChild className="mt-4">
                    <Link href="/">Return Home</Link>
                </Button>
            </div>
        );
    }

    return (
        <AuthGuard>
            <div className="container py-8 md:py-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-3xl font-bold">Inventory Management</h1>
                        <p className="text-muted-foreground">Manage your stock, prices, and sales records.</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" onClick={fetchProducts} disabled={loading}>
                            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Refresh"}
                        </Button>
                    </div>
                </div>

                {/* Filters */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="md:col-span-2 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or brand..."
                            className="pl-10"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-2">
                        <Filter className="h-4 w-4 text-muted-foreground" />
                        <select
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value as any)}
                        >
                            <option value="all">All Types</option>
                            <option value="phone">Phones</option>
                            <option value="accessory">Accessories</option>
                            <option value="repair">Repair Services</option>
                        </select>
                    </div>
                    <div className="flex items-center justify-end">
                        <Badge variant="secondary" className="text-sm py-1.5 px-3">
                            Total: {filteredProducts.length} Items
                        </Badge>
                    </div>
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block rounded-xl border border-border bg-card overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-muted/50 border-b border-border">
                                <th className="p-4 font-semibold text-sm">Product</th>
                                <th className="p-4 font-semibold text-sm">Type</th>
                                <th className="p-4 font-semibold text-sm">Brand/Condition</th>
                                <th className="p-4 font-semibold text-sm">Price</th>
                                <th className="p-4 font-semibold text-sm text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border">
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center">
                                        <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                                        <p className="mt-2 text-muted-foreground">Loading stock...</p>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="p-12 text-center text-muted-foreground">
                                        No products found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                filteredProducts.map((product) => (
                                    <tr key={product.$id} className="hover:bg-muted/30 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="relative h-12 w-12 rounded-lg border border-border overflow-hidden bg-muted">
                                                    {product.image?.[0] ? (
                                                        <Image
                                                            src={product.image[0]}
                                                            alt={product.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="flex items-center justify-center h-full w-full">
                                                            <Smartphone className="h-6 w-6 text-muted-foreground" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium line-clamp-1">{product.name}</p>
                                                    <p className="text-xs text-muted-foreground uppercase">{product.storage ? `${product.storage}GB` : ''} {product.Colour}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2 text-sm capitalize">
                                                {getTypeIcon(product.type)}
                                                {product.type}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex flex-col gap-1">
                                                <span className="text-sm font-medium">{product.brand || 'N/A'}</span>
                                                {product.Condition && (
                                                    <Badge variant="outline" className="w-fit text-[10px] h-4 capitalize">
                                                        {product.Condition}
                                                    </Badge>
                                                )}
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <p className="font-bold text-primary">₹{product.price}</p>
                                        </td>
                                        <td className="p-4 text-right space-x-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => {
                                                    setProductToSold(product);
                                                    setIsSoldFormOpen(true);
                                                }}
                                                className="h-8 gap-1.5"
                                            >
                                                <Tag className="h-3.5 w-3.5" />
                                                Mark Sold
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="destructive"
                                                onClick={() => setProductToDelete(product.$id)}
                                                className="h-8 w-8 p-0"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Mobile List View */}
                <div className="md:hidden space-y-4">
                    {loading ? (
                        <div className="p-12 text-center">
                            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
                            <p className="mt-2 text-muted-foreground">Loading stock...</p>
                        </div>
                    ) : filteredProducts.length === 0 ? (
                        <p className="text-center text-muted-foreground py-12">No products found.</p>
                    ) : (
                        filteredProducts.map((product) => (
                            <div key={product.$id} className="p-4 border border-border rounded-xl bg-card space-y-4">
                                <div className="flex items-start gap-4">
                                    <div className="relative h-16 w-16 rounded-xl border border-border overflow-hidden bg-muted flex-shrink-0">
                                        {product.image?.[0] ? (
                                            <Image
                                                src={product.image[0]}
                                                alt={product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full w-full">
                                                <Smartphone className="h-8 w-8 text-muted-foreground" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1">
                                            <span className="text-xs text-muted-foreground capitalize flex items-center gap-1">
                                                {getTypeIcon(product.type)}
                                                {product.type}
                                            </span>
                                            {product.Condition && (
                                                <Badge variant="outline" className="text-[10px] h-4 py-0 capitalize">
                                                    {product.Condition}
                                                </Badge>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
                                        <p className="text-sm text-primary font-bold">₹{product.price}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 pt-2 border-t border-border">
                                    <Button
                                        className="flex-1 h-10 gap-2"
                                        variant="outline"
                                        onClick={() => {
                                            setProductToSold(product);
                                            setIsSoldFormOpen(true);
                                        }}
                                    >
                                        <Tag className="h-4 w-4" />
                                        Mark as Sold
                                    </Button>
                                    <Button
                                        className="w-12 h-10 p-0"
                                        variant="destructive"
                                        onClick={() => setProductToDelete(product.$id)}
                                    >
                                        <Trash2 className="h-5 w-5" />
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Dialogs */}
                <AlertDialog open={!!(productToDelete !== null)} onOpenChange={(open) => { if (!open) setProductToDelete(null); }}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Delete Product?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This will permanently remove the item and all its images from the shop. This action cannot be undone.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <Button variant="destructive" onClick={handleDelete}>Delete Permanently</Button>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

                {productToSold && (
                    <SoldForm
                        product={productToSold}
                        open={!!isSoldFormOpen}
                        onOpenChange={setIsSoldFormOpen}
                        onSuccess={() => {
                            fetchProducts();
                            setProductToSold(null);
                        }}
                    />
                )}
            </div>
        </AuthGuard>
    );
}
