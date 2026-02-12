import { Listing } from "@/app/hooks/useMapDisplay"
import FavoriteButton from "../FavoriteButton"

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
      className='flex flex-col w-full min-h-96 border border-gray-300 rounded-md cursor-pointer hover:shadow-lg transition-shadow overflow-hidden'
      onClick={handleClick}
    >
      {/* Image on top - full width */}
      <div className='relative w-full h-64 bg-gray-200'>
        <FavoriteButton listingId={listing.ListingKey} />
        {getPhotoUrl() ? (
          <img
            src={getPhotoUrl()!}
            alt={`${listing.streetAddress} property`}
            className='object-cover w-full h-full absolute inset-0'
            loading='lazy'
          />
        ) : (
          <div className='w-full h-full flex items-center justify-center text-gray-400 text-sm'>
            No photo
          </div>
        )}
      </div>

      {/* Content below */}
      <div className='flex flex-col p-4'>
        <div className='mb-3'>
          <div className='flex gap-2 items-center mb-2'>
            <p className='text-lg font-bold text-gray-900 mb-1 md:mb-0'>
              {formatPrice(listing.ListPrice)}
            </p>
            <p className='text-sm text-gray-600'>
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
          <div className='flex gap-2 items-center'>
            <p className='text-sm text-gray-800 font-medium'>
              {listing.streetAddress}
            </p>
            <p className='text-xs text-gray-500 md:text-sm md:ml-2'>
              {listing.City}, {listing.StateOrProvince || 'CO'} {listing.PostalCode}
            </p>
          </div>
        </div>
        <div className='pt-2 border-t border-gray-200'>
          <p className='text-xs text-gray-500'>
            {listing.MlsStatus} • {listing.DaysOnMarket} days on market
          </p>
          {getSubStatus() && (
            <p className='text-xs font-semibold text-gray-700 mt-1'>
              {getSubStatus()}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default ListingTile