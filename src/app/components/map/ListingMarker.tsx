'use client'

import { AdvancedMarker, InfoWindow, useAdvancedMarkerRef } from '@vis.gl/react-google-maps'
import { useState } from 'react'
import { Listing } from '@/app/hooks/useMapDisplay'
import Image from 'next/image'

type ListingMarkerProps = {
  listing: Listing
}

const ListingMarker = ({ listing }: ListingMarkerProps) => {
  const [markerRef, marker] = useAdvancedMarkerRef()
  const [infoWindowShown, setInfoWindowShown] = useState(false)

  if (!listing.Latitude || !listing.Longitude) return null

  const handleMarkerClick = () => {
    window.open(`/listing/${listing.ListingKey}`, '_blank')
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getPhotoUrl = () => {
    // Use the first photo from Media array
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

  return (
    <>
      <AdvancedMarker
        ref={markerRef}
        position={{ lat: listing.Latitude, lng: listing.Longitude }}
        onMouseEnter={() => setInfoWindowShown(true)}
        onMouseLeave={() => setInfoWindowShown(false)}
        onClick={handleMarkerClick}
        className="cursor-pointer"
      >
        <div className="bg-primary text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg hover:bg-secondary transition-colors">
          {formatPrice(listing.ListPrice)}
        </div>
      </AdvancedMarker>

      {infoWindowShown && (
        <InfoWindow
          anchor={marker}
          onCloseClick={() => setInfoWindowShown(false)}
          headerDisabled
          disableAutoPan={true}
        >
          <div className="w-72 cursor-pointer" onClick={handleMarkerClick}>
            <div className="relative w-full h-40 bg-gray-200">
              {getPhotoUrl() ? (
                <Image
                  src={getPhotoUrl()!}
                  alt={`${getAddress()} property`}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  No photo available
                </div>
              )}
            </div>
            <div className="p-3">
              <p className="font-bold text-lg text-primary mb-1">
                {formatPrice(listing.ListPrice)}
              </p>
              <p className="text-sm font-semibold text-gray-800 mb-2">
                {getAddress()}
              </p>
              <p className="text-sm text-gray-700 mb-2">
                {listing.PropertyType === 'Land' ? (
                  listing.LotSizeSquareFeet && `${listing.LotSizeSquareFeet} acres`
                ) : (
                  <>
                    {listing.BedroomsTotal} bd | {listing.BathroomsTotalInteger ?? listing.BathroomsFull} ba
                    {listing.LivingArea && ` | ${listing.LivingArea.toLocaleString()} sqft`}
                  </>
                )}
              </p>
              <p className="text-sm text-gray-600 mb-1">
                {listing.City}, {listing.StateOrProvince || 'CO'} {listing.PostalCode}
              </p>
              <p className="text-xs text-gray-500">
                {listing.StandardStatus || listing.MlsStatus} • {listing.DaysOnMarket} days on market
              </p>
              {listing.ListAgentFullName && (
                <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200">
                  Agent: {listing.ListAgentFullName}
                </p>
              )}
            </div>
          </div>
        </InfoWindow>
      )}
    </>
  )
}

export default ListingMarker
