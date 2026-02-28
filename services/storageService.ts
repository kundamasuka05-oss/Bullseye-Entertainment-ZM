
interface UploadResult {
  url: string;
  path: string;
}

export const uploadImage = async (
  file: File, 
  folder: string = 'public',
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  const formData = new FormData();
  formData.append('image', file);

  if (onProgress) onProgress(20);

  const token = localStorage.getItem('admin_token');
  const headers: any = {};
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
    headers
  });

  if (onProgress) onProgress(80);

  if (!response.ok) {
    let errorMessage = 'Upload failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.error || errorData.message || errorMessage;
      if (errorData.details) console.error("UPLOAD: Server details:", errorData.details);
    } catch (e) {
      errorMessage = `Server Error: ${response.status}`;
    }
    throw new Error(errorMessage);
  }

  const data = await response.json();
  
  if (onProgress) onProgress(100);

  return {
    url: data.url,
    path: data.url
  };
};

export const deleteImage = async (path: string): Promise<void> => {
  // Local deletion not implemented in this simple version
  console.log("Delete request for:", path);
};

