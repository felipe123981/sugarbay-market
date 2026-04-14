
    import React from 'react';
    import { motion } from 'framer-motion';
    import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from '@/components/ui/button';
    import { Separator } from "@/components/ui/separator";
    import { Loader2 } from 'lucide-react';

    const CheckoutStepReview = ({ shippingInfo, paymentMethod, cartItems, total, onPlaceOrder, onPrevious, isLoading = false }) => {
      return (
        <motion.div key="step3" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
          <CardHeader>
            <CardTitle>Review Your Order</CardTitle>
            <CardDescription>Please check your details before placing the order.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div>
                <h3 className="font-semibold mb-2">Shipping To:</h3>
                <p className="text-sm text-muted-foreground">{shippingInfo.name}</p>
                <p className="text-sm text-muted-foreground">{shippingInfo.address}</p>
                <p className="text-sm text-muted-foreground">{shippingInfo.city}, {shippingInfo.state} {shippingInfo.zip}</p>
                <p className="text-sm text-muted-foreground">{shippingInfo.country}</p>
                <Button variant="link" size="sm" className="h-auto p-0 mt-1" onClick={() => onPrevious(2)}>Edit Shipping</Button>
              </div>
              <Separator />
               <div>
                <h3 className="font-semibold mb-2">Payment Method:</h3>
                 <p className="text-sm text-muted-foreground capitalize">{paymentMethod}</p>
                  <Button variant="link" size="sm" className="h-auto p-0 mt-1" onClick={() => onPrevious(1)}>Change Payment</Button>
              </div>
              <Separator />
               <div>
                <h3 className="font-semibold mb-2">Order Items:</h3>
                 {cartItems.map(item => (
                  <div key={item.id} className="flex justify-between items-center text-sm mb-1">
                    <span>{item.name} (x{item.quantity})</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                 <Separator className="my-2" />
                 <div className="flex justify-between text-sm font-medium">
                   <span>Total (incl. tax & shipping)</span>
                   <span>${total.toFixed(2)}</span>
                 </div>
              </div>
           </CardContent>
           <CardFooter className="justify-between">
             <Button variant="outline" onClick={() => onPrevious(1)}>Back to Payment</Button>
<Button onClick={onPlaceOrder} disabled={isLoading} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white">
                 {isLoading ? (
                   <>
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                     Processing...
                   </>
                 ) : 'Place Order'}
               </Button>
           </CardFooter>
         </motion.div>
      );
    };

    export default CheckoutStepReview;
  