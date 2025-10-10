import { Listing } from "@/app/hooks/useMapDisplay"
import Image from "next/image"

const ListingTile = ({ listing }: { listing: Listing }) => {
  const getPhotoUrl = () => {
    if (listing.Media && listing.Media.length > 0) {
      return listing.Media[0].MediaURL
    }
    return null
  }


  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getSubStatus = () => {
    if (listing.StandardStatus === 'Active Under Contract') {
      return 'Under Contract'
    }
    if (listing.MlsStatus === 'Active/Backup') {
      return 'Backup'
    }
    if (listing.MlsStatus === 'Active/First Right') {
      return 'First Right'
    }
    return null
  }

  const handleClick = () => {
    window.open(`/listing/${listing.ListingKey}`, '_blank')
  }

  return (
    <div
      className='flex w-full min-h-36 border border-gray-300 rounded-md cursor-pointer hover:shadow-lg transition-shadow px-1.5 py-2 sm:px-2'
      onClick={handleClick}
    >
      {/* Image on the left - full height */}
      <div className='relative w-32 h-32 flex-shrink-0 bg-gray-200'>
        {getPhotoUrl() ? (
          <Image
            src={getPhotoUrl()!}
            alt={`${listing.streetAddress} property`}
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
      <div className='flex flex-col justify-between pl-2 py-3 flex-1 min-w-0'>
        <div>
          <div className='flex flex-col xl:flex-row xl:items-baseline gap-0 xl:gap-2 mb-1'>
            <p className='text-base font-semibold text-gray-900'>
              {formatPrice(listing.ListPrice)}
            </p>
            <p className='text-xs text-gray-600'>
              {listing.PropertyType === 'Land' ? (
                listing.LotSizeAcres && `${listing.LotSizeAcres} acres`
              ) : (
                <>
                  {listing.BedroomsTotal} bd | {listing.BathroomsTotalInteger ?? listing.BathroomsFull} ba
                  {listing.LivingArea && ` | ${listing.LivingArea.toLocaleString()} sqft`}
                </>
              )}
            </p>
          </div>
          <p className='text-sm text-gray-800 break-words leading-tight sm:leading-normal'>
            {listing.streetAddress}
          </p>
          <p className='text-xs text-gray-500'>
            {listing.City}, {listing.StateOrProvince || 'CO'} {listing.PostalCode}
          </p>
        </div>
        <div className='mt-2'>
          <p className='text-xs text-gray-500'>
            {listing.StandardStatus || listing.MlsStatus} • {listing.DaysOnMarket} days on market
          </p>
          {getSubStatus() && (
            <p className='text-xs font-semibold text-gray-700 mt-0.5'>
              {getSubStatus()}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ListingTile