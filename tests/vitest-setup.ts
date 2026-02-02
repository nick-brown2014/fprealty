import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock google.maps for tests
const mockLatLngBounds = vi.fn().mockImplementation((sw?: { lat: number; lng: number }, ne?: { lat: number; lng: number }) => {
  const _sw = sw || { lat: 0, lng: 0 }
  const _ne = ne || { lat: 0, lng: 0 }
  
  return {
    getNorthEast: () => ({
      lat: () => _ne.lat,
      lng: () => _ne.lng,
    }),
    getSouthWest: () => ({
      lat: () => _sw.lat,
      lng: () => _sw.lng,
    }),
    extend: vi.fn(),
  }
})

// @ts-expect-error - mocking google maps
global.google = {
  maps: {
    LatLngBounds: mockLatLngBounds,
    event: {
      removeListener: vi.fn(),
    },
  },
}

// Mock fetch globally
global.fetch = vi.fn()

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
  useSearchParams: () => ({
    get: vi.fn(),
  }),
}))
