'use client';

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { 
  Bell, 
  Check, 
  Clock, 
  DollarSign, 
  AlertCircle, 
  Star, 
  Loader2, 
  Trash2, 
  CheckCheck 
} from "lucide-react";
import Navigation from "@/components/Navigation";
import { notificationsApi } from "@/api/notifications";
import type { Notification } from "@/types/notification.types";
import { useToast } from "@/hooks/use-toast";

export default function Notifications() {
  const router = useRouter();
  const { toast } = useToast();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Fetch notifications on mount
  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await notificationsApi.getNotifications({ limit: 100 });
      setNotifications(response.notifications);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      toast({
        title: "Error",
        description: "Failed to load notifications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      setActionLoading(notificationId);
      await notificationsApi.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => (n.id === notificationId ? { ...n, status: 'read' as const } : n))
      );

      toast({
        title: "Success",
        description: "Notification marked as read",
      });
    } catch (error) {
      console.error('Error marking notification as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark notification as read",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      setActionLoading('all');
      const result = await notificationsApi.markAllAsRead();
      
      // Update local state
      setNotifications(prev =>
        prev.map(n => ({ ...n, status: 'read' as const }))
      );

      toast({
        title: "Success",
        description: `${result.count} notifications marked as read`,
      });
    } catch (error) {
      console.error('Error marking all as read:', error);
      toast({
        title: "Error",
        description: "Failed to mark all notifications as read",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      setActionLoading(notificationId);
      await notificationsApi.deleteNotification(notificationId);
      
      // Remove from local state
      setNotifications(prev => prev.filter(n => n.id !== notificationId));

      toast({
        title: "Success",
        description: "Notification deleted",
      });
    } catch (error) {
      console.error('Error deleting notification:', error);
      toast({
        title: "Error",
        description: "Failed to delete notification",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteAllRead = async () => {
    try {
      setActionLoading('delete-all');
      const result = await notificationsApi.deleteAllRead();
      
      // Remove read notifications from local state
      setNotifications(prev => prev.filter(n => n.status !== 'read'));

      toast({
        title: "Success",
        description: `${result.count} notifications deleted`,
      });
    } catch (error) {
      console.error('Error deleting read notifications:', error);
      toast({
        title: "Error",
        description: "Failed to delete read notifications",
        variant: "destructive",
      });
    } finally {
      setActionLoading(null);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <DollarSign className="h-5 w-5 text-[#20A277]" />;
      case "deadline":
        return <Clock className="h-5 w-5 text-orange-600" />;
      case "submission_review":
      case "review":
        return <Star className="h-5 w-5 text-blue-600" />;
      case "task_alert":
      case "task_assignment":
        return <Bell className="h-5 w-5 text-purple-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getNotificationTitle = (notification: Notification): string => {
    // Try to extract title from meta or use type
    if (notification.meta && typeof notification.meta === 'object') {
      const meta = notification.meta as any;
      if (meta.taskTitle) return notification.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    }
    return notification.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getPriorityFromType = (type: string): string => {
    if (type === 'deadline') return 'urgent';
    if (type === 'payment' || type === 'submission_review') return 'high';
    return 'normal';
  };

  const getPriorityBadge = (type: string) => {
    const priority = getPriorityFromType(type);
    switch (priority) {
      case "urgent":
        return <Badge className="bg-red-100 text-red-700">Urgent</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-700">High</Badge>;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const unreadNotifications = notifications.filter(n => n.status !== 'read');
  const readNotifications = notifications.filter(n => n.status === 'read');

  const NotificationCard = ({ notification }: { notification: Notification }) => {
    const isUnread = notification.status !== 'read';
    
    return (
      <Card className={`bg-white rounded-lg border ${isUnread ? 'border-[#20A277]' : 'border-gray-200'} shadow-sm hover:shadow-md transition-shadow`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className={`p-2 rounded-full ${isUnread ? 'bg-green-50' : 'bg-gray-100'}`}>
              {getNotificationIcon(notification.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3 className="font-semibold text-sm text-gray-900">{getNotificationTitle(notification)}</h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getPriorityBadge(notification.type)}
                  <span className="text-xs text-gray-600 whitespace-nowrap">
                    {formatTimestamp(notification.createdAt)}
                  </span>
                </div>
              </div>
              <p className="text-sm text-gray-600">{notification.content || 'No content'}</p>
              
              {/* Action buttons */}
              <div className="flex gap-2 mt-3">
                {isUnread && (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => handleMarkAsRead(notification.id)}
                    disabled={actionLoading === notification.id}
                    className="text-[#20A277] hover:text-[#1A8260] hover:bg-green-50"
                  >
                    {actionLoading === notification.id ? (
                      <Loader2 className="h-3 w-3 animate-spin mr-1" />
                    ) : (
                      <Check className="h-3 w-3 mr-1" />
                    )}
                    Mark as read
                  </Button>
                )}
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => handleDeleteNotification(notification.id)}
                  disabled={actionLoading === notification.id}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {actionLoading === notification.id ? (
                    <Loader2 className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Trash2 className="h-3 w-3 mr-1" />
                  )}
                  Delete
                </Button>
              </div>
            </div>
            {isUnread && (
              <div className="w-2 h-2 rounded-full bg-[#20A277] flex-shrink-0 mt-2" />
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Notifications</h1>
              <p className="text-gray-600">
                {unreadNotifications.length} unread notification{unreadNotifications.length !== 1 ? 's' : ''}
              </p>
            </div>
            <div className="flex gap-2">
              {unreadNotifications.length > 0 && (
                <Button 
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={handleMarkAllAsRead}
                  disabled={actionLoading === 'all'}
                >
                  {actionLoading === 'all' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCheck className="h-4 w-4 mr-2" />
                  )}
                  Mark all as read
                </Button>
              )}
              {readNotifications.length > 0 && (
                <Button 
                  variant="outline"
                  onClick={handleDeleteAllRead}
                  disabled={actionLoading === 'delete-all'}
                  className="border-gray-300 text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  {actionLoading === 'delete-all' ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 mr-2" />
                  )}
                  Delete all read
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
          {loading ? (
            <Card className="border border-gray-200 shadow-sm bg-white">
              <CardContent className="p-12 text-center">
                <Loader2 className="h-12 w-12 mx-auto mb-4 text-[#20A277] animate-spin" />
                <p className="text-sm text-gray-600">Loading notifications...</p>
              </CardContent>
            </Card>
          ) : (
            <Tabs defaultValue="all" className="space-y-6">
              <TabsList className="bg-white border border-gray-200 p-1 rounded-lg">
                <TabsTrigger value="all" className="data-[state=active]:bg-[#20A277] data-[state=active]:text-white">
                  All ({notifications.length})
                </TabsTrigger>
                <TabsTrigger value="unread" className="data-[state=active]:bg-[#20A277] data-[state=active]:text-white">
                  Unread ({unreadNotifications.length})
                </TabsTrigger>
                <TabsTrigger value="read" className="data-[state=active]:bg-[#20A277] data-[state=active]:text-white">
                  Read ({readNotifications.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all" className="space-y-3">
                {notifications.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-12 text-center">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
                      <p className="text-sm text-gray-600">
                        You're all caught up! New notifications will appear here.
                      </p>
                    </div>
                  </div>
                ) : (
                  notifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="unread" className="space-y-3">
                {unreadNotifications.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-12 text-center">
                      <Check className="h-12 w-12 mx-auto mb-4 text-[#20A277]" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">All caught up!</h3>
                      <p className="text-sm text-gray-600">
                        You have no unread notifications.
                      </p>
                    </div>
                  </div>
                ) : (
                  unreadNotifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))
                )}
              </TabsContent>

              <TabsContent value="read" className="space-y-3">
                {readNotifications.length === 0 ? (
                  <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
                    <div className="p-12 text-center">
                      <Bell className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No read notifications</h3>
                      <p className="text-sm text-gray-600">
                        Read notifications will appear here.
                      </p>
                    </div>
                  </div>
                ) : (
                  readNotifications.map((notification) => (
                    <NotificationCard key={notification.id} notification={notification} />
                  ))
                )}
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>
    </div>
  );
}