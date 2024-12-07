import React, { useState, useCallback } from 'react';
import { Upload, CheckCircle, XCircle } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { fulfillmentApi } from '../../../services/api';
import { UploadStatus } from './UploadStatus';

interface UploadFormProps {
  onSuccess?: () => void;
}

export function UploadForm({ onSuccess }: UploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      try {
        const response = await fulfillmentApi.upload.uploadFile(file);
        return response;
      } catch (error) {
        console.error('Upload error:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      queryClient.invalidateQueries({ queryKey: ['logs'] });
      setFile(null);
      onSuccess?.();
    },
  });

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.xlsx')) {
        setFile(selectedFile);
        if (uploadMutation.error) {
          uploadMutation.reset();
        }
      } else {
        setFile(null);
        uploadMutation.error = new Error('فقط فایل‌های Excel (.xlsx) پذیرفته می‌شوند');
      }
    }
  }, [uploadMutation]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) {
      if (droppedFile.name.endsWith('.xlsx')) {
        setFile(droppedFile);
        if (uploadMutation.error) {
          uploadMutation.reset();
        }
      } else {
        setFile(null);
        uploadMutation.error = new Error('فقط فایل‌های Excel (.xlsx) پذیرفته می‌شوند');
      }
    }
  }, [uploadMutation]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (file) {
      try {
        await uploadMutation.mutateAsync(file);
      } catch (error) {
        console.error('Upload error:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div 
        className="border-2 border-dashed border-gray-300 rounded-lg p-6"
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileChange}
          className="hidden"
          id="file-upload"
        />
        <label
          htmlFor="file-upload"
          className="flex flex-col items-center gap-2 cursor-pointer"
        >
          <Upload className="h-8 w-8 text-gray-400" />
          <span className="text-sm text-gray-600">
            فایل اکسل را انتخاب کنید یا اینجا رها کنید
          </span>
          {file && (
            <span className="text-sm text-blue-500 font-medium mt-2">
              {file.name}
            </span>
          )}
        </label>
      </div>

      <button
        type="submit"
        disabled={!file || uploadMutation.isPending}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {uploadMutation.isPending ? 'در حال آپلود...' : 'آپلود فایل'}
      </button>

      <UploadStatus mutation={uploadMutation} />
    </form>
  );
}