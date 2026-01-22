/**
 * Upload file to Backblaze B2 via secure backend endpoint
 * @param file File to upload
 * @param folder Folder path (e.g., 'images', 'audio', 'covers')
 * @returns Public URL of uploaded file
 * @version 2025-01-22-FIX
 */
export async function uploadToB2(file: File, folder: 'images' | 'audio' | 'covers'): Promise<string> {
  console.log('✅ NEW CODE v2025 RUNNING -', file.name);
  
  // Converter arquivo para base64
  const base64 = await fileToBase64(file);

  const payload = {
    fileBase64: base64,
    fileName: file.name,
    folder,
    contentType: file.type,
  };

  // Enviar no BODY (não na URL!)
  const requestBody = JSON.stringify({ "0": { "json": payload } });
  
  console.log('📤 Sending POST request with body size:', requestBody.length);
  
  const response = await fetch('/api/trpc/storage.upload?batch=1', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: requestBody,
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Upload error response:', error);
    throw new Error(`Upload failed with status ${response.status}: ${error}`);
  }

  const result = await response.json();
  
  // DEBUG: Check what we got
  console.log('🔍 CACHE BUSTER 2025:', new Date().toISOString());
  console.log('🔍 Result structure:', JSON.stringify(result, null, 2));
  
  // tRPC returns: [{ result: { data: { json: {...} } } }]
  const jsonData = result[0]?.result?.data?.json;
  console.log('🔍 Extracted jsonData:', jsonData);
  
  if (!jsonData?.success || !jsonData?.url) {
    console.error('❌ Upload failed - invalid structure');
    console.error('❌ Full result:', JSON.stringify(result, null, 2));
    throw new Error('Upload failed - invalid response');
  }

  console.log('✅ SUCCESS! File uploaded to:', jsonData.url);
  return jsonData.url;
}

/**
 * Delete file from Backblaze B2 via secure backend endpoint
 * @param fileUrl Full URL of the file to delete
 */
export async function deleteFromB2(fileUrl: string): Promise<void> {
  const input = { fileUrl };
  const url = `/api/trpc/storage.delete?batch=1&input=${encodeURIComponent(JSON.stringify({ "0": { "json": input } }))}`;
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    const error = await response.text();
    console.error('Delete error:', error);
    throw new Error('Failed to delete file');
  }
}

/**
 * Helper: Convert File to base64
 */
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      // Remove data URL prefix (e.g., "data:image/png;base64,")
      const base64 = result.split(',')[1];
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

