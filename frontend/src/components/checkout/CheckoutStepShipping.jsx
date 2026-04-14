
import React from 'react';
import { motion } from 'framer-motion';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from '@/components/ui/button';
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from '@/context/AuthContext';
import { Link } from 'react-router-dom';

    const CheckoutStepShipping = ({ shippingInfo, setShippingInfo, onNext }) => {
      const { toast } = useToast();
      const { user: currentUser, isAuthenticated } = useAuth();

      const handleInputChange = (e) => {
        const { name, value } = e.target;
        setShippingInfo(prev => ({ ...prev, [name]: value }));
      };

      const handleNext = () => {
        if (!shippingInfo.name || !shippingInfo.address || !shippingInfo.city || !shippingInfo.zip || !shippingInfo.country) {
          toast({ title: "Missing Information", description: "Please fill in all shipping details.", variant: "destructive" });
          return;
        }
        onNext();
      }

      return (
        <motion.div key="step1" initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
          <CardHeader>
            <CardTitle>Shipping Details</CardTitle>
            <CardDescription>Enter the address where you want to receive your order.</CardDescription>
          </CardHeader>
          
          {!isAuthenticated && (
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-600 mb-3">Already have an account? <Link to="/login" className="text-primary hover:underline">Log in</Link> to use your saved address information.</p>
            </div>
          )}
          
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" name="name" value={shippingInfo.name} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input id="country" name="country" value={shippingInfo.country} onChange={handleInputChange} required />
              </div>
            </div>
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input id="address" name="address" value={shippingInfo.address} onChange={handleInputChange} required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input id="city" name="city" value={shippingInfo.city} onChange={handleInputChange} required />
              </div>
              <div>
                <Label htmlFor="state">State / Province</Label>
                <Input id="state" name="state" value={shippingInfo.state} onChange={handleInputChange} />
              </div>
              <div>
                <Label htmlFor="zip">ZIP / Postal Code</Label>
                <Input id="zip" name="zip" value={shippingInfo.zip} onChange={handleInputChange} required />
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button onClick={handleNext}>Continue to Payment</Button>
          </CardFooter>
        </motion.div>
      );
    };

    export default CheckoutStepShipping;
  