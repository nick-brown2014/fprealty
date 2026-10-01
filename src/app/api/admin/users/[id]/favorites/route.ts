import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { rewriteMediaUrls } from '@/lib/media'

interface MediaItem {
  MediaURL: string
  MediaObjectID: string
  Order: number
  MimeType: string
  ShortDescription?: string
}

// Helper function to check if user is admin
async function checkAdminAuth() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.email) {
    return { isAdmin: false, error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }) }
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email }
  })

  if (!user || !user.isAdmin) {
    return { isAdmin: false, error: NextResponse.json({ error: 'Forbidden - Admin access required' }, { status: 403 }) }
  }

  return { isAdmin: true, adminUser: user }
}

// GET - List a user's favorites with listing details
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authCheck = await checkAdminAuth()
    if (!authCheck.isAdmin) return authCheck.error

    const { id } = await params

    const favorites = await prisma.favorite.findMany({
      where: { userId: id },
      orderBy: { createdAt: 'desc' }
    })

    const listings = await prisma.listing.findMany({
      where: { listingKey: { in: favorites.map((f) => f.listingId) } }
    })
    const listingsByKey = new Map(listings.map((listing) => [listing.listingKey, listing]))

    const result = favorites.map((favorite) => {
      const listing = listingsByKey.get(favorite.listingId)
      const media = listing ? rewriteMediaUrls(listing.listingKey, listing.media as MediaItem[] | null) : undefined
      return {
        id: favorite.id,
        listingKey: favorite.listingId,
        favoritedAt: favorite.createdAt,
        listing: listing
          ? {
              address: listing.unparsedAddress,
              city: listing.city,
              listPrice: listing.listPrice === null ? null : Number(listing.listPrice),
              mlsStatus: listing.mlsStatus,
              bedroomsTotal: listing.bedroomsTotal,
              bathroomsTotalInteger: listing.bathroomsTotalInteger,
              livingArea: listing.livingArea,
              photoUrl: media?.[0]?.MediaURL ?? null
            }
          : null
      }
    })

    return NextResponse.json({ favorites: result }, { status: 200 })
  } catch (error) {
    console.error('Admin user favorites fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
