import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import useMapDisplay, { SearchFilters, Listing } from './useMapDisplay'

// Mock the apiGet function
vi.mock('../server/api', () => ({
  apiGet: vi.fn(),
}))

import { apiGet } from '../server/api'

const mockApiGet = vi.mocked(apiGet)

const createMockListing = (overrides: Partial<Listing> = {}): Listing => ({
  ListingKey: 'test-123',
  ListPrice: 500000,
  City: 'Fort Collins',
  PropertySubType: 'Single Family Residence',
  BedroomsTotal: 3,
  BathroomsFull: 2,
  LivingArea: 2000,
  PhotosCount: 10,
  MlsStatus: 'Active',
  DaysOnMarket: 30,
  ...overrides,
})

const createMockResponse = (listings: Listing[] = [createMockListing()]) => ({
  total: listings.length,
  success: true,
  bundle: listings,
})

describe('useMapDisplay Hook', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockApiGet.mockResolvedValue(createMockResponse())
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  describe('Default Behavior', () => {
    it('should fetch listings with default filters on mount', async () => {
      renderHook(() => useMapDisplay())

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          limit: 100,
          offset: 0,
          near: 'Fort Collins',
          radius: 4,
        }))
      })
    })

    it('should return loading state initially', () => {
      const { result } = renderHook(() => useMapDisplay())
      expect(result.current.loading).toBe(true)
    })

    it('should return listings after fetch completes', async () => {
      const mockListings = [createMockListing({ ListingKey: 'listing-1' })]
      mockApiGet.mockResolvedValue(createMockResponse(mockListings))

      const { result } = renderHook(() => useMapDisplay())

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
        expect(result.current.listings).toHaveLength(1)
        expect(result.current.listings[0].ListingKey).toBe('listing-1')
      })
    })

    it('should add streetAddress to each listing', async () => {
      const mockListings = [createMockListing({
        StreetNumber: '123',
        StreetName: 'Main',
        StreetSuffix: 'St',
      })]
      mockApiGet.mockResolvedValue(createMockResponse(mockListings))

      const { result } = renderHook(() => useMapDisplay())

      await waitFor(() => {
        expect(result.current.listings[0].streetAddress).toBe('123 Main St')
      })
    })
  })

  describe('Price Filters', () => {
    it('should apply minimum price filter', async () => {
      const filters: SearchFilters = { minPrice: 200000 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'ListPrice.gte': 200000,
        }))
      })
    })

    it('should apply maximum price filter', async () => {
      const filters: SearchFilters = { maxPrice: 500000 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'ListPrice.lte': 500000,
        }))
      })
    })

    it('should apply both min and max price filters', async () => {
      const filters: SearchFilters = { minPrice: 200000, maxPrice: 500000 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'ListPrice.gte': 200000,
          'ListPrice.lte': 500000,
        }))
      })
    })

    it('should not apply minPrice filter when value is 0', async () => {
      const filters: SearchFilters = { minPrice: 0 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        const calls = mockApiGet.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[1]).not.toHaveProperty('ListPrice.gte')
      })
    })

    it('should not apply maxPrice filter when value is null', async () => {
      const filters: SearchFilters = { maxPrice: null }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        const calls = mockApiGet.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[1]).not.toHaveProperty('ListPrice.lte')
      })
    })
  })

  describe('Bedroom and Bathroom Filters', () => {
    it('should apply minimum bedrooms filter', async () => {
      const filters: SearchFilters = { minBeds: 3 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'BedroomsTotal.gte': 3,
        }))
      })
    })

    it('should apply minimum bathrooms filter', async () => {
      const filters: SearchFilters = { minBaths: 2 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'BathroomsTotalInteger.gte': 2,
        }))
      })
    })

    it('should not apply bedroom filter when value is null', async () => {
      const filters: SearchFilters = { minBeds: null }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        const calls = mockApiGet.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[1]).not.toHaveProperty('BedroomsTotal.gte')
      })
    })

    it('should not apply bathroom filter when value is null', async () => {
      const filters: SearchFilters = { minBaths: null }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        const calls = mockApiGet.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[1]).not.toHaveProperty('BathroomsTotalInteger.gte')
      })
    })
  })

  describe('Property Type Filters', () => {
    it('should apply property types filter', async () => {
      const filters: SearchFilters = { propertyTypes: ['Residential', 'Income Property'] }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'PropertyType.in': 'Residential,Income Property',
        }))
      })
    })

    it('should include Land when includeLand is true', async () => {
      const filters: SearchFilters = { propertyTypes: ['Residential'], includeLand: true }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'PropertyType.in': 'Residential,Land',
        }))
      })
    })

    it('should not apply property type filter when array is empty', async () => {
      const filters: SearchFilters = { propertyTypes: [] }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        const calls = mockApiGet.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[1]).not.toHaveProperty('PropertyType.in')
      })
    })
  })

  describe('MLS Status Filters', () => {
    it('should apply single status filter', async () => {
      const filters: SearchFilters = { statuses: ['Active'] }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'MlsStatus.in': 'Active',
        }))
      })
    })

    it('should apply multiple status filters', async () => {
      const filters: SearchFilters = { statuses: ['Active', 'Pending', 'Sold'] }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'MlsStatus.in': 'Active,Pending,Sold',
        }))
      })
    })

    it('should not apply status filter when array is empty', async () => {
      const filters: SearchFilters = { statuses: [] }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        const calls = mockApiGet.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[1]).not.toHaveProperty('MlsStatus.in')
      })
    })
  })

  describe('MLS Number Search', () => {
    it('should search by MLS number only when provided', async () => {
      const filters: SearchFilters = { mlsNumber: 'MLS123456' }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'ListingId': 'MLS123456',
        }))
      })
    })

    it('should ignore other filters when MLS number is provided', async () => {
      const filters: SearchFilters = { 
        mlsNumber: 'MLS123456',
        minPrice: 200000,
        minBeds: 3,
      }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        const calls = mockApiGet.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[1]).toHaveProperty('ListingId', 'MLS123456')
        expect(lastCall[1]).not.toHaveProperty('ListPrice.gte')
        expect(lastCall[1]).not.toHaveProperty('BedroomsTotal.gte')
      })
    })

    it('should trim whitespace from MLS number', async () => {
      const filters: SearchFilters = { mlsNumber: '  MLS123456  ' }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'ListingId': 'MLS123456',
        }))
      })
    })
  })

  describe('Square Footage Filters', () => {
    it('should apply minimum square footage filter', async () => {
      const filters: SearchFilters = { minSqft: 1500 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'LivingArea.gte': 1500,
        }))
      })
    })

    it('should apply maximum square footage filter', async () => {
      const filters: SearchFilters = { maxSqft: 3000 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'LivingArea.lte': 3000,
        }))
      })
    })

    it('should apply both min and max square footage filters', async () => {
      const filters: SearchFilters = { minSqft: 1500, maxSqft: 3000 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'LivingArea.gte': 1500,
          'LivingArea.lte': 3000,
        }))
      })
    })
  })

  describe('Lot Size Filters', () => {
    it('should apply minimum lot size filter (in acres)', async () => {
      const filters: SearchFilters = { minLotSize: 0.5 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'LotSizeAcres.gte': 0.5,
        }))
      })
    })

    it('should apply maximum lot size filter (in acres)', async () => {
      const filters: SearchFilters = { maxLotSize: 5 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'LotSizeAcres.lte': 5,
        }))
      })
    })
  })

  describe('Year Built Filters', () => {
    it('should apply minimum year built filter', async () => {
      const filters: SearchFilters = { minYearBuilt: 2000 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'YearBuilt.gte': 2000,
        }))
      })
    })

    it('should apply maximum year built filter', async () => {
      const filters: SearchFilters = { maxYearBuilt: 2020 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'YearBuilt.lte': 2020,
        }))
      })
    })
  })

  describe('Stories Filters', () => {
    it('should apply minimum stories filter', async () => {
      const filters: SearchFilters = { minStories: 2 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'Stories.gte': 2,
        }))
      })
    })

    it('should apply maximum stories filter', async () => {
      const filters: SearchFilters = { maxStories: 3 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'Stories.lte': 3,
        }))
      })
    })
  })

  describe('Garage Spaces Filter', () => {
    it('should apply minimum garage spaces filter', async () => {
      const filters: SearchFilters = { minGarageSpaces: 2 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'GarageSpaces.gte': 2,
        }))
      })
    })
  })

  describe('Boolean Feature Filters', () => {
    it('should apply pool filter when hasPool is true', async () => {
      const filters: SearchFilters = { hasPool: true }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'PoolPrivateYN': true,
        }))
      })
    })

    it('should not apply pool filter when hasPool is false', async () => {
      const filters: SearchFilters = { hasPool: false }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        const calls = mockApiGet.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[1]).not.toHaveProperty('PoolPrivateYN')
      })
    })

    it('should apply AC filter when hasAC is true', async () => {
      const filters: SearchFilters = { hasAC: true }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'CoolingYN': true,
        }))
      })
    })

    it('should apply basement filter when hasBasement is true', async () => {
      const filters: SearchFilters = { hasBasement: true }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'Basement.ne': 'None',
        }))
      })
    })

    it('should apply waterfront filter when isWaterfront is true', async () => {
      const filters: SearchFilters = { isWaterfront: true }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'WaterfrontYN': true,
        }))
      })
    })

    it('should apply fireplace filter when hasFireplace is true', async () => {
      const filters: SearchFilters = { hasFireplace: true }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'FireplaceYN': true,
        }))
      })
    })

    it('should apply senior community filter when isSeniorCommunity is true', async () => {
      const filters: SearchFilters = { isSeniorCommunity: true }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'SeniorCommunityYN': true,
        }))
      })
    })

    it('should apply new construction filter when newConstructionOnly is true', async () => {
      const filters: SearchFilters = { newConstructionOnly: true }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'NewConstructionYN': true,
        }))
      })
    })
  })

  describe('Additional Boolean Feature Filters', () => {
    it('should apply spa filter when hasSpa is true', async () => {
      const filters: SearchFilters = { hasSpa: true }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'SpaYN': true,
        }))
      })
    })

    it('should apply horse property filter when isHorseProperty is true', async () => {
      const filters: SearchFilters = { isHorseProperty: true }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'HorseYN': true,
        }))
      })
    })

    it('should apply garage filter when hasGarage is true', async () => {
      const filters: SearchFilters = { hasGarage: true }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'GarageYN': true,
        }))
      })
    })

    it('should apply attached garage filter when hasAttachedGarage is true', async () => {
      const filters: SearchFilters = { hasAttachedGarage: true }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'AttachedGarageYN': true,
        }))
      })
    })

    it('should apply heating filter when hasHeating is true', async () => {
      const filters: SearchFilters = { hasHeating: true }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'HeatingYN': true,
        }))
      })
    })

    it('should apply virtual tour filter when hasVirtualTour is true', async () => {
      const filters: SearchFilters = { hasVirtualTour: true }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'VirtualTourURLUnbranded.ne': '',
        }))
      })
    })

    it('should apply green energy filter when isGreenEnergy is true', async () => {
      const filters: SearchFilters = { isGreenEnergy: true }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'GreenEnergyEfficient.ne': '',
        }))
      })
    })
  })

  describe('HOA Fee Filter', () => {
    it('should apply maximum HOA fee filter', async () => {
      const filters: SearchFilters = { maxHoaFee: 500 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'AssociationFee.lte': 500,
        }))
      })
    })

    it('should not apply HOA fee filter when value is null', async () => {
      const filters: SearchFilters = { maxHoaFee: null }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        const calls = mockApiGet.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[1]).not.toHaveProperty('AssociationFee.lte')
      })
    })
  })

  describe('Days on Market Filters', () => {
    it('should apply minimum days on market filter', async () => {
      const filters: SearchFilters = { minDaysOnMarket: 7 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'DaysOnMarket.gte': 7,
        }))
      })
    })

    it('should apply maximum days on market filter', async () => {
      const filters: SearchFilters = { maxDaysOnMarket: 30 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'DaysOnMarket.lte': 30,
        }))
      })
    })
  })

  describe('Tax Amount Filters', () => {
    it('should apply minimum tax amount filter', async () => {
      const filters: SearchFilters = { minTaxAmount: 1000 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'TaxAnnualAmount.gte': 1000,
        }))
      })
    })

    it('should apply maximum tax amount filter', async () => {
      const filters: SearchFilters = { maxTaxAmount: 5000 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'TaxAnnualAmount.lte': 5000,
        }))
      })
    })
  })

  describe('Covered Spaces Filter', () => {
    it('should apply minimum covered spaces filter', async () => {
      const filters: SearchFilters = { minCoveredSpaces: 2 }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'CoveredSpaces.gte': 2,
        }))
      })
    })
  })

  describe('Array-Based Feature Filters', () => {
    it('should apply view filter', async () => {
      const filters: SearchFilters = { view: ['Mountain', 'Water'] }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'View.in': 'Mountain,Water',
        }))
      })
    })

    it('should apply flooring filter', async () => {
      const filters: SearchFilters = { flooring: ['Hardwood', 'Tile'] }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'Flooring.in': 'Hardwood,Tile',
        }))
      })
    })

    it('should apply appliances filter', async () => {
      const filters: SearchFilters = { appliances: ['Dishwasher', 'Refrigerator'] }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'Appliances.in': 'Dishwasher,Refrigerator',
        }))
      })
    })

    it('should apply heating type filter', async () => {
      const filters: SearchFilters = { heatingType: ['Forced Air', 'Radiant'] }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'Heating.in': 'Forced Air,Radiant',
        }))
      })
    })

    it('should apply architectural style filter', async () => {
      const filters: SearchFilters = { architecturalStyle: ['Ranch', 'Contemporary'] }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'ArchitecturalStyle.in': 'Ranch,Contemporary',
        }))
      })
    })

    it('should apply fencing filter', async () => {
      const filters: SearchFilters = { fencing: ['Wood', 'Chain Link'] }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'Fencing.in': 'Wood,Chain Link',
        }))
      })
    })

    it('should apply patio features filter', async () => {
      const filters: SearchFilters = { patioFeatures: ['Covered', 'Deck'] }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'PatioAndPorchFeatures.in': 'Covered,Deck',
        }))
      })
    })

    it('should not apply array filter when array is empty', async () => {
      const filters: SearchFilters = { view: [] }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        const calls = mockApiGet.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[1]).not.toHaveProperty('View.in')
      })
    })
  })

  describe('School District Filter', () => {
    it('should apply school district filter', async () => {
      const filters: SearchFilters = { schoolDistrict: 'Poudre School District' }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'HighSchoolDistrict': 'Poudre School District',
        }))
      })
    })

    it('should trim whitespace from school district', async () => {
      const filters: SearchFilters = { schoolDistrict: '  Poudre School District  ' }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'HighSchoolDistrict': 'Poudre School District',
        }))
      })
    })

    it('should not apply school district filter when empty', async () => {
      const filters: SearchFilters = { schoolDistrict: '' }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        const calls = mockApiGet.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[1]).not.toHaveProperty('HighSchoolDistrict')
      })
    })
  })

  describe('Map Bounds Filters', () => {
    it('should apply map bounds filter with padding', async () => {
      // Create a mock bounds object that matches the google.maps.LatLngBounds interface
      const mockBounds = {
        getNorthEast: () => ({
          lat: () => 41.0,
          lng: () => -104.5,
        }),
        getSouthWest: () => ({
          lat: () => 40.0,
          lng: () => -105.5,
        }),
        extend: vi.fn(),
      } as unknown as google.maps.LatLngBounds
      const filters: SearchFilters = { mapBounds: mockBounds }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        const calls = mockApiGet.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[1]).toHaveProperty('Latitude.gte')
        expect(lastCall[1]).toHaveProperty('Latitude.lte')
        expect(lastCall[1]).toHaveProperty('Longitude.gte')
        expect(lastCall[1]).toHaveProperty('Longitude.lte')
        expect(lastCall[1]).not.toHaveProperty('near')
        expect(lastCall[1]).not.toHaveProperty('radius')
      })
    })

    it('should use search query when map bounds are not provided', async () => {
      const filters: SearchFilters = { searchQuery: 'Denver' }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          near: 'Denver',
          radius: 4,
        }))
      })
    })
  })

  describe('Listing IDs Filter (Favorites)', () => {
    it('should fetch only specified listing IDs', async () => {
      const filters: SearchFilters = { listingIds: ['listing-1', 'listing-2', 'listing-3'] }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'ListingKey.in': 'listing-1,listing-2,listing-3',
        }))
      })
    })

    it('should ignore other filters when listing IDs are provided', async () => {
      const filters: SearchFilters = { 
        listingIds: ['listing-1'],
        minPrice: 200000,
        minBeds: 3,
      }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        const calls = mockApiGet.mock.calls
        const lastCall = calls[calls.length - 1]
        expect(lastCall[1]).toHaveProperty('ListingKey.in', 'listing-1')
        expect(lastCall[1]).not.toHaveProperty('ListPrice.gte')
        expect(lastCall[1]).not.toHaveProperty('BedroomsTotal.gte')
      })
    })
  })

  describe('Combined Filters', () => {
    it('should apply multiple filters together', async () => {
      const filters: SearchFilters = {
        minPrice: 300000,
        maxPrice: 600000,
        minBeds: 3,
        minBaths: 2,
        propertyTypes: ['Residential'],
        statuses: ['Active'],
        minSqft: 1500,
        hasPool: true,
        hasAC: true,
      }
      renderHook(() => useMapDisplay(filters))

      await waitFor(() => {
        expect(mockApiGet).toHaveBeenCalledWith('/listings', expect.objectContaining({
          'ListPrice.gte': 300000,
          'ListPrice.lte': 600000,
          'BedroomsTotal.gte': 3,
          'BathroomsTotalInteger.gte': 2,
          'PropertyType.in': 'Residential',
          'MlsStatus.in': 'Active',
          'LivingArea.gte': 1500,
          'PoolPrivateYN': true,
          'CoolingYN': true,
        }))
      })
    })
  })

  describe('Street Address Generation', () => {
    it('should generate street address from components', async () => {
      const mockListings = [createMockListing({
        StreetNumber: '456',
        StreetName: 'Oak',
        StreetSuffix: 'Ave',
        UnitNumber: '101',
      })]
      mockApiGet.mockResolvedValue(createMockResponse(mockListings))

      const { result } = renderHook(() => useMapDisplay())

      await waitFor(() => {
        expect(result.current.listings[0].streetAddress).toBe('456 Oak Ave #101')
      })
    })

    it('should fallback to UnparsedAddress when components are missing', async () => {
      const mockListings = [createMockListing({
        StreetNumber: undefined,
        StreetName: undefined,
        UnparsedAddress: '789 Pine Rd',
      })]
      mockApiGet.mockResolvedValue(createMockResponse(mockListings))

      const { result } = renderHook(() => useMapDisplay())

      await waitFor(() => {
        expect(result.current.listings[0].streetAddress).toBe('789 Pine Rd')
      })
    })

    it('should fallback to City, State when no address available', async () => {
      const mockListings = [createMockListing({
        StreetNumber: undefined,
        StreetName: undefined,
        UnparsedAddress: undefined,
        City: 'Boulder',
        StateOrProvince: 'CO',
      })]
      mockApiGet.mockResolvedValue(createMockResponse(mockListings))

      const { result } = renderHook(() => useMapDisplay())

      await waitFor(() => {
        expect(result.current.listings[0].streetAddress).toBe('Boulder, CO')
      })
    })
  })
})
