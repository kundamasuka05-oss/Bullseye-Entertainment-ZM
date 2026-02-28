
import React, { useState, useCallback } from 'react';
import { Upload, X, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { uploadImage } from '../services/storageService';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  folderPath?: string;
  maxSizeMB?: number;
  className?: string;
  label?: string;
  disabled?: boolean;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  onUploadComplete,
  folderPath = 'public',
  maxSizeMB = 5,
  className = '',
  label = "Upload Image",
  disabled = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('JPG, PNG, or WebP only.');
      return false;
    }
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`Max size: ${maxSizeMB}MB.`);
      return false;
    }
    return true;
  };

  const handleUpload = async (file: File) => {
    if (disabled || !validateFile(file)) return;

    setIsUploading(true);
    setIsSuccess(false);
    setError(null);
    setUploadProgress(5);

    // Instant local preview for UX
    const objectUrl = URL.createObjectURL(file);
    setPreview(objectUrl);

    try {
      console.log("UI: Initiating storage transmission...");
      const result = await uploadImage(
        file, 
        folderPath, 
        (progress) => setUploadProgress(progress)
      );
      
      console.log("UI: Transmission success. Relaying URL to form.");
      onUploadComplete(result.url);
      setUploadProgress(100);
      setIsSuccess(true);
    } catch (err: any) {
      console.error("UI: Upload failed:", err);
      setError(err.message || 'Transmission Interrupted.');
      setUploadProgress(0);
    } finally {
      setIsUploading(false);
    }
  };

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
    setIsSuccess(false);
  };

  return (
    <div className={`w-full ${className}`}>
      {label && <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">{label}</label>}
      
      {!preview ? (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={(e) => { e.preventDefault(); setIsDragging(false); }}
          onDrop={(e) => {
            e.preventDefault();
            setIsDragging(false);
            if (e.dataTransfer.files?.length) handleUpload(e.dataTransfer.files[0]);
          }}
          className={`relative border-2 border-dashed rounded-lg p-6 flex flex-col items-center justify-center transition-all cursor-pointer bg-black/40
            ${disabled ? 'opacity-50 cursor-not-allowed' : (isDragging ? 'border-bullseye-blue bg-bullseye-blue/5' : 'border-white/10 hover:border-white/30')}
            ${error ? 'border-red-500 bg-red-500/5' : ''}
          `}
        >
          <input
            type="file"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={onFileSelect}
            accept="image/png, image/jpeg, image/webp"
            disabled={isUploading || disabled}
          />
          
          <div className="bg-white/5 p-3 rounded-full mb-3">
            <Upload className={`w-6 h-6 ${isDragging ? 'text-bullseye-blue' : 'text-gray-500'}`} />
          </div>
          
          <p className="text-[10px] font-black text-white uppercase tracking-widest text-center">
            Deploy Local File
          </p>
          
          {error && (
            <p className="text-[9px] text-red-500 mt-3 font-bold flex items-center bg-red-500/10 px-2 py-1 rounded">
              <AlertCircle size={10} className="mr-1" /> {error}
            </p>
          )}
        </div>
      ) : (
        <div className={`relative border rounded-lg p-3 ${error ? 'border-red-500/30 bg-red-500/5' : (isSuccess ? 'border-green-500/30 bg-green-500/5' : 'border-white/10 bg-white/5')}`}>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <img src={preview} alt="Preview" className="w-12 h-12 object-cover rounded bg-black border border-white/10" />
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 rounded flex items-center justify-center">
                  <Loader2 size={16} className="text-bullseye-blue animate-spin" />
                </div>
              )}
            </div>
            
            <div className="flex-grow min-w-0">
              <div className="flex justify-between items-center mb-1">
                <span className={`text-[10px] font-bold uppercase tracking-widest flex items-center ${error ? 'text-red-500' : (isSuccess ? 'text-green-500' : 'text-gray-400')}`}>
                  {isSuccess && <CheckCircle2 size={10} className="mr-1" />}
                  {error ? error : (isUploading ? 'Transmitting...' : (isSuccess ? 'Transfer Complete' : 'Ready'))}
                </span>
                <span className="text-[10px] font-mono text-white">{Math.round(uploadProgress)}%</span>
              </div>
              
              <div className="w-full bg-white/5 rounded-full h-1 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${error ? 'bg-red-500' : (isSuccess ? 'bg-green-500' : 'bg-bullseye-blue')}`}
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
            </div>

            <button 
              onClick={clearSelection}
              disabled={disabled}
              className={`p-1 hover:bg-white/10 rounded-full transition-colors text-gray-500 hover:text-white ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
