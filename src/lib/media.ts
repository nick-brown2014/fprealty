// Checks if a media URL is already cached (Vercel Blob URL) or still an MLS Grid signed URL
export function isMediaCached(url: string): boolean {
  return url.includes('.public.blob.vercel-storage.com')
}

// Rewrites media URLs: cached Blob URLs pass through, expired MLS Grid URLs get rewritten to the proxy
export function rewriteMediaUrl(listingKey: string, mediaUrl: string, index: number): string {
  if (isMediaCached(mediaUrl)) {
    return mediaUrl
  }
  // Rewrite to our proxy route which will fetch, cache, and redirect
  return `/api/media/${listingKey}?index=${index}`
}

interface MediaItem {
  MediaURL: string
  MediaObjectID: string
  Order: number
  MimeType: string
  ShortDescription?: string
  MediaKey?: string
}

// Rewrite all media URLs in a media array
export function rewriteMediaUrls(listingKey: string, media: MediaItem[] | null): MediaItem[] | undefined {
  if (!media || media.length === 0) return undefined

  return media.map((item, index) => ({
    ...item,
    MediaURL: rewriteMediaUrl(listingKey, item.MediaURL, index),
  }))
}
