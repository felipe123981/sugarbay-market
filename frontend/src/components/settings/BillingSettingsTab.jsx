
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from "@/components/ui/checkbox";
import { Link as LinkIcon, Trash2, Edit, PlusCircle, CreditCard as CreditCardIcon, CheckCircle } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DialogClose
} from "@/components/ui/dialog";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { cn } from '@/lib/utils';

const initialPaymentMethods = [
  { id: 'pm_1', type: 'Visa', last4: '4242', expiry: '12/26', isDefault: true, cardHolder: 'Demo User' },
  { id: 'pm_2', type: 'Mastercard', last4: '5555', expiry: '08/25', isDefault: false, cardHolder: 'Demo User' },
];

const PaymentMethodForm = ({ method, onSave, onCancel }) => {
  const [cardHolder, setCardHolder] = useState(method?.cardHolder || '');
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState(method?.expiry || '');
  const [cvv, setCvv] = useState('');
  const [isDefault, setIsDefault] = useState(method?.isDefault || false);
  const { toast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!cardHolder || !expiry) {
      toast({ title: "Error", description: "Card holder and expiry are required.", variant: "destructive" });
      return;
    }
    if (!method && (!cardNumber || !cvv)) {
      toast({ title: "Error", description: "Card number and CVV are required for new cards.", variant: "destructive" });
      return;
    }

    const newMethodData = {
      id: method?.id || `pm_${Date.now()}`,
      type: cardNumber.startsWith('4') ? 'Visa' : cardNumber.startsWith('5') ? 'Mastercard' : 'Card',
      last4: cardNumber ? cardNumber.slice(-4) : method.last4,
      expiry,
      isDefault,
      cardHolder,
    };
    onSave(newMethodData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="cardHolder">Card Holder Name</Label>
        <Input id="cardHolder" value={cardHolder} onChange={(e) => setCardHolder(e.target.value)} placeholder="John Doe" required />
      </div>
      {!method && (
        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input id="cardNumber" value={cardNumber} onChange={(e) => setCardNumber(e.target.value)} placeholder="•••• •••• •••• ••••" required />
        </div>
      )}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="expiry">Expiry Date (MM/YY)</Label>
          <Input id="expiry" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" required />
        </div>
        {!method && (
          <div>
            <Label htmlFor="cvv">CVV</Label>
            <Input id="cvv" value={cvv} onChange={(e) => setCvv(e.target.value)} placeholder="•••" required />
          </div>
        )}
      </div>
      <div className="flex items-center space-x-2">
        <Checkbox id="isDefault" checked={isDefault} onCheckedChange={setIsDefault} />
        <Label htmlFor="isDefault" className="cursor-pointer">Set as default payment method</Label>
      </div>
      <DialogFooter>
        <DialogClose asChild>
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
        </DialogClose>
        <Button type="submit">{method ? 'Save Changes' : 'Add Method'}</Button>
      </DialogFooter>
    </form>
  );
};


const BillingSettingsTab = () => {
  const [paymentMethods, setPaymentMethods] = useState(initialPaymentMethods);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingMethod, setEditingMethod] = useState(null);
  const { toast } = useToast();

  const handleAddOrUpdateMethod = (methodData) => {
    setPaymentMethods(prevMethods => {
      const existingIndex = prevMethods.findIndex(pm => pm.id === methodData.id);
      let updatedMethods;
      if (existingIndex > -1) {
        updatedMethods = [...prevMethods];
        updatedMethods[existingIndex] = methodData;
      } else {
        updatedMethods = [...prevMethods, methodData];
      }

      if (methodData.isDefault) {
        updatedMethods = updatedMethods.map(pm => ({ ...pm, isDefault: pm.id === methodData.id }));
      }
      return updatedMethods;
    });
    toast({ title: "Success", description: `Payment method ${editingMethod ? 'updated' : 'added'}.` });
    setIsFormOpen(false);
    setEditingMethod(null);
  };

  const handleDeleteMethod = (idToDelete) => {
    const methodToDelete = paymentMethods.find(m => m.id === idToDelete);
    if (methodToDelete && methodToDelete.isDefault && paymentMethods.length > 1) {
      toast({ title: "Error", description: "Cannot delete the default payment method. Set another method as default first.", variant: "destructive" });
      return;
    }
    setPaymentMethods(paymentMethods.filter(method => method.id !== idToDelete));
    toast({ title: "Success", description: "Payment method removed.", variant: "destructive" });
  };

  const handleSetDefault = (idToSetDefault) => {
    setPaymentMethods(paymentMethods.map(method => ({
      ...method,
      isDefault: method.id === idToSetDefault,
    })));
    toast({ title: "Success", description: "Default payment method updated." });
  };

  const openEditForm = (method) => {
    setEditingMethod(method);
    setIsFormOpen(true);
  };

  const openAddForm = () => {
    setEditingMethod(null);
    setIsFormOpen(true);
  };


  return (
    <Card className="glassmorphism">
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Billing Information</CardTitle>
          <CardDescription>Manage your payment methods and view purchase history.</CardDescription>
        </div>
        <Dialog open={isFormOpen} onOpenChange={(isOpen) => {
          setIsFormOpen(isOpen);
          if (!isOpen) setEditingMethod(null);
        }}>
          <DialogTrigger asChild>
            <Button onClick={openAddForm}>
              <PlusCircle className="mr-2 h-4 w-4" /> Add Payment Method
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{editingMethod ? 'Edit Payment Method' : 'Add New Payment Method'}</DialogTitle>
              <DialogDescription>
                {editingMethod ? 'Update your card details.' : 'Enter your new card details below.'}
              </DialogDescription>
            </DialogHeader>
            <PaymentMethodForm
              method={editingMethod}
              onSave={handleAddOrUpdateMethod}
              onCancel={() => { setIsFormOpen(false); setEditingMethod(null); }}
            />
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">This section is for managing your personal payment methods for purchases.</p>
        <RouterLink to="/dashboard?tab=invoices">
          <Button variant="outline" className="mb-6">
            <LinkIcon className="mr-2 h-4 w-4" /> View My Invoices
          </Button>
        </RouterLink>

        {paymentMethods.length === 0 && (
          <p className="text-muted-foreground text-center py-4">No payment methods added yet.</p>
        )}

        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div key={method.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md bg-background/50 hover:shadow-md transition-shadow">
              <div className="flex items-center mb-2 sm:mb-0">
                <CreditCardIcon className="h-8 w-8 mr-4 text-primary" />
                <div>
                  <p className="font-medium flex items-center">
                    {method.type} ending in {method.last4}
                    {method.isDefault && <CheckCircle className="h-4 w-4 text-green-500 ml-2" />}
                  </p>
                  <p className="text-sm text-muted-foreground">Expires: {method.expiry}</p>
                  <p className="text-sm text-muted-foreground">Card Holder: {method.cardHolder}</p>
                </div>
              </div>
              <div className="flex space-x-2 mt-2 sm:mt-0 self-end sm:self-center">
                {!method.isDefault && (
                  <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)}>Set Default</Button>
                )}
                <Button variant="ghost" size="sm" onClick={() => openEditForm(method)}>
                  <Edit className="mr-1 h-4 w-4" /> Edit
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-1 h-4 w-4" /> Remove
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will remove the payment method ending in {method.last4}. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDeleteMethod(method.id)} className="bg-destructive hover:bg-destructive/90">
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BillingSettingsTab;
