'use client'

import { useAuth } from '@/contexts/AuthContext'

interface SavedSearchesModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectSearch: (search: any) => void
}

const SavedSearchesModal = ({ isOpen, onClose, onSelectSearch }: SavedSearchesModalProps) => {
  const { savedSearches } = useAuth()

  if (!isOpen) return null

  const formatSearchName = (search: any) => {
    return search.name || 'Unnamed Search'
  }

  const formatSearchDetails = (search: any) => {
    const details = []
    if (search.searchQuery) details.push(search.searchQuery)
    if (search.minPrice) details.push(`Min: $${search.minPrice.toLocaleString()}`)
    if (search.maxPrice) details.push(`Max: $${search.maxPrice.toLocaleString()}`)
    if (search.minBeds) details.push(`${search.minBeds}+ beds`)
    if (search.minBaths) details.push(`${search.minBaths}+ baths`)
    if (search.propertyTypes && search.propertyTypes.length > 0) {
      details.push(`Types: ${search.propertyTypes.length}`)
    }
    return details.join(' • ')
  }

  return (
    <div
      className='fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center'
      onClick={onClose}
    >
      <div
        className='max-w-[600px] max-h-[80vh] w-[90vw] rounded-2xl bg-white shadow-xl p-8 relative overflow-y-auto'
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className='absolute top-4 right-4 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer'
          aria-label='Close modal'
        >
          <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
          </svg>
        </button>

        <h2 className='text-2xl font-bold text-gray-900 mb-6'>Saved Searches</h2>

        {savedSearches.length === 0 ? (
          <p className='text-gray-600'>You haven't saved any searches yet.</p>
        ) : (
          <div className='space-y-3'>
            {savedSearches.map((search) => (
              <button
                key={search.id}
                onClick={() => {
                  onSelectSearch(search)
                  onClose()
                }}
                className='w-full text-left p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition cursor-pointer'
              >
                <h3 className='font-semibold text-gray-900 mb-1'>{formatSearchName(search)}</h3>
                <p className='text-sm text-gray-600'>{formatSearchDetails(search)}</p>
                <p className='text-xs text-gray-400 mt-2'>
                  Saved {new Date(search.createdAt).toLocaleDateString()}
                </p>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedSearchesModal