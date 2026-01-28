import { Handler } from '@netlify/functions';

const B2_KEY_ID = process.env.VITE_B2_KEY_ID;
const B2_APPLICATION_KEY = process.env.VITE_B2_APPLICATION_KEY;
const B2_BUCKET_NAME = process.env.VITE_B2_BUCKET_NAME;

export const handler: Handler = async (event) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
  };

  // Handle preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { fileBase64, fileName, folder, contentType } = body;

    if (!fileBase64 || !fileName || !folder) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Missing required fields' }),
      };
    }

    // 1. Authorize with B2
    const authResponse = await fetch('https://api.backblazeb2.com/b2api/v2/b2_authorize_account', {
      headers: {
        Authorization: 'Basic ' + Buffer.from(`${B2_KEY_ID}:${B2_APPLICATION_KEY}`).toString('base64'),
      },
    });

    if (!authResponse.ok) {
      throw new Error('B2 authorization failed');
    }

    const authData = await authResponse.json();

    // 2. Get upload URL
    const uploadUrlResponse = await fetch(`${authData.apiUrl}/b2api/v2/b2_get_upload_url`, {
      method: 'POST',
      headers: {
        Authorization: authData.authorizationToken,
      },
      body: JSON.stringify({ bucketId: authData.allowed.bucketId }),
    });

    if (!uploadUrlResponse.ok) {
      throw new Error('Failed to get upload URL');
    }

    const uploadUrlData = await uploadUrlResponse.json();

    // 3. Upload file
    const fileBuffer = Buffer.from(fileBase64, 'base64');
    const filePath = `${folder}/${Date.now()}-${fileName}`;

    const uploadResponse = await fetch(uploadUrlData.uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: uploadUrlData.authorizationToken,
        'X-Bz-File-Name': encodeURIComponent(filePath),
        'Content-Type': contentType || 'application/octet-stream',
        'X-Bz-Content-Sha1': 'do_not_verify',
      },
      body: fileBuffer,
    });

    if (!uploadResponse.ok) {
      throw new Error('File upload failed');
    }

    const uploadResult = await uploadResponse.json();

    // Construct public URL
    const publicUrl = `${authData.downloadUrl}/file/${B2_BUCKET_NAME}/${filePath}`;

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        url: publicUrl,
        fileId: uploadResult.fileId,
      }),
    };
  } catch (error) {
    console.error('Upload error:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: error instanceof Error ? error.message : 'Upload failed',
      }),
    };
  }
};
