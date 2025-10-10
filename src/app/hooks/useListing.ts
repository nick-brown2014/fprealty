import { useEffect, useState } from "react"
import { apiGet } from "../server/api"
import { DetailedListing } from "../types/DetailedListing"

interface ListingResponse {
  success: boolean
  status: number
  bundle: DetailedListing
}

const useListing = (id: string) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [listing, setListing] = useState<DetailedListing | null>(null)

  useEffect(() => {
    if (!id) return

    fetchListing(id)
  }, [id])

  const getStreetAddress = (listing: DetailedListing): string => {
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

  const fetchListing = async (id: string) => {
    setLoading(true)
    const listingRes: ListingResponse = await apiGet(`/listing/${id}`)

    // Add streetAddress field
    const listingWithStreetAddress = {
      ...listingRes.bundle,
      streetAddress: getStreetAddress(listingRes.bundle)
    }

    setListing(listingWithStreetAddress)

    setLoading(false)
  }

  return {
    listing,
    loading,
  }
}

export default useListing
