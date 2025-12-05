import { storage, db } from '../firebaseConfig';
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";

interface UploadResult {
  url: string;
  path: string;
  id?: string;
}

// Helper: Simulate upload for demo/offline/error states
const simulateMockUpload = (
  file: File, 
  folder: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  return new Promise((resolve) => {
    let p = 0;
    // Fast simulation: 20% every 150ms
    const interval = setInterval(() => {
      p += 20;
      if (onProgress) onProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        resolve({ 
          url: URL.createObjectURL(file), 
          path: `mock/${folder}/${Date.now()}_${file.name}`,
          id: `mock-doc-${Date.now()}`
        });
      }
    }, 150);
  });
};

/**
 * Uploads a file to Firebase Storage and optionally saves metadata to Firestore.
 * Automatically falls back to mock simulation if credentials are invalid or upload fails.
 */
export const uploadImage = async (
  file: File, 
  folder: string = 'uploads',
  saveToCollection?: string,
  onProgress?: (progress: number) => void
): Promise<UploadResult> => {
  
  // 1. Proactive Demo Mode Check
  // If we are using the default dummy key, skip real Firebase to avoid timeouts or CORS errors
  const currentApiKey = (storage.app.options as any)?.apiKey;
  const isDemoKey = !currentApiKey || currentApiKey === "AIzaSyDummyKeyForDemoPurposes" || currentApiKey.includes("Dummy");
  
  if (isDemoKey) {
    console.log("Demo Mode detected: Simulating upload instantly.");
    return simulateMockUpload(file, folder, onProgress);
  }

  // 2. Real Upload Logic
  const fileName = `${Date.now()}_${file.name}`;
  const storagePath = `${folder}/${fileName}`;
  const storageRef = ref(storage, storagePath);
  const uploadTask = uploadBytesResumable(storageRef, file);

  return new Promise((resolve, reject) => {
    // Safety timeout: If nothing happens (no progress/error) in 5s, switch to mock
    // This handles cases where the SDK hangs on invalid auth
    const safetyTimeout = setTimeout(() => {
       console.warn("Upload timed out (network/auth issue). Switching to mock simulation.");
       uploadTask.cancel(); 
       simulateMockUpload(file, folder, onProgress).then(resolve);
    }, 5000);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // If we get actual progress, the connection is working; clear the safety timeout
        if (progress > 0) clearTimeout(safetyTimeout);
        if (onProgress) onProgress(progress);
      },
      (error) => {
        clearTimeout(safetyTimeout);
        console.warn("Firebase Upload Error. Switching to mock.", error);
        simulateMockUpload(file, folder, onProgress).then(resolve);
      },
      async () => {
        clearTimeout(safetyTimeout);
        try {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          
          let docId;
          // Save to Firestore (Optional)
          if (saveToCollection) {
            try {
              const docRef = await addDoc(collection(db, saveToCollection), {
                url: downloadURL,
                path: storagePath,
                name: file.name,
                createdAt: new Date().toISOString()
              });
              docId = docRef.id;
            } catch (fsError) {
              console.warn("Firestore write failed (likely permission/config), but upload succeeded.");
            }
          }

          resolve({ url: downloadURL, path: storagePath, id: docId });
        } catch (error) {
           // If getDownloadURL fails, fallback to mock
           console.warn("Failed to get download URL, falling back to mock.", error);
           simulateMockUpload(file, folder, onProgress).then(resolve);
        }
      }
    );
  });
};

/**
 * Deletes an image from Storage and removes its document from Firestore.
 */
export const deleteImage = async (storagePath: string, collectionName?: string, docId?: string): Promise<void> => {
  // If it's a mock path, just return (nothing to delete on server)
  if (!storagePath || storagePath.startsWith('mock/')) {
    console.log("Mock image 'deleted' successfully");
    return;
  }

  try {
    // 1. Delete from Storage
    const storageRef = ref(storage, storagePath);
    await deleteObject(storageRef);

    // 2. Delete from Firestore (if applicable)
    if (collectionName && docId) {
      await deleteDoc(doc(db, collectionName, docId));
    }
  } catch (error) {
    console.error("Delete failed:", error);
    // Suppress error for UI continuity in demo
  }
};