import React from 'react';
import { CheckCircle, XCircle } from 'lucide-react';
import { UseMutationResult } from '@tanstack/react-query';
import { ApiResponse } from '../../../services/api/types';

interface UploadStatusProps {
  mutation: UseMutationResult<ApiResponse, Error, File>;
}

export function UploadStatus({ mutation }: UploadStatusProps) {
  if (mutation.isSuccess) {
    return (
      <div className="flex items-center gap-2 text-green-600 bg-green-50 p-3 rounded-lg">
        <CheckCircle className="h-5 w-5" />
        <span>{mutation.data?.message || 'فایل با موفقیت آپلود شد'}</span>
      </div>
    );
  }

  if (mutation.isError) {
    return (
      <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded-lg">
        <XCircle className="h-5 w-5" />
        <span>
          {mutation.error instanceof Error 
            ? mutation.error.message 
            : 'خطا در آپلود فایل'}
        </span>
      </div>
    );
  }

  return null;
}