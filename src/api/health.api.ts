// Health Check API
import { apiFetch, getHeaders } from './config';

// Types
export interface HealthCheckResponse {
  status: string;
  timestamp: string;
  uptime: number;
  version: string;
}

export interface ReadinessCheckResponse {
  status: string;
  checks: {
    database: string;
    [key: string]: string;
  };
}

export interface LivenessCheckResponse {
  status: string;
  timestamp: string;
}

// API Functions
export const healthApi = {
  // GET /api/health
  healthCheck: async (): Promise<HealthCheckResponse> => {
    return await apiFetch('/health', {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // GET /api/health/ready
  readinessCheck: async (): Promise<ReadinessCheckResponse> => {
    return await apiFetch('/health/ready', {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // GET /api/health/live
  livenessCheck: async (): Promise<LivenessCheckResponse> => {
    return await apiFetch('/health/live', {
      method: 'GET',
      headers: getHeaders(),
    });
  },
};
