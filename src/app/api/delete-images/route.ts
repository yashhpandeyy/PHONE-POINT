
import { NextResponse } from 'next/server';
import { deleteImages } from '@/lib/r2';

export async function POST(request: Request) {
  try {
    const { imageUrls } = await request.json();

    if (!imageUrls || !Array.isArray(imageUrls) || imageUrls.length === 0) {
      return NextResponse.json({ error: 'Image URLs are required.' }, { status: 400 });
    }

    // Extract the key (filename) from each URL.
    // This makes the assumption that the URL is https://<public_url>/<key>
    const keys = imageUrls.map(url => {
      try {
        const urlObject = new URL(url);
        // The key is the pathname without the leading slash
        return urlObject.pathname.substring(1);
      } catch (e) {
        console.warn(`Invalid image URL provided, skipping deletion: ${url}`);
        return null;
      }
    }).filter((key): key is string => key !== null);


    console.log(`[Delete API] Extracted ${keys.length} keys from ${imageUrls.length} URLs`);

    if (keys.length > 0) {
      console.log('[Delete API] Targeting keys:', keys);
      await deleteImages(keys);
    }

    return NextResponse.json({ message: 'Images deleted successfully.' });

  } catch (error) {
    console.error('Delete Images API Error:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
