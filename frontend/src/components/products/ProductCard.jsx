
     import React from 'react';
     import { Link } from 'react-router-dom';
     import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
     import { Button } from '@/components/ui/button';
     import { Badge } from '@/components/ui/badge';
     import { motion } from 'framer-motion';
     import { Share2, Heart } from 'lucide-react';
     import { useToast } from "@/components/ui/use-toast";
     import { useFavorites } from '@/hooks/useFavorites';
     import { cn, getProductImage } from '@/lib/utils';

     const ProductCard = React.memo(({ product, index, lastElementRef }) => {
         const { toast } = useToast();
         const { isFavorite, toggleFavorite } = useFavorites();
         
         const linkId = product.id;
         const productUrl = `${window.location.origin}/product/${linkId}`;
         const isFavorited = isFavorite(product.id);

         const handleShare = async (event) => {
           event.stopPropagation();
           event.preventDefault();
           const shareData = {
             title: product.name,
             text: `Check out this product: ${product.name}`,
             url: productUrl,
           };

           if (navigator.share) {
             try {
               await navigator.share(shareData);
             } catch (err) {
               copyLinkFallback();
             }
           } else {
              copyLinkFallback();
           }
         };

          const copyLinkFallback = () => {
             navigator.clipboard.writeText(productUrl).then(() => {
                toast({
                  title: "Link Copied!",
                  description: "Product link copied to clipboard.",
                });
             }).catch(err => {
                 toast({
                   variant: "destructive",
                   title: "Copy Failed",
                   description: "Could not copy link to clipboard.",
                 });
             });
          };

          const handleFavoriteToggle = (event) => {
             event.stopPropagation();
             event.preventDefault();
             toggleFavorite(product.id, product.name);
          };

           const handleImageError = (e) => {
            e.target.onerror = null;
            e.target.src = '/placeholder.svg';
          };

      return (
        <motion.div
          ref={lastElementRef}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.05 }}
          layout
        >
          <Card className="overflow-hidden h-full flex flex-col hover:shadow-lg transition-shadow duration-300 glassmorphism">
            <CardHeader className="p-0 relative">
               <Link to={`/product/${linkId}`} className="block">
                 <img 
                    loading="lazy"
                    className="w-full h-48 object-cover"
                    alt={product.name} 
                    src={getProductImage(product)}
                    onError={handleImageError} />
               </Link>
               <Badge variant="secondary" className="absolute top-2 right-2">{product.category}</Badge>
               <Button 
                  variant="ghost" 
                  size="icon" 
                  className={cn(
                    "absolute top-2 left-2 h-8 w-8 rounded-full bg-background/70 hover:bg-background/90",
                    isFavorited ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
                  )}
                  onClick={handleFavoriteToggle}
                  aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
                >
                  <Heart className={cn("h-4 w-4", isFavorited && "fill-current")} />
                </Button>
            </CardHeader>
            <CardContent className="p-4 flex-grow">
               <Link to={`/product/${linkId}`}>
                 <CardTitle className="text-lg font-semibold mb-1 hover:text-primary transition-colors">{product.name}</CardTitle>
               </Link>
              <CardDescription className="text-sm text-muted-foreground mb-2">
                 Sold by{' '}
                 <Link to={`/seller/${product.sellerId}`} className="text-primary hover:underline">
                   {product.seller}
                 </Link>
               </CardDescription>
              <p className="text-sm mb-2 line-clamp-2">{product.description}</p>
               {product.stock === 0 && <Badge variant="destructive">Out of Stock</Badge>}
                {product.stock > 0 && product.stock < 10 && <Badge variant="outline">Low Stock</Badge>}
            </CardContent>
            <CardFooter className="p-4 flex justify-between items-center border-t mt-auto">
              <span className="text-xl font-bold text-primary">${product.price.toFixed(2)}</span>
               <div className="flex items-center space-x-2">
                 <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleShare} aria-label="Share product">
                    <Share2 className="h-4 w-4" />
                 </Button>
                 <Link to={`/product/${linkId}`}>
                    <Button size="sm" disabled={product.stock === 0}>View Details</Button>
                 </Link>
               </div>
            </CardFooter>
          </Card>
        </motion.div>
      );
    });

    export default ProductCard;
  