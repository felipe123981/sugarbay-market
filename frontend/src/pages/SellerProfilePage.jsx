import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageSquare, ArrowLeft, Loader2, MapPin, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

import { getCustomer, getCustomerAvatar } from '@/lib/api';
import { getProductsByCustomerId } from '@/lib/api';
import { getProductImage } from '@/lib/utils';

const fetchSellerDetails = async (sellerId) => {
  try {
    const customer = await getCustomer(sellerId);
    if (!customer) return null;
    
    let userAvatar = null;

    try {
      const avatarData = await getCustomerAvatar(sellerId);
      if (avatarData && avatarData.avatar_url) {
        userAvatar = avatarData.avatar_url;
      }
    } catch {
      // Silently fail — avatar is optional
    }

    return {
      id: customer.id,
      name: customer.shop_name || customer.name,
      sellerName: customer.name,
      joinDate: customer.created_at,
      location: customer.location || 'Location not specified',
      rating: Number(customer.rating) || 0,
      reviews: customer.reviews_count || 0,
      bio: customer.bio || 'Seller has no bio.',
      shop_name: customer.shop_name,
      avatar_url: userAvatar,
      initials: (customer.shop_name || customer.name)?.substring(0, 2).toUpperCase() || 'U'
    };
  } catch (error) {
    console.error("Seller not found", error);
    return null;
  }
};

const fetchSellerProducts = async (sellerId) => {
   try {
     const data = await getProductsByCustomerId(sellerId);
     if (!data || !Array.isArray(data)) return [];
     
     return data.map(p => ({
       ...p,
       price: p.price / 100,
       stock: p.quantity,
       category: p.categories && p.categories.length > 0 ? p.categories[0] : 'Other',
       sellerId: p.customer_id?.id || p.customer_id,
       photos: p.photos || [],
     }));
   } catch (error) {
     console.error("Failed to fetch seller products", error);
     return [];
   }
};

const BadgePlaceholder = ({ children, variant = 'default', className }) => (
  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${variant === 'destructive' ? 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80' : variant === 'secondary' ? 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80' : 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80'} ${className}`}>
    {children}
  </span>
);

const StarRating = ({ rating }) => {
  const fullStars = Math.floor(rating);
  const emptyStars = 5 - fullStars;
  return (
    <div className="flex items-center">
      {[...Array(fullStars)].map((_, i) => (
        <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
      ))}
      {[...Array(emptyStars)].map((_, i) => (
        <Star key={`empty-${i}`} className="h-4 w-4 text-muted-foreground" />
      ))}
    </div>
  );
};

const SellerProfilePage = () => {
  const { sellerId } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    Promise.all([fetchSellerDetails(sellerId), fetchSellerProducts(sellerId)])
      .then(([sellerData, productsData]) => {
        setSeller(sellerData);
        setProducts(productsData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch seller data:", error);
        setLoading(false);
      });
  }, [sellerId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <h1 className="text-2xl font-bold mb-4">Seller Not Found</h1>
        <p className="text-muted-foreground mb-6">The seller profile you are looking for does not exist.</p>
        <Link to="/products">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link to="/products" className="inline-block mb-6">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
          </Button>
        </Link>
      </motion.div>

      {/* Seller Info Header */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <Card className="mb-8 overflow-hidden glassmorphism">
          <div className="relative h-32 sm:h-48 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50">
            <img  
              className="w-full h-full object-cover opacity-30" 
              alt={`${seller.name} banner`}
              src="https://images.unsplash.com/photo-1696679348215-e2b1d1b11149" />
          </div>
          <CardContent className="p-6 pt-0 relative -mt-12 sm:-mt-16 flex flex-col sm:flex-row items-center sm:items-end gap-4">
            <Avatar className="h-24 w-24 sm:h-32 sm:w-32 border-4 border-background shadow-lg">
              {seller.avatar_url ? (
                <AvatarImage src={seller.avatar_url} alt={seller.name} className="object-cover" />
              ) : (
                <AvatarFallback className="text-4xl">{seller.initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 text-center sm:text-left pt-4 sm:pt-0">
              <CardTitle className="text-2xl sm:text-3xl font-bold">
                {seller.shop_name || seller.name}
              </CardTitle>
              {seller.shop_name && (
                <p className="text-sm text-muted-foreground mt-1">by {seller.sellerName}</p>
              )}
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                <div className="flex items-center">
                  <StarRating rating={seller.rating} />
                  <span className="ml-1">({seller.reviews} reviews)</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" /> {seller.location}
                </div>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 mr-1" /> Joined {new Date(seller.joinDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
                </div>
              </div>
              <p className="mt-2 text-sm">{seller.bio}</p>
            </div>
            <Button variant="outline" className="mt-4 sm:mt-0">
              <MessageSquare className="mr-2 h-4 w-4" /> Contact Seller
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Seller Products */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
        <h2 className="text-2xl font-semibold mb-6">Products from {seller.sellerName}</h2>
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.05 + 0.3 }}
                layout
              >
                <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300 glassmorphism">
                  <CardHeader className="p-0 relative">
                    <img 
                      className="w-full h-48 object-cover"
                      alt={product.name}
                      src={getProductImage(product)} />
                    <BadgePlaceholder variant="secondary" className="absolute top-2 right-2">{product.category}</BadgePlaceholder>
                  </CardHeader>
                  <CardContent className="p-4 flex-grow">
                    <CardTitle className="text-lg font-semibold mb-1">{product.name}</CardTitle>
                    <p className="text-sm mb-2 line-clamp-2">{product.description}</p>
                  </CardContent>
                  <CardFooter className="p-4 flex justify-between items-center border-t mt-auto">
                    <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
                    <Link to={`/product/${product.id}`}>
                      <Button size="sm">View Details</Button>
                    </Link>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground">This seller hasn't listed any products yet.</p>
        )}
      </motion.div>
    </div>
  );
};

export default SellerProfilePage;
