
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'crypto';
import path from 'path';

// Helper to remove leading/trailing quotes from environment variables
const unquote = (str?: string) => str?.replace(/(^"|"$)/g, '');

const R2_ENDPOINT = unquote(process.env.R2_ENDPOINT);
const R2_BUCKET_NAME = unquote(process.env.R2_BUCKET_NAME);
const R2_ACCESS_KEY_ID = unquote(process.env.R2_ACCESS_KEY_ID);
const R2_SECRET_ACCESS_KEY = unquote(process.env.R2_SECRET_ACCESS_KEY);
const R2_PUBLIC_URL = unquote(process.env.R2_PUBLIC_URL);


// Fail-fast check for R2 credentials
if (
  !R2_ENDPOINT ||
  !R2_BUCKET_NAME ||
  !R2_ACCESS_KEY_ID ||
  !R2_SECRET_ACCESS_KEY ||
  !R2_PUBLIC_URL ||
  (R2_ACCESS_KEY_ID && R2_ACCESS_KEY_ID.includes('YOUR_')) ||
  (R2_SECRET_ACCESS_KEY && R2_SECRET_ACCESS_KEY.includes('YOUR_')) ||
  (R2_PUBLIC_URL && R2_PUBLIC_URL.includes('YOUR_'))
) {
  // Gracefully handle missing credentials on the server side to avoid crashing Next.js builds.
  console.warn(
    'WARNING: Cloudflare R2 environment variables are missing or incomplete. ' +
    'Image uploads will fail. Please set R2_ENDPOINT, R2_BUCKET_NAME, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_PUBLIC_URL in your .env file.'
  );
}

const s3Client = new S3Client({
  region: 'auto',
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID || '',
    secretAccessKey: R2_SECRET_ACCESS_KEY || '',
  },
});

/**
 * Uploads an image file to Cloudflare R2.
 * @param file The image file to upload.
 * @returns The public URL of the uploaded image.
 */
export async function uploadImage(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileExtension = path.extname(file.name);
  const fileName = `${randomUUID()}${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: R2_BUCKET_NAME,
    Key: fileName,
    Body: buffer,
    ContentType: file.type,
    ACL: 'public-read', // This is important for public access
  });

  try {
    await s3Client.send(command);
    // Ensure the public URL does not have a trailing slash before appending the filename
    const cleanedPublicUrl = R2_PUBLIC_URL!.endsWith('/') ? R2_PUBLIC_URL!.slice(0, -1) : R2_PUBLIC_URL;
    return `${cleanedPublicUrl}/${fileName}`;
  } catch (error) {
    console.error('R2 upload failed:', error);
    throw new Error(`R2 upload failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Returns a URL for a default placeholder image.
 * @returns A placeholder image URL.
 */
export function getDefaultImageUrl(): string {
    return "https://picsum.photos/seed/default-product/800/600";
}

/**
 * Deletes images from Cloudflare R2.
 * @param keys The array of file keys (filenames) to delete.
 */
export async function deleteImages(keys: string[]): Promise<void> {
  if (!keys || keys.length === 0) {
    return;
  }

  const deletePromises = keys.map(key => {
    const command = new DeleteObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: key,
    });
    return s3Client.send(command);
  });

  try {
    await Promise.all(deletePromises);
  } catch (error) {
    console.error('R2 deletion failed:', error);
    throw new Error(`R2 deletion failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
