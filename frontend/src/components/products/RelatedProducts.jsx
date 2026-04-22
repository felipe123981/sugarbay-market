
    import React, { useState, useEffect } from 'react';
    import ProductCard from '@/components/products/ProductCard';
    import { Loader2 } from 'lucide-react';

    import { listProducts, listCustomers } from '@/lib/api';

    const fetchRelatedProducts = async (currentProductId, category) => {
       try {
         const [data, customersData] = await Promise.all([listProducts(), listCustomers()]);
         const customers = Array.isArray(customersData) ? customersData : (customersData?.data || []);
         
         const mappedProducts = data.map(p => {
           const seller = customers.find(c => c.id === p.customer_id?.id || c.id === p.customer_id) || {};
           return {
             ...p,
             price: parseFloat(p.price),
             stock: p.quantity,
             category: p.categories && p.categories.length > 0 ? p.categories[0] : 'Other',
             seller: seller.shop_name || seller.name || 'Unknown Seller',
             sellerId: seller.id || p.customer_id,
           };
         });
         
         return mappedProducts
           .filter(p => p.category === category && p.id !== currentProductId)
           .slice(0, 4);
       } catch (error) {
         console.error("Failed to fetch related products", error);
         return [];
       }
    };

    const RelatedProducts = React.memo(({ currentProductId, category }) => {
      const [relatedProducts, setRelatedProducts] = useState([]);
      const [loading, setLoading] = useState(true);

      useEffect(() => {
        setLoading(true);
        fetchRelatedProducts(currentProductId, category)
          .then(data => {
            setRelatedProducts(data);
            setLoading(false);
          })
          .catch(error => {
            console.error("Failed to fetch related products:", error);
            setLoading(false);
          });
      }, [currentProductId, category]);

      if (loading) {
        return (
          <div className="mt-12 text-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary inline-block" />
          </div>
        );
      }

      if (relatedProducts.length === 0) {
        return null; // Don't render the section if no related products found
      }

      return (
        <div className="mt-16">
          <h2 className="text-2xl font-semibold mb-6">You Might Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product, index) => (
              // ProductCard is already memoized, so no need to wrap here
              <ProductCard key={product.id} product={product} index={index} />
            ))}
          </div>
        </div>
      );
    }); // Wrap with React.memo

    export default RelatedProducts;
  