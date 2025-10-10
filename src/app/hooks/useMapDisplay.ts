import { useEffect, useState } from "react"
import { apiGet } from "../server/api"

const listingsListFields = 'ListingKey,ListPrice,OriginalListPrice,ClosePrice,CloseDate,City,StateOrProvince,PostalCode,CountyOrParish,UnparsedAddress,StreetNumber,StreetName,StreetSuffix,UnitNumber,PropertyType,PropertySubType,BedroomsTotal,BathroomsFull,BathroomsTotalInteger,LivingArea,LivingAreaUnits,PhotosCount,Media,MlsStatus,StandardStatus,DaysOnMarket,Latitude,Longitude,ListAgentFullName,LotSizeAcres'

interface ListingsResponse extends Response {
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
  StandardStatus?: string
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
  statuses?: string[]
}

type Filters = {
  limit: number
  offset: number
  fields: string
  near?: string
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
  'StandardStatus.in'?: string
}

const defaultFilters = {
  limit: 100,
  offset: 0,
  fields: listingsListFields,
  near: 'Fort Collins',
  'PropertyType.in': 'Residential',
  'StandardStatus.in': 'Active'
}

const useMapDisplay = (searchFilters?: SearchFilters) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [filters, setFilters] = useState<Filters>(defaultFilters)

  useEffect(() => {
    // Build filters from search filters
    const newFilters: Filters = {
      ...defaultFilters
    }

    // Use map bounds if available, otherwise use search query
    if (searchFilters?.mapBounds) {
      const ne = searchFilters.mapBounds.getNorthEast()
      const sw = searchFilters.mapBounds.getSouthWest()

      newFilters['Latitude.gte'] = sw.lat()
      newFilters['Latitude.lte'] = ne.lat()
      newFilters['Longitude.gte'] = sw.lng()
      newFilters['Longitude.lte'] = ne.lng()

      // Remove 'near' when using bounds
      delete newFilters.near
    } else if (searchFilters?.searchQuery) {
      newFilters.near = searchFilters.searchQuery
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

    // Add property types filter (using PropertySubType)
    // If includeLand is true, add 'Unimproved Land' to the property subtypes
    const propertySubTypes = [...(searchFilters?.propertyTypes || [])]
    if (searchFilters?.includeLand) {
      propertySubTypes.push('Unimproved Land')
    }

    if (propertySubTypes.length > 0) {
      newFilters['PropertySubType.in'] = propertySubTypes.join(',')
    }

    // Handle PropertyType - if includeLand is true, include both Residential and Land
    if (searchFilters?.includeLand) {
      newFilters['PropertyType.in'] = 'Residential,Land'
    } else {
      newFilters['PropertyType.in'] = 'Residential'
    }

    // Add status filter
    if (searchFilters?.statuses && searchFilters.statuses.length > 0) {
      newFilters['StandardStatus.in'] = searchFilters.statuses.join(',')
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
    const listingsRes: ListingsResponse = await apiGet('/listings', filters)

    // Add streetAddress field to each listing
    const listingsWithStreetAddress = listingsRes.bundle.map(listing => ({
      ...listing,
      streetAddress: getStreetAddress(listing)
    }))

    setListings(listingsWithStreetAddress)

    setLoading(false)
  }

  return {
    loading,
    listings,
    filters,
    setFilters
  }
}

export default useMapDisplay
