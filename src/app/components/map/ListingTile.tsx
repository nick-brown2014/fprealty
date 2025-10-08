import { Listing } from "@/app/hooks/useMapDisplay"
import Image from "next/image"
import { useRouter } from "next/navigation"

const ListingTile = ({ listing }: { listing: Listing }) => {
  const router = useRouter()

  const getPhotoUrl = () => {
    if (listing.Media && listing.Media.length > 0) {
      return listing.Media[0].MediaURL
    }
    return null
  }

  const getAddress = () => {
    if (listing.UnparsedAddress) {
      return listing.UnparsedAddress
    }
    const parts = []
    if (listing.StreetNumber) parts.push(listing.StreetNumber)
    if (listing.StreetName) parts.push(listing.StreetName)
    if (listing.UnitNumber) parts.push(`#${listing.UnitNumber}`)
    return parts.length > 0 ? parts.join(' ') : `${listing.City}, ${listing.StateOrProvince || 'CO'}`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const handleClick = () => {
    window.open(`/listing/${listing.ListingKey}`, '_blank')
  }

  return (
    <div
      className='flex w-full min-h-36 border border-gray-300 rounded-md cursor-pointer hover:shadow-lg transition-shadow px-2 py-2'
      onClick={handleClick}
    >
      {/* Image on the left - full height */}
      <div className='relative w-32 h-32 flex-shrink-0 bg-gray-200'>
        {getPhotoUrl() ? (
          <Image
            src={getPhotoUrl()!}
            alt={`${getAddress()} property`}
            fill
            className='object-cover'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-gray-400 text-xs'>
            No photo
          </div>
        )}
      </div>

      {/* Content on the right */}
      <div className='flex flex-col justify-between p-3 flex-1'>
        <div>
          <p className='text-base font-semibold text-gray-900 line-clamp-1 mb-1'>
            {formatPrice(listing.ListPrice)}
          </p>
          <p className='text-sm text-gray-800 line-clamp-1 mb-2'>
            {getAddress()}
          </p>
          <p className='text-xs text-gray-600 mb-1'>
            {listing.PropertyType === 'Land' ? (
              listing.LotSizeSquareFeet && `${listing.LotSizeSquareFeet} sqft`
            ) : (
              <>
                {listing.BedroomsTotal} bd | {listing.BathroomsTotalInteger ?? listing.BathroomsFull} ba
                {listing.LivingArea && ` | ${listing.LivingArea.toLocaleString()} sqft`}
              </>
            )}
          </p>
          <p className='text-xs text-gray-500'>
            {listing.City}, {listing.StateOrProvince || 'CO'} {listing.PostalCode}
          </p>
        </div>
        <p className='text-xs text-gray-500 mt-2'>
          {listing.StandardStatus || listing.MlsStatus} • {listing.DaysOnMarket} days on market
        </p>
      </div>
    </div>
  )
}

export default ListingTile