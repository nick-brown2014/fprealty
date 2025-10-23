'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { Media } from '../hooks/useMapDisplay'

type SlideshowProps = {
  media: Media[]
  isOpen: boolean
  initialIndex?: number
  onClose: () => void
}

const Slideshow = ({ media, isOpen, initialIndex = 0, onClose }: SlideshowProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex)

  useEffect(() => {
    setCurrentImageIndex(initialIndex)
  }, [initialIndex])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % media.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + media.length) % media.length)
  }

  if (!isOpen || !media || media.length === 0) return null

  return (
    <div className='fixed inset-0 z-50 bg-black flex items-center justify-center'>
      {/* Close Button */}
      <button
        onClick={onClose}
        className='absolute cursor-pointer top-4 right-4 z-50 text-white hover:text-gray-300 transition-colors'
        aria-label='Close gallery'
      >
        <svg className='w-8 h-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
        </svg>
      </button>

      {/* Previous Button */}
      <button
        onClick={prevImage}
        className='absolute cursor-pointer left-4 z-50 text-white hover:text-gray-300 transition-colors'
        aria-label='Previous image'
      >
        <svg className='w-12 h-12' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M15 19l-7-7 7-7' />
        </svg>
      </button>

      {/* Next Button */}
      <button
        onClick={nextImage}
        className='absolute cursor-pointer right-4 z-50 text-white hover:text-gray-300 transition-colors'
        aria-label='Next image'
      >
        <svg className='w-12 h-12' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
        </svg>
      </button>

      {/* Current Image */}
      <div className='relative w-full h-full flex items-center justify-center p-16'>
        <div className='relative w-full h-full'>
          <Image
            src={media[currentImageIndex].MediaURL}
            alt={`Property image ${currentImageIndex + 1}`}
            fill
            className='object-contain'
          />
        </div>
      </div>

      {/* Image Counter */}
      <div className='absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-lg font-semibold'>
        {currentImageIndex + 1} / {media.length}
      </div>
    </div>
  )
}

export default Slideshow