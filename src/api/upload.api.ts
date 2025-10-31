// Upload API
import { apiFetch, getHeaders } from './config';

export interface UploadedFile {
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
}

export interface UploadFilesResponse {
  success: boolean;
  files: UploadedFile[];
}

export const uploadApi = {
  /**
   * Upload files to server
   */
  uploadFiles: async (files: File[]): Promise<UploadFilesResponse> => {
    const formData = new FormData();
    
    files.forEach((file, index) => {
      formData.append(`file${index}`, file);
    });

    const token = localStorage.getItem('token');
    console.log('🔑 Upload - Token check:', {
      hasToken: !!token,
      tokenLength: token?.length,
      tokenPreview: token ? `${token.substring(0, 20)}...` : 'none'
    });
    
    const headers: Record<string, string> = {};
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/uploads/files`, {
      method: 'POST',
      headers,
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('❌ Upload failed:', { status: response.status, error });
      throw error;
    }

    return response.json();
  },

  /**
   * Get file URL
   */
  getFileUrl: (filename: string): string => {
    return `${process.env.NEXT_PUBLIC_API_URL}/uploads/files/${filename}`;
  },
};
