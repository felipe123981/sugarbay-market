
    import React, { useState, useEffect } from 'react';
    import { motion } from 'framer-motion';
    import ProductFilters from '@/components/products/ProductFilters';
    import ProductGrid from '@/components/products/ProductGrid';
    import { useProductFilters } from '@/hooks/useProductFilters';
    import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
    import { categories } from '@/lib/productData';
    import { listProducts, listCustomers } from '@/lib/api';

    const ProductsPage = () => {
      const [allProductsSource, setAllProductsSource] = useState([]);
      const [isLoadingProducts, setIsLoadingProducts] = useState(true);

      React.useEffect(() => {
        async function fetchProducts() {
          try {
            const [data, customersData] = await Promise.all([
              listProducts(),
              listCustomers().catch(() => []),
            ]);
            const customers = Array.isArray(customersData) ? customersData : (customersData?.data || []);
            
            const mappedProducts = data.map(p => {
              const seller = customers.find(c => c.id === p.customer_id?.id || c.id === p.customer_id) || {};
              return {
                ...p,
                price: p.price / 100,
                stock: p.quantity,
                category: p.categories && p.categories.length > 0 ? p.categories[0] : 'Other',
                seller: seller.shop_name || seller.name || 'Unknown Seller',
                sellerId: seller.id || p.customer_id,
              };
            });
            setAllProductsSource(mappedProducts);
          } catch (error) {
            console.error("Failed to load products:", error);
          } finally {
            setIsLoadingProducts(false);
          }
        }
        fetchProducts();
      }, []);

      // Calculate maxPrice dynamically from actual products
      const dynamicMaxPrice = allProductsSource.length > 0
        ? Math.ceil(Math.max(...allProductsSource.map(p => p.price)))
        : 1000;

      const {
        searchTerm, setSearchTerm,
        selectedCategory, setSelectedCategory,
        priceRange, setPriceRange,
        inStockOnly, setInStockOnly,
        sortBy, setSortBy,
        filteredProducts, clearFilters,
      } = useProductFilters(allProductsSource, dynamicMaxPrice);

      const {
        displayedItems: displayedProducts,
        loading, hasMore, lastItemElementRef,
      } = useInfiniteScroll(filteredProducts, 8); 

      const gridKey = `${selectedCategory}-${priceRange[0]}-${priceRange[1]}-${inStockOnly}-${searchTerm}-${sortBy}`;

      return (
        <div className="container mx-auto px-4 py-12 flex-1">
           <motion.div
             initial={{ opacity: 0, y: -20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5 }}
           >
             <h1 className="text-3xl font-bold text-center mb-6">Explore Products</h1>
             <ProductFilters
                categories={categories}
                maxPrice={dynamicMaxPrice}
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                inStockOnly={inStockOnly}
                setInStockOnly={setInStockOnly}
                sortBy={sortBy}
                setSortBy={setSortBy}
                clearFilters={clearFilters}
              />
           </motion.div>

           <ProductGrid
              products={displayedProducts}
              loading={loading}
              hasMore={hasMore}
              lastItemElementRef={lastItemElementRef}
              gridKey={gridKey}
           />
        </div>
      );
    };

    export default ProductsPage;
  