// Error Logs API
import { apiFetch, getHeaders } from './config';

// Types
export interface CreateErrorLogRequest {
  errorCode: string;
  errorMessage: string;
  errorStack?: string;
  endpoint?: string;
  method?: string;
  userId?: string;
  requestBody?: any;
  requestParams?: any;
  requestQuery?: any;
  userAgent?: string;
  ipAddress?: string;
  severity?: 'info' | 'warning' | 'error' | 'critical';
}

export interface ListErrorLogsQuery {
  page?: number;
  limit?: number;
  severity?: 'info' | 'warning' | 'error' | 'critical';
  resolved?: boolean;
  errorCode?: string;
  userId?: string;
  endpoint?: string;
  startDate?: string;
  endDate?: string;
}

export interface ResolveErrorLogRequest {
  resolvedBy: string;
  notes?: string;
}

export interface ErrorLog {
  id: string;
  errorCode: string;
  errorMessage: string;
  errorStack?: string;
  endpoint?: string;
  method?: string;
  userId?: string;
  severity: string;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: string;
  createdAt: string;
}

export interface ErrorLogListResponse {
  success: boolean;
  data: {
    data: ErrorLog[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface ErrorLogDetailResponse {
  success: boolean;
  data: ErrorLog;
}

export interface ErrorLogStatisticsResponse {
  success: boolean;
  data: {
    totalErrors: number;
    resolvedErrors: number;
    unresolvedErrors: number;
    bySeverity: {
      info: number;
      warning: number;
      error: number;
      critical: number;
    };
    byEndpoint: Array<{
      endpoint: string;
      count: number;
    }>;
  };
}

export interface CleanupResponse {
  success: boolean;
  data: {
    deleted: number;
  };
}

// API Functions
export const errorLogsApi = {
  // POST /api/errorlogs
  createErrorLog: async (data: CreateErrorLogRequest): Promise<ErrorLogDetailResponse> => {
    return await apiFetch('/errorlogs', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  // GET /api/errorlogs
  listErrorLogs: async (query?: ListErrorLogsQuery): Promise<ErrorLogListResponse> => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/errorlogs?${queryString}` : '/errorlogs';
    
    return await apiFetch(endpoint, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // GET /api/errorlogs/statistics
  getStatistics: async (startDate?: string, endDate?: string): Promise<ErrorLogStatisticsResponse> => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    
    const queryString = params.toString();
    const endpoint = queryString ? `/errorlogs/statistics?${queryString}` : '/errorlogs/statistics';
    
    return await apiFetch(endpoint, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // GET /api/errorlogs/:id
  getErrorLogById: async (errorLogId: string): Promise<ErrorLogDetailResponse> => {
    return await apiFetch(`/errorlogs/${errorLogId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // PATCH /api/errorlogs/:id/resolve
  resolveErrorLog: async (errorLogId: string, data: ResolveErrorLogRequest): Promise<ErrorLogDetailResponse> => {
    return await apiFetch(`/errorlogs/${errorLogId}/resolve`, {
      method: 'PATCH',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/errorlogs/cleanup
  cleanup: async (daysOld: number = 30): Promise<CleanupResponse> => {
    return await apiFetch(`/errorlogs/cleanup?daysOld=${daysOld}`, {
      method: 'DELETE',
      headers: getHeaders(),
    });
  },
};
