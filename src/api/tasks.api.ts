// Tasks API
import { apiFetch, getHeaders } from './config';

// Types
export interface CreateTaskRequest {
  title: string;
  description?: string;
  category?: string;
  reward: number;
  qty: number;
  deadline?: string;
}

export interface UpdateTaskRequest {
  title?: string;
  description?: string;
  category?: string;
  reward?: number;
  qty?: number;
  deadline?: string;
}

export interface TaskDiscoveryQuery {
  category?: string;
  minReward?: number;
  maxReward?: number;
  sortBy?: 'createdAt' | 'reward' | 'deadline';
  order?: 'asc' | 'desc';
  page?: number;
  limit?: number;
  clientId?: string; // Filter by client ID
  status?: string; // Filter by status (draft, open, in_progress, completed, cancelled)
}

export interface Task {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  reward: string;
  qty: number;
  budget: string | null; // Total cost
  deadline: string | null;
  status: string;
  createdAt: string;
  client?: {
    id: string;
    email: string;
  };
  _count?: {
    assignments: number;
  };
}

export interface TaskListResponse {
  success: boolean;
  data: {
    data: Task[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface TaskDetailResponse {
  success: boolean;
  data: Task;
}

export interface PublishTaskResponse {
  success: boolean;
  message: string;
  data: Task;
  escrow: {
    fromWallet: string;
    toWallet: string;
    amount: number;
    reward: number;
    fee: number;
    txHash: string;
    note: string;
  };
}

// API Functions
export const tasksApi = {
  // POST /api/tasks
  createTask: async (data: CreateTaskRequest): Promise<TaskDetailResponse> => {
    return await apiFetch('/tasks', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  // PUT /api/tasks/updateTaskDraft/:taskId
  updateTaskDraft: async (taskId: string, data: UpdateTaskRequest): Promise<TaskDetailResponse> => {
    return await apiFetch(`/tasks/updateTaskDraft/${taskId}`, {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  // POST /api/tasks/:taskId/publish
  publishTask: async (taskId: string): Promise<PublishTaskResponse> => {
    return await apiFetch(`/tasks/${taskId}/publish`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify({ taskId: taskId}),
    });
  },

  // DELETE /api/tasks/:taskId
  deleteTask: async (taskId: string): Promise<{ success: boolean; data: any }> => {
    return await apiFetch(`/tasks/${taskId}`, {
      method: 'DELETE',
      headers: getHeaders(true),
    });
  },

  // GET /api/tasks/all
  getAllTasks: async (query?: TaskDiscoveryQuery): Promise<TaskListResponse> => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/tasks/all?${queryString}` : '/tasks/all';
    
    return await apiFetch(endpoint, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // GET /api/tasks/:taskId
  getTaskById: async (taskId: string): Promise<TaskDetailResponse> => {
    return await apiFetch(`/tasks/${taskId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // GET /api/tasks/all (for client - get their own tasks)
  getMyTasks: async (query?: TaskDiscoveryQuery): Promise<TaskListResponse> => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/tasks/all?${queryString}` : '/tasks/all';
    
    return await apiFetch(endpoint, {
      method: 'GET',
      headers: getHeaders(true), // Include auth to filter by current user
    });
  },
};
