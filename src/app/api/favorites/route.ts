import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - List all favorites for a user
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

    const favorites = await prisma.favorite.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ favorites }, { status: 200 })
  } catch (error) {
    console.error('Get favorites error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// POST - Add a favorite
export async function POST(request: NextRequest) {
  try {
    const { userId, listingId } = await request.json()

    if (!userId || !listingId) {
      return NextResponse.json(
        { error: 'User ID and Listing ID are required' },
        { status: 400 }
      )
    }

    // Check if already favorited
    const existing = await prisma.favorite.findUnique({
      where: {
        userId_listingId: {
          userId,
          listingId
        }
      }
    })

    if (existing) {
      return NextResponse.json(
        { error: 'Listing already favorited' },
        { status: 400 }
      )
    }

    const favorite = await prisma.favorite.create({
      data: {
        userId,
        listingId
      }
    })

    return NextResponse.json(
      { message: 'Favorite added', favorite },
      { status: 201 }
    )
  } catch (error) {
    console.error('Add favorite error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

// DELETE - Remove a favorite
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const listingId = searchParams.get('listingId')

    if (!userId || !listingId) {
      return NextResponse.json(
        { error: 'User ID and Listing ID are required' },
        { status: 400 }
      )
    }

    await prisma.favorite.delete({
      where: {
        userId_listingId: {
          userId,
          listingId
        }
      }
    })

    return NextResponse.json(
      { message: 'Favorite removed' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Remove favorite error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}