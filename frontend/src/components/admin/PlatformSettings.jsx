
    import React, { useState, useEffect } from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { useToast } from "@/components/ui/use-toast";
    import { getPlatformSettings, updatePlatformSettings } from '@/lib/api';
    import { Loader2 } from 'lucide-react';

    const PlatformSettings = () => {
      const [platformSettings, setPlatformSettings] = useState({
        tax_rate: 0.10,
        profit_margin: 0.20,
        packaging_cost: 2.50,
        shipping_cost: 8.50
      });
      const [isLoading, setIsLoading] = useState(true);
      const [isSaving, setIsSaving] = useState(false);
      const { toast } = useToast();

      useEffect(() => {
        const loadSettings = async () => {
          try {
            const data = await getPlatformSettings();
            setPlatformSettings({
              tax_rate: Number(data.tax_rate),
              profit_margin: Number(data.profit_margin),
              packaging_cost: Number(data.packaging_cost),
              shipping_cost: Number(data.shipping_cost)
            });
          } catch (error) {
            console.error("Failed to load settings:", error);
            toast({
              title: "Error",
              description: "Failed to load platform settings.",
              variant: "destructive"
            });
          } finally {
            setIsLoading(false);
          }
        };

        loadSettings();
      }, [toast]);

      const handleSettingsChange = (e) => {
        const { name, value } = e.target;
        setPlatformSettings(prev => ({ ...prev, [name]: value }));
      };

      const handleSaveSettings = async () => {
         setIsSaving(true);
         try {
           const payload = {
             tax_rate: parseFloat(platformSettings.tax_rate),
             profit_margin: parseFloat(platformSettings.profit_margin),
             packaging_cost: parseFloat(platformSettings.packaging_cost),
             shipping_cost: parseFloat(platformSettings.shipping_cost)
           };
           
           await updatePlatformSettings(payload);
           
           toast({ 
             title: "Settings Saved", 
             description: "Platform settings updated successfully." 
           });
         } catch (error) {
           console.error("Failed to save settings:", error);
           toast({
             title: "Error",
             description: error.message || "Failed to update platform settings.",
             variant: "destructive"
           });
         } finally {
           setIsSaving(false);
         }
      };

      if (isLoading) {
        return (
          <div className="flex items-center justify-center p-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        );
      }

      return (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Platform Settings</CardTitle>
            <CardDescription>Configure global markup parameters: Final Price = (Product Cost + Packaging + Shipping) / (1 - (Tax Rate + Profit Margin))</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="tax_rate">Tax Rate (decimal, e.g. 0.1 for 10%)</Label>
                  <Input id="tax_rate" name="tax_rate" type="number" min="0" max="1" step="0.001" value={platformSettings.tax_rate} onChange={handleSettingsChange} />
                   <p className="text-xs text-muted-foreground mt-1">Sum of all taxes (e.g., Simples Nacional + Bitcoin gateway fee).</p>
                </div>
                <div>
                  <Label htmlFor="profit_margin">Desired Profit Margin (decimal, e.g. 0.2 for 20%)</Label>
                  <Input id="profit_margin" name="profit_margin" type="number" min="0" max="1" step="0.001" value={platformSettings.profit_margin} onChange={handleSettingsChange} />
                  <p className="text-xs text-muted-foreground mt-1">The percentage of the total that remains as profit.</p>
                </div>
                <div>
                  <Label htmlFor="packaging_cost">Fixed Packaging Cost ($)</Label>
                  <Input id="packaging_cost" name="packaging_cost" type="number" min="0" step="0.01" value={platformSettings.packaging_cost} onChange={handleSettingsChange} />
                  <p className="text-xs text-muted-foreground mt-1">Fixed cost added per seller in the order for packaging.</p>
                </div>
                <div>
                  <Label htmlFor="shipping_cost">Fixed FedEx Shipping Cost ($)</Label>
                  <Input id="shipping_cost" name="shipping_cost" type="number" min="0" step="0.01" value={platformSettings.shipping_cost} onChange={handleSettingsChange} />
                  <p className="text-xs text-muted-foreground mt-1">Fixed shipping cost added per seller in the order.</p>
                </div>
             </div>
          </CardContent>
           <CardFooter>
              <Button onClick={handleSaveSettings} disabled={isSaving}>
                {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Settings
              </Button>
           </CardFooter>
        </Card>
      );
    };

    export default PlatformSettings;
  