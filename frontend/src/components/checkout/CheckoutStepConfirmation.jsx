
    import React from 'react';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Link } from 'react-router-dom';
    import { CheckCircle, Package } from 'lucide-react';

    const CheckoutStepConfirmation = ({ order = null }) => {
      return (
        <motion.div key="step4" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10 px-6">
           <div className="mx-auto bg-green-100 rounded-full p-3 w-24 h-24 flex items-center justify-center mb-4">
             <Package className="h-12 w-12 text-green-500" />
           </div>
           <h2 className="text-2xl font-bold mb-2">Order Confirmed!</h2>
           {order && order.id ? (
             <p className="text-muted-foreground mb-6">Thank you for your purchase. Your order ID is <span className="font-semibold">#{order.id.substring(0,8)}</span>.</p>
           ) : (
             <p className="text-muted-foreground mb-6">Thank you for your purchase. Your order has been placed.</p>
           )}
           <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link to="/invoices">
                 <Button variant="outline" className="w-full sm:w-auto">View Order History</Button>
              </Link>
              <Link to="/products">
                <Button className="w-full sm:w-auto">Continue Shopping</Button>
              </Link>
            </div>
        </motion.div>
      );
    };

    export default CheckoutStepConfirmation;
  