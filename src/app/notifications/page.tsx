'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useRouter } from "next/navigation";
import { Bell, Check, Clock, DollarSign, AlertCircle, Star } from "lucide-react";
import Navigation from "@/components/Navigation";

export default function Notifications() {
  const router = useRouter();
  const [notifications] = useState([
    {
      id: "1",
      type: "payment",
      title: "Payment Received",
      message: "You received $25.00 for completing 'Menu Verification' task",
      read: false,
      timestamp: "2025-10-26T14:30:00",
      priority: "normal"
    },
    {
      id: "2",
      type: "deadline",
      title: "Deadline Approaching",
      message: "Task 'Data Entry - Survey Results' is due in 2 hours",
      read: false,
      timestamp: "2025-10-26T12:00:00",
      priority: "urgent"
    },
    {
      id: "3",
      type: "review",
      title: "Work Approved",
      message: "Your submission for 'Restaurant Photos' has been approved",
      read: false,
      timestamp: "2025-10-26T10:15:00",
      priority: "normal"
    },
    {
      id: "4",
      type: "task_alert",
      title: "New Task Available",
      message: "A new task matching your skills is available: 'Content Moderation'",
      read: true,
      timestamp: "2025-10-25T16:45:00",
      priority: "normal"
    },
    {
      id: "5",
      type: "review",
      title: "Fix Requested",
      message: "Client requested fixes for 'Product Description' task. View feedback.",
      read: true,
      timestamp: "2025-10-25T14:20:00",
      priority: "high"
    },
    {
      id: "6",
      type: "payment",
      title: "Withdrawal Completed",
      message: "Your withdrawal of $100.00 has been processed successfully",
      read: true,
      timestamp: "2025-10-25T09:00:00",
      priority: "normal"
    },
    {
      id: "7",
      type: "system",
      title: "New Review Posted",
      message: "TechData Corp left you a 5-star review",
      read: true,
      timestamp: "2025-10-24T18:30:00",
      priority: "normal"
    }
  ]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "payment":
        return <DollarSign className="h-5 w-5 text-[#20A277]" />;
      case "deadline":
        return <Clock className="h-5 w-5 text-orange-600" />;
      case "review":
        return <Star className="h-5 w-5 text-blue-600" />;
      case "task_alert":
        return <Bell className="h-5 w-5 text-purple-600" />;
      default:
        return <AlertCircle className="h-5 w-5 text-gray-600" />;
    }
  };

  const getPriorityBadge = (priority: string) => {
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

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  const NotificationCard = ({ notification }: { notification: typeof notifications[0] }) => (
    <div className={`bg-white rounded-lg border ${!notification.read ? 'border-[#20A277]' : 'border-gray-200'} shadow-sm hover:shadow-md transition-shadow cursor-pointer`}>
      <div className="p-4">
        <div className="flex items-start gap-4">
          <div className={`p-2 rounded-full ${!notification.read ? 'bg-green-50' : 'bg-gray-100'}`}>
            {getNotificationIcon(notification.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h3 className="font-semibold text-sm text-gray-900">{notification.title}</h3>
              <div className="flex items-center gap-2 flex-shrink-0">
                {getPriorityBadge(notification.priority)}
                <span className="text-xs text-gray-600 whitespace-nowrap">
                  {formatTimestamp(notification.timestamp)}
                </span>
              </div>
            </div>
            <p className="text-sm text-gray-600">{notification.message}</p>
          </div>
          {!notification.read && (
            <div className="w-2 h-2 rounded-full bg-[#20A277] flex-shrink-0 mt-2" />
          )}
        </div>
      </div>
    </div>
  );

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
            {unreadNotifications.length > 0 && (
              <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                <Check className="h-4 w-4 mr-2" />
                Mark all as read
              </Button>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 bg-gray-50">
        <div className="max-w-[1400px] mx-auto px-8 lg:px-16 py-12">
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
        </div>
      </main>
    </div>
  );
}

