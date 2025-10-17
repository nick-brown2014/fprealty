import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import { SavedSearch } from '@/app/types/SavedSearch'
import { Listing } from '@/app/hooks/useMapDisplay'
import PropertyAlertEmail from '../../../../emails/PropertyAlertEmail'

const resend = new Resend(process.env.RESEND_API_KEY)

interface EmailProperty {
  id: string
  address: string
  price: number
  beds: number
  baths: number
  sqft: number
  imageUrl?: string
  listingUrl: string
}

export async function POST(request: NextRequest) {
  try {
    // Optional: Add authentication to protect this endpoint
    // For now, you might want to add a secret key check
    const { secret } = await request.json()

    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Get all users who have opted in to emails
    const optedInUsers = await prisma.user.findMany({
      where: { emailOptIn: true },
      include: {
        savedSearches: true
      }
    })

    console.log(`Found ${optedInUsers.length} users with email opt-in`)

    let emailsSent = 0
    const errors: string[] = []

    // For each user with saved searches, check for new listings
    for (const user of optedInUsers) {
      if (user.savedSearches.length === 0) continue

      for (const savedSearch of user.savedSearches) {
        try {
          // Fetch new listings matching this saved search
          // This is a simplified example - you'd want to track which listings
          // have already been sent to avoid duplicates

          // Convert Prisma null values to undefined to match SavedSearch type
          const searchParams: SavedSearch = {
            id: savedSearch.id,
            userId: savedSearch.userId,
            createdAt: savedSearch.createdAt,
            updatedAt: savedSearch.updatedAt,
            name: savedSearch.name,
            searchQuery: savedSearch.searchQuery ?? undefined,
            minPrice: savedSearch.minPrice ?? undefined,
            maxPrice: savedSearch.maxPrice ?? undefined,
            minBeds: savedSearch.minBeds ?? undefined,
            minBaths: savedSearch.minBaths ?? undefined,
            propertyTypes: savedSearch.propertyTypes as string[],
            includeLand: savedSearch.includeLand,
            statuses: savedSearch.statuses as string[],
            bounds: savedSearch.bounds ? savedSearch.bounds as SavedSearch['bounds'] : undefined
          }

          const newProperties = await fetchNewListingsForSearch(searchParams)

          if (newProperties.length === 0) continue

          // Send email using Resend
          const { error } = await resend.emails.send({
            from: 'Fred Porter Realty <alerts@yourdomain.com>', // Replace with your verified domain
            to: [user.email],
            subject: `New Properties: ${savedSearch.name}`,
            react: PropertyAlertEmail({
              userName: `${user.firstName} ${user.lastName}`,
              properties: newProperties.map(p => ({
                address: p.address,
                price: p.price,
                beds: p.beds,
                baths: p.baths,
                sqft: p.sqft,
                imageUrl: p.imageUrl,
                listingUrl: `${process.env.NEXTAUTH_URL}/listing/${p.id}`
              })),
              searchName: savedSearch.name
            })
          })

          if (error) {
            console.error(`Error sending email to ${user.email}:`, error)
            errors.push(`${user.email}: ${error.message}`)
          } else {
            console.log(`Email sent to ${user.email} for search "${savedSearch.name}"`)
            emailsSent++
          }
        } catch (err) {
          console.error(`Error processing search for ${user.email}:`, err)
          errors.push(`${user.email}: ${err instanceof Error ? err.message : 'Unknown error'}`)
        }
      }
    }

    return NextResponse.json({
      success: true,
      emailsSent,
      usersProcessed: optedInUsers.length,
      errors: errors.length > 0 ? errors : undefined
    })
  } catch (error) {
    console.error('Send property alerts error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Helper function to fetch new listings for a saved search
async function fetchNewListingsForSearch(savedSearch: SavedSearch): Promise<EmailProperty[]> {
  try {
    // Build filters based on saved search criteria
    const filters: Record<string, string | number> = {
      limit: 100,
      offset: 0,
      fields: 'ListingKey,ListPrice,City,StateOrProvince,UnparsedAddress,StreetNumber,StreetName,StreetSuffix,UnitNumber,BedroomsTotal,BathroomsTotalInteger,LivingArea,Media,MajorChangeTimestamp'
    }

    // Use bounds if available, otherwise use search query
    if (savedSearch.bounds) {
      filters['Latitude.gte'] = savedSearch.bounds.south
      filters['Latitude.lte'] = savedSearch.bounds.north
      filters['Longitude.gte'] = savedSearch.bounds.west
      filters['Longitude.lte'] = savedSearch.bounds.east
    } else if (savedSearch.searchQuery) {
      filters.near = savedSearch.searchQuery
      filters.radius = 4
    }

    // Add price filters
    if (savedSearch.minPrice) {
      filters['ListPrice.gte'] = savedSearch.minPrice
    }
    if (savedSearch.maxPrice) {
      filters['ListPrice.lte'] = savedSearch.maxPrice
    }

    // Add bedroom filter
    if (savedSearch.minBeds) {
      filters['BedroomsTotal.gte'] = savedSearch.minBeds
    }

    // Add bathroom filter
    if (savedSearch.minBaths) {
      filters['BathroomsTotalInteger.gte'] = savedSearch.minBaths
    }

    // Add property types filter
    const propertySubTypes = [...(savedSearch.propertyTypes || [])]
    if (savedSearch.includeLand) {
      propertySubTypes.push('Unimproved Land')
    }
    if (propertySubTypes.length > 0) {
      filters['PropertySubType.in'] = propertySubTypes.join(',')
    }

    // Handle PropertyType
    if (savedSearch.includeLand) {
      filters['PropertyType.in'] = 'Residential,Land'
    } else {
      filters['PropertyType.in'] = 'Residential'
    }

    // Add status filter
    if (savedSearch.statuses && savedSearch.statuses.length > 0) {
      filters['StandardStatus.in'] = savedSearch.statuses.join(',')
    } else {
      filters['StandardStatus.in'] = 'Active'
    }

    // Filter for listings with MajorChangeTimestamp in the last 24 hours
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)
    filters['MajorChangeTimestamp.gte'] = twentyFourHoursAgo.toISOString()

    // Build query string
    const queryString = Object.entries(filters)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&')

    // Make API call to listings endpoint (using the same endpoint as your app)
    const apiUrl = `${process.env.NEXTAUTH_URL}/api/listings?${queryString}`

    const response = await fetch(apiUrl)

    if (!response.ok) {
      console.error(`Failed to fetch listings: ${response.status} ${response.statusText}`)
      return []
    }

    const data = await response.json()
    const listings: Listing[] = data.bundle || []

    // Transform to email format
    return listings.map((listing: Listing): EmailProperty => {
      const address = [
        listing.StreetNumber,
        listing.StreetName,
        listing.StreetSuffix,
        listing.UnitNumber ? `#${listing.UnitNumber}` : ''
      ].filter(Boolean).join(' ') || listing.UnparsedAddress || `${listing.City}, ${listing.StateOrProvince}`

      const imageUrl = listing.Media && listing.Media.length > 0
        ? listing.Media[0].MediaURL
        : undefined

      return {
        id: listing.ListingKey,
        address,
        price: listing.ListPrice,
        beds: listing.BedroomsTotal,
        baths: listing.BathroomsTotalInteger || 0,
        sqft: listing.LivingArea,
        imageUrl,
        listingUrl: `${process.env.NEXTAUTH_URL}/listing/${listing.ListingKey}`
      }
    })
  } catch (error) {
    console.error('Error fetching new listings:', error)
    return []
  }
}