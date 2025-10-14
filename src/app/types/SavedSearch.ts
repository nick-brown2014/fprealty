export interface SavedSearch {
  id: string
  userId: string
  createdAt: string
  updatedAt: string
  name: string
  searchQuery?: string
  minPrice?: number
  maxPrice?: number
  minBeds?: number
  minBaths?: number
  propertyTypes: string[]
  includeLand: boolean
  statuses: string[]
  bounds?: {
    north: number
    south: number
    east: number
    west: number
  }
}