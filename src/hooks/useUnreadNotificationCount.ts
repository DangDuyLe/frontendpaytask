import { useEffect, useState } from 'react';
import { notificationsApi } from '@/api/notifications';

export function useUnreadNotificationCount() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnreadCount();
    
    // Poll for updates every 30 seconds
    const interval = setInterval(fetchUnreadCount, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const unreadCount = await notificationsApi.getUnreadCount();
      setCount(unreadCount);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    } finally {
      setLoading(false);
    }
  };

  return { count, loading, refresh: fetchUnreadCount };
}
