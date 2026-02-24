import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const MLS_GRID_BASE_URL = 'https://api.mlsgrid.com/v2'

const hasBlobStorage = !!process.env.BLOB_READ_WRITE_TOKEN

interface MLSGridMedia {
  MediaKey: string
  MediaURL: string
  Order: number
  LongDescription?: string
}

interface MLSGridResponse {
  value: Array<{
    ListingKey: string
    Media?: MLSGridMedia[]
  }>
}

// In-flight request coalescing: prevents duplicate MLS Grid API calls
// for the same listing when multiple images load concurrently
const inFlightRequests = new Map<string, Promise<MLSGridMedia[]>>()

// Get media URLs from the local DB (stored during sync)
// This avoids calling the MLS Grid API entirely in most cases
async function getMediaFromDB(listingKey: string): Promise<MLSGridMedia[]> {
  const listing = await prisma.listing.findUnique({
    where: { listingKey },
    select: { media: true },
  })

  if (!listing?.media) return []

  const media = listing.media as Array<{ MediaKey: string; MediaURL: string; Order: number; LongDescription?: string }>
  return media
}

// Fetch fresh media URLs from MLS Grid API — only used as a fallback
// when DB URLs have expired. Uses request coalescing to avoid duplicate calls.
async function fetchFreshMedia(listingKey: string): Promise<MLSGridMedia[]> {
  // Check if there's already an in-flight request for this listing
  const existing = inFlightRequests.get(listingKey)
  if (existing) return existing

  const promise = (async () => {
    try {
      const token = process.env.MLS_GRID_ACCESS_TOKEN
      if (!token) throw new Error('MLS_GRID_ACCESS_TOKEN not configured')

      const listing = await prisma.listing.findUnique({
        where: { listingKey },
        select: { listingId: true },
      })

      if (!listing?.listingId) {
        throw new Error(`No listingId found for listingKey: ${listingKey}`)
      }

      const filter = `OriginatingSystemName eq 'ires' and ListingId eq '${listing.listingId}'`
      const url = `${MLS_GRID_BASE_URL}/Property?$filter=${encodeURIComponent(filter)}&$expand=Media&$top=1`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Encoding': 'gzip',
        },
      })

      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`MLS Grid API error: ${response.status} - ${errorText}`)
      }

      const data: MLSGridResponse = await response.json()
      if (!data.value || data.value.length === 0) return []

      return data.value[0].Media || []
    } finally {
      inFlightRequests.delete(listingKey)
    }
  })()

  inFlightRequests.set(listingKey, promise)
  return promise
}

// Download image and upload to Vercel Blob (only when BLOB_READ_WRITE_TOKEN is set)
async function downloadAndCacheImage(mediaUrl: string, blobPath: string): Promise<string | null> {
  if (!hasBlobStorage) return null

  try {
    const { put } = await import('@vercel/blob')

    const imageResponse = await fetch(mediaUrl)
    if (!imageResponse.ok) return null

    const imageBuffer = await imageResponse.arrayBuffer()

    const blob = await put(blobPath, Buffer.from(imageBuffer), {
      access: 'public',
      contentType: 'image/jpeg',
      addRandomSuffix: false,
    })

    return blob.url
  } catch (e) {
    console.error('Blob upload failed, falling back to direct stream:', e)
    return null
  }
}

// Stream image directly from a signed URL
async function streamImage(mediaUrl: string): Promise<Response> {
  const imageResponse = await fetch(mediaUrl)
  if (!imageResponse.ok) {
    throw new Error(`Failed to download image: ${imageResponse.status}`)
  }

  return new Response(imageResponse.body, {
    headers: {
      'Content-Type': imageResponse.headers.get('Content-Type') || 'image/jpeg',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}

// Update the media entry in the database with the cached blob URL
async function updateDBMediaUrl(listingKey: string, targetMedia: MLSGridMedia, blobUrl: string) {
  try {
    const listing = await prisma.listing.findUnique({
      where: { listingKey },
      select: { media: true },
    })

    if (listing?.media) {
      const mediaArray = listing.media as Array<{ MediaKey: string; MediaURL: string; Order: number; ShortDescription?: string; MediaObjectID: string; MimeType: string }>
      const mediaItem = mediaArray.find(m => m.Order === targetMedia.Order || m.MediaKey === targetMedia.MediaKey)
      if (mediaItem) {
        mediaItem.MediaURL = blobUrl
        await prisma.listing.update({
          where: { listingKey },
          data: { media: mediaArray },
        })
      }
    }
  } catch (e) {
    console.error('Failed to update DB media URL (non-fatal):', e)
  }
}

// GET /api/media/[listingKey]?index=0
// Returns the image for a specific listing at the given index.
// Priority: 1) Blob cache  2) DB media URL  3) MLS Grid API (fallback)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ listingKey: string }> }
) {
  try {
    const { listingKey } = await params
    const index = parseInt(request.nextUrl.searchParams.get('index') || '0', 10)

    const blobPath = `listings/${listingKey}/${index}.jpg`

    // 1. Check if already cached in Vercel Blob
    if (hasBlobStorage) {
      try {
        const { head } = await import('@vercel/blob')
        const existing = await head(blobPath)
        if (existing) {
          return NextResponse.redirect(existing.url, 302)
        }
      } catch {
        // Not cached yet, continue
      }
    }

    // 2. Try using the media URL stored in our DB (from the daily sync)
    //    This avoids calling the MLS Grid API entirely
    const dbMedia = await getMediaFromDB(listingKey)
    if (dbMedia.length > 0) {
      const sortedMedia = [...dbMedia].sort((a, b) => (a.Order || 0) - (b.Order || 0))
      if (index < sortedMedia.length) {
        const targetMedia = sortedMedia[index]

        // Skip if the URL is already a blob URL (shouldn't reach here, but safety check)
        if (targetMedia.MediaURL.includes('.public.blob.vercel-storage.com')) {
          return NextResponse.redirect(targetMedia.MediaURL, 302)
        }

        // Try to download and cache from the DB URL
        const blobUrl = await downloadAndCacheImage(targetMedia.MediaURL, blobPath)
        if (blobUrl) {
          await updateDBMediaUrl(listingKey, targetMedia, blobUrl)
          return NextResponse.redirect(blobUrl, 302)
        }

        // If blob storage isn't configured, try streaming from DB URL
        if (!hasBlobStorage) {
          try {
            return await streamImage(targetMedia.MediaURL)
          } catch {
            // DB URL may be expired, fall through to MLS Grid API
          }
        }
        // If download failed, the signed URL is likely expired — fall through to API
      }
    }

    // 3. Last resort: fetch fresh media URLs from MLS Grid API
    //    Uses request coalescing to prevent duplicate concurrent calls
    console.log(`DB media URL expired/missing for ${listingKey}, falling back to MLS Grid API`)
    const freshMedia = await fetchFreshMedia(listingKey)
    if (!freshMedia || freshMedia.length === 0 || index >= freshMedia.length) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const sortedFreshMedia = freshMedia.sort((a, b) => (a.Order || 0) - (b.Order || 0))
    const targetMedia = sortedFreshMedia[index]

    const blobUrl = await downloadAndCacheImage(targetMedia.MediaURL, blobPath)
    if (blobUrl) {
      await updateDBMediaUrl(listingKey, targetMedia, blobUrl)
      return NextResponse.redirect(blobUrl, 302)
    }

    return streamImage(targetMedia.MediaURL)
  } catch (error) {
    console.error('Media proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
