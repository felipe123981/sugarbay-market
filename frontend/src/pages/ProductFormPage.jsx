import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { ArrowLeft, Loader2, Upload, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '@/context/AuthContext';
import { createProduct, updateProduct, getProduct, uploadProductPhotos } from '@/lib/api';
import { getProductImage } from '@/lib/utils';

const fetchProductData = async (productId) => {
  return await getProduct(productId);
};

const ProductFormPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isAuthenticated, isValidating } = useAuth();
  const isEditing = Boolean(productId);
  const [product, setProduct] = useState({
    name: '', description: '', price: '', category: '', stock: '',
    weight: '', length: '', width: '', height: '',
  });
  const [images, setImages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isValidating && !isAuthenticated) {
      navigate('/login');
    }
  }, [isValidating, isAuthenticated, navigate]);

  useEffect(() => {
    if (isEditing) {
      setLoading(true);
      fetchProductData(productId).then(data => {
        if (data) {
          setProduct({
            name: data.name || '', description: data.description || '',
            price: parseFloat(data.price).toString() || '', category: data.categories && data.categories.length > 0 ? data.categories[0] : '',
            stock: data.quantity?.toString() || '', weight: data.weight?.toString() || '',
            length: data.length?.toString() || '', width: data.width?.toString() || '',
            height: data.height?.toString() || '', category: data.categories && data.categories.length > 0 ? data.categories[0] : '',
          });
          // pre-load existing images
          if (data.photos && data.photos.length > 0) {
            const existingPreviews = data.photos.map(photo => getProductImage({ photos: [photo] }));
            setImagePreviews(existingPreviews);
            setImages(data.photos); // Just placeholders so count is correct
          }
        } else {
          toast({ title: "Error", description: "Product not found.", variant: "destructive" });
          navigate('/dashboard');
        }
        setLoading(false);
      }).catch(error => {
        console.error("Failed to fetch product data:", error);
        toast({ title: "Error", description: "Could not load product data.", variant: "destructive" });
        setLoading(false);
        navigate('/dashboard');
      });
    }
  }, [productId, isEditing, navigate, toast]);

  useEffect(() => {
    return () => {
      imagePreviews.forEach(url => {
        if (url.startsWith('blob:')) URL.revokeObjectURL(url);
      });
    };
  }, [imagePreviews]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleCategoryChange = (value) => {
    setProduct(prev => ({ ...prev, category: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = [...images, ...files];
    setImages(newImages);
    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (indexToRemove) => {
    if (imagePreviews[indexToRemove].startsWith('blob:')) {
      URL.revokeObjectURL(imagePreviews[indexToRemove]);
    }
    setImages(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (!product.name || !product.description || !product.price || !product.stock) {
      toast({ title: "Missing Information", description: "Please fill in name, description, price, and stock.", variant: "destructive" });
      setSaving(false); return;
    }

    try {
      const payload = {
        name: product.name,
        description: product.description || undefined,
        price: parseFloat(product.price),
        quantity: parseInt(product.stock, 10),
        categories: [product.category],
        weight: product.weight ? parseFloat(product.weight) : undefined,
        length: product.length ? parseFloat(product.length) : undefined,
        width: product.width ? parseFloat(product.width) : undefined,
        height: product.height ? parseFloat(product.height) : undefined,
      };

      let savedProduct;
      if (isEditing) {
        savedProduct = await updateProduct(productId, payload);
      } else {
        savedProduct = await createProduct(payload);
      }

      const newFiles = images.filter(img => img instanceof File);
      if (newFiles.length > 0) {
        const formData = new FormData();
        newFiles.forEach(file => formData.append('photos', file));
        await uploadProductPhotos(isEditing ? productId : savedProduct.id, formData);
      }

      toast({ title: "Success", description: `Product ${isEditing ? 'updated' : 'added'} successfully.` });
      navigate('/dashboard');
    } catch (error) {
      console.error("Failed to save product:", error);
      toast({ title: "Error", description: error.message || `Failed to ${isEditing ? 'update' : 'add'} product.`, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-8">
        <Link to="/dashboard" className="inline-block mb-4">
          <Button variant="outline" size="sm"><ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard</Button>
        </Link>
        <h1 className="text-3xl font-bold">{isEditing ? 'Edit Product' : 'Add New Product'}</h1>
      </motion.div>

      <form onSubmit={handleSubmit}>
        <Card className="glassmorphism mb-6">
          <CardHeader>
            <CardTitle>Product Details</CardTitle>
            <CardDescription>Provide information about the item you want to sell.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div><Label htmlFor="name">Product Name</Label><Input id="name" name="name" value={product.name} onChange={handleInputChange} required /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" name="description" value={product.description} onChange={handleInputChange} rows={4} /></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div><Label htmlFor="price">Price ($)</Label><Input id="price" name="price" type="number" min="0.01" step="0.01" value={product.price} onChange={handleInputChange} required /></div>
              <div>
                <Label htmlFor="category">Category</Label>
                <Select name="category" value={product.category} onValueChange={handleCategoryChange} required>
                  <SelectTrigger id="category"><SelectValue placeholder="Select a category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Home Goods">Home Goods</SelectItem><SelectItem value="Apparel">Apparel</SelectItem>
                    <SelectItem value="Electronics">Electronics</SelectItem><SelectItem value="Kitchenware">Kitchenware</SelectItem>
                    <SelectItem value="Accessories">Accessories</SelectItem><SelectItem value="Art">Art</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label htmlFor="stock">Stock Quantity</Label><Input id="stock" name="stock" type="number" min="0" step="1" value={product.stock} onChange={handleInputChange} required /></div>
            </div>
          </CardContent>
        </Card>

        <Card className="glassmorphism mb-6">
          <CardHeader>
            <CardTitle>Product Images</CardTitle>
            <CardDescription>Upload images for your product (max 5 recommended).</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 mb-4">
              {imagePreviews.map((previewUrl, index) => (
                <div key={index} className="relative aspect-square border rounded-md overflow-hidden group">
                  <img src={previewUrl} alt={`Product preview ${index + 1}`} className="w-full h-full object-cover" />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {images.length < 6 && (
                <Label htmlFor="image-upload" className="aspect-square border-2 border-dashed rounded-md flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-accent transition-colors">
                  <Upload className="h-8 w-8 text-muted-foreground mb-1" />
                  <span className="text-xs text-muted-foreground text-center">Add Image</span>
                </Label>
              )}
            </div>
            <Input
              id="image-upload"
              type="file"
              multiple
              accept="image/png, image/jpeg, image/webp"
              onChange={handleImageChange}
              className="hidden"
              disabled={images.length >= 6}
            />
            <p className="text-xs text-muted-foreground">Accepted formats: PNG, JPG, WEBP. Max 5MB per image.</p>
          </CardContent>
        </Card>

        <Card className="glassmorphism mt-6">
          <CardHeader>
            <CardTitle>Shipping Details (FedEx)</CardTitle>
            <CardDescription>Provide package dimensions and weight for accurate shipping cost calculation.</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div><Label htmlFor="weight">Weight (kg)</Label><Input id="weight" name="weight" type="number" min="0.01" step="0.01" value={product.weight} onChange={handleInputChange} required /></div>
            <div><Label htmlFor="length">Length (cm)</Label><Input id="length" name="length" type="number" min="1" step="0.1" value={product.length} onChange={handleInputChange} required /></div>
            <div><Label htmlFor="width">Width (cm)</Label><Input id="width" name="width" type="number" min="1" step="0.1" value={product.width} onChange={handleInputChange} required /></div>
            <div><Label htmlFor="height">Height (cm)</Label><Input id="height" name="height" type="number" min="1" step="0.1" value={product.height} onChange={handleInputChange} required /></div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {saving ? 'Saving...' : (isEditing ? 'Update Product' : 'Add Product')}
            </Button>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
};

export default ProductFormPage;
