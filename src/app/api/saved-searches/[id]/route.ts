import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Get a specific saved search
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const savedSearch = await prisma.savedSearch.findUnique({
      where: { id: params.id }
    })

    if (!savedSearch) {
      return NextResponse.json(
        { error: 'Saved search not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ savedSearch }, { status: 200 })
  } catch (error) {
    console.error('Get saved search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// PUT - Update a saved search
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const {
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

    const savedSearch = await prisma.savedSearch.update({
      where: { id: params.id },
      data: {
        name: name || undefined,
        searchQuery: searchQuery !== undefined ? searchQuery : undefined,
        minPrice: minPrice !== undefined ? minPrice : undefined,
        maxPrice: maxPrice !== undefined ? maxPrice : undefined,
        minBeds: minBeds !== undefined ? minBeds : undefined,
        minBaths: minBaths !== undefined ? minBaths : undefined,
        propertyTypes: propertyTypes || undefined,
        includeLand: includeLand !== undefined ? includeLand : undefined,
        statuses: statuses || undefined,
        bounds: bounds !== undefined ? bounds : undefined
      }
    })

    return NextResponse.json(
      { message: 'Search updated', savedSearch },
      { status: 200 }
    )
  } catch (error) {
    console.error('Update saved search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Delete a saved search
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.savedSearch.delete({
      where: { id: params.id }
    })

    return NextResponse.json(
      { message: 'Search deleted' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Delete saved search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}