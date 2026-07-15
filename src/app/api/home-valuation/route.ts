import { NextRequest, NextResponse } from 'next/server'

const GHL_CONTACTS_URL = 'https://services.leadconnectorhq.com/contacts/upsert'
const GHL_LOCATION_ID = 'zGwqa9Oyk55imvfPlRzO'

const customFieldIds = {
  bedrooms: '4e9uLPFbCEdW8YCIgEov',
  bathrooms: 'VRisEKE735etjYpmrBb1',
  squareFootage: 'ro4ZdHyzrA5rn4gb1n9T',
  timeframe: 'gdLmp9l2O93D7ylXDZXx',
} as const

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

type GhlCustomField = {
  id: string
  value: string
}

type GhlContactPayload = {
  locationId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  address1: string
  source: string
  tags: string[]
  customFields: GhlCustomField[]
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
    const token = process.env.GHL_CONTACTS_WRITE
    if (!token) {
      console.error('GHL_CONTACTS_WRITE not configured')
      return NextResponse.json(
        { error: 'Home valuation service not configured' },
        { status: 500 }
      )
    }

    const input = parseInput(await request.json())
    if (!input) {
      return NextResponse.json(
        { error: 'Please provide valid contact information and consent.' },
        { status: 400 }
      )
    }

    const tags = [
      'home-valuation-lead',
      `Property type: ${input.propertyType || 'Not specified'}`,
    ]

    const payload: GhlContactPayload = {
      locationId: GHL_LOCATION_ID,
      firstName: input.firstName,
      lastName: input.lastName,
      email: input.email,
      phone: input.phone,
      address1: input.address,
      source: 'Home Valuation Form',
      tags,
      customFields: [
        { id: customFieldIds.bedrooms, value: input.bedrooms },
        { id: customFieldIds.bathrooms, value: input.bathrooms },
        { id: customFieldIds.squareFootage, value: input.squareFootage },
        { id: customFieldIds.timeframe, value: input.timeframe },
      ],
    }

    const response = await fetch(GHL_CONTACTS_URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })

    const responseBody: unknown = await response.json().catch(() => null)
    if (!response.ok) {
      console.error('GHL contact creation failed:', response.status, responseBody)
      return NextResponse.json(
        { error: 'Unable to submit your home valuation request.' },
        { status: 502 }
      )
    }

    const contactId = isRecord(responseBody) &&
      isRecord(responseBody.contact) &&
      typeof responseBody.contact.id === 'string'
      ? responseBody.contact.id
      : undefined

    return NextResponse.json({ ok: true, id: contactId }, { status: 201 })
  } catch (error) {
    console.error('Home valuation submission error:', error)
    return NextResponse.json(
      { error: 'Unable to submit your home valuation request.' },
      { status: 500 }
    )
  }
}
