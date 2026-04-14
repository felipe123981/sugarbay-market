
    import React from 'react';
    import { motion } from 'framer-motion';
    import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
    import { Input } from "@/components/ui/input";
    import { Label } from "@/components/ui/label";
    import { Button } from '@/components/ui/button';
    import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
    import { CreditCard, Info } from 'lucide-react';
    import { useToast } from "@/components/ui/use-toast";

    const CheckoutStepPayment = ({ paymentMethod, setPaymentMethod, onNext, onPrevious }) => {
      const { toast } = useToast();

      const handleNext = () => {
        if (!paymentMethod) {
           toast({ title: "Missing Information", description: "Please select a payment method.", variant: "destructive" });
           return;
        }
        onNext();
      }

      return (
        <motion.div key="step2" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
          <CardHeader>
            <CardTitle>Payment Method</CardTitle>
            <CardDescription>Select how you'd like to pay.</CardDescription>
          </CardHeader>
          <CardContent>
            <RadioGroup defaultValue={paymentMethod} onValueChange={setPaymentMethod} className="space-y-4">
              <Label
                htmlFor="pay-card"
                className={`flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground ${paymentMethod === 'card' ? 'border-primary' : ''}`}
              >
                <div className="flex items-center space-x-3">
                   <RadioGroupItem value="card" id="pay-card" />
                   <span className="font-medium">Credit/Debit Card</span>
                 </div>
                 <CreditCard className="h-5 w-5 text-muted-foreground" />
              </Label>
               <Label
                htmlFor="pay-paypal"
                className={`flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground ${paymentMethod === 'paypal' ? 'border-primary' : ''}`}
              >
                 <div className="flex items-center space-x-3">
                   <RadioGroupItem value="paypal" id="pay-paypal" />
                   <span className="font-medium">PayPal</span>
                 </div>
                 <Info className="h-5 w-5 text-muted-foreground" />
              </Label>
               <Label
                 htmlFor="pay-crypto"
                 className={`flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground ${paymentMethod === 'crypto' ? 'border-primary' : ''}`}
              >
                 <div className="flex items-center space-x-3">
                   <RadioGroupItem value="crypto" id="pay-crypto" />
                   <span className="font-medium">Cryptocurrency (BTC, ETH, etc.)</span>
                 </div>
                 <Info className="h-5 w-5 text-muted-foreground" />
              </Label>
            </RadioGroup>
             {paymentMethod === 'card' && (
               <div className="mt-6 space-y-4 border-t pt-4">
                 <p className="text-sm font-medium">Enter Card Details (Simulation)</p>
                 <Input placeholder="Card Number" />
                 <div className="grid grid-cols-2 gap-4">
                    <Input placeholder="MM/YY" />
                    <Input placeholder="CVC" />
                 </div>
               </div>
             )}
             {paymentMethod === 'paypal' && (
                <div className="mt-6 border-t pt-4">
                  <Button variant="outline" className="w-full">Proceed with PayPal (Simulation)</Button>
                </div>
             )}
              {paymentMethod === 'crypto' && (
                <div className="mt-6 border-t pt-4 space-y-2">
                   <p className="text-sm font-medium">Crypto Payment (Simulation)</p>
                   <p className="text-xs text-muted-foreground">Select wallet and confirm transaction externally.</p>
                   <Button variant="outline" className="w-full">Connect Wallet (Simulation)</Button>
                </div>
             )}
          </CardContent>
          <CardFooter className="justify-between">
            <Button variant="outline" onClick={onPrevious}>Back to Shipping</Button>
            <Button onClick={handleNext}>Review Order</Button>
          </CardFooter>
        </motion.div>
      );
    };

    export default CheckoutStepPayment;
  