
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useFavorites } from '@/hooks/useFavorites';
import ProductCard from '@/components/products/ProductCard';
import { Button } from '@/components/ui/button';
import { Loader2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { listProducts } from '@/lib/api';

const fetchFavoriteProductsDetails = async (favoriteIds) => {
  try {
    const allProducts = await listProducts();
    return allProducts
      .filter(p => favoriteIds.includes(p.id))
      .map(p => ({
        ...p,
        price: p.price,
        stock: p.quantity,
        category: p.categories && p.categories.length > 0 ? p.categories[0] : 'Other',
      }));
  } catch (error) {
    console.error("Failed to load favorite products:", error);
    return [];
  }
};

const FavoritesPage = () => {
  const { getFavoriteProductIds } = useFavorites();
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFavorites = async () => {
      setLoading(true);
      const ids = getFavoriteProductIds();
      if (ids.length > 0) {
        const productsDetails = await fetchFavoriteProductsDetails(ids);
        setFavoriteProducts(productsDetails);
      } else {
        setFavoriteProducts([]);
      }
      setLoading(false);
    };
    loadFavorites();
  }, [getFavoriteProductIds]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 flex-1">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-3xl font-bold">My Favorite Products</h1>
        <p className="text-muted-foreground">Products you've saved for later.</p>
      </motion.div>

      {favoriteProducts.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center py-10"
        >
          <Heart className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Favorites Yet</h2>
          <p className="text-muted-foreground mb-6">
            Looks like you haven't added any products to your favorites.
          </p>
          <Link to="/products">
            <Button>Explore Products</Button>
          </Link>
        </motion.div>
      ) : (
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } }
          }}
        >
          {favoriteProducts.map((product, index) => (
            <motion.div
              key={product.id}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 }
              }}
            >
              <ProductCard product={product} index={index} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FavoritesPage;
