import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Backblaze B2 S3-compatible client
const b2Client = new S3Client({
  endpoint: `https://${import.meta.env.VITE_B2_ENDPOINT}`,
  region: import.meta.env.VITE_B2_REGION,
  credentials: {
    accessKeyId: import.meta.env.VITE_B2_KEY_ID,
    secretAccessKey: import.meta.env.VITE_B2_APPLICATION_KEY,
  },
});

const bucketName = import.meta.env.VITE_B2_BUCKET_NAME;

/**
 * Upload file to Backblaze B2
 * @param file File to upload
 * @param folder Folder path (e.g., 'images', 'audio')
 * @returns Public URL of uploaded file
 */
export async function uploadToB2(file: File, folder: string): Promise<string> {
  const fileName = `${folder}/${Date.now()}-${file.name}`;
  
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: fileName,
    Body: file,
    ContentType: file.type,
    ACL: 'public-read',
  });

  await b2Client.send(command);

  // Construct public URL
  const publicUrl = `https://${import.meta.env.VITE_B2_ENDPOINT}/file/${bucketName}/${fileName}`;
  return publicUrl;
}

/**
 * Delete file from Backblaze B2
 * @param fileUrl Full URL of the file to delete
 */
export async function deleteFromB2(fileUrl: string): Promise<void> {
  // Extract file key from URL
  const urlParts = fileUrl.split(`/file/${bucketName}/`);
  if (urlParts.length < 2) {
    throw new Error('Invalid B2 file URL');
  }
  
  const fileKey = urlParts[1];

  const command = new DeleteObjectCommand({
    Bucket: bucketName,
    Key: fileKey,
  });

  await b2Client.send(command);
}
