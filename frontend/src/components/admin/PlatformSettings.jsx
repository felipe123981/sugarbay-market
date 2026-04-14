
    import React, { useState } from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from "@/components/ui/use-toast";

    const PlatformSettings = () => {
      const [platformSettings, setPlatformSettings] = useState({
        baseCommission: 9,
        packagingFee: 2.50,
        // Add other settings as needed
      });
      const { toast } = useToast();

      const handleSettingsChange = (e) => {
        const { name, value } = e.target;
        setPlatformSettings(prev => ({ ...prev, [name]: value }));
      };

      const handleSaveSettings = () => {
         // Simulate saving settings
         console.log("Saving settings:", platformSettings);
         toast({ title: "Settings Saved", description: "Platform settings updated successfully." });
      };

      return (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>Configure global settings like commission rates, fees, API keys, etc.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="baseCommission">Base Commission Rate (%)</Label>
                  <Input id="baseCommission" name="baseCommission" type="number" min="0" max="100" step="0.1" value={platformSettings.baseCommission} onChange={handleSettingsChange} />
                   <p className="text-xs text-muted-foreground mt-1">Percentage of the product price taken as commission (e.g., 9 for 9%).</p>
                </div>
                <div>
                  <Label htmlFor="packagingFee">Fixed Packaging Fee ($)</Label>
                  <Input id="packagingFee" name="packagingFee" type="number" min="0" step="0.01" value={platformSettings.packagingFee} onChange={handleSettingsChange} />
                  <p className="text-xs text-muted-foreground mt-1">A fixed fee added to the commission for packaging (e.g., 2.50).</p>
                </div>
             </div>
              <div>
                <Label>Delivery Fee Source (FedEx API - Placeholder)</Label>
                 <p className="text-sm text-muted-foreground">FedEx API Key and integration details would go here. The delivery fee will be added to the commission.</p>
                  <Input placeholder="FedEx API Key (Placeholder)" disabled className="mt-1" />
              </div>
               <div>
                <Label>Payment Gateway Keys (Placeholder)</Label>
                 <p className="text-sm text-muted-foreground">Stripe, PayPal, Crypto gateway API keys and settings.</p>
                  <Input placeholder="Stripe Publishable Key (Placeholder)" disabled className="mt-1" />
                  <Input placeholder="PayPal Client ID (Placeholder)" disabled className="mt-1" />
              </div>
               {/* Add more settings fields as needed */}
          </CardContent>
           <CardFooter>
              <Button onClick={handleSaveSettings}>Save Settings</Button>
           </CardFooter>
        </Card>
      );
    };

    export default PlatformSettings;
  