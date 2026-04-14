
    import React, { useState } from 'react';
    import { Link } from 'react-router-dom';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from '@/components/ui/button';
    import { Input } from '@/components/ui/input';
    import { Label } from '@/components/ui/label';
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { Bitcoin, Landmark, Trash2, PlusCircle, ArrowLeft } from 'lucide-react';
    import { useToast } from "@/components/ui/use-toast";
    import { motion } from 'framer-motion';
    import {
      AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
      AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
    } from "@/components/ui/alert-dialog";

    const initialPayoutMethods = [
      { id: 'pm_1', type: 'bitcoin', label: 'Primary BTC Wallet', details: 'bc1q...', isDefault: true },
      { id: 'pm_2', type: 'bank', label: 'Savings Account', details: '**** **** **** 1234', isDefault: false },
    ];

    const PayoutMethodIcon = ({ type }) => {
      if (type === 'bitcoin') return <Bitcoin className="h-5 w-5 mr-2 text-orange-500" />;
      if (type === 'bank') return <Landmark className="h-5 w-5 mr-2 text-blue-500" />;
      return null;
    };

    const ManagePayoutMethodsPage = () => {
      const [payoutMethods, setPayoutMethods] = useState(initialPayoutMethods);
      const [showAddForm, setShowAddForm] = useState(false);
      const [newMethodType, setNewMethodType] = useState('bitcoin');
      const [newMethodLabel, setNewMethodLabel] = useState('');
      const [newMethodDetails, setNewMethodDetails] = useState(''); // For BTC address or Account Number
      const [newMethodBankName, setNewMethodBankName] = useState('');
      const [newMethodRoutingNumber, setNewMethodRoutingNumber] = useState('');
      const { toast } = useToast();

      const handleAddMethod = (e) => {
        e.preventDefault();
        if (!newMethodLabel || !newMethodDetails) {
          toast({ title: "Error", description: "Please fill all required fields.", variant: "destructive" });
          return;
        }
        if (newMethodType === 'bank' && (!newMethodBankName || !newMethodRoutingNumber)) {
          toast({ title: "Error", description: "Bank name and routing number are required for bank accounts.", variant: "destructive" });
          return;
        }

        const newMethod = {
          id: `pm_${Date.now()}`,
          type: newMethodType,
          label: newMethodLabel,
          details: newMethodType === 'bitcoin' ? newMethodDetails : `**** **** **** ${newMethodDetails.slice(-4)}`,
          bankName: newMethodType === 'bank' ? newMethodBankName : undefined,
          routingNumber: newMethodType === 'bank' ? newMethodRoutingNumber : undefined,
          isDefault: payoutMethods.length === 0, // Make first added method default
        };
        setPayoutMethods([...payoutMethods, newMethod]);
        setShowAddForm(false);
        setNewMethodLabel('');
        setNewMethodDetails('');
        setNewMethodBankName('');
        setNewMethodRoutingNumber('');
        toast({ title: "Success", description: "Payout method added." });
      };

      const handleDeleteMethod = (idToDelete) => {
        const methodToDelete = payoutMethods.find(m => m.id === idToDelete);
        if (methodToDelete && methodToDelete.isDefault && payoutMethods.length > 1) {
          toast({ title: "Error", description: "Cannot delete the default payout method. Set another method as default first.", variant: "destructive" });
          return;
        }
        setPayoutMethods(payoutMethods.filter(method => method.id !== idToDelete));
        toast({ title: "Success", description: "Payout method removed.", variant: "destructive" });
      };

      const handleSetDefault = (idToSetDefault) => {
        setPayoutMethods(payoutMethods.map(method => ({
          ...method,
          isDefault: method.id === idToSetDefault,
        })));
        toast({ title: "Success", description: "Default payout method updated." });
      };

      return (
        <div className="container mx-auto px-4 py-12 flex-grow">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Link to="/dashboard?tab=billing" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Billing
            </Link>
            <h1 className="text-3xl font-bold">Manage Payout Methods</h1>
            <p className="text-muted-foreground">Add, remove, or update your preferred ways to receive payouts.</p>
          </motion.div>

          {!showAddForm && (
            <Button onClick={() => setShowAddForm(true)} className="mb-6">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Payout Method
            </Button>
          )}

          {showAddForm && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
              <Card className="mb-8 glassmorphism">
                <CardHeader>
                  <CardTitle>Add New Payout Method</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleAddMethod} className="space-y-4">
                    <div>
                      <Label htmlFor="method-type">Payout Type</Label>
                      <Select value={newMethodType} onValueChange={setNewMethodType}>
                        <SelectTrigger id="method-type">
                          <SelectValue placeholder="Select payout type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bitcoin">Bitcoin Wallet</SelectItem>
                          <SelectItem value="bank">Bank Account</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="method-label">Label</Label>
                      <Input id="method-label" placeholder="e.g., My Primary Wallet" value={newMethodLabel} onChange={(e) => setNewMethodLabel(e.target.value)} required />
                    </div>
                    {newMethodType === 'bitcoin' && (
                      <div>
                        <Label htmlFor="btc-address">Bitcoin Address</Label>
                        <Input id="btc-address" placeholder="Enter your Bitcoin address" value={newMethodDetails} onChange={(e) => setNewMethodDetails(e.target.value)} required />
                      </div>
                    )}
                    {newMethodType === 'bank' && (
                      <>
                        <div>
                          <Label htmlFor="bank-name">Bank Name</Label>
                          <Input id="bank-name" placeholder="e.g., Chase Bank" value={newMethodBankName} onChange={(e) => setNewMethodBankName(e.target.value)} required />
                        </div>
                        <div>
                          <Label htmlFor="account-number">Account Number</Label>
                          <Input id="account-number" placeholder="Enter account number" value={newMethodDetails} onChange={(e) => setNewMethodDetails(e.target.value)} required />
                        </div>
                        <div>
                          <Label htmlFor="routing-number">Routing Number</Label>
                          <Input id="routing-number" placeholder="Enter routing number" value={newMethodRoutingNumber} onChange={(e) => setNewMethodRoutingNumber(e.target.value)} required />
                        </div>
                      </>
                    )}
                    <div className="flex space-x-2">
                      <Button type="submit">Add Method</Button>
                      <Button variant="outline" onClick={() => setShowAddForm(false)}>Cancel</Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Your Payout Methods</CardTitle>
              <CardDescription>List of your configured payout destinations.</CardDescription>
            </CardHeader>
            <CardContent>
              {payoutMethods.length === 0 && <p className="text-muted-foreground text-sm">No payout methods configured yet.</p>}
              <div className="space-y-4">
                {payoutMethods.map((method) => (
                  <div key={method.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 border rounded-md bg-background/50 hover:shadow-md transition-shadow">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <PayoutMethodIcon type={method.type} />
                      <div>
                        <p className="font-medium">{method.label} {method.isDefault && <span className="text-xs text-primary ml-1">(Default)</span>}</p>
                        <p className="text-sm text-muted-foreground">{method.details}</p>
                        {method.type === 'bank' && method.bankName && <p className="text-xs text-muted-foreground">{method.bankName}</p>}
                      </div>
                    </div>
                    <div className="flex space-x-2 mt-2 sm:mt-0">
                      {!method.isDefault && (
                        <Button variant="outline" size="sm" onClick={() => handleSetDefault(method.id)}>Set as Default</Button>
                      )}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="sm">
                            <Trash2 className="mr-1 h-4 w-4 sm:mr-0" /> <span className="hidden sm:inline">Remove</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently remove the payout method "{method.label}".
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
        </div>
      );
    };

    export default ManagePayoutMethodsPage;
  