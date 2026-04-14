
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Badge } from "@/components/ui/badge";
    import { Avatar, AvatarFallback } from "@/components/ui/avatar";
    import { Card, CardContent } from "@/components/ui/card";
    import { ExternalLink, Heart } from 'lucide-react';
    import { Button } from "@/components/ui/button";
    import { cn } from '@/lib/utils';

    const ProductInfo = ({ product, isFavorited, onFavoriteToggle }) => {
      if (!product) return null;

      return (
        <div>
          <div className="flex justify-between items-start mb-2">
            <Badge variant="secondary">{product.category}</Badge>
            <Button
              variant="ghost"
              size="icon"
              onClick={onFavoriteToggle}
              className={cn(
                "h-10 w-10 rounded-full",
                isFavorited ? "text-red-500 hover:text-red-600" : "text-muted-foreground hover:text-foreground"
              )}
              aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
            >
              <Heart className={cn("h-6 w-6", isFavorited && "fill-current")} />
            </Button>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center space-x-2 mb-4 text-muted-foreground">
            <Avatar className="h-6 w-6">
              <AvatarFallback className="text-xs">{product.sellerInitials || 'S'}</AvatarFallback>
            </Avatar>
            <span>Sold by{' '}
              <Link to={`/seller/${product.sellerId}`} className="text-primary hover:underline">
                {product.seller} <ExternalLink className="inline-block h-3 w-3 ml-0.5" />
              </Link>
            </span>
          </div>
          <p className="text-3xl font-bold text-primary mb-4">${product.price.toFixed(2)}</p>
          <p className="text-muted-foreground mb-6">{product.description}</p>

          <Card className="mb-6 bg-secondary/30 glassmorphism">
            <CardContent className="p-4 space-y-2">
              <p className="text-sm"><span className="font-semibold">Stock:</span> {product.stock > 0 ? `${product.stock} available` : 'Out of Stock'}</p>
              <p className="text-sm"><span className="font-semibold">Condition:</span> New</p>
              <p className="text-sm"><span className="font-semibold">Shipping:</span> Calculated at checkout</p>
            </CardContent>
          </Card>
        </div>
      );
    };

    export default ProductInfo;
  