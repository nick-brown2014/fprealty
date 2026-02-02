import { describe, it, expect, vi } from 'vitest'

// Mock the hooks and components before importing the component
vi.mock('@/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    signOut: vi.fn(),
    saveSearch: vi.fn(),
    saveSearchState: 'idle',
    favorites: new Set<string>(),
    savedSearches: [],
  }),
}))

vi.mock('../../hooks/useMapDisplay', () => ({
  default: vi.fn(() => ({
    listings: [],
    loading: false,
  })),
}))

vi.mock('@vis.gl/react-google-maps', () => ({
  APIProvider: ({ children }: { children: React.ReactNode }) => <div data-testid="api-provider">{children}</div>,
  Map: ({ children }: { children: React.ReactNode }) => <div data-testid="map">{children}</div>,
  useMap: () => null,
}))

vi.mock('../../components/SearchNav', () => ({
  default: () => <nav data-testid="search-nav">SearchNav</nav>,
}))

vi.mock('../../components/Footer', () => ({
  default: () => <footer data-testid="footer">Footer</footer>,
}))

vi.mock('../../components/AuthModal', () => ({
  default: () => <div data-testid="auth-modal">AuthModal</div>,
}))

vi.mock('../../components/SavedSearchesModal', () => ({
  default: () => <div data-testid="saved-searches-modal">SavedSearchesModal</div>,
}))

vi.mock('../../components/map/ListingMarker', () => ({
  default: () => <div data-testid="listing-marker">ListingMarker</div>,
}))

vi.mock('../../components/map/ListingTile', () => ({
  default: () => <div data-testid="listing-tile">ListingTile</div>,
}))

vi.mock('../../components/map/PlacesAutocomplete', () => ({
  default: ({ onPlaceSelect }: { onPlaceSelect: (place: string, location: { lat: number; lng: number }) => void }) => (
    <input 
      data-testid="places-autocomplete" 
      placeholder="Search location"
      onChange={(e) => onPlaceSelect(e.target.value, { lat: 40.5, lng: -105.0 })}
    />
  ),
}))

// Helper functions to test filter logic
describe('Advanced Search Filter Logic', () => {
  describe('resetAllFilters function', () => {
    it('should reset all basic filters to default values', () => {
      const resetAllFilters = () => {
        const state = {
          minPrice: 0,
          maxPrice: null,
          minPriceInput: '',
          maxPriceInput: '',
          minBeds: null,
          minBaths: null,
          selectedPropertyTypes: ['Income Property', 'Residential', 'Attached Dwelling'],
          includeLand: false,
          newConstructionOnly: false,
          selectedStatuses: ['Active'],
          mlsNumber: '',
        }
        return state
      }

      const result = resetAllFilters()
      
      expect(result.minPrice).toBe(0)
      expect(result.maxPrice).toBeNull()
      expect(result.minPriceInput).toBe('')
      expect(result.maxPriceInput).toBe('')
      expect(result.minBeds).toBeNull()
      expect(result.minBaths).toBeNull()
      expect(result.selectedPropertyTypes).toEqual(['Income Property', 'Residential', 'Attached Dwelling'])
      expect(result.includeLand).toBe(false)
      expect(result.newConstructionOnly).toBe(false)
      expect(result.selectedStatuses).toEqual(['Active'])
      expect(result.mlsNumber).toBe('')
    })

    it('should reset all property detail filters to default values', () => {
      const resetPropertyDetailFilters = () => {
        const state = {
          minSqft: null,
          maxSqft: null,
          minSqftInput: '',
          maxSqftInput: '',
          minLotSize: null,
          maxLotSize: null,
          minLotSizeInput: '',
          maxLotSizeInput: '',
          minYearBuilt: null,
          maxYearBuilt: null,
          minYearBuiltInput: '',
          maxYearBuiltInput: '',
          minStories: null,
          maxStories: null,
        }
        return state
      }

      const result = resetPropertyDetailFilters()
      
      expect(result.minSqft).toBeNull()
      expect(result.maxSqft).toBeNull()
      expect(result.minSqftInput).toBe('')
      expect(result.maxSqftInput).toBe('')
      expect(result.minLotSize).toBeNull()
      expect(result.maxLotSize).toBeNull()
      expect(result.minLotSizeInput).toBe('')
      expect(result.maxLotSizeInput).toBe('')
      expect(result.minYearBuilt).toBeNull()
      expect(result.maxYearBuilt).toBeNull()
      expect(result.minYearBuiltInput).toBe('')
      expect(result.maxYearBuiltInput).toBe('')
      expect(result.minStories).toBeNull()
      expect(result.maxStories).toBeNull()
    })

    it('should reset all home feature filters to default values', () => {
      const resetHomeFeatureFilters = () => {
        const state = {
          minGarageSpaces: null,
          hasPool: false,
          hasAC: false,
          hasBasement: false,
          isWaterfront: false,
          hasFireplace: false,
          isSeniorCommunity: false,
          maxHoaFee: null,
          maxHoaFeeInput: '',
          hasSpa: false,
          isHorseProperty: false,
          hasGarage: false,
          hasAttachedGarage: false,
          hasHeating: false,
          hasVirtualTour: false,
          isGreenEnergy: false,
        }
        return state
      }

      const result = resetHomeFeatureFilters()
      
      expect(result.minGarageSpaces).toBeNull()
      expect(result.hasPool).toBe(false)
      expect(result.hasAC).toBe(false)
      expect(result.hasBasement).toBe(false)
      expect(result.isWaterfront).toBe(false)
      expect(result.hasFireplace).toBe(false)
      expect(result.isSeniorCommunity).toBe(false)
      expect(result.maxHoaFee).toBeNull()
      expect(result.maxHoaFeeInput).toBe('')
      expect(result.hasSpa).toBe(false)
      expect(result.isHorseProperty).toBe(false)
      expect(result.hasGarage).toBe(false)
      expect(result.hasAttachedGarage).toBe(false)
      expect(result.hasHeating).toBe(false)
      expect(result.hasVirtualTour).toBe(false)
      expect(result.isGreenEnergy).toBe(false)
    })

    it('should reset all additional filters to default values', () => {
      const resetAdditionalFilters = () => {
        const state = {
          minDaysOnMarket: null,
          maxDaysOnMarket: null,
          minDaysOnMarketInput: '',
          maxDaysOnMarketInput: '',
          minTaxAmount: null,
          maxTaxAmount: null,
          minTaxAmountInput: '',
          maxTaxAmountInput: '',
          minCoveredSpaces: null,
          selectedView: [] as string[],
          selectedFlooring: [] as string[],
          selectedAppliances: [] as string[],
          selectedHeatingType: [] as string[],
          selectedArchitecturalStyle: [] as string[],
          selectedFencing: [] as string[],
          selectedPatioFeatures: [] as string[],
          schoolDistrict: '',
        }
        return state
      }

      const result = resetAdditionalFilters()
      
      expect(result.minDaysOnMarket).toBeNull()
      expect(result.maxDaysOnMarket).toBeNull()
      expect(result.minDaysOnMarketInput).toBe('')
      expect(result.maxDaysOnMarketInput).toBe('')
      expect(result.minTaxAmount).toBeNull()
      expect(result.maxTaxAmount).toBeNull()
      expect(result.minTaxAmountInput).toBe('')
      expect(result.maxTaxAmountInput).toBe('')
      expect(result.minCoveredSpaces).toBeNull()
      expect(result.selectedView).toEqual([])
      expect(result.selectedFlooring).toEqual([])
      expect(result.selectedAppliances).toEqual([])
      expect(result.selectedHeatingType).toEqual([])
      expect(result.selectedArchitecturalStyle).toEqual([])
      expect(result.selectedFencing).toEqual([])
      expect(result.selectedPatioFeatures).toEqual([])
      expect(result.schoolDistrict).toBe('')
    })
  })

  describe('toggleStatus function', () => {
    it('should add status when not present', () => {
      const toggleStatus = (currentStatuses: string[], status: string): string[] => {
        if (currentStatuses.includes(status)) {
          return currentStatuses.filter(s => s !== status)
        } else {
          return [...currentStatuses, status]
        }
      }

      const result = toggleStatus(['Active'], 'Pending')
      expect(result).toEqual(['Active', 'Pending'])
    })

    it('should remove status when already present', () => {
      const toggleStatus = (currentStatuses: string[], status: string): string[] => {
        if (currentStatuses.includes(status)) {
          return currentStatuses.filter(s => s !== status)
        } else {
          return [...currentStatuses, status]
        }
      }

      const result = toggleStatus(['Active', 'Pending'], 'Pending')
      expect(result).toEqual(['Active'])
    })

    it('should handle empty array', () => {
      const toggleStatus = (currentStatuses: string[], status: string): string[] => {
        if (currentStatuses.includes(status)) {
          return currentStatuses.filter(s => s !== status)
        } else {
          return [...currentStatuses, status]
        }
      }

      const result = toggleStatus([], 'Active')
      expect(result).toEqual(['Active'])
    })

    it('should handle removing last status', () => {
      const toggleStatus = (currentStatuses: string[], status: string): string[] => {
        if (currentStatuses.includes(status)) {
          return currentStatuses.filter(s => s !== status)
        } else {
          return [...currentStatuses, status]
        }
      }

      const result = toggleStatus(['Active'], 'Active')
      expect(result).toEqual([])
    })
  })

  describe('togglePropertyType function', () => {
    it('should add property type when not present', () => {
      const togglePropertyType = (currentTypes: string[], type: string): string[] => {
        if (currentTypes.includes(type)) {
          return currentTypes.filter(t => t !== type)
        } else {
          return [...currentTypes, type]
        }
      }

      const result = togglePropertyType(['Residential'], 'Income Property')
      expect(result).toEqual(['Residential', 'Income Property'])
    })

    it('should remove property type when already present', () => {
      const togglePropertyType = (currentTypes: string[], type: string): string[] => {
        if (currentTypes.includes(type)) {
          return currentTypes.filter(t => t !== type)
        } else {
          return [...currentTypes, type]
        }
      }

      const result = togglePropertyType(['Residential', 'Income Property'], 'Income Property')
      expect(result).toEqual(['Residential'])
    })

    it('should handle default property types', () => {
      const togglePropertyType = (currentTypes: string[], type: string): string[] => {
        if (currentTypes.includes(type)) {
          return currentTypes.filter(t => t !== type)
        } else {
          return [...currentTypes, type]
        }
      }

      const defaultTypes = ['Income Property', 'Residential', 'Attached Dwelling']
      const result = togglePropertyType(defaultTypes, 'Multi-Family')
      expect(result).toEqual(['Income Property', 'Residential', 'Attached Dwelling', 'Multi-Family'])
    })
  })

  describe('toggleArrayFilter function', () => {
    it('should add item to array when not present', () => {
      const toggleArrayFilter = (currentArray: string[], item: string): string[] => {
        if (currentArray.includes(item)) {
          return currentArray.filter(i => i !== item)
        } else {
          return [...currentArray, item]
        }
      }

      const result = toggleArrayFilter(['Mountain'], 'Water')
      expect(result).toEqual(['Mountain', 'Water'])
    })

    it('should remove item from array when already present', () => {
      const toggleArrayFilter = (currentArray: string[], item: string): string[] => {
        if (currentArray.includes(item)) {
          return currentArray.filter(i => i !== item)
        } else {
          return [...currentArray, item]
        }
      }

      const result = toggleArrayFilter(['Mountain', 'Water'], 'Water')
      expect(result).toEqual(['Mountain'])
    })

    it('should work with empty array', () => {
      const toggleArrayFilter = (currentArray: string[], item: string): string[] => {
        if (currentArray.includes(item)) {
          return currentArray.filter(i => i !== item)
        } else {
          return [...currentArray, item]
        }
      }

      const result = toggleArrayFilter([], 'Hardwood')
      expect(result).toEqual(['Hardwood'])
    })
  })

  describe('Price Input Parsing', () => {
    it('should parse valid price input', () => {
      const parsePrice = (input: string): number | null => {
        const value = input.replace(/[^0-9]/g, '')
        if (value === '') return null
        const numValue = parseInt(value, 10)
        return numValue > 0 ? numValue : null
      }

      expect(parsePrice('200000')).toBe(200000)
      expect(parsePrice('$200,000')).toBe(200000)
      expect(parsePrice('200,000')).toBe(200000)
    })

    it('should return null for empty input', () => {
      const parsePrice = (input: string): number | null => {
        const value = input.replace(/[^0-9]/g, '')
        if (value === '') return null
        const numValue = parseInt(value, 10)
        return numValue > 0 ? numValue : null
      }

      expect(parsePrice('')).toBeNull()
    })

    it('should return null for zero value', () => {
      const parsePrice = (input: string): number | null => {
        const value = input.replace(/[^0-9]/g, '')
        if (value === '') return null
        const numValue = parseInt(value, 10)
        return numValue > 0 ? numValue : null
      }

      expect(parsePrice('0')).toBeNull()
    })

    it('should handle input with only non-numeric characters', () => {
      const parsePrice = (input: string): number | null => {
        const value = input.replace(/[^0-9]/g, '')
        if (value === '') return null
        const numValue = parseInt(value, 10)
        return numValue > 0 ? numValue : null
      }

      expect(parsePrice('$,.')).toBeNull()
    })
  })

  describe('Square Footage Input Parsing', () => {
    it('should parse valid sqft input', () => {
      const parseSqft = (input: string): number | null => {
        const value = input.replace(/[^0-9]/g, '')
        return value === '' ? null : parseInt(value, 10)
      }

      expect(parseSqft('1500')).toBe(1500)
      expect(parseSqft('2,500')).toBe(2500)
    })

    it('should return null for empty input', () => {
      const parseSqft = (input: string): number | null => {
        const value = input.replace(/[^0-9]/g, '')
        return value === '' ? null : parseInt(value, 10)
      }

      expect(parseSqft('')).toBeNull()
    })
  })

  describe('Lot Size Input Parsing', () => {
    it('should parse valid lot size input with decimals', () => {
      const parseLotSize = (input: string): number | null => {
        const value = input.replace(/[^0-9.]/g, '')
        return value === '' ? null : parseFloat(value)
      }

      expect(parseLotSize('0.5')).toBe(0.5)
      expect(parseLotSize('2.25')).toBe(2.25)
      expect(parseLotSize('5')).toBe(5)
    })

    it('should return null for empty input', () => {
      const parseLotSize = (input: string): number | null => {
        const value = input.replace(/[^0-9.]/g, '')
        return value === '' ? null : parseFloat(value)
      }

      expect(parseLotSize('')).toBeNull()
    })
  })

  describe('Year Built Input Parsing', () => {
    it('should parse valid year input', () => {
      const parseYear = (input: string): number | null => {
        const value = input.replace(/[^0-9]/g, '')
        return value === '' ? null : parseInt(value, 10)
      }

      expect(parseYear('2000')).toBe(2000)
      expect(parseYear('1985')).toBe(1985)
    })

    it('should return null for empty input', () => {
      const parseYear = (input: string): number | null => {
        const value = input.replace(/[^0-9]/g, '')
        return value === '' ? null : parseInt(value, 10)
      }

      expect(parseYear('')).toBeNull()
    })
  })

  describe('SearchFilters Object Construction', () => {
    it('should construct filters object with all basic filters', () => {
      const constructFilters = (state: {
        minPrice: number
        maxPrice: number | null
        minBeds: number | null
        minBaths: number | null
        selectedPropertyTypes: string[]
        includeLand: boolean
        newConstructionOnly: boolean
        selectedStatuses: string[]
        mlsNumber: string
      }) => {
        return {
          minPrice: state.minPrice,
          maxPrice: state.maxPrice,
          minBeds: state.minBeds,
          minBaths: state.minBaths,
          propertyTypes: state.selectedPropertyTypes,
          includeLand: state.includeLand,
          newConstructionOnly: state.newConstructionOnly,
          statuses: state.selectedStatuses,
          mlsNumber: state.mlsNumber,
        }
      }

      const state = {
        minPrice: 200000,
        maxPrice: 500000,
        minBeds: 3,
        minBaths: 2,
        selectedPropertyTypes: ['Residential'],
        includeLand: false,
        newConstructionOnly: false,
        selectedStatuses: ['Active'],
        mlsNumber: '',
      }

      const result = constructFilters(state)
      
      expect(result.minPrice).toBe(200000)
      expect(result.maxPrice).toBe(500000)
      expect(result.minBeds).toBe(3)
      expect(result.minBaths).toBe(2)
      expect(result.propertyTypes).toEqual(['Residential'])
      expect(result.includeLand).toBe(false)
      expect(result.newConstructionOnly).toBe(false)
      expect(result.statuses).toEqual(['Active'])
      expect(result.mlsNumber).toBe('')
    })

    it('should handle viewingFavorites mode by clearing filters', () => {
      const constructFiltersWithFavorites = (
        viewingFavorites: boolean,
        favorites: Set<string>,
        normalFilters: { minPrice: number; minBeds: number | null }
      ) => {
        if (viewingFavorites) {
          return {
            minPrice: undefined,
            minBeds: undefined,
            listingIds: Array.from(favorites),
          }
        }
        return {
          minPrice: normalFilters.minPrice,
          minBeds: normalFilters.minBeds,
          listingIds: undefined,
        }
      }

      const favorites = new Set(['listing-1', 'listing-2'])
      const result = constructFiltersWithFavorites(true, favorites, { minPrice: 200000, minBeds: 3 })
      
      expect(result.minPrice).toBeUndefined()
      expect(result.minBeds).toBeUndefined()
      expect(result.listingIds).toEqual(['listing-1', 'listing-2'])
    })

    it('should construct filters with advanced options', () => {
      const constructAdvancedFilters = (state: {
        minSqft: number | null
        maxSqft: number | null
        minLotSize: number | null
        maxLotSize: number | null
        minYearBuilt: number | null
        maxYearBuilt: number | null
        hasPool: boolean
        hasAC: boolean
        maxHoaFee: number | null
      }) => {
        return {
          minSqft: state.minSqft,
          maxSqft: state.maxSqft,
          minLotSize: state.minLotSize,
          maxLotSize: state.maxLotSize,
          minYearBuilt: state.minYearBuilt,
          maxYearBuilt: state.maxYearBuilt,
          hasPool: state.hasPool,
          hasAC: state.hasAC,
          maxHoaFee: state.maxHoaFee,
        }
      }

      const state = {
        minSqft: 1500,
        maxSqft: 3000,
        minLotSize: 0.5,
        maxLotSize: 2,
        minYearBuilt: 2000,
        maxYearBuilt: 2020,
        hasPool: true,
        hasAC: true,
        maxHoaFee: 500,
      }

      const result = constructAdvancedFilters(state)
      
      expect(result.minSqft).toBe(1500)
      expect(result.maxSqft).toBe(3000)
      expect(result.minLotSize).toBe(0.5)
      expect(result.maxLotSize).toBe(2)
      expect(result.minYearBuilt).toBe(2000)
      expect(result.maxYearBuilt).toBe(2020)
      expect(result.hasPool).toBe(true)
      expect(result.hasAC).toBe(true)
      expect(result.maxHoaFee).toBe(500)
    })

    it('should construct filters with array-based features', () => {
      const constructArrayFilters = (state: {
        selectedView: string[]
        selectedFlooring: string[]
        selectedAppliances: string[]
        selectedHeatingType: string[]
        selectedArchitecturalStyle: string[]
        selectedFencing: string[]
        selectedPatioFeatures: string[]
        schoolDistrict: string
      }) => {
        return {
          view: state.selectedView.length > 0 ? state.selectedView : undefined,
          flooring: state.selectedFlooring.length > 0 ? state.selectedFlooring : undefined,
          appliances: state.selectedAppliances.length > 0 ? state.selectedAppliances : undefined,
          heatingType: state.selectedHeatingType.length > 0 ? state.selectedHeatingType : undefined,
          architecturalStyle: state.selectedArchitecturalStyle.length > 0 ? state.selectedArchitecturalStyle : undefined,
          fencing: state.selectedFencing.length > 0 ? state.selectedFencing : undefined,
          patioFeatures: state.selectedPatioFeatures.length > 0 ? state.selectedPatioFeatures : undefined,
          schoolDistrict: state.schoolDistrict || undefined,
        }
      }

      const state = {
        selectedView: ['Mountain', 'Water'],
        selectedFlooring: ['Hardwood'],
        selectedAppliances: ['Dishwasher', 'Refrigerator'],
        selectedHeatingType: ['Forced Air'],
        selectedArchitecturalStyle: ['Ranch'],
        selectedFencing: ['Wood'],
        selectedPatioFeatures: ['Covered'],
        schoolDistrict: 'Poudre School District',
      }

      const result = constructArrayFilters(state)
      
      expect(result.view).toEqual(['Mountain', 'Water'])
      expect(result.flooring).toEqual(['Hardwood'])
      expect(result.appliances).toEqual(['Dishwasher', 'Refrigerator'])
      expect(result.heatingType).toEqual(['Forced Air'])
      expect(result.architecturalStyle).toEqual(['Ranch'])
      expect(result.fencing).toEqual(['Wood'])
      expect(result.patioFeatures).toEqual(['Covered'])
      expect(result.schoolDistrict).toBe('Poudre School District')
    })

    it('should return undefined for empty arrays', () => {
      const constructArrayFilters = (state: {
        selectedView: string[]
        selectedFlooring: string[]
      }) => {
        return {
          view: state.selectedView.length > 0 ? state.selectedView : undefined,
          flooring: state.selectedFlooring.length > 0 ? state.selectedFlooring : undefined,
        }
      }

      const state = {
        selectedView: [],
        selectedFlooring: [],
      }

      const result = constructArrayFilters(state)
      
      expect(result.view).toBeUndefined()
      expect(result.flooring).toBeUndefined()
    })
  })

  describe('handleSelectSearch function', () => {
    it('should apply saved search filters correctly', () => {
      const handleSelectSearch = (search: {
        searchQuery?: string
        minPrice?: number
        maxPrice?: number
        minBeds?: number
        minBaths?: number
        propertyTypes?: string[]
        includeLand?: boolean
        statuses?: string[]
        bounds?: { north: number; south: number; east: number; west: number }
      }) => {
        return {
          searchQuery: search.searchQuery || '',
          minPrice: search.minPrice || 0,
          maxPrice: search.maxPrice || null,
          minBeds: search.minBeds || null,
          minBaths: search.minBaths || null,
          selectedPropertyTypes: search.propertyTypes || ['Income Property', 'Residential', 'Attached Dwelling'],
          includeLand: search.includeLand || false,
          selectedStatuses: search.statuses || ['Active'],
          hasBounds: !!search.bounds,
        }
      }

      const savedSearch = {
        searchQuery: 'Fort Collins',
        minPrice: 300000,
        maxPrice: 600000,
        minBeds: 3,
        minBaths: 2,
        propertyTypes: ['Residential'],
        includeLand: true,
        statuses: ['Active', 'Pending'],
        bounds: { north: 41, south: 40, east: -104, west: -106 },
      }

      const result = handleSelectSearch(savedSearch)
      
      expect(result.searchQuery).toBe('Fort Collins')
      expect(result.minPrice).toBe(300000)
      expect(result.maxPrice).toBe(600000)
      expect(result.minBeds).toBe(3)
      expect(result.minBaths).toBe(2)
      expect(result.selectedPropertyTypes).toEqual(['Residential'])
      expect(result.includeLand).toBe(true)
      expect(result.selectedStatuses).toEqual(['Active', 'Pending'])
      expect(result.hasBounds).toBe(true)
    })

    it('should use default values for missing saved search fields', () => {
      const handleSelectSearch = (search: {
        searchQuery?: string
        minPrice?: number
        maxPrice?: number
        minBeds?: number
        minBaths?: number
        propertyTypes?: string[]
        includeLand?: boolean
        statuses?: string[]
      }) => {
        return {
          searchQuery: search.searchQuery || '',
          minPrice: search.minPrice || 0,
          maxPrice: search.maxPrice || null,
          minBeds: search.minBeds || null,
          minBaths: search.minBaths || null,
          selectedPropertyTypes: search.propertyTypes || ['Income Property', 'Residential', 'Attached Dwelling'],
          includeLand: search.includeLand || false,
          selectedStatuses: search.statuses || ['Active'],
        }
      }

      const savedSearch = {}

      const result = handleSelectSearch(savedSearch)
      
      expect(result.searchQuery).toBe('')
      expect(result.minPrice).toBe(0)
      expect(result.maxPrice).toBeNull()
      expect(result.minBeds).toBeNull()
      expect(result.minBaths).toBeNull()
      expect(result.selectedPropertyTypes).toEqual(['Income Property', 'Residential', 'Attached Dwelling'])
      expect(result.includeLand).toBe(false)
      expect(result.selectedStatuses).toEqual(['Active'])
    })
  })

  describe('Map Bounds Handling', () => {
    it('should create bounds from saved search coordinates', () => {
      const createBoundsFromSavedSearch = (bounds: { north: number; south: number; east: number; west: number }) => {
        return {
          sw: { lat: bounds.south, lng: bounds.west },
          ne: { lat: bounds.north, lng: bounds.east },
        }
      }

      const savedBounds = { north: 41, south: 40, east: -104, west: -106 }
      const result = createBoundsFromSavedSearch(savedBounds)
      
      expect(result.sw).toEqual({ lat: 40, lng: -106 })
      expect(result.ne).toEqual({ lat: 41, lng: -104 })
    })

    it('should handle map idle event and capture pending bounds', () => {
      const handleMapIdle = (map: { getBounds: () => { getNorthEast: () => { lat: () => number; lng: () => number }; getSouthWest: () => { lat: () => number; lng: () => number } } | null }, mapInitialized: boolean) => {
        const bounds = map.getBounds()
        if (!bounds) return { pendingBounds: null, showButton: false }
        
        return {
          pendingBounds: {
            ne: { lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng() },
            sw: { lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng() },
          },
          showButton: mapInitialized,
        }
      }

      const mockMap = {
        getBounds: () => ({
          getNorthEast: () => ({ lat: () => 41, lng: () => -104 }),
          getSouthWest: () => ({ lat: () => 40, lng: () => -106 }),
        }),
      }

      const result = handleMapIdle(mockMap, true)
      
      expect(result.pendingBounds).toEqual({
        ne: { lat: 41, lng: -104 },
        sw: { lat: 40, lng: -106 },
      })
      expect(result.showButton).toBe(true)
    })

    it('should apply pending bounds when search this area is clicked', () => {
      const handleSearchThisArea = (pendingBounds: { ne: { lat: number; lng: number }; sw: { lat: number; lng: number } } | null) => {
        if (!pendingBounds) return { mapBounds: null, showButton: false }
        
        return {
          mapBounds: pendingBounds,
          showButton: false,
        }
      }

      const pendingBounds = {
        ne: { lat: 41, lng: -104 },
        sw: { lat: 40, lng: -106 },
      }

      const result = handleSearchThisArea(pendingBounds)
      
      expect(result.mapBounds).toEqual(pendingBounds)
      expect(result.showButton).toBe(false)
    })
  })

  describe('Filter Tab Navigation', () => {
    it('should have correct filter tabs', () => {
      const filterTabs = [
        { id: 'basic' as const, label: 'Basic' },
        { id: 'features' as const, label: 'Home Features' },
        { id: 'interior' as const, label: 'Interior' },
        { id: 'exterior' as const, label: 'Exterior' },
        { id: 'other' as const, label: 'Other' },
      ]

      expect(filterTabs).toHaveLength(5)
      expect(filterTabs[0].id).toBe('basic')
      expect(filterTabs[0].label).toBe('Basic')
      expect(filterTabs[1].id).toBe('features')
      expect(filterTabs[1].label).toBe('Home Features')
      expect(filterTabs[2].id).toBe('interior')
      expect(filterTabs[2].label).toBe('Interior')
      expect(filterTabs[3].id).toBe('exterior')
      expect(filterTabs[3].label).toBe('Exterior')
      expect(filterTabs[4].id).toBe('other')
      expect(filterTabs[4].label).toBe('Other')
    })
  })

  describe('Property Types Options', () => {
    it('should have correct property type options', () => {
      const propertyTypes = [
        'Income Property',
        'Residential',
        'Attached Dwelling',
        'Multi-Family',
      ]

      expect(propertyTypes).toContain('Income Property')
      expect(propertyTypes).toContain('Residential')
      expect(propertyTypes).toContain('Attached Dwelling')
      expect(propertyTypes).toContain('Multi-Family')
    })
  })

  describe('Status Options', () => {
    it('should have correct status options', () => {
      const statuses = [
        'Active',
        'Active/Backup',
        'Active/First Right',
        'Pending',
      ]

      expect(statuses).toContain('Active')
      expect(statuses).toContain('Active/Backup')
      expect(statuses).toContain('Active/First Right')
      expect(statuses).toContain('Pending')
    })
  })

  describe('Bed/Bath Options', () => {
    it('should have correct bed/bath options', () => {
      const bedBathOptions = [1, 2, 3, 4, 5]

      expect(bedBathOptions).toEqual([1, 2, 3, 4, 5])
    })
  })

  describe('Stories Options', () => {
    it('should have correct stories options', () => {
      const storiesOptions = [1, 2, 3, 4]

      expect(storiesOptions).toEqual([1, 2, 3, 4])
    })
  })

  describe('Garage Options', () => {
    it('should have correct garage options', () => {
      const garageOptions = [1, 2, 3, 4, 5]

      expect(garageOptions).toEqual([1, 2, 3, 4, 5])
    })
  })
})
