import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const MLS_GRID_BASE_URL = 'https://api.mlsgrid.com/v2'
const hasBlobStorage = !!process.env.BLOB_READ_WRITE_TOKEN

// Global rate limit interval: only 1 MLS Grid API call per 1.5s across ALL
// Vercel instances. Enforced via atomic DB UPDATE on SyncState.lastMediaApiCall.
const GLOBAL_RATE_LIMIT_MS = 1500

// In-memory cache: after fetching fresh media for a listing, cache for 60s
// so concurrent/subsequent requests for other image indices reuse the result.
const freshMediaCache = new Map<string, { media: MLSGridMedia[]; timestamp: number }>()
const FRESH_CACHE_TTL_MS = 60_000

// Request coalescing: concurrent requests for the same listing share one API call
const inFlightRequests = new Map<string, Promise<MLSGridMedia[] | null>>()

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

// Get media URLs from the local DB (stored during sync)
// This avoids calling the MLS Grid API entirely
async function getMediaFromDB(listingKey: string): Promise<MLSGridMedia[]> {
  const listing = await prisma.listing.findUnique({
    where: { listingKey },
    select: { media: true },
  })

  if (!listing?.media) return []

  const media = listing.media as Array<{ MediaKey: string; MediaURL: string; Order: number; LongDescription?: string }>
  return media
}

// Attempt to claim a global rate-limit slot via atomic DB UPDATE.
// Returns true if this instance is allowed to make an MLS Grid API call.
async function claimGlobalRateSlot(): Promise<boolean> {
  try {
    const result = await prisma.$executeRaw`
      UPDATE "SyncState"
      SET "lastMediaApiCall" = NOW(), "updatedAt" = NOW()
      WHERE id = 'mls-grid-sync'
        AND ("lastMediaApiCall" IS NULL
             OR "lastMediaApiCall" < NOW() - INTERVAL '1500 milliseconds')
    `
    return result > 0
  } catch (e) {
    console.error('Global rate limit check failed:', e)
    return false
  }
}

// Fetch fresh media URLs from MLS Grid API with coalescing + caching + global rate limiting.
// 1) Check in-memory cache (60s TTL) — serves all indices for a listing from one API call
// 2) Coalesce concurrent requests — 30 gallery images = 1 API call, not 30
// 3) Claim global rate-limit slot via DB — ensures ≤1 API call per 1.5s across ALL instances
async function fetchFreshMedia(listingKey: string): Promise<MLSGridMedia[] | null> {
  // 1. Check in-memory cache first (populated by a previous request for this listing)
  const cached = freshMediaCache.get(listingKey)
  if (cached && Date.now() - cached.timestamp < FRESH_CACHE_TTL_MS) {
    return cached.media
  }

  // 2. Coalesce: if another request is already fetching this listing, wait for it
  const inFlight = inFlightRequests.get(listingKey)
  if (inFlight) return inFlight

  // 3. Try to claim a global rate-limit slot. Retry a few times with backoff.
  //    While waiting, re-check cache in case another instance/request fulfilled it.
  const MAX_ATTEMPTS = 8
  let claimed = false
  for (let attempt = 0; attempt < MAX_ATTEMPTS; attempt++) {
    // Re-check cache — another request (possibly from another instance) may have refreshed it
    const rechecked = freshMediaCache.get(listingKey)
    if (rechecked && Date.now() - rechecked.timestamp < FRESH_CACHE_TTL_MS) {
      return rechecked.media
    }

    // Re-check coalescing — another request for same listing may have started
    const reInFlight = inFlightRequests.get(listingKey)
    if (reInFlight) return reInFlight

    claimed = await claimGlobalRateSlot()
    if (claimed) break

    // Wait before retrying (increasing backoff: 500ms, 1000ms, 1500ms, ...)
    await new Promise(r => setTimeout(r, GLOBAL_RATE_LIMIT_MS * (attempt + 1) / MAX_ATTEMPTS))
  }
  if (!claimed) return null // Could not claim a slot after retries

  const promise = (async (): Promise<MLSGridMedia[] | null> => {
    try {
      const token = process.env.MLS_GRID_ACCESS_TOKEN
      if (!token) return null

      const listing = await prisma.listing.findUnique({
        where: { listingKey },
        select: { listingId: true },
      })

      if (!listing?.listingId) return null

      const filter = `OriginatingSystemName eq 'ires' and ListingId eq '${listing.listingId}'`
      const url = `${MLS_GRID_BASE_URL}/Property?$filter=${encodeURIComponent(filter)}&$expand=Media&$top=1`

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept-Encoding': 'gzip',
        },
      })

      if (!response.ok) {
        console.error(`MLS Grid API error for ${listingKey}: ${response.status}`)
        return null
      }

      const data: MLSGridResponse = await response.json()
      const media = data.value?.[0]?.Media || []

      // Cache in memory so concurrent requests for other indices reuse it
      freshMediaCache.set(listingKey, { media, timestamp: Date.now() })

      // Persist fresh URLs to DB so future requests (even from other instances)
      // find valid URLs at step 2 and never need the API again until next expiry
      if (media.length > 0) {
        try {
          const freshMediaArray = media
            .sort((a, b) => (a.Order || 0) - (b.Order || 0))
            .map(m => ({
              MediaKey: m.MediaKey,
              MediaURL: m.MediaURL,
              Order: m.Order,
              ShortDescription: m.LongDescription || '',
              MediaObjectID: m.MediaKey,
              MimeType: 'image/jpeg',
            }))
          await prisma.listing.update({
            where: { listingKey },
            data: { media: freshMediaArray },
          })
          console.log(`Refreshed ${media.length} media URLs in DB for ${listingKey}`)
        } catch (e) {
          console.error(`Failed to update DB media URLs for ${listingKey} (non-fatal):`, e)
        }
      }

      return media
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

    const imageResponse = await fetch(mediaUrl, {
      headers: { 'User-Agent': process.env.MLS_GRID_ACCESS_TOKEN || '' },
    })
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
  const imageResponse = await fetch(mediaUrl, {
    headers: { 'User-Agent': process.env.MLS_GRID_ACCESS_TOKEN || '' },
  })
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
            // DB URL may be expired, fall through to placeholder
          }
        }
        // If download failed, the signed URL is likely expired — fall through to placeholder
      }
    }

    // 3. DB URL expired or missing — try rate-limited MLS Grid API call.
    //    Returns null if rate-limited; in that case, serve placeholder.
    const freshMedia = await fetchFreshMedia(listingKey)
    if (freshMedia && freshMedia.length > 0) {
      const sortedFreshMedia = freshMedia.sort((a, b) => (a.Order || 0) - (b.Order || 0))
      if (index < sortedFreshMedia.length) {
        const targetMedia = sortedFreshMedia[index]

        const blobUrl = await downloadAndCacheImage(targetMedia.MediaURL, blobPath)
        if (blobUrl) {
          await updateDBMediaUrl(listingKey, targetMedia, blobUrl)
          return NextResponse.redirect(blobUrl, 302)
        }

        // Couldn't cache to blob, stream directly
        try {
          return await streamImage(targetMedia.MediaURL)
        } catch {
          // Fall through to placeholder
        }
      }
    }

    // 4. Rate-limited or no media found — serve placeholder inline.
    //    Cache-Control: no-store ensures the browser retries on next page load
    //    instead of permanently caching the placeholder.
    const placeholderSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600"><rect width="800" height="600" fill="#f0f0f0"/><g transform="translate(400,280)" fill="#ccc"><rect x="-60" y="-40" width="120" height="80" rx="4"/><polygon points="-40,30 0,-20 40,30"/><circle cx="30" cy="-15" r="12"/></g><text x="400" y="340" text-anchor="middle" font-family="system-ui,sans-serif" font-size="18" fill="#999">Image loading…</text></svg>`
    return new Response(placeholderSvg, {
      status: 200,
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    console.error('Media proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
