export interface Search {
  id: string
  userId: string
  name: string
  searchQuery?: string
  minPrice?: number
  maxPrice?: number
  minBeds?: number
  minBaths?: number
  propertyTypes: string[]
  includeLand: boolean
  statuses: string[]
  bound?: JSON
}