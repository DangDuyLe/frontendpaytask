import axios from 'axios';
import type {
  NotificationsResponse,
  UnreadCountResponse,
  NotificationFilter,
  CreateNotificationRequest,
  Notification,
  MarkAsReadResponse,
  MarkAllAsReadResponse,
  DeleteNotificationResponse,
  DeleteAllReadResponse,
} from '@/types/notification.types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

// Helper function to get auth token
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token');
  }
  return null;
};

// Create axios instance with auth header
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const notificationsApi = {
  /**
   * Get user notifications with optional filters
   */
  getNotifications: async (filter?: NotificationFilter): Promise<NotificationsResponse> => {
    const params = new URLSearchParams();
    
    if (filter?.status) params.append('status', filter.status);
    if (filter?.type) params.append('type', filter.type);
    if (filter?.limit) params.append('limit', filter.limit.toString());
    if (filter?.offset) params.append('offset', filter.offset.toString());

    const response = await apiClient.get<NotificationsResponse>(
      `/notifications?${params.toString()}`
    );
    return response.data;
  },

  /**
   * Get unread notification count
   */
  getUnreadCount: async (): Promise<number> => {
    const response = await apiClient.get<UnreadCountResponse>('/notifications/unread-count');
    return response.data.count;
  },

  /**
   * Mark a notification as read
   */
  markAsRead: async (notificationId: string): Promise<MarkAsReadResponse> => {
    const response = await apiClient.patch<MarkAsReadResponse>(
      `/notifications/${notificationId}/read`
    );
    return response.data;
  },

  /**
   * Mark all notifications as read
   */
  markAllAsRead: async (): Promise<MarkAllAsReadResponse> => {
    const response = await apiClient.patch<MarkAllAsReadResponse>('/notifications/read-all');
    return response.data;
  },

  /**
   * Delete a notification
   */
  deleteNotification: async (notificationId: string): Promise<DeleteNotificationResponse> => {
    const response = await apiClient.delete<DeleteNotificationResponse>(
      `/notifications/${notificationId}`
    );
    return response.data;
  },

  /**
   * Delete all read notifications
   */
  deleteAllRead: async (): Promise<DeleteAllReadResponse> => {
    const response = await apiClient.delete<DeleteAllReadResponse>('/notifications/read');
    return response.data;
  },

  /**
   * Create a notification (Admin only)
   */
  createNotification: async (data: CreateNotificationRequest): Promise<Notification> => {
    const response = await apiClient.post<Notification>('/notifications', data);
    return response.data;
  },
};
