
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
    import { Separator } from "@/components/ui/separator";
    import { getProductImage } from '@/lib/utils';

    const CheckoutOrderSummary = ({ cartItems, subtotal, shippingCost, taxes, total }) => {
      return (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="lg:col-span-1">
          <Card className="sticky top-24 glassmorphism">
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {cartItems.map(item => (
                <div key={item.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-2">
                     <img className="w-10 h-10 object-cover rounded" alt={item.name} src={getProductImage(item)} />
                      <span>{item.name} x{item.quantity}</span>
                   </div>
                   <span>${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
              <Separator />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Shipping</span>
                <span>${shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>Taxes</span>
                <span>${taxes.toFixed(2)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      );
    };

    export default CheckoutOrderSummary;
  