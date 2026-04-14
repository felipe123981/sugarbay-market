
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, Bell, Trash2, Eye, Loader2, MessageSquare, Mail, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useToast } from "@/components/ui/use-toast";
import { useNotificationContext } from '@/context/NotificationContext';

const notificationIcons = {
  order_shipped: Truck,
  new_message: MessageSquare,
  promotion: Bell,
  default: Mail,
};

const NotificationsSettingsTab = () => {
  const { 
    notifications, 
    loading, 
    unreadCount, 
    markAsRead, 
    markAllAsRead, 
    deleteNotification 
  } = useNotificationContext();
  const { toast } = useToast();
  const navigate = useNavigate();

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

  // unreadCount is now directly from context

  if (loading) {
    return (
      <Card className="glassmorphism">
        <CardHeader>
          <CardTitle>My Notifications</CardTitle>
          <CardDescription>Manage and view your account notifications.</CardDescription>
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
        <CardTitle>My Notifications</CardTitle>
        <CardDescription>Manage and view your account notifications. You have {unreadCount} unread.</CardDescription>
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
          <p className="text-muted-foreground text-center py-8">No notifications yet.</p>
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

export default NotificationsSettingsTab;
