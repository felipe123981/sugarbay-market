
import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from 'lucide-react';
import Reviews from '@/components/Reviews';
import RelatedProducts from '@/components/products/RelatedProducts';
import ProductImageGallery from '@/components/product_detail/ProductImageGallery';
import ProductInfo from '@/components/product_detail/ProductInfo';
import ProductActions from '@/components/product_detail/ProductActions';
import { motion } from 'framer-motion';
import { useToast } from "@/components/ui/use-toast";
import { useCart } from '@/hooks/useCart';
import { useFavorites } from '@/hooks/useFavorites';

import { getProduct, listCustomers } from '@/lib/api';
import { getAllProductImages } from '@/lib/utils';

const fetchProductDetails = async (productId) => {
  try {
    const data = await getProduct(productId);
    if (!data) return null;

    let sellerName = 'Unknown Seller';
    let sellerInitials = 'U';
    try {
      const customersResponse = await listCustomers();
      const customers = Array.isArray(customersResponse) ? customersResponse : (customersResponse?.data || []);
      const sellerCustomer = customers.find(c => c.id === data.customer_id?.id || c.id === data.customer_id);
      if (sellerCustomer) {
        sellerName = sellerCustomer.shop_name || sellerCustomer.name;
        sellerInitials = sellerName.substring(0, 2).toUpperCase();
      }
    } catch (e) { console.error("Error fetching seller", e); }

    const galleryImages = getAllProductImages(data);

    const formattedProduct = {
      ...data,
      price: parseFloat(data.price),
      stock: data.quantity,
      category: data.categories && data.categories.length > 0 ? data.categories[0] : 'Other',
      seller: sellerName,
      sellerInitials: sellerInitials,
      sellerId: data.customer_id?.id || data.customer_id,
      gallery: galleryImages
    };

    formattedProduct.mainImage = galleryImages.length > 0 ? galleryImages[0] : null;
    formattedProduct.mainImageUrlForSelection = galleryImages.length > 0 ? galleryImages[0] : null;
    return formattedProduct;
  } catch (error) {
    console.error("Failed to fetch product details:", error);
    return null;
  }
};

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { toast } = useToast();
  const { addToCart } = useCart();
  const { isFavorite, toggleFavorite } = useFavorites();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const productUrl = window.location.href;
  const isFavorited = product ? isFavorite(product.id) : false;

  useEffect(() => {
    setLoading(true);
    setSelectedImage(null);
    setProduct(null);
    setCurrentImageIndex(0);
    fetchProductDetails(productId).then(data => {
      setProduct(data);
      if (data && data.gallery && data.gallery.length > 0) {
        setSelectedImage(data.gallery[0]);
      } else if (data && data.mainImageUrlForSelection) { // Fallback if gallery is empty but main image exists
        setSelectedImage(data.mainImageUrlForSelection);
      }
      setLoading(false);
    }).catch(error => {
      console.error("Error fetching product details:", error);
      setLoading(false);
    });
    window.scrollTo(0, 0);
  }, [productId]);

  const handleAddToCart = useCallback(() => {
    if (product) {
      addToCart(product, 1);
      toast({
        title: "Added to Cart",
        description: `${product.name} has been added to your cart.`,
      });
    }
  }, [product, addToCart, toast]);

  const handleShare = useCallback(async () => {
    if (!product) return;
    const shareData = { title: product.name, text: `Check out this product: ${product.name}`, url: productUrl };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (err) { copyLinkFallback(); }
    } else { copyLinkFallback(); }
  }, [product, productUrl, toast]);

  const copyLinkFallback = useCallback(() => {
    navigator.clipboard.writeText(productUrl).then(() => {
      toast({ title: "Link Copied!", description: "Product page link copied to clipboard." });
    }).catch(err => {
      toast({ variant: "destructive", title: "Copy Failed", description: "Could not copy link." });
    });
  }, [productUrl, toast]);

  const handleThumbnailClick = useCallback((imageUrl, index) => {
    setSelectedImage(imageUrl);
    setCurrentImageIndex(index);
  }, []);

  const navigateImage = useCallback((direction) => {
    if (!product || !product.gallery || product.gallery.length === 0) return;
    const newIndex = (currentImageIndex + direction + product.gallery.length) % product.gallery.length;
    setSelectedImage(product.gallery[newIndex]);
    setCurrentImageIndex(newIndex);
  }, [product, currentImageIndex]);

  const handleFavoriteToggle = useCallback(() => {
    if (product) {
      toggleFavorite(product.id, product.name);
    }
  }, [product, toggleFavorite]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
        <p className="text-muted-foreground mb-6">The product you are looking for does not exist or may have been removed.</p>
        <Link to="/products">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  const galleryImages = product.gallery || [];

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link to="/products" className="inline-block mb-6">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </Link>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-12">
        <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
          <ProductImageGallery
            productName={product.name}
            selectedImage={selectedImage}
            galleryImages={galleryImages}
            currentImageIndex={currentImageIndex}
            onThumbnailClick={handleThumbnailClick}
            onNavigateImage={navigateImage}
          />
        </motion.div>

        <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }}>
          <ProductInfo
            product={product}
            isFavorited={isFavorited}
            onFavoriteToggle={handleFavoriteToggle}
          />
          <ProductActions
            product={product}
            onAddToCart={handleAddToCart}
            onShare={handleShare}
          />
        </motion.div>
      </div>

      <Reviews />

      {product && product.id && product.category && (
        <RelatedProducts currentProductId={product.id} category={product.category} />
      )}
    </div>
  );
};

export default ProductDetailPage;
