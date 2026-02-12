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

// Fetch fresh media URLs from MLS Grid for a given listing
async function fetchFreshMedia(listingKey: string): Promise<MLSGridMedia[]> {
  const token = process.env.MLS_GRID_ACCESS_TOKEN
  if (!token) throw new Error('MLS_GRID_ACCESS_TOKEN not configured')

  const filter = `ListingKey eq '${listingKey}'`
  const url = `${MLS_GRID_BASE_URL}/Property?$filter=${encodeURIComponent(filter)}&$expand=Media&$top=1`

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept-Encoding': 'gzip',
    },
  })

  if (!response.ok) {
    throw new Error(`MLS Grid API error: ${response.status}`)
  }

  const data: MLSGridResponse = await response.json()
  if (!data.value || data.value.length === 0) return []

  return data.value[0].Media || []
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

// Stream image directly from MLS Grid signed URL
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

// GET /api/media/[listingKey]?index=0
// Returns the image for a specific listing at the given index
// Fetches fresh signed URL from MLS Grid, optionally caches to Vercel Blob
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ listingKey: string }> }
) {
  try {
    const { listingKey } = await params
    const index = parseInt(request.nextUrl.searchParams.get('index') || '0', 10)

    const blobPath = `listings/${listingKey}/${index}.jpg`

    // Check if already cached in Vercel Blob
    if (hasBlobStorage) {
      try {
        const { head } = await import('@vercel/blob')
        const existing = await head(blobPath)
        if (existing) {
          return NextResponse.redirect(existing.url, 302)
        }
      } catch {
        // Not cached yet, continue to download
      }
    }

    // Fetch fresh media URLs from MLS Grid
    const media = await fetchFreshMedia(listingKey)
    if (!media || media.length === 0 || index >= media.length) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 })
    }

    const sortedMedia = media.sort((a, b) => (a.Order || 0) - (b.Order || 0))
    const targetMedia = sortedMedia[index]

    // Try to cache to Vercel Blob
    const blobUrl = await downloadAndCacheImage(targetMedia.MediaURL, blobPath)

    if (blobUrl) {
      // Update the media entry in the database with the blob URL
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

      return NextResponse.redirect(blobUrl, 302)
    }

    // No blob storage — stream the image directly
    return streamImage(targetMedia.MediaURL)
  } catch (error) {
    console.error('Media proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
