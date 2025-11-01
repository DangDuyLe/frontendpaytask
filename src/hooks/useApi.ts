// Custom hooks for API calls
import { useState, useEffect } from 'react';
import { tasksApi, type Task, type TaskListResponse } from '@/api';

// Hook to fetch tasks
export function useTasks(filters?: {
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'reward' | 'deadline';
  order?: 'asc' | 'desc';
}) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await tasksApi.getMyTasks(filters);

      if (response.success) {
        setTasks(response.data.data);
        setPagination(response.data.pagination);
      }
    } catch (err: any) {
      console.error('Error fetching tasks:', err);
      setError(err?.error?.message || 'Failed to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters?.status, filters?.category, filters?.page, filters?.limit]);

  return {
    tasks,
    loading,
    error,
    pagination,
    refetch: fetchTasks,
  };
}

// Hook to fetch single task by ID
export function useTask(taskId: string | null) {
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTask = async () => {
    if (!taskId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await tasksApi.getTaskById(taskId);

      if (response.success) {
        setTask(response.data);
      }
    } catch (err: any) {
      console.error('Error fetching task:', err);
      setError(err?.error?.message || 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  return {
    task,
    loading,
    error,
    refetch: fetchTask,
  };
}
