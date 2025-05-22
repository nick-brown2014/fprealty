import { useEffect, useState } from "react"
import { apiGet } from "../server/api"

const listingsListFields = 'ListingKey,BuildingName,ListPrice,OriginalListPrice,City,PropertySubType,BedroomsTotal,BathroomsFull,BathroomsPartial,LivingArea,PhotosCount,MlsStatus,DaysOnMarket'

interface ListingsResponse extends Response {
  total: number
  success: boolean
  bundle: Listing[]
}

type Listing = {
  // check listings
}

type Filters = {
  limit: number
  offset: number
  fields: string
}

const defaultFilters = {
  limit: 16,
  offset: 0,
  fields: listingsListFields
}

const useMapDisplay = () => {
  const [loading, setLoading] = useState<boolean>(false)
  const [listings, setListings] = useState<Listing[]>([])
  const [filters, setFilters] = useState<Filters>(defaultFilters)

  useEffect(() => {
    fetchListings()
  }, [filters])

  const fetchListings = async () => {
    setLoading(true)
    const listingsRes: ListingsResponse = await apiGet('/listings', filters)
    console.log('listingsRes', listingsRes)
    setListings(listingsRes.bundle)

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
