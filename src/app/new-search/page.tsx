'use client'

import Footer from "../components/Footer"
import Nav from "../components/Nav"
import AuthModal from "../components/AuthModal"
import SavedSearchesModal from "../components/SavedSearchesModal"
import { useAuth } from '@/contexts/AuthContext'
import { APIProvider, Map, useMap } from '@vis.gl/react-google-maps'
import useMapDisplay, { Listing } from '../hooks/useMapDisplay'
import ListingMarker from '../components/map/ListingMarker'
import { useState, useRef, useEffect, useMemo, useCallback } from 'react'
import ListingTile from "../components/map/ListingTile"
import PlacesAutocomplete from "../components/map/PlacesAutocomplete"
import { useRouter } from "next/navigation"
import { SavedSearch } from "../types/SavedSearch"

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

const Search = () => {
  const router = useRouter()
  const { user, signOut, saveSearch, saveSearchState, favorites, savedSearches } = useAuth()
  const [searchQuery, setSearchQuery] = useState('')
  const [mapBounds, setMapBounds] = useState<google.maps.LatLngBounds | null>(null)
  const [pendingMapBounds, setPendingMapBounds] = useState<google.maps.LatLngBounds | null>(null)
  const [showSearchAreaButton, setShowSearchAreaButton] = useState(false)
  const [mapCenter, setMapCenter] = useState({ lat: 40.5853, lng: -105.0844 })
  const [mapInitialized, setMapInitialized] = useState(false)
  const [priceDropdownOpen, setPriceDropdownOpen] = useState(false)
  const [minPrice, setMinPrice] = useState(0)
  const [maxPrice, setMaxPrice] = useState<number | null>(null)
  const [bedsDropdownOpen, setBedsDropdownOpen] = useState(false)
  const [minBeds, setMinBeds] = useState<number | null>(null)
  const [bathsDropdownOpen, setBathsDropdownOpen] = useState(false)
  const [minBaths, setMinBaths] = useState<number | null>(null)
  const [propertyTypesDropdownOpen, setPropertyTypesDropdownOpen] = useState(false)
  const [selectedPropertyTypes, setSelectedPropertyTypes] = useState<string[]>([
    'Residential-Detached',
    'Residential-Attached',
    'Residential-Townhome',
    'Residential-Condo',
    'Multi-Family',
    'Manufactured'
  ])
  const [includeLand, setIncludeLand] = useState(false)
  const [selectedStatuses, setSelectedStatuses] = useState<string[]>(['Active'])
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [savedSearchesModalOpen, setSavedSearchesModalOpen] = useState(false)
  const [viewingFavorites, setViewingFavorites] = useState(false)
  const [shouldFitFavorites, setShouldFitFavorites] = useState(false)
  const [savedSearchBounds, setSavedSearchBounds] = useState<google.maps.LatLngBounds | null>(null)
  const [isApplyingSavedSearch, setIsApplyingSavedSearch] = useState(false)
  const [isApplyingFavorites, setIsApplyingFavorites] = useState(false)

  // Memoize filters to prevent infinite loop
  const searchFilters = useMemo(() => ({
    searchQuery: viewingFavorites ? undefined : searchQuery,
    mapBounds: viewingFavorites ? null : mapBounds,
    minPrice: viewingFavorites ? undefined : minPrice,
    maxPrice: viewingFavorites ? undefined : maxPrice,
    minBeds: viewingFavorites ? undefined : minBeds,
    minBaths: viewingFavorites ? undefined : minBaths,
    propertyTypes: viewingFavorites ? undefined : selectedPropertyTypes,
    includeLand: viewingFavorites ? undefined : includeLand,
    statuses: viewingFavorites ? undefined : selectedStatuses,
    listingIds: viewingFavorites ? Array.from(favorites) : undefined
  }), [searchQuery, mapBounds, minPrice, maxPrice, minBeds, minBaths, selectedPropertyTypes, includeLand, selectedStatuses, viewingFavorites, favorites])

  // Pass filters to the hook
  const { listings, loading } = useMapDisplay(searchFilters)
  const priceDropdownRef = useRef<HTMLDivElement>(null)

  // Set shouldFitFavorites after viewingFavorites changes and listings update
  useEffect(() => {
    if (viewingFavorites && listings.length > 0) {
      setShouldFitFavorites(true)
    }
  }, [viewingFavorites, listings.length])
  const bedsDropdownRef = useRef<HTMLDivElement>(null)
  const bathsDropdownRef = useRef<HTMLDivElement>(null)
  const propertyTypesDropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (priceDropdownRef.current && !priceDropdownRef.current.contains(event.target as Node)) {
        setPriceDropdownOpen(false)
      }
      if (bedsDropdownRef.current && !bedsDropdownRef.current.contains(event.target as Node)) {
        setBedsDropdownOpen(false)
      }
      if (bathsDropdownRef.current && !bathsDropdownRef.current.contains(event.target as Node)) {
        setBathsDropdownOpen(false)
      }
      if (propertyTypesDropdownRef.current && !propertyTypesDropdownRef.current.contains(event.target as Node)) {
        setPropertyTypesDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Generate min price options (0 to 2,000,000 in 250k increments)
  const minPriceOptions = []
  for (let i = 0; i <= 2000000; i += 250000) {
    minPriceOptions.push(i)
  }

  // Generate max price options (500k to 2,000,000 in 250k increments, plus "No Max")
  const maxPriceOptions: (number | null)[] = [null]
  for (let i = 500000; i <= 2000000; i += 250000) {
    maxPriceOptions.push(i)
  }

  const formatPrice = (price: number | null) => {
    if (price === null) return 'No Max'
    if (price === 0) return '$0'
    return `$${price.toLocaleString()}`
  }

  const goToSettings = () => {
    router.push('/settings')
  }

  const bedBathOptions = [1, 2, 3, 4, 5]

  const propertyTypes = [
    { label: 'Houses', value: 'Residential-Detached' },
    { label: 'Townhomes', value: 'Residential-Townhome' },
    { label: 'Condos', value: 'Residential-Condo' },
    { label: 'Attached Homes', value: 'Residential-Attached' },
    { label: 'Multi-Family', value: 'Multi-Family' },
    { label: 'Manufactured', value: 'Manufactured' }
  ]

  const statuses = [
    { label: 'Active', value: 'Active' },
    { label: 'Pending', value: 'Pending' },
    { label: 'Closed', value: 'Closed' }
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
        // First idle event - just mark as initialized, don't show button
        setMapInitialized(true)
      } else if (!isApplyingSavedSearch && !isApplyingFavorites) {
        // Subsequent idle events - user has interacted with map
        // Don't show button if we're applying a saved search or favorites
        setPendingMapBounds(bounds)
        setShowSearchAreaButton(true)
      }
    }
  }, [mapInitialized, isApplyingSavedSearch, isApplyingFavorites])

  const handleSearchThisArea = useCallback(() => {
    // Clear viewing favorites mode
    setViewingFavorites(false)

    if (pendingMapBounds) {
      setMapBounds(pendingMapBounds)
      setShowSearchAreaButton(false)
    }
  }, [pendingMapBounds])

  const handleSelectSearch = useCallback((search: SavedSearch) => {
    // Clear viewing favorites mode
    setViewingFavorites(false)

    // Load search parameters into filter UI
    setSearchQuery(search.searchQuery || '')
    setMinPrice(search.minPrice || 0)
    setMaxPrice(search.maxPrice || null)
    setMinBeds(search.minBeds || null)
    setMinBaths(search.minBaths || null)
    setSelectedPropertyTypes(search.propertyTypes || [
      'Residential-Detached',
      'Residential-Attached',
      'Residential-Townhome',
      'Residential-Condo',
      'Multi-Family',
      'Manufactured'
    ])
    setIncludeLand(search.includeLand || false)
    setSelectedStatuses(search.statuses || ['Active'])

    // Hide search area button
    setShowSearchAreaButton(false)
    setPendingMapBounds(null)

    // Handle map bounds if present
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

  return (
    <div className='w-full h-full flex-col'>
      <Nav />
      <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
        <div className='pb-10 flex flex-col w-[100vw] items-center'>

          {/* Auth section */}
          <div className='w-[90vw] max-w-[1200px] mt-8 flex justify-end'>
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

          {/* Search Bar and Filters */}
          <div className='w-[90vw] max-w-[1200px] mt-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center'>
            <PlacesAutocomplete
              value={searchQuery}
              onPlaceSelect={(place, location) => {
                if (location) {
                  // Create a 4-mile radius bounds around the selected location
                  // Using Google Maps geometry library to calculate bounds
                  const radiusInMeters = 4 * 1609.34 // 4 miles in meters
                  const center = new google.maps.LatLng(location.lat, location.lng)

                  // Calculate bounds using a circle
                  const circle = new google.maps.Circle({
                    center: center,
                    radius: radiusInMeters
                  })
                  const bounds = circle.getBounds()

                  setMapCenter(location)
                  setMapBounds(bounds)
                  setSearchQuery('') // Clear search query since we're using bounds
                } else {
                  setSearchQuery(place)
                  setMapBounds(null)
                }
                setShowSearchAreaButton(false)
              }}
            />
            <div className='flex gap-2 flex-wrap md:flex-nowrap items-center'>
              {/* Price Filter Dropdown */}
              <div className='relative' ref={priceDropdownRef}>
                <button
                  onClick={() => setPriceDropdownOpen(!priceDropdownOpen)}
                  className='cursor-pointer px-4 py-2 border border-gray-300 rounded-md hover:opacity-70 bg-primary text-slate-50 transition font-semibold whitespace-nowrap'
                >
                  Price
                </button>
                {priceDropdownOpen && (
                  <div className='absolute top-full mt-2 left-0 bg-white border border-gray-300 rounded-md shadow-lg p-4 z-50 w-64'>
                    <div className='mb-4'>
                      <label className='block text-sm font-semibold mb-2 text-gray-700'>
                        Minimum Price
                      </label>
                      <select
                        value={minPrice}
                        onChange={(e) => setMinPrice(Number(e.target.value))}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                      >
                        {minPriceOptions.map((price) => (
                          <option key={price} value={price}>
                            {formatPrice(price)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className='block text-sm font-semibold mb-2 text-gray-700'>
                        Maximum Price
                      </label>
                      <select
                        value={maxPrice === null ? '' : maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value === '' ? null : Number(e.target.value))}
                        className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary'
                      >
                        {maxPriceOptions.map((price, idx) => (
                          <option key={idx} value={price === null ? '' : price}>
                            {formatPrice(price)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Beds Filter Dropdown */}
              <div className='relative' ref={bedsDropdownRef}>
                <button
                  onClick={() => setBedsDropdownOpen(!bedsDropdownOpen)}
                  className='cursor-pointer px-4 py-2 border border-gray-300 rounded-md hover:opacity-70 bg-primary text-slate-50 transition font-semibold whitespace-nowrap'
                >
                  Beds
                </button>
                {bedsDropdownOpen && (
                  <div className='absolute top-full mt-2 left-0 bg-white border border-gray-300 rounded-md shadow-lg p-4 z-50 w-48'>
                    <div className='flex flex-col gap-2'>
                      <button
                        onClick={() => {
                          setMinBeds(null)
                          setBedsDropdownOpen(false)
                        }}
                        className={`px-4 py-2 rounded-md transition font-semibold ${
                          minBeds === null
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Any
                      </button>
                      {bedBathOptions.map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            setMinBeds(num)
                            setBedsDropdownOpen(false)
                          }}
                          className={`px-4 py-2 rounded-md transition font-semibold ${
                            minBeds === num
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {num}+
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Baths Filter Dropdown */}
              <div className='relative' ref={bathsDropdownRef}>
                <button
                  onClick={() => setBathsDropdownOpen(!bathsDropdownOpen)}
                  className='cursor-pointer px-4 py-2 border border-gray-300 rounded-md hover:opacity-70 bg-primary text-slate-50 transition font-semibold whitespace-nowrap'
                >
                  Baths
                </button>
                {bathsDropdownOpen && (
                  <div className='absolute top-full mt-2 left-0 bg-white border border-gray-300 rounded-md shadow-lg p-4 z-50 w-48'>
                    <div className='flex flex-col gap-2'>
                      <button
                        onClick={() => {
                          setMinBaths(null)
                          setBathsDropdownOpen(false)
                        }}
                        className={`px-4 py-2 rounded-md transition font-semibold ${
                          minBaths === null
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Any
                      </button>
                      {bedBathOptions.map((num) => (
                        <button
                          key={num}
                          onClick={() => {
                            setMinBaths(num)
                            setBathsDropdownOpen(false)
                          }}
                          className={`px-4 py-2 rounded-md transition font-semibold ${
                            minBaths === num
                              ? 'bg-primary text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {num}+
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              {/* Property Types Filter Dropdown */}
              <div className='relative' ref={propertyTypesDropdownRef}>
                <button
                  onClick={() => setPropertyTypesDropdownOpen(!propertyTypesDropdownOpen)}
                  className='cursor-pointer px-4 py-2 border border-gray-300 rounded-md hover:opacity-70 bg-primary text-slate-50 transition font-semibold whitespace-nowrap'
                >
                  <span className='hidden sm:inline'>Property Types</span>
                  <span className='sm:hidden'>Types</span>
                </button>
                {propertyTypesDropdownOpen && (
                  <div className='absolute top-full mt-2 right-0 bg-white border border-gray-300 rounded-md shadow-lg p-4 z-50 w-64'>
                    <div className='mb-4'>
                      <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Property Types</p>
                      <div className='flex flex-col gap-2'>
                        {propertyTypes.map((type) => (
                          <label
                            key={type.value}
                            className='flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer'
                          >
                            <input
                              type='checkbox'
                              checked={selectedPropertyTypes.includes(type.value)}
                              onChange={() => togglePropertyType(type.value)}
                              className='w-4 h-4 accent-primary border-gray-300 rounded cursor-pointer'
                            />
                            <span className='text-sm font-medium text-gray-700'>
                              {type.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <div className='mb-4 pt-4 border-t border-gray-200'>
                      <label className='flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer'>
                        <input
                          type='checkbox'
                          checked={includeLand}
                          onChange={(e) => setIncludeLand(e.target.checked)}
                          className='w-4 h-4 accent-primary border-gray-300 rounded cursor-pointer'
                        />
                        <span className='text-sm font-medium text-gray-700'>
                          Include Land
                        </span>
                      </label>
                    </div>

                    <div className='mb-4 pt-4 border-t border-gray-200'>
                      <p className='text-xs font-bold text-gray-500 uppercase mb-2'>Status</p>
                      <div className='flex flex-col gap-2'>
                        {statuses.map((status) => (
                          <label
                            key={status.value}
                            className='flex items-center gap-3 px-3 py-2 rounded-md hover:bg-gray-50 cursor-pointer'
                          >
                            <input
                              type='checkbox'
                              checked={selectedStatuses.includes(status.value)}
                              onChange={() => toggleStatus(status.value)}
                              className='w-4 h-4 accent-primary border-gray-300 rounded cursor-pointer'
                            />
                            <span className='text-sm font-medium text-gray-700'>
                              {status.label}
                            </span>
                          </label>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedPropertyTypes([])
                        setIncludeLand(false)
                        setSelectedStatuses(['Active'])
                      }}
                      className='w-full px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition font-semibold text-sm'
                    >
                      Reset Filters
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Saved Searches and View Favorites Links */}
          {user && (
            <div className='flex justify-between pt-2 w-[90vw] max-w-[1200px]'>
              <button
                  onClick={() => saveSearch(searchFilters)}
                  disabled={saveSearchState !== 'idle'}
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
                        // Clear all filters when viewing favorites
                        setSearchQuery('')
                        setMinPrice(0)
                        setMaxPrice(null)
                        setMinBeds(null)
                        setMinBaths(null)
                        setSelectedPropertyTypes([
                          'Residential-Detached',
                          'Residential-Attached',
                          'Residential-Townhome',
                          'Residential-Condo',
                          'Multi-Family',
                          'Manufactured'
                        ])
                        setIncludeLand(false)
                        setSelectedStatuses(['Active'])
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

          <div className={`flex flex-col md:flex-row w-[90vw] max-w-[1200px] mt-4 transition-opacity ${loading ? 'opacity-70' : 'opacity-100'}`}>
            <div className='w-full lg:w-[65%] h-[600px] relative'>
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
            
            <div className='w-full lg:w-[35%] md:pl-4 flex flex-col gap-2 mt-6 md:mt-0 max-h-[600px] overflow-y-scroll'>
            {listings.length === 0 ? (
              <p>No results found</p>
            ) : (<>
              {listings.map((listing) => <ListingTile key={listing.ListingKey} listing={listing} /> )}
            </>)}
            </div>
          </div>
          <div className='mt-8 text-center'>
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

export default Search
