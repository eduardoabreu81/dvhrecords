// Server-side B2 Storage - Credentials protegidas
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

// Garantir que as variáveis de ambiente estão disponíveis
if (!process.env.VITE_B2_ENDPOINT || !process.env.VITE_B2_KEY_ID || !process.env.VITE_B2_APPLICATION_KEY || !process.env.VITE_B2_BUCKET_NAME || !process.env.VITE_B2_REGION) {
  throw new Error('B2 environment variables not configured. Check: VITE_B2_ENDPOINT, VITE_B2_KEY_ID, VITE_B2_APPLICATION_KEY, VITE_B2_BUCKET_NAME, VITE_B2_REGION');
}

// Backblaze B2 S3-compatible client (APENAS NO SERVIDOR)
const b2Client = new S3Client({
  endpoint: `https://${process.env.VITE_B2_ENDPOINT}`,
  region: process.env.VITE_B2_REGION,
  credentials: {
    accessKeyId: process.env.VITE_B2_KEY_ID,
    secretAccessKey: process.env.VITE_B2_APPLICATION_KEY,
  },
});

const bucketName = process.env.VITE_B2_BUCKET_NAME;

/**
 * Upload file to Backblaze B2 (SERVER-SIDE ONLY)
 * @param fileBuffer File buffer
 * @param fileName Original file name
 * @param folder Folder path (e.g., 'images', 'audio')
 * @param contentType MIME type
 * @returns Public URL of uploaded file
 */
export async function uploadToB2(
  fileBuffer: Buffer,
  fileName: string,
  folder: string,
  contentType: string
): Promise<string> {
  const timestamp = Date.now();
  const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_');
  const key = `${folder}/${timestamp}-${sanitizedFileName}`;

  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: key,
    Body: fileBuffer,
    ContentType: contentType,
    ACL: 'public-read',
  });

  await b2Client.send(command);

  // Construct public URL
  const publicUrl = `https://${process.env.VITE_B2_ENDPOINT}/file/${bucketName}/${key}`;
  return publicUrl;
}

/**
 * Delete file from Backblaze B2 (SERVER-SIDE ONLY)
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
