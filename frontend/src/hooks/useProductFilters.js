
    import { useState, useMemo, useCallback } from 'react';

    export const useProductFilters = (allProductsSource, maxPrice) => {
      const [searchTerm, setSearchTerm] = useState('');
      const [selectedCategory, setSelectedCategory] = useState('All');
      const [priceRange, setPriceRange] = useState([0, maxPrice]);
      const [inStockOnly, setInStockOnly] = useState(false);
      const [sortBy, setSortBy] = useState('relevance'); // 'relevance', 'latest', 'best-selling', 'price-asc', 'price-desc'

      const filteredAndSortedProducts = useMemo(() => {
        let products = allProductsSource.filter(product => {
          const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                               (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase()));
          const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
          const matchesPrice = product.price >= priceRange[0] && product.price <= priceRange[1];
          const matchesStock = !inStockOnly || product.stock > 0;
          return matchesSearch && matchesCategory && matchesPrice && matchesStock;
        });

        switch (sortBy) {
          case 'latest':
            products.sort((a, b) => (b.dateAdded || 0) - (a.dateAdded || 0)); // Assuming products have a dateAdded field
            break;
          case 'best-selling':
            products.sort((a, b) => (b.salesCount || 0) - (a.salesCount || 0)); // Assuming products have a salesCount field
            break;
          case 'price-asc':
            products.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            products.sort((a, b) => b.price - a.price);
            break;
          case 'relevance':
          default:
            // Default relevance (can be improved with more sophisticated logic if needed)
            break;
        }
        return products;
      }, [allProductsSource, searchTerm, selectedCategory, priceRange, inStockOnly, sortBy]);

      const clearFilters = useCallback(() => {
        setSearchTerm('');
        setSelectedCategory('All');
        setPriceRange([0, maxPrice]);
        setInStockOnly(false);
        setSortBy('relevance');
      }, [maxPrice]);

      return {
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        priceRange,
        setPriceRange,
        inStockOnly,
        setInStockOnly,
        sortBy,
        setSortBy,
        filteredProducts: filteredAndSortedProducts,
        clearFilters,
      };
    };
  