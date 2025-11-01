// Authentication API
import { apiFetch, getHeaders, setAuthToken, removeAuthToken } from './config';

// Types
export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  role?: 'worker' | 'client';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    expiresAt: string;
    user: {
      id: string;
      email: string;
      username: string;
      role: string;
      isActive: boolean;
      createdAt: string;
    };
    wallet: {
      id: string;
      name: string;
      addresses: any;
      isActive: boolean;
      createdAt: string;
    } | null;
    session: {
      id: string;
      createdAt: string;
      expiresAt: string;
    };
  };
}

export interface LogoutResponse {
  message: string;
}

// API Functions
export const authApi = {
  // POST /api/auth/register
  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await apiFetch<AuthResponse>('/auth/register', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    // Save token to localStorage
    if (response.success && response.data.accessToken) {
      setAuthToken(response.data.accessToken);
    }
    
    return response;
  },

  // POST /api/auth/login
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await apiFetch<AuthResponse>('/auth/login', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
    
    // Save token to localStorage
    if (response.success && response.data.accessToken) {
      setAuthToken(response.data.accessToken);
    }
    
    return response;
  },

  // POST /api/auth/logout
  logout: async (): Promise<LogoutResponse> => {
    const response = await apiFetch<LogoutResponse>('/auth/logout', {
      method: 'POST',
      headers: getHeaders(true),
    });
    
    // Remove token from localStorage
    removeAuthToken();
    
    return response;
  },

  // GET /api/auth/me (if exists)
  getCurrentUser: async (): Promise<any> => {
    return await apiFetch('/auth/me', {
      method: 'GET',
      headers: getHeaders(true),
    });
  },
};
