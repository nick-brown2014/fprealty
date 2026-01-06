import { useEffect, useState } from "react"
import { apiGet } from "../server/api"

const listingsListFields = 'ListingKey,ListPrice,OriginalListPrice,ClosePrice,CloseDate,City,StateOrProvince,PostalCode,CountyOrParish,UnparsedAddress,StreetNumber,StreetName,StreetSuffix,UnitNumber,PropertyType,PropertySubType,BedroomsTotal,BathroomsFull,BathroomsTotalInteger,LivingArea,LivingAreaUnits,PhotosCount,Media,MlsStatus,DaysOnMarket,Latitude,Longitude,ListAgentFullName,LotSizeAcres'

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
}

type Filters = {
  limit: number
  offset: number
  fields: string
  near?: string
  radius?:number
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
}

const defaultFilters = {
  limit: 100,
  offset: 0,
  fields: listingsListFields,
  near: 'Fort Collins',
  radius: 4
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
        fields: listingsListFields,
        'ListingKey.in': searchFilters.listingIds.join(',')
      }
      setFilters(favoritesFilters as Filters)
      return
    }

    // If MLS Number is provided, search by ListingId only
    if (searchFilters?.mlsNumber?.trim()) {
      const mlsFilters: Filters = {
        limit: 100,
        offset: 0,
        fields: listingsListFields,
        'ListingId': searchFilters.mlsNumber.trim()
      }
      setFilters(mlsFilters as Filters)
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

      // Remove 'near' when using bounds
      delete newFilters.near
      delete newFilters.radius
    } else if (searchFilters?.searchQuery) {
      newFilters.near = searchFilters.searchQuery
      newFilters.radius = 4
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
          } : null
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
