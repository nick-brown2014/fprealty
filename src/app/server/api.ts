const BASE_URL = "https://api.bridgedataoutput.com/api/v2/test"
const API_KEY = process.env.NEXT_PUBLIC_BROWSER_TOKEN // Server-only secret

const defaultHeaders = {
  'Content-Type': 'application/json',
}

const buildQueryString = (params?: Record<string, string | number | boolean>) => {
  const queryString = `?access_token=${API_KEY}`
  if (!params) return queryString
  const query = new URLSearchParams()
  for (const key in params) {
    const value = params[key]
    if (value !== undefined && value !== null) {
      query.append(key, String(value))
    }
  }
  return `${queryString}&${query.toString()}`
}

export async function apiGet<T>(
  endpoint: string,
  filters?: Record<string, string | number | boolean>
): Promise<T> {
  const queryString = buildQueryString(filters)
  const res = await fetch(`${BASE_URL}${endpoint}${queryString}`, {
    method: 'GET',
    headers: defaultHeaders,
  })

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
  const queryString = buildQueryString(params)
  const res = await fetch(`${BASE_URL}${endpoint}${queryString}`, {
    method: 'POST',
    headers: defaultHeaders,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    throw new Error(`POST ${endpoint} failed: ${res.status}`)
  }

  return res.json()
}
