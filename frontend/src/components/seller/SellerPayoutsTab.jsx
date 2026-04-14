
    import React from 'react';
    import { Link } from 'react-router-dom';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from '@/components/ui/button';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
    import { Badge } from '@/components/ui/badge';
    import { Download, DollarSign, CheckCircle, Clock, Bitcoin, Landmark, PlusCircle } from 'lucide-react';
    import { useToast } from "@/components/ui/use-toast";

    const sampleInvoices = [
      { id: 'INV-2025-001', date: '2025-05-01', amount: 255.80, status: 'Paid', description: 'Weekly Payout (Apr 24 - Apr 30)' },
      { id: 'INV-2025-002', date: '2025-04-24', amount: 198.50, status: 'Paid', description: 'Weekly Payout (Apr 17 - Apr 23)' },
      { id: 'INV-2025-003', date: '2025-04-17', amount: 310.20, status: 'Paid', description: 'Weekly Payout (Apr 10 - Apr 16)' },
      { id: 'INV-2025-004', date: '2025-05-08', amount: 280.00, status: 'Pending', description: 'Weekly Payout (May 01 - May 07)' },
    ];

    const getStatusBadgeVariant = (status) => {
      if (status === 'Paid') return 'green';
      if (status === 'Pending') return 'yellow';
      return 'secondary';
    };

    const getStatusIcon = (status) => {
      if (status === 'Paid') return <CheckCircle className="h-4 w-4 text-green-500" />;
      if (status === 'Pending') return <Clock className="h-4 w-4 text-yellow-500" />;
      return null;
    };

    const SellerPayoutsTab = () => {
      const { toast } = useToast();
      const currentBalance = 85.30; // Placeholder

      const handleWithdraw = (method) => {
        if (currentBalance <= 0) {
          toast({ title: "Withdrawal Error", description: "Your balance is zero.", variant: "destructive" });
          return;
        }
        // Placeholder for withdrawal logic
        toast({ title: "Withdrawal Initiated", description: `Withdrawal of $${currentBalance.toFixed(2)} to ${method} is being processed.` });
      };

      return (
        <div className="space-y-6">
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Payout Summary & Actions</CardTitle>
              <CardDescription>Overview of your earnings, payout status, and withdrawal options.</CardDescription>
            </CardHeader>
            <CardContent className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 border rounded-lg bg-background/50">
                <h4 className="text-sm font-medium text-muted-foreground">Current Balance</h4>
                <p className="text-2xl font-bold text-primary">${currentBalance.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Awaiting next payout or withdraw</p>
              </div>
              <div className="p-4 border rounded-lg bg-background/50">
                <h4 className="text-sm font-medium text-muted-foreground">Next Auto Payout</h4>
                <p className="text-2xl font-bold">May 15, 2025</p>
                <p className="text-xs text-muted-foreground">Est. amount: $280.00</p>
              </div>
              <div className="p-4 border rounded-lg bg-background/50 flex flex-col justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">Withdraw Balance</h4>
                <div className="space-y-2 mt-2">
                    <Button size="sm" className="w-full" onClick={() => handleWithdraw('Bitcoin Wallet')} disabled={currentBalance <= 0}>
                        <Bitcoin className="mr-2 h-4 w-4" /> To Bitcoin
                    </Button>
                    <Button size="sm" className="w-full" onClick={() => handleWithdraw('Bank Account')} disabled={currentBalance <= 0}>
                        <Landmark className="mr-2 h-4 w-4" /> To Bank
                    </Button>
                </div>
              </div>
               <div className="p-4 border rounded-lg bg-background/50 flex flex-col justify-between">
                <h4 className="text-sm font-medium text-muted-foreground">Payout Settings</h4>
                 <Link to="/dashboard/billing/manage-payouts" className="w-full mt-2">
                    <Button variant="outline" className="w-full">
                        <PlusCircle className="mr-2 h-4 w-4" /> Manage Methods
                    </Button>
                 </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="glassmorphism">
            <CardHeader>
                <CardTitle>Payout History</CardTitle>
                <CardDescription>Record of all payouts made to your account.</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableCaption>{sampleInvoices.length === 0 ? 'No payout history yet.' : 'A list of your past payouts.'}</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice ID</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sampleInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell className="font-medium">{invoice.id}</TableCell>
                      <TableCell>{new Date(invoice.date).toLocaleDateString()}</TableCell>
                      <TableCell>{invoice.description}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(invoice.status)} className="flex items-center">
                          {getStatusIcon(invoice.status)}
                          <span className="ml-1">{invoice.status}</span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon">
                          <Download className="h-4 w-4" />
                          <span className="sr-only">Download Invoice</span>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      );
    };

    export default SellerPayoutsTab;
  