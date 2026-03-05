
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
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      try {
        const errorData = await response.json();
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch (e) {
        errorMessage = `Server Error: ${response.status}`;
      }
    } else {
      // If we got HTML (like a 404 or redirect), it's likely a session issue
      if (response.status === 401) errorMessage = 'Session expired. Please log in again.';
      else errorMessage = `Server Error: ${response.status} (Check login status)`;
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

