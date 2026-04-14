
    import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { Bell, Package, CheckCircle, DollarSign, Star, MessageSquare, Trash2, Mail, Eye, Loader2 } from 'lucide-react';
    import { cn } from '@/lib/utils';
    import { useToast } from "@/components/ui/use-toast";

    const fetchSellerNotifications = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      return [
        { id: 1, type: 'new_order', title: 'Order #ORD-004 Received', message: 'Customer Bob K. ordered "Wooden Cutting Board".', date: '2025-05-03 10:30', read: false, link: '/order/ORD-004' },
        { id: 2, type: 'review', title: '5-Star Review for Wooden Bowl', message: 'Alice M. left a positive review for your product.', date: '2025-05-02 11:20', read: true, link: '/product/1#reviews' }, // Assuming product ID 1
        { id: 3, type: 'message', title: 'Question about Leather Jacket', message: 'A customer asked about sizing for the Vintage Leather Jacket.', date: '2025-05-01 18:05', read: false, link: '/dashboard/messages/MSG-123' }, // Placeholder message link
        { id: 4, type: 'low_stock', title: 'Low Stock: Wooden Cutting Board', message: 'Only 8 units left. Consider restocking.', date: '2025-04-30 09:00', read: true, link: '/dashboard/products/edit/1b' }, // Assuming product ID 1b
        { id: 5, type: 'payout', title: 'Payout Processed', message: 'Your payout of $150.75 has been sent.', date: '2025-05-05 14:00', read: false, link: '/dashboard?tab=billing' },
      ];
    };


    const notificationIcons = {
      new_order: Package,
      payout: DollarSign,
      review: Star,
      message: MessageSquare,
      product_approved: CheckCircle,
      low_stock: Bell,
      default: Mail,
    };

    const SellerNotificationsTab = () => {
      const [notifications, setNotifications] = useState([]);
      const [loading, setLoading] = useState(true);
      const { toast } = useToast();
      const navigate = useNavigate();

      useEffect(() => {
        setLoading(true);
        fetchSellerNotifications().then(data => {
          setNotifications(data);
          setLoading(false);
        }).catch(error => {
          console.error("Failed to fetch seller notifications:", error);
          toast({ title: "Error", description: "Could not load notifications.", variant: "destructive" });
          setLoading(false);
        });
      }, [toast]);

      const handleNotificationClick = (notification) => {
        if (!notification.read) {
          markAsRead(notification.id);
        }
        if (notification.link) {
          navigate(notification.link);
        } else {
          toast({ title: "Info", description: "No specific page for this notification type yet."});
        }
      };

      const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
      };

      const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      };

      const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(n => n.id !== id));
        toast({ title: "Notification Removed", variant: "destructive" });
      };

      const unreadCount = notifications.filter(n => !n.read).length;

      if (loading) {
        return (
          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Shop Notifications</CardTitle>
              <CardDescription>Loading your updates...</CardDescription>
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
            <CardTitle>Shop Notifications</CardTitle>
            <CardDescription>
              Updates related to your sales, products, and customer interactions. You have {unreadCount} unread.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {notifications.length > 0 && (
                <div className="mb-4 flex justify-end">
                    <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                        Mark All Read
                    </Button>
                </div>
            )}
            {notifications.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No shop notifications yet.</p>
            ) : (
              <div className="space-y-4">
                {notifications.map((notification) => {
                  const Icon = notificationIcons[notification.type] || notificationIcons.default;
                  return (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex items-start space-x-4 p-4 border rounded-lg transition-colors hover:shadow-md",
                        notification.read ? 'bg-background/30' : 'bg-primary/10 border-primary/30',
                        notification.link ? 'cursor-pointer' : ''
                      )}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className={cn("mt-1 p-2 rounded-full", notification.read ? 'bg-muted' : 'bg-primary/20')}>
                         <Icon className={cn("h-5 w-5", notification.read ? 'text-muted-foreground' : 'text-primary')} />
                      </div>
                      <div className="flex-1 space-y-1">
                        <div className="flex items-center justify-between">
                           <p className="text-sm font-medium leading-none">{notification.title}</p>
                           {!notification.read && <Badge variant="default" className="h-5">New</Badge>}
                        </div>
                        <p className="text-sm text-muted-foreground">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">{new Date(notification.date).toLocaleString()}</p>
                      </div>
                      <div className="flex flex-col space-y-1">
                         {notification.link && (
                            <Button variant="ghost" size="sm" className="h-7 px-2 text-primary hover:text-primary/80" onClick={(e) => { e.stopPropagation(); handleNotificationClick(notification); }}>
                                <Eye className="mr-1 h-3 w-3" /> View
                            </Button>
                         )}
                         <Button variant="ghost" size="icon" className="h-7 w-7 text-muted-foreground hover:text-destructive" onClick={(e) => { e.stopPropagation(); deleteNotification(notification.id); }}>
                           <Trash2 className="h-4 w-4" />
                         </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      );
    };

    export default SellerNotificationsTab;
  