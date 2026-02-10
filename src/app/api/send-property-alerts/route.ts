import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
// Phase 4: Replaced with Prisma types for local database queries
// import { SavedSearch } from '@/app/types/SavedSearch'
// import { Listing } from '@/app/hooks/useMapDisplay'
import type { SavedSearch as PrismaSavedSearch } from '@prisma/client'
import { Prisma } from '@prisma/client'
import PropertyAlertEmail from '../../../../emails/PropertyAlertEmail'

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

export async function GET(request: NextRequest) {
  try {
    // Verify the request is authorized (from Vercel Cron or with proper secret)
    const authHeader = request.headers.get('authorization')
    const secret = request.nextUrl.searchParams.get('secret')

    // Check either Bearer token (Vercel Cron) or secret query param
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    // Initialize Resend with API key
    if (!process.env.RESEND_API_KEY) {
      return NextResponse.json(
        { error: 'RESEND_API_KEY not configured' },
        { status: 500 }
      )
    }
    const resend = new Resend(process.env.RESEND_API_KEY)

    // Get all users who have opted in to emails
    // For testing: only send to nick.brown2014@gmail.com
    const testMode = request.nextUrl.searchParams.get('test') === 'true'
    const optedInUsers = await prisma.user.findMany({
      where: {
        emailOptIn: true,
        ...(testMode && { email: 'nick.brown2014@gmail.com' })
      },
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

      try {
        // Collect all new listings across all saved searches for this user
        const searchResults: Array<{
          searchId: string
          searchName: string
          properties: Array<{
            address: string
            price: number
            beds: number
            baths: number
            sqft: number
            imageUrl?: string
            listingUrl: string
          }>
        }> = []

        for (const savedSearch of user.savedSearches) {
          try {
            // Phase 4: Pass Prisma SavedSearch directly to query local Listing table
            // Previously converted to custom SavedSearch type for Bridge API:
            // const searchParams: SavedSearch = {
            //   id: savedSearch.id,
            //   userId: savedSearch.userId,
            //   createdAt: savedSearch.createdAt,
            //   updatedAt: savedSearch.updatedAt,
            //   name: savedSearch.name,
            //   searchQuery: savedSearch.searchQuery ?? undefined,
            //   minPrice: savedSearch.minPrice ?? undefined,
            //   maxPrice: savedSearch.maxPrice ?? undefined,
            //   minBeds: savedSearch.minBeds ?? undefined,
            //   minBaths: savedSearch.minBaths ?? undefined,
            //   propertyTypes: savedSearch.propertyTypes as string[],
            //   includeLand: savedSearch.includeLand,
            //   statuses: savedSearch.statuses as string[],
            //   bounds: savedSearch.bounds ? savedSearch.bounds as SavedSearch['bounds'] : undefined
            // }
            // const newProperties = await fetchNewListingsForSearch(searchParams)
            const newProperties = await fetchNewListingsForSearch(savedSearch)

            if (newProperties.length > 0) {
              searchResults.push({
                searchId: savedSearch.id,
                searchName: savedSearch.name,
                properties: newProperties.map(p => ({
                  address: p.address,
                  price: p.price,
                  beds: p.beds,
                  baths: p.baths,
                  sqft: p.sqft,
                  imageUrl: p.imageUrl,
                  listingUrl: `${process.env.NEXTAUTH_URL}/listing/${p.id}`
                }))
              })
            }
          } catch (err) {
            console.error(`Error processing search "${savedSearch.name}" for ${user.email}:`, err)
          }
        }

        // Only send email if we found new properties across any saved search
        if (searchResults.length === 0) continue

        const totalProperties = searchResults.reduce((sum, result) => sum + result.properties.length, 0)

        // Send consolidated email using Resend
        const { error } = await resend.emails.send({
          from: 'Fred Porter Real Estate <noreply@alerts.nocorealtor.com>',
          to: [user.email],
          subject: `${totalProperties} New ${totalProperties === 1 ? 'Listing' : 'Listings'} Just Hit the Market!`,
          react: PropertyAlertEmail({
            userName: `${user.firstName} ${user.lastName}`,
            searchResults
          })
        })

        if (error) {
          console.error(`Error sending email to ${user.email}:`, error)
          errors.push(`${user.email}: ${error.message}`)
        } else {
          console.log(`Email sent to ${user.email} with ${totalProperties} new properties from ${searchResults.length} saved searches`)
          emailsSent++
        }
      } catch (err) {
        console.error(`Error processing user ${user.email}:`, err)
        errors.push(`${user.email}: ${err instanceof Error ? err.message : 'Unknown error'}`)
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

// Phase 4: Query local Listing table using Prisma instead of Bridge API
async function fetchNewListingsForSearch(savedSearch: PrismaSavedSearch): Promise<EmailProperty[]> {
  try {
    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const startOfYesterday = new Date(yesterday.getFullYear(), yesterday.getMonth(), yesterday.getDate())
    const endOfYesterday = new Date(startOfYesterday)
    endOfYesterday.setDate(endOfYesterday.getDate() + 1)

    const where: Prisma.ListingWhereInput = {
      listingContractDate: {
        gte: startOfYesterday,
        lt: endOfYesterday,
      },
    }

    // Geographic bounds filter
    if (savedSearch.bounds) {
      const bounds = savedSearch.bounds as { north: number; south: number; east: number; west: number }
      where.latitude = { gte: bounds.south, lte: bounds.north }
      where.longitude = { gte: bounds.west, lte: bounds.east }
    }

    // Price filters (listPrice is BigInt in schema)
    if (savedSearch.minPrice !== null || savedSearch.maxPrice !== null) {
      where.listPrice = {
        ...(savedSearch.minPrice !== null ? { gte: BigInt(savedSearch.minPrice) } : {}),
        ...(savedSearch.maxPrice !== null ? { lte: BigInt(savedSearch.maxPrice) } : {}),
      }
    }

    // Bedroom and bathroom filters
    if (savedSearch.minBeds !== null) {
      where.bedroomsTotal = { gte: savedSearch.minBeds }
    }
    if (savedSearch.minBaths !== null) {
      where.bathroomsTotalInteger = { gte: savedSearch.minBaths }
    }

    // Property type filter
    const propertyTypes = [...(savedSearch.propertyTypes || [])]
    if (savedSearch.includeLand) {
      propertyTypes.push('Land')
    }
    if (propertyTypes.length > 0) {
      where.propertyType = { in: propertyTypes }
    }

    // Status filter
    if (savedSearch.statuses && savedSearch.statuses.length > 0) {
      where.standardStatus = { in: savedSearch.statuses }
    } else {
      where.standardStatus = 'Active'
    }

    // Square footage
    if (savedSearch.minSqft !== null || savedSearch.maxSqft !== null) {
      where.livingArea = {
        ...(savedSearch.minSqft !== null ? { gte: savedSearch.minSqft } : {}),
        ...(savedSearch.maxSqft !== null ? { lte: savedSearch.maxSqft } : {}),
      }
    }

    // Lot size (acres)
    if (savedSearch.minLotSize !== null || savedSearch.maxLotSize !== null) {
      where.lotSizeAcres = {
        ...(savedSearch.minLotSize !== null ? { gte: savedSearch.minLotSize } : {}),
        ...(savedSearch.maxLotSize !== null ? { lte: savedSearch.maxLotSize } : {}),
      }
    }

    // Year built
    if (savedSearch.minYearBuilt !== null || savedSearch.maxYearBuilt !== null) {
      where.yearBuilt = {
        ...(savedSearch.minYearBuilt !== null ? { gte: savedSearch.minYearBuilt } : {}),
        ...(savedSearch.maxYearBuilt !== null ? { lte: savedSearch.maxYearBuilt } : {}),
      }
    }

    // Stories
    if (savedSearch.minStories !== null || savedSearch.maxStories !== null) {
      where.stories = {
        ...(savedSearch.minStories !== null ? { gte: savedSearch.minStories } : {}),
        ...(savedSearch.maxStories !== null ? { lte: savedSearch.maxStories } : {}),
      }
    }

    // Garage spaces
    if (savedSearch.minGarageSpaces !== null) {
      where.garageSpaces = { gte: savedSearch.minGarageSpaces }
    }

    // Boolean feature filters
    if (savedSearch.hasPool) where.poolPrivateYN = true
    if (savedSearch.hasAC) where.coolingYN = true
    if (savedSearch.hasBasement) where.basement = { isEmpty: false }
    if (savedSearch.isWaterfront) where.waterfrontYN = true
    if (savedSearch.hasFireplace) where.fireplaceYN = true
    if (savedSearch.isSeniorCommunity) where.seniorCommunityYN = true
    if (savedSearch.hasSpa) where.spaYN = true
    if (savedSearch.isHorseProperty) where.horseYN = true
    if (savedSearch.hasGarage) where.garageYN = true
    if (savedSearch.hasAttachedGarage) where.attachedGarageYN = true
    if (savedSearch.hasHeating) where.heatingYN = true

    // HOA fee
    if (savedSearch.maxHoaFee !== null) {
      where.associationFee = { lte: savedSearch.maxHoaFee }
    }

    // Days on market
    if (savedSearch.minDaysOnMarket !== null || savedSearch.maxDaysOnMarket !== null) {
      where.daysOnMarket = {
        ...(savedSearch.minDaysOnMarket !== null ? { gte: savedSearch.minDaysOnMarket } : {}),
        ...(savedSearch.maxDaysOnMarket !== null ? { lte: savedSearch.maxDaysOnMarket } : {}),
      }
    }

    // Tax amount
    if (savedSearch.minTaxAmount !== null || savedSearch.maxTaxAmount !== null) {
      where.taxAnnualAmount = {
        ...(savedSearch.minTaxAmount !== null ? { gte: savedSearch.minTaxAmount } : {}),
        ...(savedSearch.maxTaxAmount !== null ? { lte: savedSearch.maxTaxAmount } : {}),
      }
    }

    // Covered spaces
    if (savedSearch.minCoveredSpaces !== null) {
      where.coveredSpaces = { gte: savedSearch.minCoveredSpaces }
    }

    // Virtual tour
    if (savedSearch.hasVirtualTour) {
      where.virtualTourURLUnbranded = { not: null }
    }

    // Green energy
    if (savedSearch.isGreenEnergy) {
      where.greenEnergyEfficient = { isEmpty: false }
    }

    // Array overlap filters
    if (savedSearch.view.length > 0) where.view = { hasSome: savedSearch.view }
    if (savedSearch.flooring.length > 0) where.flooring = { hasSome: savedSearch.flooring }
    if (savedSearch.appliances.length > 0) where.appliances = { hasSome: savedSearch.appliances }
    if (savedSearch.heatingType.length > 0) where.heating = { hasSome: savedSearch.heatingType }
    if (savedSearch.architecturalStyle.length > 0) where.architecturalStyle = { hasSome: savedSearch.architecturalStyle }
    if (savedSearch.fencing.length > 0) where.fencing = { hasSome: savedSearch.fencing }
    if (savedSearch.patioFeatures.length > 0) where.patioAndPorchFeatures = { hasSome: savedSearch.patioFeatures }

    // School district
    if (savedSearch.schoolDistrict) {
      where.highSchoolDistrict = savedSearch.schoolDistrict
    }

    const listings = await prisma.listing.findMany({
      where,
      take: 100,
    })

    return listings.map((listing): EmailProperty => {
      const address = [
        listing.streetNumber,
        listing.streetName,
        listing.streetSuffix,
        listing.unitNumber ? `#${listing.unitNumber}` : ''
      ].filter(Boolean).join(' ') || listing.unparsedAddress || `${listing.city}, ${listing.stateOrProvince}`

      const media = listing.media as Array<{ MediaURL: string }> | null
      const imageUrl = media && media.length > 0 ? media[0].MediaURL : undefined

      return {
        id: listing.listingKey,
        address,
        price: Number(listing.listPrice) || 0,
        beds: listing.bedroomsTotal || 0,
        baths: listing.bathroomsTotalInteger || 0,
        sqft: listing.livingArea || 0,
        imageUrl,
        listingUrl: `${process.env.NEXTAUTH_URL}/listing/${listing.listingKey}`
      }
    })
  } catch (error) {
    console.error('Error fetching new listings from database:', error)
    return []
  }
}

// =============================================================================
// BRIDGE DATA OUTPUT API CODE (Phase 4: commented out for rollback)
// To rollback: uncomment this function and the imports above, revert the
// savedSearch conversion in the loop, and change the function call back.
// =============================================================================
/*
import { SavedSearch } from '@/app/types/SavedSearch'
import { Listing } from '@/app/hooks/useMapDisplay'

async function fetchNewListingsForSearch(savedSearch: SavedSearch): Promise<EmailProperty[]> {
  try {
    const filters: Record<string, string | number> = {
      limit: 100,
      offset: 0,
      fields: 'ListingKey,ListPrice,City,StateOrProvince,UnparsedAddress,StreetNumber,StreetName,StreetSuffix,UnitNumber,BedroomsTotal,BathroomsTotalInteger,LivingArea,Media,ListingContractDate'
    }

    if (savedSearch.bounds) {
      filters['Latitude.gte'] = savedSearch.bounds.south
      filters['Latitude.lte'] = savedSearch.bounds.north
      filters['Longitude.gte'] = savedSearch.bounds.west
      filters['Longitude.lte'] = savedSearch.bounds.east
    } else if (savedSearch.searchQuery) {
      filters.near = savedSearch.searchQuery
      filters.radius = 4
    }

    if (savedSearch.minPrice) {
      filters['ListPrice.gte'] = savedSearch.minPrice
    }
    if (savedSearch.maxPrice) {
      filters['ListPrice.lte'] = savedSearch.maxPrice
    }

    if (savedSearch.minBeds) {
      filters['BedroomsTotal.gte'] = savedSearch.minBeds
    }

    if (savedSearch.minBaths) {
      filters['BathroomsTotalInteger.gte'] = savedSearch.minBaths
    }

    const propertyTypes = [...(savedSearch.propertyTypes || [])]
    if (savedSearch.includeLand) {
      propertyTypes.push('Land')
    }
    if (propertyTypes.length > 0) {
      filters['PropertyType.in'] = propertyTypes.join(',')
    }

    if (savedSearch.statuses && savedSearch.statuses.length > 0) {
      filters['StandardStatus.in'] = savedSearch.statuses.join(',')
    } else {
      filters['StandardStatus.in'] = 'Active'
    }

    const yesterday = new Date()
    yesterday.setDate(yesterday.getDate() - 1)
    const yesterdayFormatted = yesterday.toISOString().split('T')[0]
    filters['ListingContractDate'] = yesterdayFormatted

    const queryString = Object.entries(filters)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&')

    const apiUrl = `https://api.bridgedataoutput.com/api/v2/iresds/listings?access_token=${process.env.NEXT_PUBLIC_BROWSER_TOKEN}&${queryString}`

    const response = await fetch(apiUrl)

    if (!response.ok) {
      console.error(`Failed to fetch listings: ${response.status} ${response.statusText}`)
      return []
    }

    const data = await response.json()
    const listings: Listing[] = data.bundle || []

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
*/
