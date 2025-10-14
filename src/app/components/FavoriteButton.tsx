'use client'

import { useAuth } from '@/contexts/AuthContext'

interface FavoriteButtonProps {
  listingId: string
}

const FavoriteButton = ({ listingId }: FavoriteButtonProps) => {
  const { user, favorites, toggleFavorite } = useAuth()

  if (!user) return null

  const isFavorited = favorites.has(listingId)

  const handleToggleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    await toggleFavorite(listingId)
  }

  return (
    <button
      onClick={handleToggleFavorite}
      className='absolute cursor-pointer top-0 left-0 z-10 p-1 rounded-full bg-white/40 hover:bg-white transition-all duration-200'
      aria-label={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
    >
      <svg
        className={`w-6 h-6 transition-colors duration-200 ${
          isFavorited ? 'fill-primary' : 'fill-none stroke-primary'
        }`}
        viewBox='0 0 24 24'
        strokeWidth={2}
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          d='M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z'
        />
      </svg>
    </button>
  )
}

export default FavoriteButton