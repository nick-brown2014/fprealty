import { useEffect, useState } from "react"
import { apiGet } from "../server/api"
import { DetailedListing } from "../types/DetailedListing"
import { DetailedBrokerage } from "../types/DetailedBrokerage"

interface ListingResponse {
  success: boolean
  status: number
  bundle: DetailedListing
}

interface BrokerageResponse {
  success: boolean
  status: number
  bundle: DetailedBrokerage
}

const useListing = (id: string) => {
  const [loading, setLoading] = useState<boolean>(false)
  const [listing, setListing] = useState<DetailedListing | null>(null)
  const [brokerage, setBrokerage] = useState<DetailedBrokerage | null>(null)

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

    if (!!listingRes.bundle.ListOfficeKey) {
      await fetchBrokerage(listingRes.bundle.ListOfficeKey)
    }

    setListing(listingWithStreetAddress)

    setLoading(false)
  }

  const fetchBrokerage = async (id: string) => {
    const brokerageRes: BrokerageResponse = await apiGet(`/offices/${id}`)
    setBrokerage(brokerageRes.bundle)
  }

  return {
    brokerage,
    listing,
    loading,
  }
}

export default useListing
