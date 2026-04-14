
    import React from 'react';
    import { useNavigate } from 'react-router-dom';
    import { Button } from "@/components/ui/button";
    import { ShoppingCart, MessageSquare, Share2 } from 'lucide-react';
    import { useToast } from "@/components/ui/use-toast";

    const ProductActions = ({ product, onAddToCart, onShare }) => {
      const navigate = useNavigate();
      const { toast } = useToast();

      if (!product) return null;

      const handleContactSeller = () => {
        if (product.sellerId) {
          navigate(`/chat/seller-${product.sellerId}`);
        } else {
          toast({
            title: "Error",
            description: "Seller information is not available for chat.",
            variant: "destructive",
          });
        }
      };

      return (
        <>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              size="lg"
              disabled={product.stock <= 0}
              onClick={onAddToCart}
              className="flex-1 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button size="lg" variant="outline" className="flex-1" onClick={handleContactSeller}>
              <MessageSquare className="mr-2 h-5 w-5" /> Contact Seller
            </Button>
            <Button size="lg" variant="outline" onClick={onShare}>
              <Share2 className="mr-2 h-5 w-5" /> Share
            </Button>
          </div>
        </>
      );
    };

    export default ProductActions;
  