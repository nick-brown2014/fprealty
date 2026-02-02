import { describe, it, expect, vi, beforeEach } from 'vitest'
import { GET } from '@/app/api/send-property-alerts/route'
import { prismaMock } from '../setup'
import { NextRequest } from 'next/server'

vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = {
      send: vi.fn().mockResolvedValue({ error: null })
    }
  }
}))

global.fetch = vi.fn()

describe('GET /api/send-property-alerts', () => {
  beforeEach(() => {
    process.env.CRON_SECRET = 'test-secret'
    process.env.RESEND_API_KEY = 'test-resend-key'
    process.env.NEXTAUTH_URL = 'http://localhost:3000'
    process.env.NEXT_PUBLIC_BROWSER_TOKEN = 'test-browser-token'
    vi.mocked(global.fetch).mockReset()
  })

  it('requires CRON_SECRET in authorization header', async () => {
    const req = new NextRequest('http://localhost/api/send-property-alerts')
    const res = await GET(req)
    expect(res.status).toBe(401)
    const data = await res.json()
    expect(data.error).toBe('Unauthorized')
  })

  it('accepts CRON_SECRET as Bearer token in authorization header', async () => {
    const req = new NextRequest('http://localhost/api/send-property-alerts', {
      headers: { authorization: 'Bearer test-secret' }
    })
    prismaMock.user.findMany.mockResolvedValue([])
    const res = await GET(req)
    expect(res.status).toBe(200)
  })

  it('accepts CRON_SECRET as query parameter', async () => {
    const req = new NextRequest('http://localhost/api/send-property-alerts?secret=test-secret')
    prismaMock.user.findMany.mockResolvedValue([])
    const res = await GET(req)
    expect(res.status).toBe(200)
  })

  it('rejects invalid CRON_SECRET', async () => {
    const req = new NextRequest('http://localhost/api/send-property-alerts', {
      headers: { authorization: 'Bearer wrong-secret' }
    })
    const res = await GET(req)
    expect(res.status).toBe(401)
  })

  it('returns 500 when RESEND_API_KEY is not configured', async () => {
    delete process.env.RESEND_API_KEY
    const req = new NextRequest('http://localhost/api/send-property-alerts', {
      headers: { authorization: 'Bearer test-secret' }
    })
    const res = await GET(req)
    expect(res.status).toBe(500)
    const data = await res.json()
    expect(data.error).toBe('RESEND_API_KEY not configured')
  })

  it('only fetches users with emailOptIn=true', async () => {
    const req = new NextRequest('http://localhost/api/send-property-alerts', {
      headers: { authorization: 'Bearer test-secret' }
    })
    prismaMock.user.findMany.mockResolvedValue([])

    await GET(req)
    expect(prismaMock.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ emailOptIn: true })
      })
    )
  })

  it('includes savedSearches in user query', async () => {
    const req = new NextRequest('http://localhost/api/send-property-alerts', {
      headers: { authorization: 'Bearer test-secret' }
    })
    prismaMock.user.findMany.mockResolvedValue([])

    await GET(req)
    expect(prismaMock.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        include: expect.objectContaining({ savedSearches: true })
      })
    )
  })

  it('skips users with no saved searches', async () => {
    const req = new NextRequest('http://localhost/api/send-property-alerts', {
      headers: { authorization: 'Bearer test-secret' }
    })
    prismaMock.user.findMany.mockResolvedValue([
      {
        id: 'user-1',
        email: 'user@test.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        password: 'hashed',
        emailOptIn: true,
        isAdmin: false,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        savedSearches: []
      }
    ] as any)

    const res = await GET(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.emailsSent).toBe(0)
  })

    it('fetches listings from Bridge API for saved searches', async () => {
      const req = new NextRequest('http://localhost/api/send-property-alerts', {
        headers: { authorization: 'Bearer test-secret' }
      })

    prismaMock.user.findMany.mockResolvedValue([
      {
        id: 'user-1',
        email: 'user@test.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        password: 'hashed',
        emailOptIn: true,
        isAdmin: false,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        savedSearches: [
          {
            id: 'search-1',
            userId: 'user-1',
            name: 'Fort Collins Search',
            searchQuery: 'Fort Collins, CO',
            minPrice: 300000,
            maxPrice: 500000,
            minBeds: 3,
            minBaths: 2,
            propertyTypes: ['Residential'],
            includeLand: false,
            statuses: ['Active'],
            bounds: null,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
    ] as any)

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ bundle: [] })
    } as Response)

    const res = await GET(req)
    expect(res.status).toBe(200)
    expect(global.fetch).toHaveBeenCalled()
    const fetchCall = vi.mocked(global.fetch).mock.calls[0][0] as string
    expect(fetchCall).toContain('api.bridgedataoutput.com')
  })

    it('applies price filters to Bridge API query', async () => {
      const req = new NextRequest('http://localhost/api/send-property-alerts', {
        headers: { authorization: 'Bearer test-secret' }
      })

    prismaMock.user.findMany.mockResolvedValue([
      {
        id: 'user-1',
        email: 'user@test.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        password: 'hashed',
        emailOptIn: true,
        isAdmin: false,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        savedSearches: [
          {
            id: 'search-1',
            userId: 'user-1',
            name: 'Price Filter Search',
            searchQuery: 'Denver, CO',
            minPrice: 200000,
            maxPrice: 400000,
            minBeds: null,
            minBaths: null,
            propertyTypes: [],
            includeLand: false,
            statuses: [],
            bounds: null,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
    ] as any)

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ bundle: [] })
    } as Response)

    await GET(req)
    const fetchCall = vi.mocked(global.fetch).mock.calls[0][0] as string
    expect(fetchCall).toContain('ListPrice.gte')
    expect(fetchCall).toContain('ListPrice.lte')
  })

    it('applies bounds filters when available', async () => {
      const req = new NextRequest('http://localhost/api/send-property-alerts', {
        headers: { authorization: 'Bearer test-secret' }
      })

    prismaMock.user.findMany.mockResolvedValue([
      {
        id: 'user-1',
        email: 'user@test.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        password: 'hashed',
        emailOptIn: true,
        isAdmin: false,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        savedSearches: [
          {
            id: 'search-1',
            userId: 'user-1',
            name: 'Bounds Search',
            searchQuery: null,
            minPrice: null,
            maxPrice: null,
            minBeds: null,
            minBaths: null,
            propertyTypes: [],
            includeLand: false,
            statuses: [],
            bounds: {
              north: 40.6,
              south: 40.4,
              east: -104.9,
              west: -105.1
            },
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
    ] as any)

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ bundle: [] })
    } as Response)

    await GET(req)
    const fetchCall = vi.mocked(global.fetch).mock.calls[0][0] as string
    expect(fetchCall).toContain('Latitude.gte')
    expect(fetchCall).toContain('Latitude.lte')
    expect(fetchCall).toContain('Longitude.gte')
    expect(fetchCall).toContain('Longitude.lte')
  })

    it('filters by test email when test mode is enabled', async () => {
      const req = new NextRequest('http://localhost/api/send-property-alerts?secret=test-secret&test=true')
    prismaMock.user.findMany.mockResolvedValue([])

    await GET(req)
    expect(prismaMock.user.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          emailOptIn: true,
          email: 'nick.brown2014@gmail.com'
        })
      })
    )
  })

    it('returns success response with email count', async () => {
      const req = new NextRequest('http://localhost/api/send-property-alerts', {
        headers: { authorization: 'Bearer test-secret' }
      })
    prismaMock.user.findMany.mockResolvedValue([])

    const res = await GET(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.success).toBe(true)
    expect(data.emailsSent).toBeDefined()
    expect(data.usersProcessed).toBeDefined()
  })

    it('handles Bridge API errors gracefully', async () => {
      const req = new NextRequest('http://localhost/api/send-property-alerts', {
        headers: { authorization: 'Bearer test-secret' }
      })

    prismaMock.user.findMany.mockResolvedValue([
      {
        id: 'user-1',
        email: 'user@test.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        password: 'hashed',
        emailOptIn: true,
        isAdmin: false,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        savedSearches: [
          {
            id: 'search-1',
            userId: 'user-1',
            name: 'Test Search',
            searchQuery: 'Denver, CO',
            minPrice: null,
            maxPrice: null,
            minBeds: null,
            minBaths: null,
            propertyTypes: [],
            includeLand: false,
            statuses: [],
            bounds: null,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
    ] as any)

    vi.mocked(global.fetch).mockResolvedValue({
      ok: false,
      status: 500,
      statusText: 'Internal Server Error'
    } as Response)

    const res = await GET(req)
    expect(res.status).toBe(200)
    const data = await res.json()
    expect(data.emailsSent).toBe(0)
  })

    it('defaults to Active status when no statuses specified', async () => {
      const req = new NextRequest('http://localhost/api/send-property-alerts', {
        headers: { authorization: 'Bearer test-secret' }
      })

    prismaMock.user.findMany.mockResolvedValue([
      {
        id: 'user-1',
        email: 'user@test.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        password: 'hashed',
        emailOptIn: true,
        isAdmin: false,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        savedSearches: [
          {
            id: 'search-1',
            userId: 'user-1',
            name: 'No Status Search',
            searchQuery: 'Denver, CO',
            minPrice: null,
            maxPrice: null,
            minBeds: null,
            minBaths: null,
            propertyTypes: [],
            includeLand: false,
            statuses: [],
            bounds: null,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
    ] as any)

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ bundle: [] })
    } as Response)

    await GET(req)
    const fetchCall = vi.mocked(global.fetch).mock.calls[0][0] as string
    expect(fetchCall).toContain('StandardStatus.in=Active')
  })

    it('includes Land in property types when includeLand is true', async () => {
      const req = new NextRequest('http://localhost/api/send-property-alerts', {
        headers: { authorization: 'Bearer test-secret' }
      })

    prismaMock.user.findMany.mockResolvedValue([
      {
        id: 'user-1',
        email: 'user@test.com',
        firstName: 'John',
        lastName: 'Doe',
        phoneNumber: '1234567890',
        password: 'hashed',
        emailOptIn: true,
        isAdmin: false,
        resetToken: null,
        resetTokenExpiry: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        savedSearches: [
          {
            id: 'search-1',
            userId: 'user-1',
            name: 'Land Search',
            searchQuery: 'Denver, CO',
            minPrice: null,
            maxPrice: null,
            minBeds: null,
            minBaths: null,
            propertyTypes: ['Residential'],
            includeLand: true,
            statuses: [],
            bounds: null,
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ]
      }
    ] as any)

    vi.mocked(global.fetch).mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({ bundle: [] })
    } as Response)

    await GET(req)
    const fetchCall = vi.mocked(global.fetch).mock.calls[0][0] as string
    expect(fetchCall).toContain('PropertyType.in')
    expect(fetchCall).toContain('Land')
  })
})
