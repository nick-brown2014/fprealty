// ===== BRIDGE DATA OUTPUT API (COMMENTED OUT FOR MLS GRID MIGRATION - PHASE 3) =====
// const BASE_URL = "https://api.bridgedataoutput.com/api/v2/iresds"
// const API_KEY = process.env.NEXT_PUBLIC_BROWSER_TOKEN // Server-only secret
//
// const defaultHeaders = {
//   'Content-Type': 'application/json',
// }
//
// const buildQueryString = (params?: Record<string, string | number | boolean>) => {
//   const queryString = `?access_token=${API_KEY}`
//   if (!params) return queryString
//   const query = new URLSearchParams()
//   for (const key in params) {
//     const value = params[key]
//     if (value !== undefined && value !== null) {
//       query.append(key, String(value))
//     }
//   }
//   return `${queryString}&${query.toString()}`
// }
//
// export async function apiGet<T>(
//   endpoint: string,
//   filters?: Record<string, string | number | boolean>
// ): Promise<T> {
//   const queryString = buildQueryString(filters)
//   const res = await fetch(`${BASE_URL}${endpoint}${queryString}`, {
//     method: 'GET',
//     headers: defaultHeaders,
//   })
//
//   if (!res.ok) {
//     throw new Error(`GET ${endpoint} failed: ${res.status}`)
//   }
//
//   return res.json()
// }
//
// export async function apiPost<T>(
//   endpoint: string,
//   body: object,
//   params?: Record<string, string | number | boolean>
// ): Promise<T> {
//   const queryString = buildQueryString(params)
//   const res = await fetch(`${BASE_URL}${endpoint}${queryString}`, {
//     method: 'POST',
//     headers: defaultHeaders,
//     body: JSON.stringify(body),
//   })
//
//   if (!res.ok) {
//     throw new Error(`POST ${endpoint} failed: ${res.status}`)
//   }
//
//   return res.json()
// }
// ===== END BRIDGE DATA OUTPUT API =====

// Local Prisma database queries via Next.js API routes (MLS Grid Phase 3)
const LOCAL_API_BASE = '/api'

const buildLocalQueryString = (params?: Record<string, string | number | boolean>) => {
  if (!params) return ''
  const query = new URLSearchParams()
  for (const key in params) {
    const value = params[key]
    if (value !== undefined && value !== null) {
      query.append(key, String(value))
    }
  }
  const str = query.toString()
  return str ? `?${str}` : ''
}

export async function apiGet<T>(
  endpoint: string,
  filters?: Record<string, string | number | boolean>
): Promise<T> {
  const queryString = buildLocalQueryString(filters)
  const res = await fetch(`${LOCAL_API_BASE}${endpoint}${queryString}`)

  if (!res.ok) {
    throw new Error(`GET ${endpoint} failed: ${res.status}`)
  }

  return res.json()
}

export async function apiPost<T>(
  endpoint: string,
  body: object,
  params?: Record<string, string | number | boolean>
): Promise<T> {
  const queryString = buildLocalQueryString(params)
  const res = await fetch(`${LOCAL_API_BASE}${endpoint}${queryString}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`POST ${endpoint} failed: ${res.status}`)
  }

  return res.json()
}
