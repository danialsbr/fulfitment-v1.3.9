import React from 'react';
import { Upload } from 'lucide-react';
import { UploadForm } from './UploadForm';

export function FileUpload() {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <div className="flex items-center gap-3 mb-6">
        <Upload className="h-6 w-6 text-blue-500" />
        <h2 className="text-lg font-semibold">آپلود فایل سفارشات</h2>
      </div>
      <UploadForm />
    </div>
  );
}