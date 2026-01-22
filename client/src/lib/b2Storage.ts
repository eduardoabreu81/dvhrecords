import { trpc } from './trpc';

/**
 * Upload file to Backblaze B2 via secure backend endpoint
 * @param file File to upload
 * @param folder Folder path (e.g., 'images', 'audio', 'covers')
 * @returns Public URL of uploaded file
 */
export async function uploadToB2(file: File, folder: 'images' | 'audio' | 'covers'): Promise<string> {
  // Converter arquivo para base64
  const base64 = await fileToBase64(file);

  // Chamar endpoint backend seguro
  const result = await trpc.storage.upload.mutate({
    fileBase64: base64,
    fileName: file.name,
    folder,
    contentType: file.type,
  });

  if (!result.success || !result.url) {
    throw new Error('Upload failed');
  }

  return result.url;
}

/**
 * Delete file from Backblaze B2 via secure backend endpoint
 * @param fileUrl Full URL of the file to delete
 */
export async function deleteFromB2(fileUrl: string): Promise<void> {
  await trpc.storage.delete.mutate({ fileUrl });
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

