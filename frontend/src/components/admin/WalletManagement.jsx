import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Trash2, PlusCircle, Edit } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger
} from "@/components/ui/dialog";

// Placeholder data - this will be the source of truth for the component's lifecycle
const initialWallets = [
  { id: 1, address: 'bc1q...', label: 'Main Commission Wallet', percentage: 50 },
  { id: 2, address: '3J98...', label: 'Marketing Fund', percentage: 30 },
  { id: 3, address: '1A1z...', label: 'Reserve Wallet', percentage: 20 },
];

const WalletManagement = () => {
  const [wallets, setWallets] = useState(initialWallets); // Initialize directly with mock data
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentWallet, setCurrentWallet] = useState(null); // For editing or null for adding
  const [formData, setFormData] = useState({ address: '', label: '', percentage: '' });
  const { toast } = useToast();

  // Removed useEffect for loading from localStorage
  // Removed useEffect for saving to localStorage

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const resetAndCloseDialog = () => {
    setFormData({ address: '', label: '', percentage: '' });
    setCurrentWallet(null);
    setIsDialogOpen(false);
  };

  const handleOpenDialog = (walletToEdit = null) => {
    if (walletToEdit) {
      setCurrentWallet(walletToEdit);
      setFormData({ 
        address: walletToEdit.address, 
        label: walletToEdit.label, 
        percentage: walletToEdit.percentage.toString() 
      });
    } else {
      setCurrentWallet(null);
      setFormData({ address: '', label: '', percentage: '' });
    }
    setIsDialogOpen(true);
  };

  const handleSubmitWallet = (e) => {
    e.preventDefault();
    if (!formData.address || !formData.label || !formData.percentage) {
      toast({ title: "Error", description: "Please fill all wallet fields.", variant: "destructive" });
      return;
    }
    const percentage = parseFloat(formData.percentage);
    if (isNaN(percentage) || percentage <= 0 || percentage > 100) {
       toast({ title: "Error", description: "Percentage must be a number between 0.1 and 100.", variant: "destructive" });
       return;
    }

    let updatedWallets;
    if (currentWallet) { // Editing existing wallet
      updatedWallets = wallets.map(w => 
        w.id === currentWallet.id ? { ...w, address: formData.address, label: formData.label, percentage } : w
      );
      toast({ title: "Success", description: "Wallet updated." });
    } else { // Adding new wallet
      const newWallet = {
        id: Date.now(), // Ensure unique ID
        address: formData.address,
        label: formData.label,
        percentage: percentage,
      };
      updatedWallets = [...wallets, newWallet];
      toast({ title: "Success", description: "Commission wallet added." });
    }
    setWallets(updatedWallets);
    resetAndCloseDialog();
  };

  const handleDeleteWallet = (idToDelete) => {
    setWallets(wallets.filter(wallet => wallet.id !== idToDelete));
    toast({ title: "Success", description: "Wallet removed.", variant: "destructive" });
  };
  
  return (
    <div className="space-y-6">
      <Dialog open={isDialogOpen} onOpenChange={(isOpen) => {
        if (!isOpen) {
            resetAndCloseDialog();
        } else {
            // If we are opening and currentWallet is not set, it means "Add New"
            if (!currentWallet) {
                 setFormData({ address: '', label: '', percentage: '' });
            }
            setIsDialogOpen(true);
        }
      }}>
        <DialogTrigger asChild>
          <Button onClick={() => handleOpenDialog()}>
            <PlusCircle className="mr-2 h-4 w-4" /> Add New Wallet
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{currentWallet ? 'Edit' : 'Add New'} Commission Wallet</DialogTitle>
            <DialogDescription>
              {currentWallet ? 'Update the details for this wallet.' : 'Configure where commissions are sent.'}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitWallet} className="space-y-4 py-4">
             <div>
               <Label htmlFor="wallet-label-modal" className="text-right">Label</Label>
               <Input id="wallet-label-modal" name="label" placeholder="e.g., Main Payout" value={formData.label} onChange={handleInputChange} required className="mt-1"/>
             </div>
             <div>
               <Label htmlFor="wallet-address-modal" className="text-right">Bitcoin Address</Label>
               <Input id="wallet-address-modal" name="address" placeholder="bc1q..." value={formData.address} onChange={handleInputChange} required className="mt-1"/>
             </div>
             <div>
               <Label htmlFor="wallet-percentage-modal" className="text-right">Percentage (%)</Label>
               <Input id="wallet-percentage-modal" name="percentage" type="number" min="0.1" max="100" step="0.1" placeholder="e.g., 50" value={formData.percentage} onChange={handleInputChange} required className="mt-1"/>
             </div>
             <DialogFooter className="pt-4">
                <Button type="button" variant="outline" onClick={resetAndCloseDialog}>Cancel</Button>
                <Button type="submit">{currentWallet ? 'Save Changes' : 'Add Wallet'}</Button>
             </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Current Commission Wallets</CardTitle>
           <CardDescription>Manage existing commission destinations.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 max-h-[calc(100vh-24rem)] overflow-y-auto pr-2"> {/* Adjusted height slightly */}
            {wallets.length === 0 && <p className="text-muted-foreground text-sm text-center py-4">No commission wallets configured yet.</p>}
            {wallets.map((wallet) => (
              <div key={wallet.id} className="flex items-center justify-between p-3 border rounded-lg bg-card hover:shadow-md transition-shadow">
                <div className="flex-1 overflow-hidden mr-2">
                  <p className="font-medium text-sm">{wallet.label} ({wallet.percentage}%)</p>
                  <p className="text-xs text-muted-foreground truncate" title={wallet.address}>{wallet.address}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => handleOpenDialog(wallet)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                      <AlertDialogTrigger asChild>
                         <Button variant="destructive" size="icon" className="h-8 w-8">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the wallet configuration for "{wallet.label}".
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteWallet(wallet.id)} className="bg-destructive hover:bg-destructive/90">
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                </div>
              </div>
            ))}
          </div>
           <div className="mt-4 pt-4 border-t">
              <p className="text-sm font-medium">Total Allocated: {wallets.reduce((sum, w) => sum + parseFloat(w.percentage || 0), 0).toFixed(1)}%</p>
           </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WalletManagement;
