'use client'

import Footer from "../../components/Footer"
import SearchNav from "../../components/SearchNav"
import AuthModal from "../../components/AuthModal"
import SavedSearchesModal from "../../components/SavedSearchesModal"
import { useAuth } from '@/contexts/AuthContext'
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import useMapDisplay, { Listing, SearchFilters } from '../../hooks/useMapDisplay'
import ListingMarker from '../../components/map/ListingMarker'
import { useState, useEffect, useMemo, useCallback } from 'react'
import ListingTile from "../../components/map/ListingTile"
import PlacesAutocomplete from "../../components/map/PlacesAutocomplete"
import { useRouter } from "next/navigation"
import { SavedSearch } from "../../types/SavedSearch"
import Link from "next/link"

const MapEventHandler = ({ onIdle }: { onIdle: (map: google.maps.Map) => void }) => {
  const map = useMap()

  useEffect(() => {
    if (!map) return

    const listener = map.addListener('idle', () => onIdle(map))

    return () => {
      google.maps.event.removeListener(listener)
    }
  }, [map, onIdle])

  return null
}

const MapBoundsHandler = ({ listings, shouldFit, onBoundsApplied }: { listings: Listing[], shouldFit: boolean, onBoundsApplied: () => void }) => {
  const map = useMap()

  useEffect(() => {
    if (!map || !shouldFit || listings.length === 0) return

    const bounds = new google.maps.LatLngBounds()
    listings.forEach(listing => {
      if (listing.Latitude && listing.Longitude) {
        bounds.extend({ lat: listing.Latitude, lng: listing.Longitude })
      }
    })

    map.fitBounds(bounds)
    onBoundsApplied()
  }, [map, listings, shouldFit, onBoundsApplied])

  return null
}

const SavedSearchBoundsHandler = ({ bounds, onBoundsApplied }: { bounds: google.maps.LatLngBounds | null, onBoundsApplied: () => void }) => {
  const map = useMap()

  useEffect(() => {
    if (!map || !bounds) return
    map.fitBounds(bounds)
    onBoundsApplied()
  }, [map, bounds, onBoundsApplied])

  return null
}

const AdvancedSearch = () => {
  const router = useRouter()
  const { user, signOut, saveSearch, saveSearchState, favorites, savedSearches } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null)
  const [pendingMapBounds, setPendingMapBounds] = useState<google.maps.LatLngBounds | null>(null)
  const [showSearchAreaButton, setShowSearchAreaButton] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 40.5853, lng: -105.0844 })
  const [mapInitialized, setMapInitialized] = useState(false)

  // Basic filters
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [minPriceInput, setMinPriceInput] = useState('')
  const [maxPriceInput, setMaxPriceInput] = useState('')
  const [minBeds, setMinBeds] = useState<number | null>(null)
  const [minBaths, setMinBaths] = useState<number | null>(null)
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([
    'Income Property',
    'Residential',
    'Attached Dwelling'
  ])
  const [includeLand, setIncludeLand] = useState(false)
  const [newConstructionOnly, setNewConstructionOnly] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['Active'])
  const [mlsNumber, setMlsNumber] = useState('')

  // Advanced filters - Property Details
  const [minSqft, setMinSqft] = useState<number | null>(null)
  const [maxSqft, setMaxSqft] = useState<number | null>(null)
  const [minSqftInput, setMinSqftInput] = useState('')
  const [maxSqftInput, setMaxSqftInput] = useState('')
  const [minLotSize, setMinLotSize] = useState<number | null>(null)
  const [maxLotSize, setMaxLotSize] = useState<number | null>(null)
  const [minLotSizeInput, setMinLotSizeInput] = useState('')
  const [maxLotSizeInput, setMaxLotSizeInput] = useState('')
  const [minYearBuilt, setMinYearBuilt] = useState<number | null>(null)
  const [maxYearBuilt, setMaxYearBuilt] = useState<number | null>(null)
  const [minYearBuiltInput, setMinYearBuiltInput] = useState('')
  const [maxYearBuiltInput, setMaxYearBuiltInput] = useState('')
  const [minStories, setMinStories] = useState<number | null>(null)
  const [maxStories, setMaxStories] = useState<number | null>(null)

  // Advanced filters - Home Features
  const [minGarageSpaces, setMinGarageSpaces] = useState<number | null>(null)
  const [hasPool, setHasPool] = useState(false)
  const [hasAC, setHasAC] = useState(false)
  const [hasBasement, setHasBasement] = useState(false)
  const [isWaterfront, setIsWaterfront] = useState(false)
  const [hasFireplace, setHasFireplace] = useState(false)
  const [isSeniorCommunity, setIsSeniorCommunity] = useState(false)

  // Advanced filters - Cost/Finance
  const [maxHoaFee, setMaxHoaFee] = useState<number | null>(null)
  const [maxHoaFeeInput, setMaxHoaFeeInput] = useState('')

  // UI state
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [savedSearchesModalOpen, setSavedSearchesModalOpen] = useState(false)
  const [viewingFavorites, setViewingFavorites] = useState(false)
  const [shouldFitFavorites, setShouldFitFavorites] = useState(false)
  const [savedSearchBounds, setSavedSearchBounds] = useState<google.maps.LatLngBounds | null>(null)
  const [isApplyingSavedSearch, setIsApplyingSavedSearch] = useState(false)
  const [isApplyingFavorites, setIsApplyingFavorites] = useState(false)
  const [showFiltersPanel, setShowFiltersPanel] = useState(true)

  // Debounce price input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const value = minPriceInput.replace(/[^0-9]/g, '')
      if (value === '') {
        setMinPrice(0)
      } else {
        const numValue = parseInt(value, 10)
        if (numValue > 0) {
          setMinPrice(numValue)
        }
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [minPriceInput])

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = maxPriceInput.replace(/[^0-9]/g, '')
      if (value === '') {
        setMaxPrice(null)
      } else {
        const numValue = parseInt(value, 10)
        if (numValue > 0) {
          setMaxPrice(numValue)
        }
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [maxPriceInput])

  // Debounce sqft input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const value = minSqftInput.replace(/[^0-9]/g, '')
      setMinSqft(value === '' ? null : parseInt(value, 10))
    }, 500)
    return () => clearTimeout(timer)
  }, [minSqftInput])

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = maxSqftInput.replace(/[^0-9]/g, '')
      setMaxSqft(value === '' ? null : parseInt(value, 10))
    }, 500)
    return () => clearTimeout(timer)
  }, [maxSqftInput])

  // Debounce lot size input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const value = minLotSizeInput.replace(/[^0-9.]/g, '')
      setMinLotSize(value === '' ? null : parseFloat(value))
    }, 500)
    return () => clearTimeout(timer)
  }, [minLotSizeInput])

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = maxLotSizeInput.replace(/[^0-9.]/g, '')
      setMaxLotSize(value === '' ? null : parseFloat(value))
    }, 500)
    return () => clearTimeout(timer)
  }, [maxLotSizeInput])

  // Debounce year built input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const value = minYearBuiltInput.replace(/[^0-9]/g, '')
      setMinYearBuilt(value === '' ? null : parseInt(value, 10))
    }, 500)
    return () => clearTimeout(timer)
  }, [minYearBuiltInput])

  useEffect(() => {
    const timer = setTimeout(() => {
      const value = maxYearBuiltInput.replace(/[^0-9]/g, '')
      setMaxYearBuilt(value === '' ? null : parseInt(value, 10))
    }, 500)
    return () => clearTimeout(timer)
  }, [maxYearBuiltInput])

  // Debounce HOA fee input changes
  useEffect(() => {
    const timer = setTimeout(() => {
      const value = maxHoaFeeInput.replace(/[^0-9]/g, '')
      setMaxHoaFee(value === '' ? null : parseInt(value, 10))
    }, 500)
    return () => clearTimeout(timer)
  }, [maxHoaFeeInput])

  // Memoize filters to prevent infinite loop
  const searchFilters = useMemo<SearchFilters | undefined>(() => {
    return {
      searchQuery: viewingFavorites ? undefined : searchQuery,
      mapBounds: viewingFavorites ? null : mapBounds,
      minPrice: viewingFavorites ? undefined : minPrice,
      maxPrice: viewingFavorites ? undefined : maxPrice,
      minBeds: viewingFavorites ? undefined : minBeds,
      minBaths: viewingFavorites ? undefined : minBaths,
      propertyTypes: viewingFavorites ? undefined : selectedPropertyTypes,
      includeLand: viewingFavorites ? undefined : includeLand,
      newConstructionOnly: viewingFavorites ? undefined : newConstructionOnly,
      statuses: viewingFavorites ? undefined : selectedStatuses,
      mlsNumber: viewingFavorites ? undefined : mlsNumber,
      listingIds: viewingFavorites ? Array.from(favorites) : undefined,
      minSqft: viewingFavorites ? undefined : minSqft,
      maxSqft: viewingFavorites ? undefined : maxSqft,
      minLotSize: viewingFavorites ? undefined : minLotSize,
      maxLotSize: viewingFavorites ? undefined : maxLotSize,
      minYearBuilt: viewingFavorites ? undefined : minYearBuilt,
      maxYearBuilt: viewingFavorites ? undefined : maxYearBuilt,
      minStories: viewingFavorites ? undefined : minStories,
      maxStories: viewingFavorites ? undefined : maxStories,
      minGarageSpaces: viewingFavorites ? undefined : minGarageSpaces,
      hasPool: viewingFavorites ? undefined : hasPool,
      hasAC: viewingFavorites ? undefined : hasAC,
      hasBasement: viewingFavorites ? undefined : hasBasement,
      isWaterfront: viewingFavorites ? undefined : isWaterfront,
      hasFireplace: viewingFavorites ? undefined : hasFireplace,
      isSeniorCommunity: viewingFavorites ? undefined : isSeniorCommunity,
      maxHoaFee: viewingFavorites ? undefined : maxHoaFee
    }
  }, [searchQuery, mapBounds, minPrice, maxPrice, minBeds, minBaths, selectedPropertyTypes, includeLand, newConstructionOnly, selectedStatuses, mlsNumber, viewingFavorites, favorites, minSqft, maxSqft, minLotSize, maxLotSize, minYearBuilt, maxYearBuilt, minStories, maxStories, minGarageSpaces, hasPool, hasAC, hasBasement, isWaterfront, hasFireplace, isSeniorCommunity, maxHoaFee])

  // Pass filters to the hook
  const { listings, loading } = useMapDisplay(searchFilters)

  // Set shouldFitFavorites after viewingFavorites changes and listings update
  useEffect(() => {
    if (viewingFavorites && listings.length > 0) {
      setShouldFitFavorites(true)
    }
  }, [viewingFavorites, listings.length])

  const goToSettings = () => {
    router.push('/settings')
  }

  const bedBathOptions = [1, 2, 3, 4, 5]
  const storiesOptions = [1, 2, 3, 4]
  const garageOptions = [1, 2, 3, 4, 5]

  const propertyTypes = [
    { label: 'Residential', value: 'Residential' },
    { label: 'Attached Dwelling', value: 'Attached Dwelling' },
    { label: 'Income Property', value: 'Income Property' },
  ]

  const statuses = [
    { label: 'Active', value: 'Active' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Sold', value: 'Sold' }
  ]

  const toggleStatus = (status: string) => {
    setSelectedStatuses(prev =>
      prev.includes(status)
        ? prev.filter(s => s !== status)
        : [...prev, status]
    )
  }

  const togglePropertyType = (type: string) => {
    setSelectedPropertyTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    )
  }

  const handleMapIdle = useCallback((map: google.maps.Map) => {
    const bounds = map.getBounds()
    if (bounds) {
      if (!mapInitialized) {
        setMapInitialized(true)
      } else if (!isApplyingSavedSearch && !isApplyingFavorites) {
        setPendingMapBounds(bounds)
        setShowSearchAreaButton(true)
      }
    }
  }, [mapInitialized, isApplyingSavedSearch, isApplyingFavorites])

  const handleSearchThisArea = useCallback(() => {
    setViewingFavorites(false)
    if (pendingMapBounds) {
      setMapBounds(pendingMapBounds)
      setShowSearchAreaButton(false)
    }
  }, [pendingMapBounds])

  const handleSelectSearch = useCallback((search: SavedSearch) => {
    setViewingFavorites(false)
    setSearchQuery(search.searchQuery || '')
    setMinPrice(search.minPrice || 0)
    setMaxPrice(search.maxPrice || null)
    setMinBeds(search.minBeds || null)
    setMinBaths(search.minBaths || null)
    setSelectedPropertyTypes(search.propertyTypes || [
      'Income Property',
      'Residential',
      'Attached Dwelling'
    ])
    setIncludeLand(search.includeLand || false)
    setSelectedStatuses(search.statuses || ['Active'])
    setShowSearchAreaButton(false)
    setPendingMapBounds(null)

    if (search.bounds) {
      setIsApplyingSavedSearch(true)
      const bounds = new google.maps.LatLngBounds(
        { lat: search.bounds.south, lng: search.bounds.west },
        { lat: search.bounds.north, lng: search.bounds.east }
      )
      setMapBounds(bounds)
      setSavedSearchBounds(bounds)
    } else {
      setMapBounds(null)
      setSavedSearchBounds(null)
    }
  }, [])

  const resetAllFilters = () => {
    setMinPrice(0)
    setMaxPrice(null)
    setMinPriceInput('')
    setMaxPriceInput('')
    setMinBeds(null)
    setMinBaths(null)
    setSelectedPropertyTypes(['Income Property', 'Residential', 'Attached Dwelling'])
    setIncludeLand(false)
    setNewConstructionOnly(false)
    setSelectedStatuses(['Active'])
    setMlsNumber('')
    setMinSqft(null)
    setMaxSqft(null)
    setMinSqftInput('')
    setMaxSqftInput('')
    setMinLotSize(null)
    setMaxLotSize(null)
    setMinLotSizeInput('')
    setMaxLotSizeInput('')
    setMinYearBuilt(null)
    setMaxYearBuilt(null)
    setMinYearBuiltInput('')
    setMaxYearBuiltInput('')
    setMinStories(null)
    setMaxStories(null)
    setMinGarageSpaces(null)
    setHasPool(false)
    setHasAC(false)
    setHasBasement(false)
    setIsWaterfront(false)
    setHasFireplace(false)
    setIsSeniorCommunity(false)
    setMaxHoaFee(null)
    setMaxHoaFeeInput('')
  }

  return (
    <div className='w-full h-full flex-col'>
      <SearchNav />
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
        <div className='pb-10 pt-12 flex flex-col w-[100vw] items-center'>

          {/* Auth section */}
          <div className='w-[90vw] max-w-[1400px] mt-8 flex justify-between items-center'>
            <div className='flex items-center gap-4'>
              <Link href="/search" className='text-primary hover:underline font-semibold text-sm'>
                &larr; Basic Search
              </Link>
              <h1 className='text-xl font-bold text-gray-800'>Advanced Search</h1>
            </div>
            {user ? (
              <p className='text-sm text-gray-700'>
                Welcome, {user.firstName} {user.lastName} |{' '}
                <button
                  onClick={goToSettings}
                  className='text-primary hover:underline cursor-pointer font-semibold'
                >
                  Settings
                </button>{' '}|{' '}
                <button
                  onClick={signOut}
                  className='text-primary hover:underline cursor-pointer font-semibold'
                >
                  Sign Out
                </button>
              </p>
            ) : (
              <button
                onClick={() => setAuthModalOpen(true)}
                className='cursor-pointer px-3 py-1.5 text-sm border border-gray-300 rounded-md hover:opacity-70 bg-white text-primary transition font-semibold whitespace-nowrap'
              >
                Sign in / Sign up
              </button>
            )}
          </div>

          {/* Search Bar */}
          <div className='w-[90vw] max-w-[1400px] mt-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center'>
            <PlacesAutocomplete
              onPlaceSelect={(place, location) => {
                if (location) {
                  const radiusInMeters = 4 * 1609.34
                  const center = new google.maps.LatLng(location.lat, location.lng)
                  const circle = new google.maps.Circle({
                    center: center,
                    radius: radiusInMeters
                  })
                  const bounds = circle.getBounds()
                  setMapCenter(location)
                  setMapBounds(bounds)
                  setSearchQuery('')
                } else {
                  setSearchQuery(place)
                  setMapBounds(null)
                }
                setShowSearchAreaButton(false)
              }}
            />
            <button
              onClick={() => setShowFiltersPanel(!showFiltersPanel)}
              className='cursor-pointer px-4 py-2 border border-gray-300 rounded-md hover:opacity-70 bg-primary text-slate-50 transition font-semibold whitespace-nowrap'
            >
              {showFiltersPanel ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* Saved Searches and View Favorites Links */}
          {user && (
            <div className='flex justify-between pt-2 w-[90vw] max-w-[1400px]'>
              <button
                onClick={() => searchFilters && saveSearch(searchFilters)}
                disabled={saveSearchState !== 'idle' || !searchFilters}
                className='text-primary text-sm hover:underline cursor-pointer font-semibold disabled:opacity-50'
              >
                {saveSearchState === 'idle' && 'Save Search'}
                {saveSearchState === 'saving' && 'Saving...'}
                {saveSearchState === 'saved' && 'Saved!'}
              </button>
              <div className='flex items-center justify-end gap-1 md:gap-4'>
                {savedSearches.length > 0 && (
                  <button
                    onClick={() => setSavedSearchesModalOpen(true)}
                    className='text-sm text-primary hover:underline cursor-pointer font-semibold whitespace-nowrap'
                  >
                    Saved Searches ({savedSearches.length})
                  </button>
                )}
                {favorites.size > 0 && (
                  <button
                    onClick={() => {
                      const newValue = !viewingFavorites
                      if (newValue) {
                        setIsApplyingFavorites(true)
                        resetAllFilters()
                        setMapBounds(null)
                      }
                      setViewingFavorites(newValue)
                    }}
                    className='text-sm text-primary hover:underline cursor-pointer font-semibold whitespace-nowrap'
                  >
                    {viewingFavorites ? 'View All Listings' : `View Favorites (${favorites.size})`}
                  </button>
                )}
              </div>
            </div>
          )}

          <div className='flex flex-col lg:flex-row w-[90vw] max-w-[1400px] mt-4 gap-4'>
            {/* Filters Panel */}
            {showFiltersPanel && (
              <div className='w-full lg:w-[300px] bg-white border border-gray-200 rounded-lg p-4 h-fit max-h-[600px] overflow-y-auto'>
                <div className='flex justify-between items-center mb-4'>
                  <h2 className='text-lg font-bold text-gray-800'>Filters</h2>
                  <button
                    onClick={resetAllFilters}
                    className='text-sm text-primary hover:underline cursor-pointer font-semibold'
                  >
                    Reset All
                  </button>
                </div>

                {/* Price Range */}
                <div className='mb-6'>
                  <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Price Range</p>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      value={minPriceInput}
                      onChange={(e) => setMinPriceInput(e.target.value)}
                      placeholder='Min'
                      className='w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                    />
                    <input
                      type='text'
                      value={maxPriceInput}
                      onChange={(e) => setMaxPriceInput(e.target.value)}
                      placeholder='Max'
                      className='w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                    />
                  </div>
                </div>

                {/* Beds & Baths */}
                <div className='mb-6'>
                  <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Beds</p>
                  <div className='flex gap-1 flex-wrap'>
                    <button
                      onClick={() => setMinBeds(null)}
                      className={`px-3 py-1 rounded-md text-sm font-semibold ${minBeds === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Any
                    </button>
                    {bedBathOptions.map((num) => (
                      <button
                        key={num}
                        onClick={() => setMinBeds(num)}
                        className={`px-3 py-1 rounded-md text-sm font-semibold ${minBeds === num ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {num}+
                      </button>
                    ))}
                  </div>
                </div>

                <div className='mb-6'>
                  <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Baths</p>
                  <div className='flex gap-1 flex-wrap'>
                    <button
                      onClick={() => setMinBaths(null)}
                      className={`px-3 py-1 rounded-md text-sm font-semibold ${minBaths === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Any
                    </button>
                    {bedBathOptions.map((num) => (
                      <button
                        key={num}
                        onClick={() => setMinBaths(num)}
                        className={`px-3 py-1 rounded-md text-sm font-semibold ${minBaths === num ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {num}+
                      </button>
                    ))}
                  </div>
                </div>

                {/* Property Types */}
                <div className='mb-6'>
                  <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Property Types</p>
                  <div className='flex flex-col gap-1'>
                    {propertyTypes.map((type) => (
                      <label key={type.value} className='flex items-center gap-2 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={selectedPropertyTypes.includes(type.value)}
                          onChange={() => togglePropertyType(type.value)}
                          className='w-4 h-4 accent-primary'
                        />
                        <span className='text-sm text-gray-700'>{type.label}</span>
                      </label>
                    ))}
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={includeLand}
                        onChange={(e) => setIncludeLand(e.target.checked)}
                        className='w-4 h-4 accent-primary'
                      />
                      <span className='text-sm text-gray-700'>Include Land</span>
                    </label>
                  </div>
                </div>

                {/* Status */}
                <div className='mb-6'>
                  <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Status</p>
                  <div className='flex flex-col gap-1'>
                    {statuses.map((status) => (
                      <label key={status.value} className='flex items-center gap-2 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={selectedStatuses.includes(status.value)}
                          onChange={() => toggleStatus(status.value)}
                          className='w-4 h-4 accent-primary'
                        />
                        <span className='text-sm text-gray-700'>{status.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Square Footage */}
                <div className='mb-6'>
                  <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Square Feet</p>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      value={minSqftInput}
                      onChange={(e) => setMinSqftInput(e.target.value)}
                      placeholder='Min'
                      className='w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                    />
                    <input
                      type='text'
                      value={maxSqftInput}
                      onChange={(e) => setMaxSqftInput(e.target.value)}
                      placeholder='Max'
                      className='w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                    />
                  </div>
                </div>

                {/* Lot Size */}
                <div className='mb-6'>
                  <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Lot Size (acres)</p>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      value={minLotSizeInput}
                      onChange={(e) => setMinLotSizeInput(e.target.value)}
                      placeholder='Min'
                      className='w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                    />
                    <input
                      type='text'
                      value={maxLotSizeInput}
                      onChange={(e) => setMaxLotSizeInput(e.target.value)}
                      placeholder='Max'
                      className='w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                    />
                  </div>
                </div>

                {/* Year Built */}
                <div className='mb-6'>
                  <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Year Built</p>
                  <div className='flex gap-2'>
                    <input
                      type='text'
                      value={minYearBuiltInput}
                      onChange={(e) => setMinYearBuiltInput(e.target.value)}
                      placeholder='Min'
                      className='w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                    />
                    <input
                      type='text'
                      value={maxYearBuiltInput}
                      onChange={(e) => setMaxYearBuiltInput(e.target.value)}
                      placeholder='Max'
                      className='w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                    />
                  </div>
                </div>

                {/* Stories */}
                <div className='mb-6'>
                  <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Stories</p>
                  <div className='flex gap-2'>
                    <select
                      value={minStories ?? ''}
                      onChange={(e) => setMinStories(e.target.value ? parseInt(e.target.value) : null)}
                      className='w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                    >
                      <option value=''>Min</option>
                      {storiesOptions.map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                    <select
                      value={maxStories ?? ''}
                      onChange={(e) => setMaxStories(e.target.value ? parseInt(e.target.value) : null)}
                      className='w-1/2 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                    >
                      <option value=''>Max</option>
                      {storiesOptions.map((num) => (
                        <option key={num} value={num}>{num}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Garage Spaces */}
                <div className='mb-6'>
                  <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Garage Spaces</p>
                  <div className='flex gap-1 flex-wrap'>
                    <button
                      onClick={() => setMinGarageSpaces(null)}
                      className={`px-3 py-1 rounded-md text-sm font-semibold ${minGarageSpaces === null ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                    >
                      Any
                    </button>
                    {garageOptions.map((num) => (
                      <button
                        key={num}
                        onClick={() => setMinGarageSpaces(num)}
                        className={`px-3 py-1 rounded-md text-sm font-semibold ${minGarageSpaces === num ? 'bg-primary text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                      >
                        {num}+
                      </button>
                    ))}
                  </div>
                </div>

                {/* Max HOA Fee */}
                <div className='mb-6'>
                  <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Max HOA Fee ($/month)</p>
                  <input
                    type='text'
                    value={maxHoaFeeInput}
                    onChange={(e) => setMaxHoaFeeInput(e.target.value)}
                    placeholder='No Max'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                  />
                </div>

                {/* Home Features */}
                <div className='mb-6'>
                  <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Home Features</p>
                  <div className='flex flex-col gap-1'>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={hasPool}
                        onChange={(e) => setHasPool(e.target.checked)}
                        className='w-4 h-4 accent-primary'
                      />
                      <span className='text-sm text-gray-700'>Pool</span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={hasAC}
                        onChange={(e) => setHasAC(e.target.checked)}
                        className='w-4 h-4 accent-primary'
                      />
                      <span className='text-sm text-gray-700'>Air Conditioning</span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={hasBasement}
                        onChange={(e) => setHasBasement(e.target.checked)}
                        className='w-4 h-4 accent-primary'
                      />
                      <span className='text-sm text-gray-700'>Basement</span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={isWaterfront}
                        onChange={(e) => setIsWaterfront(e.target.checked)}
                        className='w-4 h-4 accent-primary'
                      />
                      <span className='text-sm text-gray-700'>Waterfront</span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={hasFireplace}
                        onChange={(e) => setHasFireplace(e.target.checked)}
                        className='w-4 h-4 accent-primary'
                      />
                      <span className='text-sm text-gray-700'>Fireplace</span>
                    </label>
                    <label className='flex items-center gap-2 cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={newConstructionOnly}
                        onChange={(e) => setNewConstructionOnly(e.target.checked)}
                        className='w-4 h-4 accent-primary'
                      />
                      <span className='text-sm text-gray-700'>New Construction</span>
                    </label>
                  </div>
                </div>

                {/* Community */}
                <div className='mb-6'>
                  <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Community</p>
                  <label className='flex items-center gap-2 cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={isSeniorCommunity}
                      onChange={(e) => setIsSeniorCommunity(e.target.checked)}
                      className='w-4 h-4 accent-primary'
                    />
                    <span className='text-sm text-gray-700'>55+ Community</span>
                  </label>
                </div>

                {/* MLS Number */}
                <div className='mb-4'>
                  <p className='text-xs font-bold text-gray-500 uppercase mb-2'>MLS Number</p>
                  <input
                    type='text'
                    value={mlsNumber}
                    onChange={(e) => setMlsNumber(e.target.value)}
                    placeholder='Enter MLS #'
                    className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm'
                  />
                </div>
              </div>
            )}

            {/* Map and Listings */}
            <div className={`flex flex-col md:flex-row flex-1 transition-opacity ${loading ? 'opacity-70' : 'opacity-100'}`}>
              <div className='w-full lg:w-[60%] h-[600px] relative'>
                <Map
                  key={`${mapCenter.lat}-${mapCenter.lng}`}
                  defaultCenter={mapCenter}
                  defaultZoom={12}
                  gestureHandling={'greedy'}
                  disableDefaultUI={false}
                  zoomControl={true}
                  mapId='property-map'
                >
                  <MapEventHandler onIdle={handleMapIdle} />
                  <MapBoundsHandler
                    listings={listings}
                    shouldFit={shouldFitFavorites}
                    onBoundsApplied={() => {
                      setIsApplyingFavorites(false)
                      setShouldFitFavorites(false)
                    }}
                  />
                  <SavedSearchBoundsHandler
                    bounds={savedSearchBounds}
                    onBoundsApplied={() => {
                      setIsApplyingSavedSearch(false)
                      setSavedSearchBounds(null)
                    }}
                  />
                  {listings.map((listing) => (
                    <ListingMarker key={listing.ListingKey} listing={listing} />
                  ))}
                </Map>
                {showSearchAreaButton && (
                  <button
                    onClick={handleSearchThisArea}
                    className='absolute top-4 left-1/2 transform -translate-x-1/2 bg-white text-primary md:px-4 md:py-2 px-2 py-1 cursor-pointer rounded-full shadow-lg hover:shadow-xl transition-shadow font-semibold border border-primary z-10 text-sm md:text-base'
                  >
                    Search this area
                  </button>
                )}
              </div>

              <div className='w-full lg:w-[40%] md:pl-4 flex flex-col gap-2 mt-6 md:mt-0 max-h-[600px] overflow-y-auto'>
                {listings.length === 0 ? (
                  <p className='text-gray-500'>No results found</p>
                ) : (
                  listings.map((listing) => <ListingTile key={listing.ListingKey} listing={listing} />)
                )}
              </div>
            </div>
          </div>

          <div className='mt-8 mb-4 text-center'>
            <p className='text-sm text-gray-600'>
              Showing {listings.length} {listings.length === 1 ? 'listing' : 'listings'}
            </p>
          </div>
          <Footer />
        </div>
      </APIProvider>

      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
      <SavedSearchesModal
        isOpen={savedSearchesModalOpen}
        onClose={() => setSavedSearchesModalOpen(false)}
        onSelectSearch={handleSelectSearch}
      />
    </div>
  )
}

export default AdvancedSearch
