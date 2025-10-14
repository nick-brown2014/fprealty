import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - List all saved searches for a user
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const savedSearches = await prisma.savedSearch.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' }
    })

    return NextResponse.json({ savedSearches }, { status: 200 })
  } catch (error) {
    console.error('Get saved searches error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Create a new saved search
export async function POST(request: NextRequest) {
  try {
    const {
      userId,
      name,
      searchQuery,
      minPrice,
      maxPrice,
      minBeds,
      minBaths,
      propertyTypes,
      includeLand,
      statuses,
      bounds
    } = await request.json()

    if (!userId || !name) {
      return NextResponse.json(
        { error: 'User ID and name are required' },
        { status: 400 }
      )
    }

    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId,
        name,
        searchQuery: searchQuery || null,
        minPrice: minPrice || null,
        maxPrice: maxPrice || null,
        minBeds: minBeds || null,
        minBaths: minBaths || null,
        propertyTypes: propertyTypes || [],
        includeLand: includeLand || false,
        statuses: statuses || [],
        bounds: bounds || null
      }
    })

    return NextResponse.json(
      { message: 'Search saved', savedSearch },
      { status: 201 }
    )
  } catch (error) {
    console.error('Create saved search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}