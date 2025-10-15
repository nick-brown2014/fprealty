'use client'

import { Favorite } from '@/app/types/Favorite'
import { SavedSearch } from '@/app/types/SavedSearch'
import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useSession, signOut as nextAuthSignOut } from 'next-auth/react'
import { Session } from 'next-auth'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  phoneNumber: string
  name: string
}

interface ExtendedSessionUser {
  id: string
  email: string
  name: string
  firstName: string
  lastName: string
  phoneNumber: string
}

interface ExtendedSession extends Omit<Session, 'user'> {
  user: ExtendedSessionUser
}

interface SaveSearchParams {
  searchQuery?: string
  minPrice?: number
  maxPrice?: number | null
  minBeds?: number | null
  minBaths?: number | null
  propertyTypes?: string[]
  includeLand?: boolean
  statuses?: string[]
  mapBounds?: google.maps.LatLngBounds | null
}

interface AuthContextType {
  user: User | null
  signIn: (userData: User) => void
  signOut: () => void
  isLoading: boolean
  saveSearch: (params: SaveSearchParams) => Promise<void>
  saveSearchState: 'idle' | 'saving' | 'saved'
  favorites: Set<string>
  toggleFavorite: (listingId: string) => Promise<void>
  loadFavorites: () => Promise<void>
  savedSearches: SavedSearch[]
  loadSavedSearches: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession()
  const [user, setUser] = useState<User | null>(null)
  const [saveSearchState, setSaveSearchState] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [favorites, setFavorites] = useState<Set<string>>(new Set())
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])

  const isLoading = status === 'loading'

  // Sync user state with NextAuth session
  useEffect(() => {
    if (session?.user) {
      const extendedSession = session as ExtendedSession
      const userData: User = {
        id: extendedSession.user.id,
        email: extendedSession.user.email,
        firstName: extendedSession.user.firstName,
        lastName: extendedSession.user.lastName,
        phoneNumber: extendedSession.user.phoneNumber,
        name: extendedSession.user.name
      }
      setUser(userData)
    } else {
      setUser(null)
      setFavorites(new Set())
      setSavedSearches([])
    }
  }, [session, status])

  // Load favorites and saved searches when user changes
  useEffect(() => {
    if (user?.id) {
      loadFavorites()
      loadSavedSearches()
    }
  }, [user?.id])

  const signIn = (userData: User) => {
    // This is now just for compatibility - actual sign in happens through NextAuth
    setUser(userData)
  }

  const signOut = async () => {
    setUser(null)
    setFavorites(new Set())
    setSavedSearches([])
    await nextAuthSignOut()
  }

  const loadFavorites = async (userId?: string) => {
    const id = userId || user?.id
    if (!id) return

    try {
      const response = await fetch(`/api/favorites?userId=${id}`)
      if (!response.ok) return

      const data = await response.json()
      const favoriteIds: Set<string> = new Set(data.favorites.map((f: Favorite) => f.listingId))
      setFavorites(favoriteIds)
    } catch (error) {
      console.error('Load favorites error:', error)
    }
  }

  const toggleFavorite = async (listingId: string) => {
    if (!user?.id) return

    const isFavorited = favorites.has(listingId)

    // Optimistically update UI
    const newFavorites = new Set(favorites)
    if (isFavorited) {
      newFavorites.delete(listingId)
    } else {
      newFavorites.add(listingId)
    }
    setFavorites(newFavorites)

    try {
      if (isFavorited) {
        // Remove favorite
        const response = await fetch(`/api/favorites?userId=${user.id}&listingId=${listingId}`, {
          method: 'DELETE'
        })
        if (!response.ok) throw new Error('Failed to remove favorite')
      } else {
        // Add favorite
        const response = await fetch('/api/favorites', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id, listingId })
        })
        if (!response.ok) throw new Error('Failed to add favorite')
      }
    } catch (error) {
      console.error('Toggle favorite error:', error)
      // Revert on error
      setFavorites(favorites)
    }
  }

  const loadSavedSearches = async (userId?: string) => {
    const id = userId || user?.id
    if (!id) return

    try {
      const response = await fetch(`/api/saved-searches?userId=${id}`)
      if (!response.ok) return

      const data = await response.json()
      setSavedSearches(data.savedSearches)
    } catch (error) {
      console.error('Load saved searches error:', error)
    }
  }

  const saveSearch = async (params: SaveSearchParams) => {
    if (!user?.id || saveSearchState !== 'idle') return

    setSaveSearchState('saving')

    try {
      // Generate a name for the search based on filters
      const searchName = params.searchQuery ||
        `Search: ${params.minPrice ? `$${params.minPrice.toLocaleString()}+` : 'Any'} | ${params.minBeds ? `${params.minBeds}+ bd` : 'Any beds'} | ${params.minBaths ? `${params.minBaths}+ ba` : 'Any baths'}`

      const response = await fetch('/api/saved-searches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          name: searchName,
          searchQuery: params.searchQuery || null,
          minPrice: params.minPrice || null,
          maxPrice: params.maxPrice || null,
          minBeds: params.minBeds || null,
          minBaths: params.minBaths || null,
          propertyTypes: params.propertyTypes || [],
          includeLand: params.includeLand || false,
          statuses: params.statuses || [],
          bounds: params.mapBounds ? {
            north: params.mapBounds.getNorthEast().lat(),
            south: params.mapBounds.getSouthWest().lat(),
            east: params.mapBounds.getNorthEast().lng(),
            west: params.mapBounds.getSouthWest().lng()
          } : null
        })
      })

      if (!response.ok) throw new Error('Failed to save search')

      setSaveSearchState('saved')

      // Reload saved searches
      await loadSavedSearches()

      // Reset to idle after 2 seconds
      setTimeout(() => {
        setSaveSearchState('idle')
      }, 2000)
    } catch (error) {
      console.error('Save search error:', error)
      setSaveSearchState('idle')
    }
  }

  return (
    <AuthContext.Provider value={{
      user,
      signIn,
      signOut,
      isLoading,
      saveSearch,
      saveSearchState,
      favorites,
      toggleFavorite,
      loadFavorites,
      savedSearches,
      loadSavedSearches
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}