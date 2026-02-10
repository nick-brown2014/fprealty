import { useEffect, useState } from "react"
// Bridge API import - commented out for MLS Grid migration (Phase 5)
// import { apiGet } from "../server/api"
import { DetailedListing } from "../types/DetailedListing"
import { DetailedBrokerage } from "../types/DetailedBrokerage"

// Bridge API response types - commented out for MLS Grid migration (Phase 5)
// interface ListingResponse {
//   success: boolean
//   status: number
//   bundle: DetailedListing
// }

// interface BrokerageResponse {
//   success: boolean
//   status: number
//   bundle: DetailedBrokerage
// }

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

    return listing.UnparsedAddress || `${listing.City}, ${listing.StateOrProvince || 'CO'}`
  }

  const fetchListing = async (id: string) => {
    setLoading(true)

    const res = await fetch(`/api/listings/${id}`)
    if (!res.ok) {
      setLoading(false)
      return
    }
    const data: DetailedListing & { ListOfficeName?: string } = await res.json()

    // Bridge API fetch - commented out for MLS Grid migration (Phase 5)
    // const listingRes: ListingResponse = await apiGet(`/listing/${id}`)
    // const listingData = listingRes.bundle

    const listingWithStreetAddress = {
      ...data,
      streetAddress: getStreetAddress(data)
    }

    if (data.ListOfficeName || data.ListOfficeKey) {
      setBrokerage({
        OfficeName: data.ListOfficeName ?? '',
        OfficeKey: data.ListOfficeKey ?? '',
      } as DetailedBrokerage)
    }

    // Bridge API brokerage fetch - commented out for MLS Grid migration (Phase 5)
    // if (!!listingRes.bundle.ListOfficeKey) {
    //   await fetchBrokerage(listingRes.bundle.ListOfficeKey)
    // }

    setListing(listingWithStreetAddress)

    setLoading(false)
  }

  // Bridge API brokerage fetch - commented out for MLS Grid migration (Phase 5)
  // const fetchBrokerage = async (id: string) => {
  //   const brokerageRes: BrokerageResponse = await apiGet(`/offices/${id}`)
  //   setBrokerage(brokerageRes.bundle)
  // }

  return {
    brokerage,
    listing,
    loading,
  }
}

export default useListing
