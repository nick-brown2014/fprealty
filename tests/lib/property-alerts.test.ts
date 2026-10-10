import { describe, it, expect, vi, beforeEach } from 'vitest'
import { processPropertyAlerts } from '@/lib/property-alerts'
import { prismaMock } from '../setup'

const sendMock = vi.fn().mockResolvedValue({ error: null })
vi.mock('resend', () => ({
  Resend: class MockResend {
    emails = { send: sendMock }
  }
}))

vi.mock('@/lib/media', () => ({ isMediaCached: () => true }))

const user = {
  id: 'user-1',
  email: 'user@test.com',
  firstName: 'John',
  lastName: 'Doe',
  emailOptIn: true,
  lastAlertEmailAt: null,
  savedSearches: [
    {
      id: 'search-1',
      userId: 'user-1',
      name: 'Everything',
      minPrice: null, maxPrice: null, minBeds: null, minBaths: null,
      propertyTypes: [], includeLand: false, statuses: [], bounds: null,
      minSqft: null, maxSqft: null, minLotSize: null, maxLotSize: null,
      minYearBuilt: null, maxYearBuilt: null, minStories: null, maxStories: null,
      minGarageSpaces: null, maxHoaFee: null, minDaysOnMarket: null, maxDaysOnMarket: null,
      minTaxAmount: null, maxTaxAmount: null, minCoveredSpaces: null, schoolDistrict: null,
      view: [], flooring: [], appliances: [], heatingType: [], architecturalStyle: [], fencing: [], patioFeatures: [],
    }
  ]
}

const listing = {
  listingKey: 'IRE1', streetNumber: '1', streetName: 'Main', streetSuffix: 'St', unitNumber: null,
  unparsedAddress: '1 Main St', city: 'Fort Collins', stateOrProvince: 'CO',
  listPrice: BigInt(400000), bedroomsTotal: 3, bathroomsTotalInteger: 2, livingArea: 1500, media: [],
}

describe('processPropertyAlerts daily cap', () => {
  beforeEach(() => {
    process.env.RESEND_API_KEY = 'test-resend-key'
    sendMock.mockClear()
  })

  it('excludes users emailed within the last 24 hours from the query', async () => {
    prismaMock.user.findMany.mockResolvedValue([])
    const before = Date.now()

    await processPropertyAlerts(['IRE1'])

    const where = prismaMock.user.findMany.mock.calls[0][0]!.where as { OR: Array<{ lastAlertEmailAt: null | { lt: Date } }> }
    expect(where.OR[0]).toEqual({ lastAlertEmailAt: null })
    const cutoff = (where.OR[1].lastAlertEmailAt as { lt: Date }).lt.getTime()
    expect(before - cutoff).toBeGreaterThanOrEqual(24 * 60 * 60 * 1000 - 1000)
    expect(before - cutoff).toBeLessThan(24 * 60 * 60 * 1000 + 5000)
  })

  it('stamps lastAlertEmailAt after a successful send', async () => {
    prismaMock.user.findMany.mockResolvedValue([user] as never)
    prismaMock.listing.findMany.mockResolvedValue([listing] as never)
    prismaMock.user.update.mockResolvedValue(user as never)

    const result = await processPropertyAlerts(['IRE1'])

    expect(result.emailsSent).toBe(1)
    expect(prismaMock.user.update).toHaveBeenCalledWith({
      where: { id: 'user-1' },
      data: { lastAlertEmailAt: expect.any(Date) },
    })
  })

  it('does not stamp lastAlertEmailAt when nothing matched', async () => {
    prismaMock.user.findMany.mockResolvedValue([user] as never)
    prismaMock.listing.findMany.mockResolvedValue([])

    const result = await processPropertyAlerts(['IRE1'])

    expect(result.emailsSent).toBe(0)
    expect(prismaMock.user.update).not.toHaveBeenCalled()
  })

  it('does not stamp lastAlertEmailAt when the send fails', async () => {
    sendMock.mockResolvedValueOnce({ error: { message: 'boom' } })
    prismaMock.user.findMany.mockResolvedValue([user] as never)
    prismaMock.listing.findMany.mockResolvedValue([listing] as never)

    const result = await processPropertyAlerts(['IRE1'])

    expect(result.emailsSent).toBe(0)
    expect(prismaMock.user.update).not.toHaveBeenCalled()
  })
})
