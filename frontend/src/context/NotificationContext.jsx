import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from "@/components/ui/use-toast";

// Mock API call - in a real app, this would be a fetch to a backend
const mockFetchUserNotifications = async () => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return [
    { id: 'usr_notif_1', type: 'order_shipped', title: 'Your Order #ORD-789 Shipped!', message: 'The "Vintage Camera" is on its way.', date: '2025-05-06 10:00', read: false, link: '/order/ORD-001/track' },
    { id: 'usr_notif_2', type: 'new_message', title: 'Message from "Artisan Goods"', message: 'Regarding your question about custom orders.', date: '2025-05-05 14:30', read: true, link: '/chat/seller-1', senderId: 'seller-2' },
    { id: 'usr_notif_3', type: 'promotion', title: 'Weekend Flash Sale!', message: 'Get 15% off on all electronics this weekend.', date: '2025-05-04 09:15', read: false, link: '/products?category=electronics' },
    { id: 'usr_notif_4', type: 'new_message', title: 'Message from "Retro Finds"', message: 'Seller "Retro Finds" replied to your query about the Leather Jacket.', date: '2025-05-04 15:00', read: false, link: '/chat/seller-2', senderId: 'seller-2' },
  ];
};

const NotificationContext = createContext();

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [unreadCount, setUnreadCount] = useState(0);
  const { toast } = useToast();

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    try {
      const data = await mockFetchUserNotifications();
      setNotifications(data);
      setUnreadCount(data.filter(n => !n.read).length);
    } catch (error) {
      console.error("Failed to fetch user notifications:", error);
      toast({ title: "Error", description: "Could not load notifications.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsRead = useCallback((id) => {
    setNotifications(prev => {
      const newNotifications = prev.map(n => n.id === id ? { ...n, read: true } : n);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
      return newNotifications;
    });
    // In a real app, you would also send an API request to mark as read on the server
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications(prev => {
      const newNotifications = prev.map(n => ({ ...n, read: true }));
      setUnreadCount(0);
      return newNotifications;
    });
    // API call for marking all as read
  }, []);

  const deleteNotification = useCallback((id) => {
    setNotifications(prev => {
      const newNotifications = prev.filter(n => n.id !== id);
      setUnreadCount(newNotifications.filter(n => !n.read).length);
      return newNotifications;
    });
    toast({ title: "Notification Removed", variant: "info" });
    // API call for deleting notification
  }, [toast]);
  
  const addNotification = useCallback((notification) => {
    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      setUnreadCount(newNotifications.filter(n => !n.read).length);
      return newNotifications;
    });
     toast({ title: "New Notification", description: notification.title, variant: "default" });
  }, [toast]);


  const value = {
    notifications,
    loading,
    unreadCount,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    addNotification, // If you need to add notifications dynamically
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
