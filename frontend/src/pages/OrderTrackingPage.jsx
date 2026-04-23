
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Loader, Package, Truck, Home, ArrowLeft, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

// Placeholder fetch function
const fetchTrackingDetails = async (orderId) => {
  console.log(`Fetching tracking for order ID: ${orderId}`);
  await new Promise(resolve => setTimeout(resolve, 700));

  // Simulate different statuses based on orderId
  const statuses = [
    {
      id: 'ORD-001', status: 'Delivered', currentStep: 4, productName: 'Vintage Camera', seller: 'Retro Finds', events: [
        { status: 'Order Placed', date: '2025-04-30 10:00', location: 'System', icon: Package },
        { status: 'Processing', date: '2025-04-30 14:00', location: 'Warehouse A', icon: Loader },
        { status: 'Shipped', date: '2025-05-01 09:30', location: 'FedEx Facility, OR', icon: Truck },
        { status: 'Out for Delivery', date: '2025-05-02 08:15', location: 'Local Hub', icon: Truck },
        { status: 'Delivered', date: '2025-05-02 13:45', location: 'Customer Address', icon: Home },
      ]
    },
    {
      id: 'ORD-002', status: 'Shipped', currentStep: 2, productName: 'Vintage Leather Jacket', seller: 'Retro Finds', events: [
        { status: 'Order Placed', date: '2025-05-01 11:00', location: 'System', icon: Package },
        { status: 'Processing', date: '2025-05-01 16:30', location: 'Warehouse B', icon: Loader },
        { status: 'Shipped', date: '2025-05-02 10:00', location: 'FedEx Facility, UK', icon: Truck },
      ]
    },
    {
      id: 'ORD-003', status: 'Processing', currentStep: 1, productName: 'Ceramic Mug Set', seller: 'Pottery Place', events: [
        { status: 'Order Placed', date: '2025-05-02 09:00', location: 'System', icon: Package },
        { status: 'Processing', date: '2025-05-02 15:00', location: 'Workshop', icon: Loader },
      ]
    },
    // Simulate an order not found
    // { id: 'NOT_FOUND', status: 'Not Found', currentStep: 0, events: [] }
  ];

  return statuses.find(s => s.id === orderId) || { id: orderId, status: 'Not Found', currentStep: -1, events: [], productName: 'N/A', seller: 'N/A' };
};

const OrderTrackingPage = () => {
  const { orderId } = useParams();
  const [trackingInfo, setTrackingInfo] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchTrackingDetails(orderId)
      .then(data => {
        setTrackingInfo(data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Failed to fetch tracking data:", error);
        setTrackingInfo({ id: orderId, status: 'Error', currentStep: -1, events: [], productName: 'N/A', seller: 'N/A' });
        setLoading(false);
      });
  }, [orderId]);


  if (loading) {
    return (
      <div className="container mx-auto px-4 py-12 flex justify-center items-center min-h-[calc(100vh-10rem)]">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
      </div>
    );
  }

  if (!trackingInfo || trackingInfo.status === 'Not Found') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-4">Order Not Found</h1>
        <p className="text-muted-foreground mb-6">We couldn't find tracking information for order ID: {orderId}.</p>
        <Link to="/dashboard?tab=invoices">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
          </Button>
        </Link>
      </div>
    );
  }
  if (trackingInfo.status === 'Error') {
    return (
      <div className="container mx-auto px-4 py-12 text-center">
        <AlertCircle className="mx-auto h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-4">Error Loading Tracking</h1>
        <p className="text-muted-foreground mb-6">An error occurred while fetching tracking information for order ID: {orderId}. Please try again later.</p>
        <Link to="/dashboard?tab=invoices">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
          </Button>
        </Link>
      </div>
    );
  }

  const trackingSteps = trackingInfo.events;
  const currentStatusIndex = trackingSteps.length - 1; // Index of the latest event

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Link to="/dashboard?tab=invoices" className="inline-block mb-6">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Invoices
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">Track Order: {trackingInfo.id}</h1>
        <p className="text-muted-foreground mb-8">Item: {trackingInfo.productName} from {trackingInfo.seller}</p>
      </motion.div>

      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>Current Status: {trackingInfo.status}</CardTitle>
          {trackingInfo.status === 'Delivered' && <CardDescription>Delivered on {new Date(trackingSteps[currentStatusIndex].date).toLocaleDateString()}.</CardDescription>}
          {trackingInfo.status !== 'Delivered' && trackingInfo.events.length > 0 && <CardDescription>Last updated: {new Date(trackingSteps[currentStatusIndex].date).toLocaleString()} at {trackingSteps[currentStatusIndex].location}</CardDescription>}
        </CardHeader>
        <CardContent>
          {/* Tracking Timeline */}
          <div className="relative pl-8 space-y-8">
            {/* Vertical line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border"></div>

            {trackingSteps.map((event, index) => {
              const isCurrent = index === currentStatusIndex;
              const isCompleted = index < currentStatusIndex;
              const Icon = event.icon || Package; // Default icon

              return (
                <motion.div
                  key={index}
                  className="relative"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {/* Dot on the line */}
                  <div className={`absolute left-0 top-1 -translate-x-[calc(50%-1px)] w-4 h-4 rounded-full border-2 ${isCurrent || isCompleted ? 'bg-primary border-primary' : 'bg-background border-muted'}`}>
                    {isCurrent && <div className="absolute inset-0 rounded-full bg-primary animate-ping"></div>}
                  </div>

                  {/* Event Details */}
                  <div className="ml-4">
                    <div className="flex items-center mb-1">
                      <Icon className={`h-5 w-5 mr-2 ${isCurrent || isCompleted ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`font-semibold ${isCurrent ? 'text-foreground' : 'text-muted-foreground'}`}>{event.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{new Date(event.date).toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">{event.location}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Placeholder for Map View (optional) */}
          {/* <div className="mt-8 pt-6 border-t">
                    <h3 className="font-semibold mb-4">Package Location (Map Placeholder)</h3>
                    <div className="h-64 bg-muted rounded-md flex items-center justify-center">
                       <p className="text-muted-foreground">Map View (Requires Integration)</p>
                     </div>
                 </div> */}

        </CardContent>
      </Card>
    </div>
  );
};

export default OrderTrackingPage;
