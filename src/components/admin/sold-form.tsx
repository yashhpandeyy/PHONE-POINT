'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { PhoneDocument } from '@/lib/types';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { databases, DATABASE_ID, COLLECTION_ID_PRODUCTS } from '@/lib/appwrite';

// IMPORTANT: User needs to replace this with their actual deployed Web App URL
const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzOYqq6Nd-Yld46oaYvzbsF53OfFDFIHmbSMiKkKjzjtm1JPmaDucuA6gpOkQv3BqQ9/exec';

interface SoldFormProps {
    product: PhoneDocument;
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
}

export function SoldForm({ product, open, onOpenChange, onSuccess }: SoldFormProps) {
    const [loading, setLoading] = useState(false);
    const { toast } = useToast();
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        buyingPrice: '',
        sellingPrice: product.price.toString(),
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            // 1. Prepare data for Google Sheets
            // Keys must match what the Google Script expects (or what headers exist in the sheet)
            const payload = {
                timestamp: new Date().toISOString(),
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                productName: product.name,
                brand: product.brand || '',
                condition: product.Condition || '',
                storage: product.storage || '',
                colour: product.Colour || '',
                buyingPrice: formData.buyingPrice,
                sellingPrice: formData.sellingPrice,
                productId: product.$id,
            };

            // 2. Send to Google Sheets (using no-cors if necessary, but script returns JSON so standard fetch is better if enabled)
            // Note: standard fetch to Google Scripts often requires redirect handling or simple POST
            const response = await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors', // Simple POST for Google Scripts often works best with no-cors if not handling preflight
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(payload as any).toString(),
            });

            // Since we use 'no-cors', we can't read the response body. 
            // We assume it worked if the fetch didn't throw, or we can try with standard CORS if the script allows.
            // Most Google Script Web Apps require 'no-cors' unless carefully configured.

            // 3. Cleanup images from R2 if present
            if (product.image && product.image.length > 0) {
                try {
                    await fetch('/api/delete-images', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ imageUrls: product.image }),
                    });
                } catch (cleanupError) {
                    console.error('Failed to cleanup images during sale:', cleanupError);
                    // We don't block the UI flow for image cleanup failures, but log it
                }
            }

            // 4. Delete from Appwrite
            await databases.deleteDocument(DATABASE_ID, COLLECTION_ID_PRODUCTS, product.$id);

            toast({
                title: 'Success!',
                description: `${product.name} marked as sold and removed from shop.`,
            });

            onSuccess();
            onOpenChange(false);
        } catch (error: any) {
            console.error('Error marking as sold:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to mark as sold. Please try again.',
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Mark as Sold</DialogTitle>
                    <DialogDescription>
                        Enter customer details and final pricing for {product.name}. This will save to your Google Sheet and remove the item from the shop.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="customerName">Customer Name</Label>
                        <Input
                            id="customerName"
                            required
                            value={formData.customerName}
                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                            placeholder="e.g. John Doe"
                        />
                    </div>
                    <div className="grid gap-2">
                        <Label htmlFor="customerPhone">Phone Number</Label>
                        <Input
                            id="customerPhone"
                            required
                            value={formData.customerPhone}
                            onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                            placeholder="e.g. +91 XXXXX XXXXX"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="buyingPrice">Buying Price (₹)</Label>
                            <Input
                                id="buyingPrice"
                                type="number"
                                required
                                value={formData.buyingPrice}
                                onChange={(e) => setFormData({ ...formData, buyingPrice: e.target.value })}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="sellingPrice">Selling Price (₹)</Label>
                            <Input
                                id="sellingPrice"
                                type="number"
                                required
                                value={formData.sellingPrice}
                                onChange={(e) => setFormData({ ...formData, sellingPrice: e.target.value })}
                            />
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Save & Delete
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
