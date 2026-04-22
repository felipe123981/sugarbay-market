import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PackagePlus, Edit, Trash2, Loader2 } from 'lucide-react';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { getMyProducts, deleteProduct } from '@/lib/api';

const fetchSellerProducts = async () => {
  try {
    return await getMyProducts();
  } catch (error) {
    throw new Error('Failed to fetch products');
  }
};

const deleteProductById = async (productId) => {
  return await deleteProduct(productId);
};

const SellerProductsTab = () => {
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;
    setLoadingProducts(true);
    fetchSellerProducts().then(data => {
      setProducts(data);
      setLoadingProducts(false);
    }).catch(error => {
      console.error("Failed to fetch seller products:", error);
      toast({ title: "Error", description: "Could not load your products.", variant: "destructive" });
      setLoadingProducts(false);
    });
  }, [user, toast]);

  const handleDeleteProduct = async (productId) => {
    try {
      await deleteProductById(productId);
      setProducts(prevProducts => prevProducts.filter(p => p.id !== productId));
      toast({ title: "Product Deleted", description: "The product has been removed." });
    } catch (error) {
      toast({ title: "Delete Failed", description: error.message || "Could not delete product.", variant: "destructive" });
    }
  };

  if (loadingProducts) {
    return (
      <Card className="glassmorphism">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Manage Your Products</CardTitle>
            <CardDescription>Loading your listings...</CardDescription>
          </div>
           <Link to="/dashboard/products/new">
            <Button disabled>
              <PackagePlus className="mr-2 h-4 w-4" /> Add New Product
            </Button>
          </Link>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-10">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="glassmorphism">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Manage Your Products</CardTitle>
          <CardDescription>View, add, edit, or remove your listings.</CardDescription>
        </div>
        <Link to="/dashboard/products/new">
          <Button>
            <PackagePlus className="mr-2 h-4 w-4" /> Add New Product
          </Button>
        </Link>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>{products.length === 0 ? 'You have not listed any products yet.' : 'A list of your products.'}</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell className="font-medium">{product.name}</TableCell>
                <TableCell>${parseFloat(product.price).toFixed(2)}</TableCell>
                <TableCell>{product.quantity}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Link to={`/dashboard/products/edit/${product.id}`}>
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="icon">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete the product "{product.name}".
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteProduct(product.id)} className="bg-destructive hover:bg-destructive/90">
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default SellerProductsTab;
