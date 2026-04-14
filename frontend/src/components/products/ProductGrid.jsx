
    import React from 'react';
    import { motion, AnimatePresence } from 'framer-motion';
    import ProductCard from '@/components/products/ProductCard';
    import { Loader2 } from 'lucide-react';

    const ProductGrid = React.memo(({ products, loading, hasMore, lastItemElementRef, gridKey }) => {
      return (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={gridKey} // Use the dynamic key here
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {products.map((product, index) => (
                <ProductCard
                  key={`${product.id}-${index}`} // Unique key per item
                  product={product}
                  index={index}
                  lastElementRef={products.length === index + 1 ? lastItemElementRef : null}
                />
              ))}
            </motion.div>
          </AnimatePresence>

          {loading && (
            <div className="text-center mt-8 py-6 flex justify-center items-center col-span-full">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading more products...</span>
            </div>
          )}

          {!loading && products.length === 0 && (
            <div className="text-center mt-8 py-6 text-muted-foreground col-span-full">
              No products found matching your criteria.
            </div>
          )}

          {!hasMore && !loading && products.length > 0 && (
             <div className="text-center mt-8 py-6 text-muted-foreground col-span-full">
               You've reached the end!
             </div>
           )}
        </>
      );
    }); // Wrap with React.memo

    export default ProductGrid;
  