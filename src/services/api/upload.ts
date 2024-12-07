import { api } from './config';
import type { ApiResponse, UploadResponse } from './types';

export const uploadApi = {
  uploadFile: async (file: File): Promise<ApiResponse<UploadResponse>> => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await api.post<ApiResponse<UploadResponse>>('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (!response.success) {
        throw new Error(response.message || 'خطا در آپلود فایل');
      }
      
      return response;
    } catch (error: any) {
      const errorMessage = error.response?.data?.message || error.message || 'خطا در آپلود فایل';
      throw new Error(errorMessage);
    }
  },
};