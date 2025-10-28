// Assignments API
import { apiFetch, getHeaders } from './config';

// Types
export interface AcceptTaskRequest {
  taskId: string;
  workerId?: string;
}

export interface ListAssignmentsQuery {
  workerId?: string;
  status?: 'in_progress' | 'late' | 'completed' | 'expired';
  page?: number;
  limit?: number;
}

export interface Assignment {
  id: string;
  taskId: string;
  workerId: string;
  status: string;
  startedAt: string | null;
  dueAt: string | null;
  createdAt: string;
  task?: {
    id: string;
    title: string;
    category: string | null;
    reward: string;
    deadline: string | null;
  };
  submission?: {
    id: string;
    status: string;
    submittedAt: string;
  } | null;
}

export interface AcceptTaskResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    taskId: string;
    workerId: string;
    status: string;
    startedAt: string;
    dueAt: string;
    createdAt: string;
    task: {
      title: string;
      reward: string;
      deadline: string | null;
    };
  };
}

export interface AssignmentListResponse {
  success: boolean;
  data: {
    data: Assignment[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface MyAssignmentsResponse {
  success: boolean;
  data: Assignment[];
}

// API Functions
export const assignmentsApi = {
  // POST /api/assignments/accept
  acceptTask: async (data: AcceptTaskRequest): Promise<AcceptTaskResponse> => {
    return await apiFetch('/assignments/accept', {
      method: 'POST',
      headers: getHeaders(true), // ✅ Include auth token
      body: JSON.stringify(data),
    });
  },

  // GET /api/assignments/list
  listAssignments: async (query?: ListAssignmentsQuery): Promise<AssignmentListResponse> => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/assignments/list?${queryString}` : '/assignments/list';
    
    return await apiFetch(endpoint, {
      method: 'GET',
      headers: getHeaders(true), // ✅ Include auth token
    });
  },

  // GET /api/assignments/my-assignments
  // Gets assignments for the authenticated user (workerId from JWT token)
  getMyAssignments: async (userId?: string): Promise<MyAssignmentsResponse> => {
    const params = userId ? `?workerId=${userId}` : '';
    return await apiFetch(`/tasks/assignments/my-assignments${params}`, {
      method: 'GET',
      headers: getHeaders(true), // ✅ Include auth token
    });
  },
};
