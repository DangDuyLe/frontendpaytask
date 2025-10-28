// Submissions API
import { apiFetch, getHeaders } from './config';

// Types
export interface CreateSubmissionRequest {
  assignmentId: string;
  payloadUrl: string;
  payloadHash: string;
  metadata?: {
    fileSize: number;
    fileName: string;
    mimeType: string;
  };
}

export interface RequestFixRequest {
  feedback: string;
}

export interface Submission {
  id: string;
  assignmentId: string;
  payloadUrl: string;
  payloadHash: string;
  qaFlags: {
    passed: boolean;
    checks: {
      completeness: boolean;
      duplicate: boolean;
      format: boolean;
      size: boolean;
    };
  };
  status: string;
  submittedAt: string;
  earlySubmission: boolean;
  hoursEarly: number;
  bonusPoints: number;
}

export interface CreateSubmissionResponse {
  success: boolean;
  message: string;
  data: Submission;
}

export interface SubmissionDetailResponse {
  success: boolean;
  data: Submission;
}

export interface RequestFixResponse {
  success: boolean;
  message: string;
  data: {
    submissionId: string;
    status: string;
    feedback: string;
    workerNotificationId: string;
    clientNotificationId: string;
    worker: {
      id: string;
      email: string;
      username: string;
    };
    client: {
      id: string;
    };
  };
}

// API Functions
export const submissionsApi = {
  // POST /api/submissions/create
  createSubmission: async (data: CreateSubmissionRequest): Promise<CreateSubmissionResponse> => {
    return await apiFetch('/submissions/create', {
      method: 'POST',
      headers: getHeaders(),
      body: JSON.stringify(data),
    });
  },

  // GET /api/submissions/:submissionId
  getSubmissionById: async (submissionId: string): Promise<SubmissionDetailResponse> => {
    return await apiFetch(`/submissions/${submissionId}`, {
      method: 'GET',
      headers: getHeaders(),
    });
  },

  // POST /api/submissions/:id/request-fix
  requestFix: async (submissionId: string, data: RequestFixRequest): Promise<RequestFixResponse> => {
    return await apiFetch(`/submissions/${submissionId}/request-fix`, {
      method: 'POST',
      headers: getHeaders(true),
      body: JSON.stringify(data),
    });
  },
};
