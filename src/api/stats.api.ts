// Statistics API
import { apiFetch, getHeaders } from './config';

// Types
export interface TaskStats {
  tasks: {
    total: number;
    open: number;
    byCategory: Array<{
      category: string;
      count: number;
    }>;
    byStatus: Array<{
      status: string;
      count: number;
    }>;
  };
  assignments: {
    total: number;
    completed: number;
  };
}

export interface TaskStatsResponse {
  success: boolean;
  data: TaskStats;
}

export interface CategoriesResponse {
  success: boolean;
  data: string[];
}

export interface CacheClearResponse {
  success: boolean;
  message: string;
}

// API Functions
export const statsApi = {
  // GET /api/stats/tasks
  getTaskStats: async (): Promise<TaskStatsResponse> => {
    return await apiFetch('/stats/tasks', {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // GET /api/stats/categories
  getCategories: async (): Promise<CategoriesResponse> => {
    return await apiFetch('/stats/categories', {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // POST /api/stats/cache/clear
  clearCache: async (): Promise<CacheClearResponse> => {
    return await apiFetch('/stats/cache/clear', {
      method: 'POST',
      headers: getHeaders(),
    });
  },
};
