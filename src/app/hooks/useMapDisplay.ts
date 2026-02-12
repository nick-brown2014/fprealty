import { useEffect, useState } from "react"
import { apiGet } from "../server/api"

// Bridge API field selection string (no longer needed - Prisma returns selected fields from API route)
// const listingsListFields = 'ListingKey,ListPrice,OriginalListPrice,ClosePrice,CloseDate,City,StateOrProvince,PostalCode,CountyOrParish,UnparsedAddress,StreetNumber,StreetName,StreetSuffix,UnitNumber,PropertyType,PropertySubType,BedroomsTotal,BathroomsFull,BathroomsTotalInteger,LivingArea,LivingAreaUnits,PhotosCount,Media,MlsStatus,DaysOnMarket,Latitude,Longitude,ListAgentFullName,LotSizeAcres'

interface ListingsResponse {
  total: number
  success: boolean
  bundle: Listing[]
}

export type Media = {
  MediaURL: string
  MediaObjectID: string
  Order: number
  MimeType: string
  ShortDescription?: string
}

export type Listing = {
  ListingKey: string
  ListPrice: number
  OriginalListPrice?: number
  ClosePrice?: number
  CloseDate?: string
  City: string
  StateOrProvince?: string
  PostalCode?: string
  CountyOrParish?: string
  UnparsedAddress?: string
  StreetNumber?: string
  StreetName?: string
  StreetSuffix?: string
  UnitNumber?: string
  PropertyType?: string
  PropertySubType: string
  BedroomsTotal: number
  BathroomsFull: number
  BathroomsTotalInteger?: number
  LivingArea: number
  LivingAreaUnits?: string
  PhotosCount: number
  Media?: Media[]
  MlsStatus: string
  DaysOnMarket: number
  Latitude?: number
  Longitude?: number
  ListAgentFullName?: string
  LotSizeAcres?: number
  streetAddress?: string
}

export type SearchFilters = {
  searchQuery?: string
  mapBounds?: google.maps.LatLngBounds | null
  minPrice?: number
  maxPrice?: number | null
  minBeds?: number | null
  minBaths?: number | null
  propertyTypes?: string[]
  includeLand?: boolean
  newConstructionOnly?: boolean
  statuses?: string[]
  mlsNumber?: string
  listingIds?: string[]
  minSqft?: number | null
  maxSqft?: number | null
  minLotSize?: number | null
  maxLotSize?: number | null
  minYearBuilt?: number | null
  maxYearBuilt?: number | null
  minStories?: number | null
  maxStories?: number | null
  minGarageSpaces?: number | null
  hasPool?: boolean
  hasAC?: boolean
  hasBasement?: boolean
  isWaterfront?: boolean
  hasFireplace?: boolean
  isSeniorCommunity?: boolean
  maxHoaFee?: number | null
  // New filters
  hasSpa?: boolean
  isHorseProperty?: boolean
  hasGarage?: boolean
  hasAttachedGarage?: boolean
  hasHeating?: boolean
  minDaysOnMarket?: number | null
  maxDaysOnMarket?: number | null
  minTaxAmount?: number | null
  maxTaxAmount?: number | null
  minCoveredSpaces?: number | null
  hasVirtualTour?: boolean
  isGreenEnergy?: boolean
  view?: string[]
  flooring?: string[]
  appliances?: string[]
  heatingType?: string[]
  architecturalStyle?: string[]
  fencing?: string[]
  patioFeatures?: string[]
  schoolDistrict?: string
}

type Filters = {
  limit: number
  offset: number
  'Latitude.gte'?: number
  'Latitude.lte'?: number
  'Longitude.gte'?: number
  'Longitude.lte'?: number
  'ListPrice.gte'?: number
  'ListPrice.lte'?: number
  'BedroomsTotal.gte'?: number
  'BathroomsTotalInteger.gte'?: number
  'PropertyType.in'?: string
  'PropertySubType.in'?: string
  'MlsStatus.in'?: string
  'ListingKey.in'?: string
  'ListingId'?: string
  'NewConstructionYN'?: boolean
  'LivingArea.gte'?: number
  'LivingArea.lte'?: number
  'LotSizeAcres.gte'?: number
  'LotSizeAcres.lte'?: number
  'YearBuilt.gte'?: number
  'YearBuilt.lte'?: number
  'Stories.gte'?: number
  'Stories.lte'?: number
  'GarageSpaces.gte'?: number
  'PoolPrivateYN'?: boolean
  'CoolingYN'?: boolean
  'Basement.ne'?: string
  'WaterfrontYN'?: boolean
  'FireplaceYN'?: boolean
  'SeniorCommunityYN'?: boolean
  'AssociationFee.lte'?: number
  // New filter parameters
  'SpaYN'?: boolean
  'HorseYN'?: boolean
  'GarageYN'?: boolean
  'AttachedGarageYN'?: boolean
  'HeatingYN'?: boolean
  'DaysOnMarket.gte'?: number
  'DaysOnMarket.lte'?: number
  'TaxAnnualAmount.gte'?: number
  'TaxAnnualAmount.lte'?: number
  'CoveredSpaces.gte'?: number
  'VirtualTourURLUnbranded.ne'?: string
  'GreenEnergyEfficient.ne'?: string
  'View.in'?: string
  'Flooring.in'?: string
  'Appliances.in'?: string
  'Heating.in'?: string
  'ArchitecturalStyle.in'?: string
  'Fencing.in'?: string
  'PatioAndPorchFeatures.in'?: string
  'HighSchoolDistrict'?: string
}

const FORT_COLLINS_BOUNDS = {
  'Latitude.gte': 40.35,
  'Latitude.lte': 40.75,
  'Longitude.gte': -105.30,
  'Longitude.lte': -104.80,
}

const defaultFilters: Filters = {
  limit: 100,
  offset: 0,
  ...FORT_COLLINS_BOUNDS,
}

const useMapDisplay = (searchFilters?: SearchFilters, userId?: string) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [filters, setFilters] = useState<Filters>(defaultFilters)
  const [saveSearchState, setSaveSearchState] = useState<'idle' | 'saving' | 'saved'>('idle')

  useEffect(() => {
    // Build filters from search filters
    const newFilters: Filters = {
      ...defaultFilters
    }

    // If listing IDs are provided, ignore all other filters and fetch only those listings
    if (searchFilters?.listingIds && searchFilters.listingIds.length > 0) {
      const favoritesFilters: Filters = {
        limit: 100,
        offset: 0,
        'ListingKey.in': searchFilters.listingIds.join(',')
      }
      setFilters(favoritesFilters)
      return
    }

    // If MLS Number is provided, search by ListingId only
    if (searchFilters?.mlsNumber?.trim()) {
      const mlsFilters: Filters = {
        limit: 100,
        offset: 0,
        'ListingId': searchFilters.mlsNumber.trim()
      }
      setFilters(mlsFilters)
      return
    }

    // Use map bounds if available, otherwise use search query
    if (searchFilters?.mapBounds) {
      const ne = searchFilters.mapBounds.getNorthEast()
      const sw = searchFilters.mapBounds.getSouthWest()

      // Calculate the bounds dimensions
      const latDiff = ne.lat() - sw.lat()
      const lngDiff = ne.lng() - sw.lng()

      // Shrink bounds by 10% on each side (20% total reduction in each dimension)
      const latPadding = latDiff * 0.1
      const lngPadding = lngDiff * 0.1

      newFilters['Latitude.gte'] = sw.lat() + latPadding
      newFilters['Latitude.lte'] = ne.lat() - latPadding
      newFilters['Longitude.gte'] = sw.lng() + lngPadding
      newFilters['Longitude.lte'] = ne.lng() - lngPadding

      delete newFilters['Latitude.gte']
      delete newFilters['Latitude.lte']
      delete newFilters['Longitude.gte']
      delete newFilters['Longitude.lte']

      newFilters['Latitude.gte'] = sw.lat() + latPadding
      newFilters['Latitude.lte'] = ne.lat() - latPadding
      newFilters['Longitude.gte'] = sw.lng() + lngPadding
      newFilters['Longitude.lte'] = ne.lng() - lngPadding
    }

    // Add price filters
    if (searchFilters?.minPrice && searchFilters.minPrice > 0) {
      newFilters['ListPrice.gte'] = searchFilters.minPrice
    }
    if (searchFilters?.maxPrice !== null && searchFilters?.maxPrice !== undefined) {
      newFilters['ListPrice.lte'] = searchFilters.maxPrice
    }

    // Add bedroom filter
    if (searchFilters?.minBeds !== null && searchFilters?.minBeds !== undefined) {
      newFilters['BedroomsTotal.gte'] = searchFilters.minBeds
    }

    // Add bathroom filter
    if (searchFilters?.minBaths !== null && searchFilters?.minBaths !== undefined) {
      newFilters['BathroomsTotalInteger.gte'] = searchFilters.minBaths
    }

    // Add property types filter (using PropertyType)
    // Build the property types array
    const propertyTypes = [...(searchFilters?.propertyTypes || [])]
    if (searchFilters?.includeLand) {
      propertyTypes.push('Land')
    }

    if (propertyTypes.length > 0) {
      newFilters['PropertyType.in'] = propertyTypes.join(',')
    }

    // Add status filter
    if (searchFilters?.statuses && searchFilters.statuses.length > 0) {
      newFilters['MlsStatus.in'] = searchFilters.statuses.join(',')
    }

    // Add new construction filter
    if (searchFilters?.newConstructionOnly) {
      newFilters['NewConstructionYN'] = true
    }

    // Add square footage filters
    if (searchFilters?.minSqft !== null && searchFilters?.minSqft !== undefined) {
      newFilters['LivingArea.gte'] = searchFilters.minSqft
    }
    if (searchFilters?.maxSqft !== null && searchFilters?.maxSqft !== undefined) {
      newFilters['LivingArea.lte'] = searchFilters.maxSqft
    }

    // Add lot size filters (in acres)
    if (searchFilters?.minLotSize !== null && searchFilters?.minLotSize !== undefined) {
      newFilters['LotSizeAcres.gte'] = searchFilters.minLotSize
    }
    if (searchFilters?.maxLotSize !== null && searchFilters?.maxLotSize !== undefined) {
      newFilters['LotSizeAcres.lte'] = searchFilters.maxLotSize
    }

    // Add year built filters
    if (searchFilters?.minYearBuilt !== null && searchFilters?.minYearBuilt !== undefined) {
      newFilters['YearBuilt.gte'] = searchFilters.minYearBuilt
    }
    if (searchFilters?.maxYearBuilt !== null && searchFilters?.maxYearBuilt !== undefined) {
      newFilters['YearBuilt.lte'] = searchFilters.maxYearBuilt
    }

    // Add stories filters
    if (searchFilters?.minStories !== null && searchFilters?.minStories !== undefined) {
      newFilters['Stories.gte'] = searchFilters.minStories
    }
    if (searchFilters?.maxStories !== null && searchFilters?.maxStories !== undefined) {
      newFilters['Stories.lte'] = searchFilters.maxStories
    }

    // Add garage spaces filter
    if (searchFilters?.minGarageSpaces !== null && searchFilters?.minGarageSpaces !== undefined) {
      newFilters['GarageSpaces.gte'] = searchFilters.minGarageSpaces
    }

    // Add boolean feature filters
    if (searchFilters?.hasPool) {
      newFilters['PoolPrivateYN'] = true
    }
    if (searchFilters?.hasAC) {
      newFilters['CoolingYN'] = true
    }
    if (searchFilters?.hasBasement) {
      newFilters['Basement.ne'] = 'None'
    }
    if (searchFilters?.isWaterfront) {
      newFilters['WaterfrontYN'] = true
    }
    if (searchFilters?.hasFireplace) {
      newFilters['FireplaceYN'] = true
    }
    if (searchFilters?.isSeniorCommunity) {
      newFilters['SeniorCommunityYN'] = true
    }

    // Add HOA fee filter
    if (searchFilters?.maxHoaFee !== null && searchFilters?.maxHoaFee !== undefined) {
      newFilters['AssociationFee.lte'] = searchFilters.maxHoaFee
    }

    // New boolean feature filters
    if (searchFilters?.hasSpa) {
      newFilters['SpaYN'] = true
    }
    if (searchFilters?.isHorseProperty) {
      newFilters['HorseYN'] = true
    }
    if (searchFilters?.hasGarage) {
      newFilters['GarageYN'] = true
    }
    if (searchFilters?.hasAttachedGarage) {
      newFilters['AttachedGarageYN'] = true
    }
    if (searchFilters?.hasHeating) {
      newFilters['HeatingYN'] = true
    }

    // Days on market filters
    if (searchFilters?.minDaysOnMarket !== null && searchFilters?.minDaysOnMarket !== undefined) {
      newFilters['DaysOnMarket.gte'] = searchFilters.minDaysOnMarket
    }
    if (searchFilters?.maxDaysOnMarket !== null && searchFilters?.maxDaysOnMarket !== undefined) {
      newFilters['DaysOnMarket.lte'] = searchFilters.maxDaysOnMarket
    }

    // Tax amount filters
    if (searchFilters?.minTaxAmount !== null && searchFilters?.minTaxAmount !== undefined) {
      newFilters['TaxAnnualAmount.gte'] = searchFilters.minTaxAmount
    }
    if (searchFilters?.maxTaxAmount !== null && searchFilters?.maxTaxAmount !== undefined) {
      newFilters['TaxAnnualAmount.lte'] = searchFilters.maxTaxAmount
    }

    // Covered parking spaces filter
    if (searchFilters?.minCoveredSpaces !== null && searchFilters?.minCoveredSpaces !== undefined) {
      newFilters['CoveredSpaces.gte'] = searchFilters.minCoveredSpaces
    }

    // Virtual tour filter
    if (searchFilters?.hasVirtualTour) {
      newFilters['VirtualTourURLUnbranded.ne'] = ''
    }

    // Green energy filter
    if (searchFilters?.isGreenEnergy) {
      newFilters['GreenEnergyEfficient.ne'] = ''
    }

    // Array-based feature filters
    if (searchFilters?.view && searchFilters.view.length > 0) {
      newFilters['View.in'] = searchFilters.view.join(',')
    }
    if (searchFilters?.flooring && searchFilters.flooring.length > 0) {
      newFilters['Flooring.in'] = searchFilters.flooring.join(',')
    }
    if (searchFilters?.appliances && searchFilters.appliances.length > 0) {
      newFilters['Appliances.in'] = searchFilters.appliances.join(',')
    }
    if (searchFilters?.heatingType && searchFilters.heatingType.length > 0) {
      newFilters['Heating.in'] = searchFilters.heatingType.join(',')
    }
    if (searchFilters?.architecturalStyle && searchFilters.architecturalStyle.length > 0) {
      newFilters['ArchitecturalStyle.in'] = searchFilters.architecturalStyle.join(',')
    }
    if (searchFilters?.fencing && searchFilters.fencing.length > 0) {
      newFilters['Fencing.in'] = searchFilters.fencing.join(',')
    }
    if (searchFilters?.patioFeatures && searchFilters.patioFeatures.length > 0) {
      newFilters['PatioAndPorchFeatures.in'] = searchFilters.patioFeatures.join(',')
    }

    // School district filter
    if (searchFilters?.schoolDistrict?.trim()) {
      newFilters['HighSchoolDistrict'] = searchFilters.schoolDistrict.trim()
    }

    setFilters(newFilters)
  }, [searchFilters])

  useEffect(() => {
    fetchListings()
  }, [filters])

  const getStreetAddress = (listing: Listing): string => {
    const parts = []
    if (listing.StreetNumber) parts.push(listing.StreetNumber)
    if (listing.StreetName) parts.push(listing.StreetName)
    if (listing.StreetSuffix) parts.push(listing.StreetSuffix)
    if (listing.UnitNumber) parts.push(`#${listing.UnitNumber}`)

    if (parts.length > 0) {
      return parts.join(' ')
    }

    // Fallback to unparsed address or city
    return listing.UnparsedAddress || `${listing.City}, ${listing.StateOrProvince || 'CO'}`
  }

  const fetchListings = async () => {
    setLoading(true)
    const listingsRes: ListingsResponse = await apiGet('/listings', filters as Record<string, string | number | boolean>)

    // Add streetAddress field to each listing
    const listingsWithStreetAddress = listingsRes.bundle.map(listing => ({
      ...listing,
      streetAddress: getStreetAddress(listing)
    }))

    setListings(listingsWithStreetAddress)

    setLoading(false)
  }

  const saveSearch = async () => {
    if (!userId || saveSearchState !== 'idle') return

    setSaveSearchState('saving')

    try {
      // Generate a name for the search based on filters
      const searchName = searchFilters?.searchQuery ||
        `Search: ${searchFilters?.minPrice ? `$${searchFilters.minPrice.toLocaleString()}+` : 'Any'} | ${searchFilters?.minBeds ? `${searchFilters.minBeds}+ bd` : 'Any beds'} | ${searchFilters?.minBaths ? `${searchFilters.minBaths}+ ba` : 'Any baths'}`

      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId,
          name: searchName,
          searchQuery: searchFilters?.searchQuery || null,
          minPrice: searchFilters?.minPrice || null,
          maxPrice: searchFilters?.maxPrice || null,
          minBeds: searchFilters?.minBeds || null,
          minBaths: searchFilters?.minBaths || null,
          propertyTypes: searchFilters?.propertyTypes || [],
          includeLand: searchFilters?.includeLand || false,
          statuses: searchFilters?.statuses || [],
          bounds: searchFilters?.mapBounds ? {
            north: searchFilters.mapBounds.getNorthEast().lat(),
            south: searchFilters.mapBounds.getSouthWest().lat(),
            east: searchFilters.mapBounds.getNorthEast().lng(),
            west: searchFilters.mapBounds.getSouthWest().lng()
          } : null,
          minSqft: searchFilters?.minSqft ?? null,
          maxSqft: searchFilters?.maxSqft ?? null,
          minLotSize: searchFilters?.minLotSize ?? null,
          maxLotSize: searchFilters?.maxLotSize ?? null,
          minYearBuilt: searchFilters?.minYearBuilt ?? null,
          maxYearBuilt: searchFilters?.maxYearBuilt ?? null,
          minStories: searchFilters?.minStories ?? null,
          maxStories: searchFilters?.maxStories ?? null,
          minGarageSpaces: searchFilters?.minGarageSpaces ?? null,
          hasPool: searchFilters?.hasPool || false,
          hasAC: searchFilters?.hasAC || false,
          hasBasement: searchFilters?.hasBasement || false,
          isWaterfront: searchFilters?.isWaterfront || false,
          hasFireplace: searchFilters?.hasFireplace || false,
          isSeniorCommunity: searchFilters?.isSeniorCommunity || false,
          maxHoaFee: searchFilters?.maxHoaFee ?? null,
          hasSpa: searchFilters?.hasSpa || false,
          isHorseProperty: searchFilters?.isHorseProperty || false,
          hasGarage: searchFilters?.hasGarage || false,
          hasAttachedGarage: searchFilters?.hasAttachedGarage || false,
          hasHeating: searchFilters?.hasHeating || false,
          minDaysOnMarket: searchFilters?.minDaysOnMarket ?? null,
          maxDaysOnMarket: searchFilters?.maxDaysOnMarket ?? null,
          minTaxAmount: searchFilters?.minTaxAmount ?? null,
          maxTaxAmount: searchFilters?.maxTaxAmount ?? null,
          minCoveredSpaces: searchFilters?.minCoveredSpaces ?? null,
          hasVirtualTour: searchFilters?.hasVirtualTour || false,
          isGreenEnergy: searchFilters?.isGreenEnergy || false,
          view: searchFilters?.view || [],
          flooring: searchFilters?.flooring || [],
          appliances: searchFilters?.appliances || [],
          heatingType: searchFilters?.heatingType || [],
          architecturalStyle: searchFilters?.architecturalStyle || [],
          fencing: searchFilters?.fencing || [],
          patioFeatures: searchFilters?.patioFeatures || [],
          schoolDistrict: searchFilters?.schoolDistrict || null,
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save search')
      }

      setSaveSearchState('saved')

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveSearchState('idle')
      }, 2000)
    } catch (error) {
      console.error('Save search error:', error)
      setSaveSearchState('idle')
    }
  }

  return {
    loading,
    listings,
    filters,
    setFilters,
    saveSearch,
    saveSearchState
  }
}

export default useMapDisplay
