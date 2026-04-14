
    import React, { useState } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Button } from "@/components/ui/button";
    import { Card } from "@/components/ui/card";
    import { Separator } from "@/components/ui/separator";
    import { ArrowLeft, CheckCircle, Package, CreditCard } from 'lucide-react';
    import { useToast } from "@/components/ui/use-toast";
    import { motion, AnimatePresence } from 'framer-motion';
    import CheckoutStepShipping from '@/components/checkout/CheckoutStepShipping';
    import CheckoutStepPayment from '@/components/checkout/CheckoutStepPayment';
    import CheckoutStepReview from '@/components/checkout/CheckoutStepReview';
    import CheckoutStepConfirmation from '@/components/checkout/CheckoutStepConfirmation';
    import CheckoutOrderSummary from '@/components/checkout/CheckoutOrderSummary';
    import { useCart } from '@/hooks/useCart';
    import { useAuth } from '@/context/AuthContext';
    import { createOrder } from '@/lib/api';

const CheckoutPage = () => {
  const { cartItems, clearCart } = useCart();
  const { user: currentUser } = useAuth();
  const [shippingInfo, setShippingInfo] = useState({ 
    name: currentUser?.recipient_name || currentUser?.name || '', 
    address: currentUser?.address || '', 
    city: currentUser?.city || '', 
    state: currentUser?.state || '', 
    zip: currentUser?.zipcode || '', 
    country: currentUser?.country || '' 
  });
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [step, setStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review, 4: Confirmation
  const [isLoading, setIsLoading] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

      // Calculate totals
      const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shippingCost = 8.50; // Placeholder
      const taxRate = 0.07; // Placeholder tax rate (7%)
      const taxes = subtotal * taxRate;
      const total = subtotal + shippingCost + taxes;

      const goToStep = (targetStep) => {
        setStep(targetStep);
      };

      const handlePlaceOrder = () => {
        // Check if user is authenticated
        if (!currentUser) {
          const { dismiss } = toast({
            title: "Login Required",
            description: "You need to be logged in to place an order.",
            action: (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => navigate('/login')}
              >
                Go to Login
              </Button>
            ),
            duration: Infinity
          });
          return;
        }

        setIsLoading(true);
        
        // Prepare order data
        const orderData = {
          products: cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity
          }))
        };

        toast({ title: "Processing Order...", description: "Please wait while we process your order." });

        // Create order via API
        createOrder(orderData)
          .then(orderResponse => {
            // Store the placed order and move to confirmation step
            setPlacedOrder(orderResponse);
            setStep(4);
            
            // Clear cart after successful order
            clearCart();
            
            toast({
              title: "Order Placed Successfully!",
              description: `Your order #${orderResponse.id.substring(0,8)} has been confirmed.`,
              variant: "default"
            });
          })
          .catch(error => {
            console.error("Error placing order:", error);
            toast({
              title: "Order Failed",
              description: error.message || "There was an error processing your order. Please try again.",
              variant: "destructive"
            });
          })
          .finally(() => {
            setIsLoading(false);
          });
      };

      // For step 4, we want to pass actual order information when available
      const renderStepContent = () => {
        switch (step) {
          case 1:
            return <CheckoutStepShipping shippingInfo={shippingInfo} setShippingInfo={setShippingInfo} onNext={() => goToStep(2)} />;
          case 2:
            return <CheckoutStepPayment paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} onNext={() => goToStep(3)} onPrevious={() => goToStep(1)} />;
          case 3:
            return <CheckoutStepReview shippingInfo={shippingInfo} paymentMethod={paymentMethod} cartItems={cartItems} total={total} onPlaceOrder={handlePlaceOrder} onPrevious={(prevStep) => goToStep(prevStep === 1 ? 2 : 1)} isLoading={isLoading} />; // Adjusted onPrevious logic
          case 4:
            return <CheckoutStepConfirmation order={placedOrder} />;
          default:
            return null;
        }
      };


      return (
        <div className="container mx-auto px-4 py-12">
           <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <Link to={step > 1 && step < 4 ? '#' : '/products'} onClick={(e) => step > 1 && step < 4 ? e.preventDefault() : null} className="inline-block mb-6">
                <Button variant="outline" size="sm" disabled={step > 1 && step < 4}>
                  <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
                </Button>
              </Link>
             <h1 className="text-3xl font-bold mb-8">Checkout</h1>
           </motion.div>

           {step < 4 && (
              <div className="mb-8 flex justify-center items-center space-x-2 sm:space-x-4">
                {[1, 2, 3].map((s) => (
                  <React.Fragment key={s}>
                    <div className="flex flex-col items-center cursor-pointer" onClick={() => step > s ? goToStep(s) : null}>
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${
                          step >= s ? 'bg-primary border-primary text-primary-foreground' : 'border-muted text-muted-foreground'
                        } ${step > s ? 'hover:opacity-80 transition-opacity' : ''}`}
                      >
                        {step > s ? <CheckCircle className="h-4 w-4" /> : s}
                      </div>
                       <span className={`mt-1 text-xs ${step >= s ? 'font-semibold text-primary' : 'text-muted-foreground'}`}>
                        {s === 1 ? 'Shipping' : s === 2 ? 'Payment' : 'Review'}
                      </span>
                    </div>
                    {s < 3 && <Separator className={`w-12 sm:w-24 ${step > s ? 'bg-primary' : 'bg-muted'}`} />}
                  </React.Fragment>
                ))}
              </div>
            )}


          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="lg:col-span-2 glassmorphism">
              <AnimatePresence mode="wait">
                 {renderStepContent()}
              </AnimatePresence>
            </Card>

            {step < 4 && (
               <CheckoutOrderSummary
                 cartItems={cartItems}
                 subtotal={subtotal}
                 shippingCost={shippingCost}
                 taxes={taxes}
                 total={total}
               />
            )}
          </div>
        </div>
      );
    };

    export default CheckoutPage;
  