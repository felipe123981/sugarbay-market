
    import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from '@/components/ui/button';
    import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from "@/components/ui/table";
    import { Badge } from "@/components/ui/badge";
    import { Truck, CheckCircle, XCircle, Clock, Loader2, Eye } from 'lucide-react';
    import { useToast } from "@/components/ui/use-toast";
    import { getProfileOrders, getCustomer } from '@/lib/api';

    const mapStatus = (backendStatus) => {
      // Backend uses 'Pending'/'Paid', frontend uses 'Processing'/'Shipped'/'Delivered'/'Cancelled'
      // Map backend status to frontend status
      switch (backendStatus) {
        case 'Pending': return 'Processing';
        case 'Paid': return 'Shipped';
        default: return backendStatus;
      }
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
        const fetchOrdersWithSellers = async () => {
          setLoadingOrders(true);
          try {
            const data = await getProfileOrders();

            // Collect all unique seller IDs
            const allSellerIds = [...new Set(
              data.flatMap(order => order.order_products?.map(op => op.seller_id) || [])
            )];

            // Fetch all seller details in parallel
            const sellersMap = {};
            await Promise.all(
              allSellerIds.map(async (sellerId) => {
                try {
                  const customer = await getCustomer(sellerId);
                  sellersMap[sellerId] = customer?.shop_name || customer?.name || 'Unknown Seller';
                } catch {
                  sellersMap[sellerId] = 'Unknown Seller';
                }
              })
            );

            // Transform backend format to frontend format
            const transformedOrders = data.map(order => ({
              id: order.id,
              customer: order.buyer?.name || 'Unknown',
              date: order.created_at,
              total: parseFloat(order.total) || 0,
              status: mapStatus(order.status),
              items: order.order_products?.map(op => ({
                name: op.product?.name || 'Product',
                quantity: op.quantity,
                sellerId: op.seller_id,
                sellerName: sellersMap[op.seller_id] || 'Unknown Seller',
              })) || [],
            }));
            setOrders(transformedOrders);
          } catch (error) {
            console.error("Failed to fetch seller orders:", error);
            toast({ title: "Error", description: "Could not load your orders.", variant: "destructive" });
          } finally {
            setLoadingOrders(false);
          }
        };

        fetchOrdersWithSellers();
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
                  <TableHead>Date</TableHead>
                  <TableHead>Sellers</TableHead>
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
                    <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {Array.from(new Set(order.items.map(item => item.sellerId))).map((sellerId, idx) => {
                          const item = order.items.find(i => i.sellerId === sellerId);
                          return (
                            <Link key={sellerId} to={`/seller/${sellerId}`} className="text-primary hover:underline text-sm">
                              {item?.sellerName || 'Unknown Seller'}
                            </Link>
                          );
                        })}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {order.items.map((item, idx) => (
                          <span key={idx} className="text-sm">{item.name} (x{item.quantity})</span>
                        ))}
                      </div>
                    </TableCell>
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
  