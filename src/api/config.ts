// API Configuration
// In production, use relative URLs to leverage Next.js rewrites (bypassing CORS)
// In development, use the full backend URL

// Type declaration for process (Next.js environment)
declare const process: {
  env: {
    NEXT_PUBLIC_API_URL?: string;
  };
};

const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    // Client-side: Check if we're in production
    const hostname = window.location.hostname;
    if (hostname === 'frontendpaytask.onrender.com' || hostname.includes('vercel.app')) {
      return '/api'; // Use relative URL in production to proxy through Next.js
    }
  }
  // Server-side or development
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';
};

const API_BASE_URL = getApiBaseUrl();

// Helper function to get auth token
export const getAuthToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('accessToken');
  }
  return null;
};

// Helper function to set auth token
export const setAuthToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('accessToken', token);
  }
};

// Helper function to remove auth token
export const removeAuthToken = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('accessToken');
  }
};

// Default headers
export const getHeaders = (includeAuth = false): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (includeAuth) {
    const token = getAuthToken();
    console.log('🔑 getHeaders - Token check:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPreview: token ? `${token.substring(0, 30)}...` : 'NO TOKEN',
    });
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    } else {
      console.error('❌ NO TOKEN FOUND - User may not be logged in');
    }
  }

  return headers;
};

// API Error Response Type
export interface ApiError {
  success: false;
  error: {
    message: string;
    code: string;
    details?: any;
  };
}

// API Success Response Type
export interface ApiSuccess<T = any> {
  success: true;
  data: T;
  message?: string;
}

export type ApiResponse<T = any> = ApiSuccess<T> | ApiError;

// Base fetch wrapper
export const apiFetch = async <T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> => {
  const url = `${API_BASE_URL}${endpoint}`;
  
  try {
    console.log('🌐 API Request:', {
      url,
      method: options.method || 'GET',
      headers: options.headers,
    });
    
    const response = await fetch(url, {
      ...options,
      headers: {
        ...options.headers,
      },
    });

    const data = await response.json();
    
    console.log('📦 API Response:', {
      url,
      status: response.status,
      ok: response.ok,
      dataKeys: Object.keys(data),
      data: data,
    });

    if (!response.ok) {
      throw data;
    }

    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
};

export { API_BASE_URL };
