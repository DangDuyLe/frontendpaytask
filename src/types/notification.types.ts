export type NotificationStatus = 'pending' | 'sent' | 'read';

export interface Notification {
  id: string;
  toUserId: string;
  type: string;
  content?: string | null;
  status: NotificationStatus;
  meta?: Record<string, any> | null;
  createdAt: string;
  toUser?: {
    id: string;
    username: string;
  };
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  hasMore: boolean;
}

export interface UnreadCountResponse {
  count: number;
}

export interface NotificationFilter {
  status?: NotificationStatus;
  type?: string;
  limit?: number;
  offset?: number;
}

export interface CreateNotificationRequest {
  toUserId: string;
  type: string;
  content?: string;
  meta?: Record<string, any>;
}

export interface MarkAsReadResponse {
  id: string;
  status: NotificationStatus;
}

export interface MarkAllAsReadResponse {
  count: number;
}

export interface DeleteNotificationResponse {
  success: boolean;
  message: string;
}

export interface DeleteAllReadResponse {
  count: number;
}
