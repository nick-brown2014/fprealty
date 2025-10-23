'use client'

import { use, useState } from 'react'
import Image from 'next/image'
import useListing from '@/app/hooks/useListing'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import Slideshow from '@/app/components/Slideshow'
import { useRouter } from 'next/navigation'

type GalleryPageProps = {
  params: Promise<{
    listing_id: string
  }>
}

const GalleryPage = ({ params }: GalleryPageProps) => {
  const { listing_id } = use(params)
  const { listing, loading } = useListing(listing_id)
  const router = useRouter()
  const [isSlideshowOpen, setIsSlideshowOpen] = useState(false)
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)

  const openSlideshow = (index: number) => {
    setSelectedImageIndex(index)
    setIsSlideshowOpen(true)
  }

  if (!!loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <p className='text-xl text-gray-600'>Loading...</p>
      </div>
    )
  }

  if (!listing) return <></>

  return (
    <div className='min-h-screen bg-gray-50'>
      <Nav />
      <div className='max-w-7xl mx-auto px-4 py-8'>
        {/* Header */}
        <div className='flex justify-between items-center mb-6'>
          <div>
            <h1 className='text-3xl font-bold text-gray-900'>Photo Gallery</h1>
            <p className='text-lg text-gray-700 mt-1'>{listing.UnparsedAddress}</p>
          </div>
          <button
            onClick={() => router.push(`/listing/${listing_id}`)}
            className='px-4 py-2 bg-primary text-white rounded-lg hover:opacity-90 transition font-semibold cursor-pointer'
          >
            Back to Listing
          </button>
        </div>

        {/* Gallery Grid */}
        {listing.Media && listing.Media.length > 0 ? (
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
            {listing.Media.map((media, index) => (
              <div
                key={media.MediaObjectID || index}
                className='relative w-full h-64 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity'
                onClick={() => openSlideshow(index)}
              >
                <Image
                  src={media.MediaURL}
                  alt={`${listing.streetAddress} property ${index + 1}`}
                  fill
                  className='object-cover'
                />
              </div>
            ))}
          </div>
        ) : (
          <div className='w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center'>
            <p className='text-gray-400 text-lg'>No photos available</p>
          </div>
        )}

        {/* Slideshow */}
        {listing.Media && (
          <Slideshow
            media={listing.Media}
            isOpen={isSlideshowOpen}
            initialIndex={selectedImageIndex}
            onClose={() => setIsSlideshowOpen(false)}
          />
        )}
      </div>
      <Footer />
    </div>
  )
}

export default GalleryPage