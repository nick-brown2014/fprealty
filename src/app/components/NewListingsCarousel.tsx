'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import { Listing } from '../hooks/useMapDisplay'

const NewListingsCarousel = () => {
  const [listings, setListings] = useState<Listing[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNewListings = async () => {
      try {
        const res = await fetch('/api/listings?limit=10&MlsStatus.in=Active&DaysOnMarket.lte=14')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        const all: Listing[] = data.bundle || []
        const top4 = all
          .filter((l) => l.ListPrice > 0)
          .sort((a, b) => b.ListPrice - a.ListPrice)
          .slice(0, 4)
        setListings(top4)
      } catch (err) {
        console.error('Error fetching new listings:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchNewListings()
  }, [])

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const resetAutoScroll = () => {
    if (intervalRef.current) clearInterval(intervalRef.current)
    if (listings.length > 1) {
      intervalRef.current = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % listings.length)
      }, 5000)
    }
  }

  const nextSlide = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (listings.length === 0) return
    setCurrentIndex((prev) => (prev + 1) % listings.length)
    resetAutoScroll()
  }

  const prevSlide = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (listings.length === 0) return
    setCurrentIndex((prev) => (prev - 1 + listings.length) % listings.length)
    resetAutoScroll()
  }

  // Auto-scroll every 5 seconds
  useEffect(() => {
    if (listings.length <= 1) return
    intervalRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % listings.length)
    }, 5000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [listings.length])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(price)
  }

  const getStreetAddress = (listing: Listing): string => {
    const parts = []
    if (listing.StreetNumber) parts.push(listing.StreetNumber)
    if (listing.StreetName) parts.push(listing.StreetName)
    if (listing.StreetSuffix) parts.push(listing.StreetSuffix)
    if (listing.UnitNumber) parts.push(`#${listing.UnitNumber}`)
    if (parts.length > 0) return parts.join(' ')
    return listing.UnparsedAddress || `${listing.City}, ${listing.StateOrProvince || 'CO'}`
  }

  const getPhotoUrl = (listing: Listing) => {
    if (listing.Media && listing.Media.length > 0) {
      return listing.Media[0].MediaURL
    }
    return null
  }

  if (loading) {
    return (
      <div className='w-full max-w-5xl mx-auto py-8'>
        <div className='animate-pulse bg-gray-200 rounded-2xl h-80' />
      </div>
    )
  }

  if (listings.length === 0) return null

  const listing = listings[currentIndex]

  return (
    <div className='w-full max-w-5xl mx-auto py-8 px-4'>
      <h2 className='text-3xl font-bold tracking-tight text-center mb-8'>New Listings</h2>
      <div className='relative'>
        {/* Carousel Card */}
        <Link
          href={`/listing/${listing.ListingKey}`}
          className='block bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow'
        >
          <div className='flex flex-col md:flex-row'>
            {/* Image */}
            <div className='relative w-full md:w-1/2 h-64 md:h-80 bg-gray-200'>
              {getPhotoUrl(listing) ? (
                <img
                  src={getPhotoUrl(listing)!}
                  alt={`${getStreetAddress(listing)} property`}
                  className='object-cover w-full h-full absolute inset-0'
                />
              ) : (
                <div className='w-full h-full flex items-center justify-center text-gray-400 text-sm'>
                  No photo
                </div>
              )}
            </div>

            {/* Details */}
            <div className='flex flex-col justify-center p-6 md:p-8 md:w-1/2'>
              <p className='text-3xl font-bold text-gray-900 mb-2'>
                {formatPrice(listing.ListPrice)}
              </p>
              <p className='text-lg font-medium text-gray-800 mb-1'>
                {getStreetAddress(listing)}
              </p>
              <p className='text-sm text-gray-500 mb-4'>
                {listing.City}, {listing.StateOrProvince || 'CO'} {listing.PostalCode}
              </p>
              {listing.PropertyType !== 'Land' ? (
                <p className='text-sm text-gray-600'>
                  {listing.BedroomsTotal} bd | {listing.BathroomsTotalInteger ?? listing.BathroomsFull} ba
                  {listing.LivingArea ? ` | ${listing.LivingArea.toLocaleString()} sqft` : ''}
                </p>
              ) : (
                <p className='text-sm text-gray-600'>
                  {listing.LotSizeAcres && `${listing.LotSizeAcres} acres`}
                </p>
              )}
              <p className='text-xs text-gray-500 mt-2'>
                {listing.DaysOnMarket} days on market
              </p>
            </div>
          </div>
        </Link>

        {/* Navigation Arrows */}
        {listings.length > 1 && (
          <>
            <button
              onClick={prevSlide}
              className='absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition cursor-pointer'
              aria-label='Previous listing'
            >
              <svg className='w-5 h-5 text-gray-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
              </svg>
            </button>
            <button
              onClick={nextSlide}
              className='absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full w-10 h-10 flex items-center justify-center shadow-md transition cursor-pointer'
              aria-label='Next listing'
            >
              <svg className='w-5 h-5 text-gray-700' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
              </svg>
            </button>
          </>
        )}

        {/* Dots */}
        {listings.length > 1 && (
          <div className='flex justify-center gap-2 mt-4'>
            {listings.map((_, idx) => (
              <button
                key={idx}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentIndex(idx); resetAutoScroll(); }}
                className={`w-3 h-3 rounded-full transition cursor-pointer ${
                  idx === currentIndex ? 'bg-primary' : 'bg-gray-300'
                }`}
                aria-label={`Go to listing ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NewListingsCarousel
