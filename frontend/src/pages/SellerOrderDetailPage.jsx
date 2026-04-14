
    import React, { useState, useEffect } from 'react';
    import { useParams, Link, useNavigate } from 'react-router-dom';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from "@/components/ui/button";
    import { Separator } from "@/components/ui/separator";
    import { Loader2, AlertCircle, ArrowLeft, Package, User, Calendar, DollarSign, Edit, Truck } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { Badge } from "@/components/ui/badge";
    import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
    import { useToast } from "@/components/ui/use-toast";

    const fetchSellerOrderDetails = async (orderId) => {
      console.log(`Fetching details for seller order ID: ${orderId}`);
      await new Promise(resolve => setTimeout(resolve, 700));

      const orders = [
        { 
          id: 'ORD-001', 
          customer: 'Alice M.', 
          customerEmail: 'alice.m@example.com',
          shippingAddress: '123 Main St, Anytown, USA 12345',
          date: '2025-05-01', 
          total: 45.00, 
          status: 'Shipped', 
          items: [
            { id: 'prod_wood_bowl', name: 'Handcrafted Wooden Bowl', quantity: 1, price: 45.00, sku: 'WB-001' }
          ],
          shippingMethod: 'Standard Shipping',
          trackingNumber: '1Z999AA10123456789',
          notes: 'Customer requested gift wrapping.'
        },
        { 
          id: 'ORD-004', 
          customer: 'Bob K.',
          customerEmail: 'bob.k@example.com',
          shippingAddress: '456 Oak Ave, Otherville, USA 67890',
          date: '2025-05-03', 
          total: 55.00, 
          status: 'Processing', 
          items: [
            { id: 'prod_cut_board', name: 'Wooden Cutting Board', quantity: 1, price: 55.00, sku: 'CB-003' }
          ],
          shippingMethod: 'Express Shipping',
          trackingNumber: null,
          notes: ''
        },
      ];
      return orders.find(o => o.id === orderId) || { id: orderId, status: 'Not Found' };
    };

    const statusOptions = ["Processing", "Shipped", "Delivered", "Cancelled"];

    const SellerOrderDetailPage = () => {
      const { orderId } = useParams();
      const navigate = useNavigate();
      const { toast } = useToast();
      const [orderDetails, setOrderDetails] = useState(null);
      const [loading, setLoading] = useState(true);
      const [isEditingStatus, setIsEditingStatus] = useState(false);
      const [currentStatus, setCurrentStatus] = useState('');
      const [newTrackingNumber, setNewTrackingNumber] = useState('');


      useEffect(() => {
        setLoading(true);
        fetchSellerOrderDetails(orderId)
          .then(data => {
            setOrderDetails(data);
            setCurrentStatus(data.status);
            setNewTrackingNumber(data.trackingNumber || '');
            setLoading(false);
          })
          .catch(error => {
            console.error("Failed to fetch order details:", error);
            setOrderDetails({ id: orderId, status: 'Error' });
            setLoading(false);
          });
      }, [orderId]);

      const handleStatusUpdate = () => {
        console.log(`Updating status for ${orderId} to ${currentStatus} with tracking ${newTrackingNumber}`);
        
        setOrderDetails(prev => ({...prev, status: currentStatus, trackingNumber: newTrackingNumber}));
        toast({title: "Order Updated", description: `Order ${orderId} status changed to ${currentStatus}.`});
        setIsEditingStatus(false);
      }

      if (loading) {
        return (
          <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
          </div>
        );
      }

      if (!orderDetails || orderDetails.status === 'Not Found') {
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
            <p className="text-muted-foreground mb-6">Could not find details for order ID: {orderId}.</p>
            <Button variant="outline" onClick={() => navigate('/dashboard?tab=orders')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Button>
          </div>
        );
      }
      
      if (orderDetails.status === 'Error') {
        return (
          <div className="container mx-auto px-4 py-12 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h1 className="text-2xl font-bold mb-4">Error Loading Order</h1>
            <p className="text-muted-foreground mb-6">An error occurred while fetching details for {orderId}.</p>
             <Button variant="outline" onClick={() => navigate('/dashboard?tab=orders')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Button>
          </div>
        );
      }

      const { customer, customerEmail, shippingAddress, date, total, status, items, shippingMethod, trackingNumber, notes } = orderDetails;

      return (
        <div className="container mx-auto px-4 py-12">
          <motion.div 
            initial={{ opacity: 0, y: -20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.5 }}
            className="mb-6 flex justify-between items-center"
          >
            <div>
                <h1 className="text-3xl font-bold">Order Details: {orderId}</h1>
                <p className="text-muted-foreground">Manage and view details for this specific order.</p>
            </div>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard?tab=orders')}>
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Orders
            </Button>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 space-y-6">
              <Card className="glassmorphism">
                <CardHeader>
                  <CardTitle>Order Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div><User className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>Customer:</strong> {customer}</div>
                    <div><Calendar className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>Date:</strong> {new Date(date).toLocaleDateString()}</div>
                    <div><DollarSign className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>Total:</strong> ${total.toFixed(2)}</div>
                    <div><Package className="inline mr-2 h-4 w-4 text-muted-foreground" /><strong>Status:</strong> <Badge variant={status === "Delivered" ? "green" : status === "Shipped" ? "blue" : status === "Processing" ? "yellow" : "destructive"}>{status}</Badge></div>
                  </div>
                  <Separator className="my-4" />
                  <h3 className="font-semibold mb-2">Items Ordered:</h3>
                  <ul className="space-y-1">
                    {items.map(item => (
                      <li key={item.id} className="text-sm flex justify-between">
                        <span>{item.name} (x{item.quantity}) - SKU: {item.sku}</span>
                        <span>${(item.price * item.quantity).toFixed(2)}</span>
                      </li>
                    ))}
                  </ul>
                   {notes && (
                    <>
                        <Separator className="my-4" />
                        <h3 className="font-semibold mb-1">Customer Notes:</h3>
                        <p className="text-sm text-muted-foreground p-2 border rounded-md bg-background/30">{notes}</p>
                    </>
                   )}
                </CardContent>
              </Card>

              <Card className="glassmorphism">
                <CardHeader>
                    <CardTitle>Shipping Information</CardTitle>
                </CardHeader>
                <CardContent>
                    <p><strong>Address:</strong> {shippingAddress}</p>
                    <p><strong>Method:</strong> {shippingMethod}</p>
                    {trackingNumber && <p><strong>Tracking #:</strong> {trackingNumber}</p>}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="glassmorphism">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Manage Order</CardTitle>
                  {!isEditingStatus && (
                    <Button variant="ghost" size="sm" onClick={() => setIsEditingStatus(true)}>
                      <Edit className="mr-2 h-4 w-4" /> Edit
                    </Button>
                  )}
                </CardHeader>
                <CardContent>
                  {isEditingStatus ? (
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-muted-foreground mb-1">Order Status</label>
                        <Select value={currentStatus} onValueChange={setCurrentStatus}>
                          <SelectTrigger id="status">
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                          <SelectContent>
                            {statusOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                          </SelectContent>
                        </Select>
                      </div>
                       {(currentStatus === 'Shipped' || currentStatus === 'Delivered') && (
                        <div>
                            <label htmlFor="trackingNumber" className="block text-sm font-medium text-muted-foreground mb-1">Tracking Number</label>
                            <input 
                                type="text" 
                                id="trackingNumber"
                                value={newTrackingNumber}
                                onChange={(e) => setNewTrackingNumber(e.target.value)}
                                placeholder="Enter tracking number"
                                className="w-full p-2 border rounded-md bg-background"
                            />
                        </div>
                       )}
                      <div className="flex justify-end space-x-2 pt-2">
                        <Button variant="outline" onClick={() => {setIsEditingStatus(false); setCurrentStatus(orderDetails.status); setNewTrackingNumber(orderDetails.trackingNumber || '');}}>Cancel</Button>
                        <Button onClick={handleStatusUpdate}>Save Changes</Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p><strong>Current Status:</strong> <Badge variant={status === "Delivered" ? "green" : status === "Shipped" ? "blue" : status === "Processing" ? "yellow" : "destructive"}>{status}</Badge></p>
                       {trackingNumber && <p className="text-sm"><strong>Tracking:</strong> {trackingNumber}</p>}
                       <Button className="w-full mt-4" onClick={() => toast({title: "Action Example", description: "Print Packing Slip clicked (not implemented)."})}>
                         Print Packing Slip
                       </Button>
                       <Button variant="outline" className="w-full" onClick={() => toast({title: "Action Example", description: "Contact Customer clicked (not implemented)."})}>
                         Contact Customer ({customerEmail})
                       </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      );
    };

    export default SellerOrderDetailPage;
  