
    import React from 'react';
    import { Link } from 'react-router-dom'; // Import Link
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { FileText, Download, Truck } from 'lucide-react'; // Added Truck
    import { motion } from 'framer-motion';

    const invoices = [
      { id: 'INV-2025-001', orderId: 'ORD-001', date: '2025-04-30', total: 47.50, status: 'Paid', items: ['Vintage Camera'], seller: 'Retro Finds' },
      { id: 'INV-2025-002', orderId: 'ORD-002', date: '2025-05-01', total: 125.00, status: 'Paid', items: ['Vintage Leather Jacket'], seller: 'Retro Finds' },
      { id: 'INV-2025-003', orderId: 'ORD-003', date: '2025-05-02', total: 32.00, status: 'Pending', items: ['Ceramic Mug Set'], seller: 'Pottery Place' },
    ];

    const getStatusVariant = (status) => {
      switch (status.toLowerCase()) {
        case 'paid': return 'default';
        case 'pending': return 'secondary';
        case 'failed':
        case 'cancelled': return 'destructive';
        default: return 'outline';
      }
    };


    const InvoicesPage = () => {
      return (
        <div className="container mx-auto px-4 py-12">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl font-bold mb-8"
          >
            My Invoices
          </motion.h1>

           {invoices.length === 0 ? (
             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                <Card className="text-center glassmorphism">
                   <CardHeader>
                      <FileText className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                      <CardTitle>No Invoices Yet</CardTitle>
                      <CardDescription>Your past orders and invoices will appear here once you make a purchase.</CardDescription>
                   </CardHeader>
                   <CardContent>
                      <Link to="/products">
                        <Button>Start Shopping</Button>
                      </Link>
                   </CardContent>
                </Card>
              </motion.div>
           ) : (
             <div className="space-y-4">
                {invoices.map((invoice, index) => (
                   <motion.div
                      key={invoice.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 + 0.1 }}
                    >
                      <Card className="glassmorphism">
                         <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                            <div className="flex-1">
                              <p className="font-semibold text-lg">{invoice.id} (Order: {invoice.orderId})</p>
                              <p className="text-sm text-muted-foreground">Date: {invoice.date}</p>
                              <p className="text-sm text-muted-foreground">Seller: {invoice.seller}</p>
                              <p className="text-sm text-muted-foreground">Items: {invoice.items.join(', ')}</p>
                            </div>
                            <div className="flex flex-col items-stretch sm:items-end gap-2 w-full sm:w-auto">
                              <p className="text-xl font-bold text-right sm:text-left">${invoice.total.toFixed(2)}</p>
                              <Badge variant={getStatusVariant(invoice.status)} className="self-end sm:self-auto">{invoice.status}</Badge>
                               <div className="flex flex-col sm:flex-row gap-2 mt-2 w-full">
                                <Button variant="outline" size="sm" className="flex-1 justify-center">
                                  <Download className="mr-2 h-4 w-4" /> Download PDF
                                </Button>
                                 {invoice.status.toLowerCase() === 'paid' && ( // Show track button only if paid/shipped
                                    <Link to={`/order/${invoice.orderId}/track`} className="flex-1">
                                       <Button variant="secondary" size="sm" className="w-full justify-center">
                                          <Truck className="mr-2 h-4 w-4" /> Track Order
                                        </Button>
                                     </Link>
                                 )}
                               </div>
                            </div>
                         </CardContent>
                      </Card>
                    </motion.div>
                ))}
              </div>
           )}
        </div>
      );
    };

    export default InvoicesPage;
  