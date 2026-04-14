
    import React, { useState, useEffect } from 'react';
    import { Link, useNavigate } from 'react-router-dom';
    import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
    import { Button } from '@/components/ui/button';
    import { Badge } from '@/components/ui/badge';
    import { Bell, Package, CheckCircle, DollarSign, Star, MessageSquare, Trash2, Mail, Eye, Loader2 } from 'lucide-react';
    import { motion } from 'framer-motion';
    import { cn } from '@/lib/utils';
    import { useToast } from "@/components/ui/use-toast";

    const fetchGeneralNotifications = async () => {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call
      return [
        { id: 1, type: 'new_order', title: 'Order Shipped!', message: 'Your order #ORD-123 for "Vintage T-Shirt" has been shipped.', date: '2025-05-05 10:30', read: false, link: '/order/ORD-123/track' },
        { id: 2, type: 'message', title: 'Reply from Seller', message: 'Seller "Retro Finds" replied to your query about the Leather Jacket.', date: '2025-05-04 15:00', read: false, link: '/chat/seller-2', senderId: 'seller-2' },
        { id: 3, type: 'review', title: 'Your Review Published', message: 'Your review for "Handcrafted Wooden Bowl" is now live.', date: '2025-05-03 11:20', read: true, link: '/product/1#reviews' },
        { id: 4, type: 'product_approved', title: 'Welcome Offer!', message: 'Get 10% off your first purchase. Use code WELCOME10.', date: '2025-05-01 09:00', read: true, link: '/products' },
        { id: 5, type: 'message', title: 'New Message from Alice', message: 'Alice sent you a new message.', date: '2025-05-06 09:00', read: false, link: '/chat/user-Alice', senderId: 'user-Alice' },
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

    const NotificationsPage = () => {
      const [notifications, setNotifications] = useState([]);
      const [loading, setLoading] = useState(true);
      const { toast } = useToast();
      const navigate = useNavigate();

      useEffect(() => {
        setLoading(true);
        fetchGeneralNotifications().then(data => {
          setNotifications(data);
          setLoading(false);
        }).catch(error => {
          console.error("Failed to fetch notifications:", error);
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

      const deleteAllNotifications = () => {
        setNotifications([]);
        toast({ title: "All Notifications Cleared", variant: "destructive" });
      };

      const unreadCount = notifications.filter(n => !n.read).length;

      if (loading) {
        return (
          <div className="container mx-auto px-4 py-12 flex-grow flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        );
      }

      return (
        <div className="container mx-auto px-4 py-12 flex-grow">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-between mb-8"
          >
            <h1 className="text-3xl font-bold">Notifications</h1>
            <div className="space-x-2">
               <Button variant="outline" size="sm" onClick={markAllAsRead} disabled={unreadCount === 0}>
                 Mark All Read
               </Button>
               <Button variant="destructive" size="sm" onClick={deleteAllNotifications} disabled={notifications.length === 0}>
                 Delete All
               </Button>
            </div>
          </motion.div>

          <Card className="glassmorphism">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>
                You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No notifications yet.</p>
              ) : (
                <div className="space-y-4">
                  {notifications.map((notification, index) => {
                    const Icon = notificationIcons[notification.type] || notificationIcons.default;
                    return (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
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
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    };

    export default NotificationsPage;
  