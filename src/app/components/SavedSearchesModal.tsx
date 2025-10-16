'use client'

import { useAuth } from '@/contexts/AuthContext'
import { SavedSearch } from '../types/SavedSearch'
import { useState } from 'react'

interface SavedSearchesModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectSearch: (search: SavedSearch) => void
}

const SavedSearchesModal = ({ isOpen, onClose, onSelectSearch }: SavedSearchesModalProps) => {
  const { savedSearches, loadSavedSearches, user } = useAuth()
  const [deletingId, setDeletingId] = useState<string | null>(null)

  if (!isOpen) return null

  const formatSearchName = (search: SavedSearch) => {
    return search.name || 'Unnamed Search'
  }

  const formatSearchDetails = (search: SavedSearch) => {
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

  const handleDelete = async (e: React.MouseEvent, searchId: string) => {
    e.stopPropagation()

    if (!user?.id) return

    setDeletingId(searchId)

    try {
      const response = await fetch(`/api/saved-searches/${searchId}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Failed to delete search')
      }

      // Reload saved searches after deletion
      await loadSavedSearches()
    } catch (error) {
      console.error('Delete search error:', error)
    } finally {
      setDeletingId(null)
    }
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
          <p className='text-gray-600'>You haven&apos;t saved any searches yet.</p>
        ) : (
          <div className='space-y-3'>
            {savedSearches.map((search) => (
              <div
                key={search.id}
                className='relative w-full p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition group'
              >
                <button
                  onClick={() => {
                    onSelectSearch(search)
                    onClose()
                  }}
                  className='w-full text-left pr-12 cursor-pointer'
                >
                  <h3 className='font-semibold text-gray-900 mb-1'>{formatSearchName(search)}</h3>
                  <p className='text-sm text-gray-600'>{formatSearchDetails(search)}</p>
                  <p className='text-xs text-gray-400 mt-2'>
                    Saved {new Date(search.createdAt).toLocaleDateString()}
                  </p>
                </button>
                <button
                  onClick={(e) => handleDelete(e, search.id)}
                  disabled={deletingId === search.id}
                  className='absolute top-4 right-4 text-gray-400 hover:text-red-600 transition-colors cursor-pointer disabled:opacity-50'
                  aria-label='Delete search'
                >
                  {deletingId === search.id ? (
                    <svg className='w-5 h-5 animate-spin' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <circle className='opacity-25' cx='12' cy='12' r='10' stroke='currentColor' strokeWidth='4'></circle>
                      <path className='opacity-75' fill='currentColor' d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'></path>
                    </svg>
                  ) : (
                    <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16' />
                    </svg>
                  )}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default SavedSearchesModal