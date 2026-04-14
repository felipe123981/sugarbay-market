
    import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from '@/components/ui/button';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
    import { Badge } from "@/components/ui/badge";
    import { Truck, CheckCircle, XCircle, Clock, Loader2, Eye } from 'lucide-react';
    import { useToast } from "@/components/ui/use-toast";

    const fetchSellerOrders = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      return [
        { id: 'ORD-001', customer: 'Alice M.', date: '2025-05-01', total: 45.00, status: 'Shipped', items: [{ name: 'Handcrafted Wooden Bowl', quantity: 1 }] },
        { id: 'ORD-004', customer: 'Bob K.', date: '2025-05-03', total: 55.00, status: 'Processing', items: [{ name: 'Wooden Cutting Board', quantity: 1 }] },
        { id: 'ORD-005', customer: 'Charlie P.', date: '2025-05-04', total: 30.00, status: 'Delivered', items: [{ name: 'Ceramic Mug Set', quantity: 1 }] },
        { id: 'ORD-006', customer: 'David L.', date: '2025-05-05', total: 90.00, status: 'Cancelled', items: [{ name: 'Handcrafted Wooden Bowl', quantity: 2 }] },
      ];
    };

    const getStatusBadgeVariant = (status) => {
      switch (status) {
        case 'Shipped': return 'blue';
        case 'Processing': return 'yellow';
        case 'Delivered': return 'green';
        case 'Cancelled': return 'destructive';
        default: return 'secondary';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'Shipped': return <Truck className="h-4 w-4 text-blue-500" />;
        case 'Processing': return <Clock className="h-4 w-4 text-yellow-500" />;
        case 'Delivered': return <CheckCircle className="h-4 w-4 text-green-500" />;
        case 'Cancelled': return <XCircle className="h-4 w-4 text-red-500" />;
        default: return null;
      }
    };

    const SellerOrdersTab = () => {
      const [orders, setOrders] = useState([]);
      const [loadingOrders, setLoadingOrders] = useState(true);
      const { toast } = useToast();

      useEffect(() => {
        setLoadingOrders(true);
        fetchSellerOrders().then(data => {
          setOrders(data);
          setLoadingOrders(false);
        }).catch(error => {
          console.error("Failed to fetch seller orders:", error);
          toast({ title: "Error", description: "Could not load your orders.", variant: "destructive" });
          setLoadingOrders(false);
        });
      }, [toast]);

      if (loadingOrders) {
        return (
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
              <CardDescription>Loading incoming orders...</CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </CardContent>
          </Card>
        );
      }

      return (
        <Card className="glassmorphism">
          <CardHeader>
            <CardTitle>Your Orders</CardTitle>
            <CardDescription>View and manage incoming orders.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableCaption>{orders.length === 0 ? 'You have no orders yet.' : 'A list of your recent orders.'}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead>Total</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.id}</TableCell>
                    <TableCell>{order.customer}</TableCell>
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>{order.items.map(item => `${item.name} (x${item.quantity})`).join(', ')}</TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)} className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-1">{order.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Link to={`/dashboard/order/${order.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" /> View Details
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      );
    };

    export default SellerOrdersTab;
  