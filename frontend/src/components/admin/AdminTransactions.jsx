
    import React, { useState } from 'react';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Input } from '@/components/ui/input';
    import { Search, ArrowRightLeft, User, ShoppingBag } from 'lucide-react';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
    import { Badge } from "@/components/ui/badge";
    import { Button } from '@/components/ui/button';

    const initialTransactions = [
      { id: 'txn_1', date: '2025-06-01 10:15', type: 'Sale', amount: 45.00, fromUser: 'Alice M.', toUser: 'Artisan Woodworks', product: 'Wooden Bowl', status: 'Completed' },
      { id: 'txn_2', date: '2025-06-01 14:30', type: 'Commission', amount: 4.50, fromUser: 'Artisan Woodworks', toUser: 'Platform', product: 'Wooden Bowl', status: 'Completed' },
      { id: 'txn_3', date: '2025-06-02 09:00', type: 'Sale', amount: 120.00, fromUser: 'Bob K.', toUser: 'Retro Finds', product: 'Leather Jacket', status: 'Completed' },
      { id: 'txn_4', date: '2025-06-02 11:00', type: 'Commission', amount: 12.00, fromUser: 'Retro Finds', toUser: 'Platform', product: 'Leather Jacket', status: 'Completed' },
      { id: 'txn_5', date: '2025-06-03 16:20', type: 'Refund', amount: -30.00, fromUser: 'Pottery Place', toUser: 'Charlie P.', product: 'Mug Set', status: 'Completed' },
      { id: 'txn_6', date: '2025-06-03 16:25', type: 'Commission Reversal', amount: -3.00, fromUser: 'Platform', toUser: 'Pottery Place', product: 'Mug Set', status: 'Completed' },
      { id: 'txn_7', date: '2025-06-04 08:00', type: 'Sale', amount: 250.00, fromUser: 'David L.', toUser: 'Modern Art', product: 'Canvas Painting', status: 'Pending' },
    ];

    const getTypeBadgeVariant = (type) => {
      if (type.includes('Sale')) return 'green';
      if (type.includes('Commission')) return 'blue';
      if (type.includes('Refund') || type.includes('Reversal')) return 'orange';
      return 'secondary';
    };

    const getStatusBadgeVariant = (status) => {
      if (status === 'Completed') return 'default';
      if (status === 'Pending') return 'yellow';
      if (status === 'Failed') return 'destructive';
      return 'secondary';
    };

    const AdminTransactions = () => {
      const [transactions, setTransactions] = useState(initialTransactions);
      const [searchTerm, setSearchTerm] = useState('');

      const filteredTransactions = transactions.filter(txn =>
        txn.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.fromUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.toUser.toLowerCase().includes(searchTerm.toLowerCase()) ||
        txn.product.toLowerCase().includes(searchTerm.toLowerCase())
      );

      return (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Platform Transactions</CardTitle>
            <CardDescription>View all financial transactions occurring on the platform.</CardDescription>
            <div className="relative mt-4">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search transactions (ID, User, Product)..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>{filteredTransactions.length === 0 ? 'No transactions found.' : 'A list of platform transactions.'}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>From</TableHead>
                  <TableHead>To</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((txn) => (
                  <TableRow key={txn.id}>
                    <TableCell className="font-mono text-xs">{txn.id}</TableCell>
                    <TableCell>{new Date(txn.date).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(txn.type)}>{txn.type}</Badge>
                    </TableCell>
                    <TableCell className={`font-semibold ${txn.amount < 0 ? 'text-destructive' : 'text-green-600'}`}>
                      ${Math.abs(txn.amount).toFixed(2)}
                    </TableCell>
                    <TableCell className="flex items-center">
                      <User className="h-3 w-3 mr-1 text-muted-foreground" /> {txn.fromUser}
                    </TableCell>
                    <TableCell className="flex items-center">
                      <User className="h-3 w-3 mr-1 text-muted-foreground" /> {txn.toUser}
                    </TableCell>
                    <TableCell className="flex items-center">
                      <ShoppingBag className="h-3 w-3 mr-1 text-muted-foreground" /> {txn.product}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(txn.status)}>{txn.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      );
    };

    export default AdminTransactions;
  