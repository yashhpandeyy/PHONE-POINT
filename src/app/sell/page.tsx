
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { databases, DATABASE_ID, COLLECTION_ID_PHONES } from '@/lib/appwrite';
import { ID } from 'appwrite';
import { Loader2 } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AuthGuard } from '@/components/auth-guard';

const initialPhoneData = {
  imei: '',
  name: '',
  brand: '',
  price: '',
  Condition: '',
  storage: '',
  Colour: '',
  description: '',
  camera: '',
  Battery: '',
  Processor: '',
  new_price: '',
  tag: 'none',
};

const initialAccessoryData = {
  name: '',
  brand: '',
  price: '',
  new_price: '',
  tag: 'none',
  Condition: '',
  Colour: '',
  description: '',
};

const initialRepairData = {
  name: '',
  price: '',
  new_price: '',
  tag: 'none',
  description: '',
};


export default function SellPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [imageFiles, setImageFiles] = useState<FileList | null>(null);
  const [productType, setProductType] = useState('phone');
  const [formData, setFormData] = useState<any>(initialPhoneData);

  const handleProductTypeChange = (type: string) => {
    setProductType(type);
    setImageFiles(null);
    if (type === 'phone') {
      setFormData(initialPhoneData);
    } else if (type === 'accessory') {
      setFormData(initialAccessoryData);
    } else if (type === 'repair') {
      setFormData(initialRepairData);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev: any) => ({
      ...prev,
      [id]: id === 'price' || id === 'Battery' || id === 'new_price' ? Number(value) : value,
    }));
  };

  const handleSelectChange = (id: string, value: string) => {
    setFormData((prev: any) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFiles(e.target.files);
    } else {
      setImageFiles(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let imageUrls: string[] = [];
      // Upload images for phones, accessories, and repairs
      if (imageFiles && imageFiles.length > 0) {
        const imageFormData = new FormData();
        for (let i = 0; i < imageFiles.length; i++) {
          imageFormData.append('image', imageFiles[i]);
        }

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        });

        if (!uploadResponse.ok) {
          const errorData = await uploadResponse.json();
          throw new Error(errorData.error || 'Image upload failed. Check the server console.');
        }
        const uploadData = await uploadResponse.json();
        imageUrls = uploadData.imageUrls;
      }

      if (productType === 'phone') {
        const documentId = formData.imei;
        if (!documentId) {
          toast({ title: 'Validation Error', description: 'IMEI ID cannot be empty.', variant: 'destructive' });
          setIsLoading(false);
          return;
        }
        const { imei, ...payload } = formData;
        const documentData = {
          ...payload,
          image: imageUrls,
          type: 'phone',
          new_price: formData.new_price ? Number(formData.new_price) : null,
          tag: formData.tag || 'none'
        };

        try {
          await databases.getDocument(DATABASE_ID, COLLECTION_ID_PHONES, documentId);
          await databases.updateDocument(DATABASE_ID, COLLECTION_ID_PHONES, documentId, documentData);
          toast({ title: 'Listing Updated!', description: `${formData.name} has been successfully updated.` });
        } catch (error: any) {
          if (error.code === 404) {
            await databases.createDocument(DATABASE_ID, COLLECTION_ID_PHONES, documentId, documentData);
            toast({ title: 'Phone Listed!', description: `${formData.name} has been successfully added.` });
          } else {
            throw error;
          }
        }
      } else { // Handle Accessory and Repair
        const { new_price, ...payloadWithoutNewPrice } = formData;
        const finalPayload = {
          ...payloadWithoutNewPrice,
          image: imageUrls,
          type: productType,
          new_price: formData.new_price ? Number(formData.new_price) : null,
          tag: formData.tag || 'none'
        };

        await databases.createDocument(DATABASE_ID, COLLECTION_ID_PHONES, ID.unique(), finalPayload);
        toast({
          title: `${productType.charAt(0).toUpperCase() + productType.slice(1)} Listed!`,
          description: `${formData.name} has been successfully added.`,
        });
      }
    } catch (err: any) {
      console.error("❌ Appwrite/Upload Error:", err);
      toast({
        title: 'Error',
        description: err.message || 'Could not save the product. Check console.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const renderPhoneForm = () => (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Phone Name</Label>
          <Input id="name" value={formData.name || ''} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="imei">IMEI (Used as unique ID)</Label>
          <Input id="imei" value={formData.imei || ''} onChange={handleInputChange} required />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" value={formData.brand || ''} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="Colour">Colour</Label>
          <Input id="Colour" value={formData.Colour || ''} onChange={handleInputChange} required />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label htmlFor="price">Original Price (Integer)</Label>
          <Input id="price" type="number" value={formData.price || ''} onChange={handleInputChange} required max="500000" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new_price">Discounted Price (Optional)</Label>
          <Input id="new_price" type="number" value={formData.new_price || ''} onChange={handleInputChange} max="500000" placeholder="Leave empty if no sale" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label htmlFor="Condition">Condition</Label>
          <Select value={formData.Condition || ''} onValueChange={(value) => handleSelectChange('Condition', value)}>
            <SelectTrigger id="Condition"><SelectValue placeholder="Select condition" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="used">Used</SelectItem>
              <SelectItem value="damaged">Damaged</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tag">Deal Tag</Label>
          <Select value={formData.tag || 'none'} onValueChange={(value) => handleSelectChange('tag', value)}>
            <SelectTrigger id="tag"><SelectValue placeholder="Select tag" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="sale">Sale (Price Drop)</SelectItem>
              <SelectItem value="budget">Budget (Value)</SelectItem>
              <SelectItem value="like-new">Like-New (Premium)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label htmlFor="storage">Storage</Label>
          <Select value={formData.storage || ''} onValueChange={(value) => handleSelectChange('storage', value)}>
            <SelectTrigger id="storage"><SelectValue placeholder="Select storage" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="32">32GB</SelectItem>
              <SelectItem value="64">64GB</SelectItem>
              <SelectItem value="128">128GB</SelectItem>
              <SelectItem value="256">256GB</SelectItem>
              <SelectItem value="512">512GB</SelectItem>
              <SelectItem value="1TB">1TB</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="grid gap-2">
          <Label htmlFor="Battery">Battery (e.g., hours of playback)</Label>
          <Input id="Battery" type="number" value={formData.Battery || ''} onChange={handleInputChange} required />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description || ''} onChange={handleInputChange} required rows={4} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="image">Product Images</Label>
        <Input id="image" type="file" onChange={handleFileChange} accept="image/*" multiple />
        <p className="text-sm text-muted-foreground">The first image selected will be the main display image.</p>
      </div>
      <div className="border p-4 rounded-md space-y-4">
        <h3 className="font-medium text-lg">Specifications</h3>
        <div className="grid gap-2">
          <Label htmlFor="camera">Camera</Label>
          <Input id="camera" value={formData.camera || ''} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="Processor">Processor</Label>
          <Input id="Processor" value={formData.Processor || ''} onChange={handleInputChange} required />
        </div>
      </div>
    </>
  );

  const renderAccessoryForm = () => (
    <>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label htmlFor="name">Accessory Name</Label>
          <Input id="name" value={formData.name || ''} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="brand">Brand</Label>
          <Input id="brand" value={formData.brand || ''} onChange={handleInputChange} required />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label htmlFor="price">Original Price (Integer)</Label>
          <Input id="price" type="number" value={formData.price || ''} onChange={handleInputChange} required max="500000" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new_price">Discounted Price (Optional)</Label>
          <Input id="new_price" type="number" value={formData.new_price || ''} onChange={handleInputChange} max="500000" placeholder="Leave empty if no sale" />
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label htmlFor="Colour">Colour</Label>
          <Input id="Colour" value={formData.Colour || ''} onChange={handleInputChange} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="tag">Deal Tag</Label>
          <Select value={formData.tag || 'none'} onValueChange={(value) => handleSelectChange('tag', value)}>
            <SelectTrigger id="tag"><SelectValue placeholder="Select tag" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="sale">Sale (Price Drop)</SelectItem>
              <SelectItem value="budget">Budget (Value)</SelectItem>
              <SelectItem value="like-new">Like-New (Premium)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="Condition">Condition</Label>
        <Select value={formData.Condition || ''} onValueChange={(value) => handleSelectChange('Condition', value)}>
          <SelectTrigger id="Condition"><SelectValue placeholder="Select condition" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="new">New</SelectItem>
            <SelectItem value="used">Used</SelectItem>
            <SelectItem value="damaged">Damaged</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" value={formData.description || ''} onChange={handleInputChange} required rows={4} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="image">Product Images</Label>
        <Input id="image" type="file" onChange={handleFileChange} accept="image/*" multiple />
        <p className="text-sm text-muted-foreground">The first image selected will be the main display image.</p>
      </div>
    </>
  );

  const renderRepairForm = () => (
    <>
      <div className="grid gap-2">
        <Label htmlFor="name">Service Name</Label>
        <Input id="name" value={formData.name || ''} onChange={handleInputChange} required />
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="grid gap-2">
          <Label htmlFor="price">Original Price (Integer)</Label>
          <Input id="price" type="number" value={formData.price || ''} onChange={handleInputChange} required max="500000" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="new_price">Discounted Price (Optional)</Label>
          <Input id="new_price" type="number" value={formData.new_price || ''} onChange={handleInputChange} max="500000" placeholder="Leave empty if no sale" />
        </div>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="tag">Deal Tag</Label>
        <Select value={formData.tag || 'none'} onValueChange={(value) => handleSelectChange('tag', value)}>
          <SelectTrigger id="tag"><SelectValue placeholder="Select tag" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="none">None</SelectItem>
            <SelectItem value="sale">Sale (Price Drop)</SelectItem>
            <SelectItem value="budget">Budget (Value)</SelectItem>
            <SelectItem value="like-new">Like-New (Premium)</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className="grid gap-2">
        <Label htmlFor="description">Service Description</Label>
        <Textarea id="description" value={formData.description || ''} onChange={handleInputChange} required rows={4} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="image">Service Image</Label>
        <Input id="image" type="file" onChange={handleFileChange} accept="image/*" multiple />
        <p className="text-sm text-muted-foreground">You can upload one or more images for the service.</p>
      </div>
    </>
  );

  return (
    <AuthGuard>
      <div className="container py-12">
        <h1 className="text-4xl font-bold text-center">List an Item for Sale</h1>
        <p className="text-center text-muted-foreground mt-4 max-w-2xl mx-auto">
          Select the type of item you want to list and fill out the details below.
        </p>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto mt-8 space-y-6">
          <div className="grid gap-2">
            <Label>Item Type</Label>
            <Select value={productType} onValueChange={handleProductTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select item type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="accessory">Accessory</SelectItem>
                <SelectItem value="repair">Repair Service</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {productType === 'phone' && renderPhoneForm()}
          {productType === 'accessory' && renderAccessoryForm()}
          {productType === 'repair' && renderRepairForm()}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            List My Item
          </Button>
        </form>
      </div>
    </AuthGuard>
  );
}
