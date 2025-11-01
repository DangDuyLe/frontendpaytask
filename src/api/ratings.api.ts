// Ratings API
import { apiFetch, getHeaders } from './config';

// Types
export interface CreateRatingRequest {
  toUserId: string;
  taskId: string;
  score: number;
  comment?: string;
}

export interface RatingQuery {
  page?: number;
  limit?: number;
}

export interface RatingStatsQuery {
  includeRecent?: boolean;
}

export interface Rating {
  id: string;
  fromUserId: string;
  toUserId: string;
  taskId: string;
  score: number;
  comment?: string;
  createdAt: string;
}

export interface RatingListResponse {
  success: boolean;
  data: {
    data: Rating[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface RatingDetailResponse {
  success: boolean;
  data: Rating;
}

export interface RatingStatsResponse {
  success: boolean;
  data: {
    averageScore: number;
    totalRatings: number;
    ratingDistribution: {
      1: number;
      2: number;
      3: number;
      4: number;
      5: number;
    };
    recentRatings?: Rating[];
  };
}

// API Functions
export const ratingsApi = {
  // POST /api/ratings
  createRating: async (data: CreateRatingRequest): Promise<RatingDetailResponse> => {
    return await apiFetch('/ratings', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  // GET /api/ratings
  getAllRatings: async (query?: RatingQuery): Promise<RatingListResponse> => {
    const params = new URLSearchParams();
    if (query) {
      Object.entries(query).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/ratings?${queryString}` : '/ratings';
    
    return await apiFetch(endpoint, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // GET /api/ratings/:id
  getRatingById: async (ratingId: string): Promise<RatingDetailResponse> => {
    return await apiFetch(`/ratings/${ratingId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // GET /api/ratings/task/:taskId
  getRatingsByTask: async (taskId: string): Promise<RatingListResponse> => {
    return await apiFetch(`/ratings/task/${taskId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // GET /api/ratings/given-by/:userId
  getRatingsGivenByUser: async (userId: string): Promise<RatingListResponse> => {
    return await apiFetch(`/ratings/given-by/${userId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // GET /api/ratings/received-by/:userId
  getRatingsReceivedByUser: async (userId: string): Promise<RatingListResponse> => {
    return await apiFetch(`/ratings/received-by/${userId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // GET /api/ratings/stats/:userId
  getRatingStats: async (userId: string, query?: RatingStatsQuery): Promise<RatingStatsResponse> => {
    const params = new URLSearchParams();
    if (query?.includeRecent !== undefined) {
      params.append('includeRecent', query.includeRecent.toString());
    }
    
    const queryString = params.toString();
    const endpoint = queryString ? `/ratings/stats/${userId}?${queryString}` : `/ratings/stats/${userId}`;
    
    return await apiFetch(endpoint, {
      method: 'GET',
      headers: getHeaders(),
    });
  },
};
