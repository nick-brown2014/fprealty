import { Resend } from 'resend'
import { prisma } from '@/lib/prisma'
import type { SavedSearch as PrismaSavedSearch } from '@prisma/client'
import { Prisma } from '@prisma/client'
import PropertyAlertEmail from '../../emails/PropertyAlertEmail'
import { isMediaCached } from '@/lib/media'

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXTAUTH_URL || 'https://nocorealtor.com'

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

export interface AlertsResult {
  success: boolean
  emailsSent: number
  usersProcessed: number
  newListingsCount: number
  errors?: string[]
  message?: string
}

// Core alerts processing logic — called directly from sync route
// No HTTP round-trip needed
export async function processPropertyAlerts(
  newListingKeys: string[],
  options?: { testMode?: boolean }
): Promise<AlertsResult> {
  if (newListingKeys.length === 0) {
    return {
      success: true,
      emailsSent: 0,
      usersProcessed: 0,
      newListingsCount: 0,
      message: 'No new listings to alert on',
    }
  }

  console.log(`Processing alerts for ${newListingKeys.length} new listings`)

  if (!process.env.RESEND_API_KEY) {
    console.error('RESEND_API_KEY not configured, skipping alerts')
    return {
      success: false,
      emailsSent: 0,
      usersProcessed: 0,
      newListingsCount: newListingKeys.length,
      message: 'RESEND_API_KEY not configured',
    }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)

  const optedInUsers = await prisma.user.findMany({
    where: {
      emailOptIn: true,
      ...(options?.testMode && { email: 'nick.brown2014@gmail.com' })
    },
    include: {
      savedSearches: true
    }
  })

  console.log(`Found ${optedInUsers.length} users with email opt-in`)

  let emailsSent = 0
  const errors: string[] = []

  for (const user of optedInUsers) {
    if (user.savedSearches.length === 0) continue

    try {
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
          const newProperties = await fetchNewListingsForSearch(savedSearch, newListingKeys)

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
                listingUrl: `${SITE_URL}/listing/${p.id}`
              }))
            })
          }
        } catch (err) {
          console.error(`Error processing search "${savedSearch.name}" for ${user.email}:`, err)
        }
      }

      if (searchResults.length === 0) continue

      const totalProperties = searchResults.reduce((sum, result) => sum + result.properties.length, 0)

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

  return {
    success: true,
    emailsSent,
    usersProcessed: optedInUsers.length,
    newListingsCount: newListingKeys.length,
    errors: errors.length > 0 ? errors : undefined,
  }
}

// Query local Listing table for new listings that match a saved search
async function fetchNewListingsForSearch(savedSearch: PrismaSavedSearch, newListingKeys: string[]): Promise<EmailProperty[]> {
  try {
    const where: Prisma.ListingWhereInput = {
      // Only consider listings that were just synced as new
      listingKey: { in: newListingKeys },
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

    // Status filter (frontend saves mlsStatus values like Active, Pending, Sold)
    if (savedSearch.statuses && savedSearch.statuses.length > 0) {
      where.mlsStatus = { in: savedSearch.statuses }
    } else {
      where.mlsStatus = 'Active'
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
      let imageUrl: string | undefined
      if (media && media.length > 0) {
        const url = media[0].MediaURL
        if (isMediaCached(url)) {
          imageUrl = url
        } else {
          // Use absolute proxy URL for emails
          imageUrl = `${SITE_URL}/api/media/${listing.listingKey}?index=0`
        }
      }

      return {
        id: listing.listingKey,
        address,
        price: Number(listing.listPrice) || 0,
        beds: listing.bedroomsTotal || 0,
        baths: listing.bathroomsTotalInteger || 0,
        sqft: listing.livingArea || 0,
        imageUrl,
        listingUrl: `${SITE_URL}/listing/${listing.listingKey}`
      }
    })
  } catch (error) {
    console.error('Error fetching new listings from database:', error)
    return []
  }
}
