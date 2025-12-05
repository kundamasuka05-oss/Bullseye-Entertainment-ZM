import React, { useState, useCallback } from 'react';
import { Upload, X, Trash2, CheckCircle, AlertCircle } from 'lucide-react';
import { uploadImage } from '../services/storageService';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  folderPath?: string;
  collectionName?: string; // If provided, saves metadata to Firestore
  maxSizeMB?: number;
  className?: string;
  label?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  folderPath = 'uploads',
  collectionName,
  maxSizeMB = 5,
  className = '',
  label = "Upload Image"
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    // Check type
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPG, PNG, and WebP files are allowed.');
      return false;
    }
    // Check size
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size must be less than ${maxSizeMB}MB.`);
      return false;
    }
    return true;
  };

  const handleUpload = async (file: File) => {
    if (!validateFile(file)) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(1); // Start at 1% so the bar appears

    // Create local preview immediately
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      const result = await uploadImage(
        file, 
        folderPath, 
        collectionName, 
        (progress) => setUploadProgress(progress)
      );
      
      onUploadComplete(result.url);
      setUploadProgress(100);
      setIsUploading(false);
    } catch (err: any) {
      console.error(err);
      setError('Upload failed. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // --- Drag and Drop Handlers ---
  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files[0]);
    }
  }, []);

  const onFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUpload(e.target.files[0]);
    }
  };

  const clearSelection = () => {
    setPreview(null);
    setUploadProgress(0);
    setError(null);
    setIsUploading(false);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>}
      
      {!preview ? (
        <div
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
          className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-colors cursor-pointer
            ${isDragging ? 'border-bullseye-red bg-red-50' : 'border-gray-300 hover:border-bullseye-red hover:bg-gray-50'}
            ${error ? 'border-red-500 bg-red-50' : ''}
          `}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={onFileSelect}
            accept="image/png, image/jpeg, image/webp"
            disabled={isUploading}
          />
          
          <div className="bg-white p-3 rounded-full shadow-sm mb-3">
            <Upload className={`w-6 h-6 ${isDragging ? 'text-bullseye-red' : 'text-gray-400'}`} />
          </div>
          
          <p className="text-sm font-medium text-gray-900 text-center">
            Click to upload or drag and drop
          </p>
          <p className="text-xs text-gray-500 mt-1">
            JPG, PNG up to {maxSizeMB}MB
          </p>
          
          {error && (
            <p className="text-xs text-red-600 mt-2 font-medium flex items-center">
              <AlertCircle size={12} className="mr-1" /> {error}
            </p>
          )}
        </div>
      ) : (
        <div className={`relative border rounded-lg p-2 ${error ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-gray-50'}`}>
          <div className="flex items-center space-x-4">
            <img src={preview} alt="Preview" className="w-16 h-16 object-cover rounded bg-white shadow-sm flex-shrink-0" />
            
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-sm font-medium truncate max-w-[150px] ${error ? 'text-red-700' : 'text-gray-700'}`}>
                  {error ? 'Upload Error' : (isUploading ? 'Uploading...' : 'Upload Complete')}
                </span>
                <span className="text-xs text-gray-500">{Math.round(uploadProgress)}%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${error ? 'bg-red-500' : (isUploading ? 'bg-bullseye-red' : 'bg-green-500')}`}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>

            <button 
              onClick={clearSelection}
              className="p-1 hover:bg-gray-200 rounded-full transition-colors text-gray-500"
              title="Remove"
            >
              <X size={18} />
            </button>
          </div>
          {error && (
             <p className="text-xs text-red-600 mt-2 ml-20">
               {error}
             </p>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageUpload;