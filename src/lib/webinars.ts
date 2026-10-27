export const WEBINAR_TIME_ZONE = 'America/Denver'

export type WebinarView = {
  id: string
  title: string
  description: string
  image: string | null
  signUpUrl: string | null
  startsAt: string
}

const ordinal = (day: number) => {
  if (day > 3 && day < 21) return 'th'
  switch (day % 10) {
    case 1: return 'st'
    case 2: return 'nd'
    case 3: return 'rd'
    default: return 'th'
  }
}

function denverParts(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: WEBINAR_TIME_ZONE,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(date)
  const get = (type: string) => Number(parts.find((part) => part.type === type)?.value)
  return { year: get('year'), month: get('month'), day: get('day'), hour: get('hour'), minute: get('minute') }
}

export function formatWebinarDate(value: string | Date) {
  const date = new Date(value)
  const options = { timeZone: WEBINAR_TIME_ZONE } as const
  const weekday = date.toLocaleDateString('en-US', { ...options, weekday: 'long' })
  const month = date.toLocaleDateString('en-US', { ...options, month: 'long' })
  const time = date.toLocaleTimeString('en-US', { ...options, hour: 'numeric', minute: '2-digit' })
  const day = denverParts(date).day
  return `${weekday}, ${month} ${day}${ordinal(day)} @ ${time}`
}

/** Formats a UTC instant as a `datetime-local` input value in Denver wall-clock time. */
export function toDenverInputValue(date: Date) {
  const { year, month, day, hour, minute } = denverParts(date)
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${year}-${pad(month)}-${pad(day)}T${pad(hour)}:${pad(minute)}`
}

/** Parses a `datetime-local` value (YYYY-MM-DDTHH:mm) as Denver wall-clock time and returns the UTC instant. */
export function fromDenverInputValue(value: string): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/.exec(value)
  if (!match) return null
  const [year, month, day, hour, minute] = match.slice(1).map(Number)
  const asUtc = Date.UTC(year, month - 1, day, hour, minute)
  // Two passes handle the offset change around DST transitions.
  let guess = asUtc
  for (let i = 0; i < 2; i++) {
    const local = denverParts(new Date(guess))
    const localAsUtc = Date.UTC(local.year, local.month - 1, local.day, local.hour, local.minute)
    guess = asUtc - (localAsUtc - guess)
  }
  const result = new Date(guess)
  return Number.isNaN(result.getTime()) ? null : result
}
