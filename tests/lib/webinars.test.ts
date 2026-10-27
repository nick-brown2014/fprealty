import { describe, expect, it } from 'vitest'
import { formatWebinarDate, fromDenverInputValue, toDenverInputValue } from '@/lib/webinars'

describe('webinar time helpers', () => {
  it('formats a UTC instant in Mountain time', () => {
    expect(formatWebinarDate('2026-10-17T01:00:00.000Z')).toBe('Friday, October 16th @ 7:00 PM')
  })

  it('round-trips a Denver wall-clock time through the datetime-local format (MDT)', () => {
    const date = fromDenverInputValue('2026-10-16T19:00')
    expect(date?.toISOString()).toBe('2026-10-17T01:00:00.000Z')
    expect(toDenverInputValue(date!)).toBe('2026-10-16T19:00')
  })

  it('round-trips a Denver wall-clock time through the datetime-local format (MST)', () => {
    const date = fromDenverInputValue('2026-12-03T18:30')
    expect(date?.toISOString()).toBe('2026-12-04T01:30:00.000Z')
    expect(toDenverInputValue(date!)).toBe('2026-12-03T18:30')
  })

  it('rejects malformed input', () => {
    expect(fromDenverInputValue('')).toBeNull()
    expect(fromDenverInputValue('2026-10-16')).toBeNull()
  })
})
