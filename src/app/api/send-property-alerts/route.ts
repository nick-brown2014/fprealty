import { NextRequest, NextResponse } from 'next/server'
import { processPropertyAlerts } from '@/lib/property-alerts'

// POST /api/send-property-alerts
// Called with { newListingKeys: string[] } body
// Can also be called manually for testing
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const secret = request.nextUrl.searchParams.get('secret')

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && secret !== process.env.CRON_SECRET) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const newListingKeys: string[] = body.newListingKeys || []
    const testMode = request.nextUrl.searchParams.get('test') === 'true'

    const result = await processPropertyAlerts(newListingKeys, { testMode })

    return NextResponse.json(result, { status: result.success ? 200 : 500 })
  } catch (error) {
    console.error('Send property alerts error:', error)
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
