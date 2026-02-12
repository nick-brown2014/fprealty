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
    const body = await request.json()

    if (!body.userId || !body.name) {
      return NextResponse.json(
        { error: 'User ID and name are required' },
        { status: 400 }
      )
    }

    const savedSearch = await prisma.savedSearch.create({
      data: {
        userId: body.userId,
        name: body.name,
        searchQuery: body.searchQuery || null,
        minPrice: body.minPrice ?? null,
        maxPrice: body.maxPrice ?? null,
        minBeds: body.minBeds ?? null,
        minBaths: body.minBaths ?? null,
        propertyTypes: body.propertyTypes || [],
        includeLand: body.includeLand || false,
        statuses: body.statuses || [],
        bounds: body.bounds || null,
        minSqft: body.minSqft ?? null,
        maxSqft: body.maxSqft ?? null,
        minLotSize: body.minLotSize ?? null,
        maxLotSize: body.maxLotSize ?? null,
        minYearBuilt: body.minYearBuilt ?? null,
        maxYearBuilt: body.maxYearBuilt ?? null,
        minStories: body.minStories ?? null,
        maxStories: body.maxStories ?? null,
        minGarageSpaces: body.minGarageSpaces ?? null,
        hasPool: body.hasPool || false,
        hasAC: body.hasAC || false,
        hasBasement: body.hasBasement || false,
        isWaterfront: body.isWaterfront || false,
        hasFireplace: body.hasFireplace || false,
        isSeniorCommunity: body.isSeniorCommunity || false,
        maxHoaFee: body.maxHoaFee ?? null,
        hasSpa: body.hasSpa || false,
        isHorseProperty: body.isHorseProperty || false,
        hasGarage: body.hasGarage || false,
        hasAttachedGarage: body.hasAttachedGarage || false,
        hasHeating: body.hasHeating || false,
        minDaysOnMarket: body.minDaysOnMarket ?? null,
        maxDaysOnMarket: body.maxDaysOnMarket ?? null,
        minTaxAmount: body.minTaxAmount ?? null,
        maxTaxAmount: body.maxTaxAmount ?? null,
        minCoveredSpaces: body.minCoveredSpaces ?? null,
        hasVirtualTour: body.hasVirtualTour || false,
        isGreenEnergy: body.isGreenEnergy || false,
        view: body.view || [],
        flooring: body.flooring || [],
        appliances: body.appliances || [],
        heatingType: body.heatingType || [],
        architecturalStyle: body.architecturalStyle || [],
        fencing: body.fencing || [],
        patioFeatures: body.patioFeatures || [],
        schoolDistrict: body.schoolDistrict || null,
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