// Reviews API
import { apiFetch, getHeaders } from './config';

// Types
export interface AcceptSubmissionRequest {
  submissionId: string;
  feedback?: string;
}

export interface RejectSubmissionRequest {
  submissionId: string;
  feedback: string;
}

export interface RefundTaskRequest {
  taskId: string;
  reason: string;
}

export interface Review {
  id: string;
  submissionId: string;
  reviewerId: string;
  decision: string;
  feedback?: string;
  createdAt: string;
}

export interface ReviewDetailResponse {
  success: boolean;
  data: Review;
}

export interface AcceptSubmissionResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface RejectSubmissionResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface RefundTaskResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface PendingRefundsResponse {
  success: boolean;
  data: any[];
}

// API Functions
export const reviewsApi = {
  // POST /api/reviews/accept
  acceptSubmission: async (data: AcceptSubmissionRequest): Promise<AcceptSubmissionResponse> => {
    return await apiFetch('/reviews/accept', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  // POST /api/reviews/reject
  rejectSubmission: async (data: RejectSubmissionRequest): Promise<RejectSubmissionResponse> => {
    return await apiFetch('/reviews/reject', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  // POST /api/reviews/refund
  refundTask: async (data: RefundTaskRequest): Promise<RefundTaskResponse> => {
    return await apiFetch('/reviews/refund', {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },

  // GET /api/reviews/:id
  getReviewById: async (reviewId: string): Promise<ReviewDetailResponse> => {
    return await apiFetch(`/reviews/${reviewId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // GET /api/reviews/submission/:submissionId
  getReviewsBySubmission: async (submissionId: string): Promise<{ success: boolean; data: Review[] }> => {
    return await apiFetch(`/reviews/submission/${submissionId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // GET /api/reviews/admin/pending-refunds
  getPendingRefunds: async (): Promise<PendingRefundsResponse> => {
    return await apiFetch('/reviews/admin/pending-refunds', {
      method: 'GET',
      headers: getHeaders(true),
    });
  },
};
