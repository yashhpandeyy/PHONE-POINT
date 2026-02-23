
import { NextResponse } from 'next/server';
import { uploadImage } from '@/lib/r2';

export async function POST(request: Request) {
  // The check for credentials is now handled at server startup in `lib/r2.ts`.
  // If the credentials were missing, the server would have already crashed with a clear error message.

  try {
    const formData = await request.formData();
    const files = formData.getAll('image') as File[];
    // Filter out any empty file inputs that might be sent
    const validFiles = files.filter(file => file.size > 0);

    if (validFiles.length === 0) {
        // No files were uploaded, which is a valid case (e.g., user doesn't select an image).
        // Return an empty array. The calling function will handle using a default if needed.
        return NextResponse.json({ imageUrls: [] });
    }

    // If files are provided, upload them all to R2
    const uploadPromises = validFiles.map(file => uploadImage(file));
    const imageUrls = await Promise.all(uploadPromises);

    return NextResponse.json({ imageUrls });

  } catch (error) {
    console.error('Upload API Error:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
        errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
