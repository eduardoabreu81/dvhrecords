/**
 * Upload file to Backblaze B2 via Netlify Function
 * @param file File to upload
 * @param folder Folder path (e.g., 'images', 'audio', 'covers')
 * @returns Public URL of uploaded file
 */
export async function uploadToB2(file: File, folder: 'images' | 'audio' | 'covers'): Promise<string> {
  console.log('📤 Uploading file to B2:', file.name);
  
  try {
    // Convert file to base64
    const base64 = await fileToBase64(file);

    const payload = {
      fileBase64: base64,
      fileName: file.name,
      folder,
      contentType: file.type,
    };

    // Call Netlify Function
    const response = await fetch('/.netlify/functions/upload', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error('Upload error response:', error);
      throw new Error(`Upload failed with status ${response.status}`);
    }

    const result = await response.json();
    
    if (!result.success || !result.url) {
      throw new Error('Upload failed - invalid response');
    }

    console.log('✅ File uploaded successfully:', result.url);
    return result.url;
  } catch (error) {
    console.error('❌ Upload error:', error);
    throw error;
  }
}

/**
 * Delete file from Backblaze B2
 * Note: Delete functionality requires additional B2 API implementation
 */
export async function deleteFromB2(fileUrl: string): Promise<void> {
  console.log('Delete not implemented yet:', fileUrl);
  // TODO: Implement delete via Netlify Function if needed
}

/**
 * Helper: Convert File to base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

