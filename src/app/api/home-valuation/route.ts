import { NextRequest, NextResponse } from 'next/server'

const GHL_WEBHOOK_URL = 'https://services.leadconnectorhq.com/hooks/zGwqa9Oyk55imvfPlRzO/webhook-trigger/3618be67-b003-445f-a581-8a5cb5610461'

type HomeValuationInput = {
  address: string
  propertyType: string
  bedrooms: string
  bathrooms: string
  squareFootage: string
  timeframe: string
  firstName: string
  lastName: string
  phone: string
  email: string
  consent: boolean
}

const isRecord = (value: unknown): value is Record<string, unknown> => (
  typeof value === 'object' && value !== null
)

const stringValue = (value: unknown): string => (
  typeof value === 'string' ? value.trim() : ''
)

const parseInput = (value: unknown): HomeValuationInput | null => {
  if (!isRecord(value)) return null

  const input: HomeValuationInput = {
    address: stringValue(value.address),
    propertyType: stringValue(value.propertyType),
    bedrooms: stringValue(value.bedrooms),
    bathrooms: stringValue(value.bathrooms),
    squareFootage: stringValue(value.squareFootage),
    timeframe: stringValue(value.timeframe),
    firstName: stringValue(value.firstName),
    lastName: stringValue(value.lastName),
    phone: stringValue(value.phone),
    email: stringValue(value.email),
    consent: value.consent === true,
  }

  if (
    !input.address ||
    !input.firstName ||
    !input.lastName ||
    !input.phone ||
    !input.email ||
    !input.consent ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)
  ) {
    return null
  }

  return input
}

export async function POST(request: NextRequest) {
  try {
    const input = parseInput(await request.json())
    if (!input) {
      return NextResponse.json(
        { error: 'Please provide valid contact information and consent.' },
        { status: 400 }
      )
    }

    const payload = {
      firstName: input.firstName,
      lastName: input.lastName,
      fullName: `${input.firstName} ${input.lastName}`,
      email: input.email,
      phone: input.phone,
      address: input.address,
      propertyType: input.propertyType,
      bedrooms: input.bedrooms,
      bathrooms: input.bathrooms,
      squareFootage: input.squareFootage,
      timeframe: input.timeframe,
      consent: input.consent,
      source: 'Home Valuation Form',
      tag: 'home-valuation-lead',
      submittedAt: new Date().toISOString(),
    }

    const response = await fetch(GHL_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      const responseBody = await response.text().catch(() => '')
      console.error('GHL webhook submission failed:', response.status, responseBody)
      return NextResponse.json(
        { error: 'Unable to submit your home valuation request.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ ok: true }, { status: 201 })
  } catch (error) {
    console.error('Home valuation submission error:', error)
    return NextResponse.json(
      { error: 'Unable to submit your home valuation request.' },
      { status: 500 }
    )
  }
}
