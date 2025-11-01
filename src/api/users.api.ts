// Users API
import { apiFetch, getHeaders } from './config';

// Types
export interface UpdateProfileRequest {
  email?: string;
  username?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  username: string;
  role: string;
  createdAt: string;
  isActive: boolean;
}

export interface UserProfileResponse {
  success?: boolean;
  data?: UserProfile;
}

// API Functions
export const usersApi = {
  // GET /api/users/profile
  getProfile: async (): Promise<UserProfile> => {
    return await apiFetch('/users/profile', {
      method: 'GET',
      headers: getHeaders(true),
    });
  },

  // PUT /api/users/profile
  updateProfile: async (data: UpdateProfileRequest): Promise<UserProfile> => {
    return await apiFetch('/users/profile', {
      method: 'PUT',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  // DELETE /api/users/profile
  deactivateAccount: async (): Promise<{ message: string }> => {
    return await apiFetch('/users/profile', {
      method: 'DELETE',
      headers: getHeaders(true),
    });
  },

  // GET /api/users
  getAllUsers: async (): Promise<UserProfile[]> => {
    return await apiFetch('/users', {
      method: 'GET',
      headers: getHeaders(true),
    });
  },

  // GET /api/users/:id
  getUserById: async (userId: string): Promise<UserProfile> => {
    return await apiFetch(`/users/${userId}`, {
      method: 'GET',
      headers: getHeaders(true),
    });
  },
};
