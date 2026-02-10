import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

interface MediaItem {
  MediaURL: string
  MediaObjectID: string
  Order: number
  MimeType: string
  ShortDescription?: string
}

function bigIntToNumber(val: bigint | null): number | null {
  if (val === null || val === undefined) return null
  return Number(val)
}

function transformListing(listing: Prisma.ListingGetPayload<object>) {
  const media = listing.media as MediaItem[] | null
  return {
    ListingKey: listing.listingKey,
    ListPrice: bigIntToNumber(listing.listPrice) ?? 0,
    OriginalListPrice: bigIntToNumber(listing.originalListPrice),
    ClosePrice: bigIntToNumber(listing.closePrice),
    CloseDate: listing.closeDate?.toISOString() ?? null,
    City: listing.city ?? '',
    StateOrProvince: listing.stateOrProvince,
    PostalCode: listing.postalCode,
    CountyOrParish: listing.countyOrParish,
    UnparsedAddress: listing.unparsedAddress,
    StreetNumber: listing.streetNumber,
    StreetName: listing.streetName,
    StreetSuffix: listing.streetSuffix,
    UnitNumber: listing.unitNumber,
    PropertyType: listing.propertyType,
    PropertySubType: listing.propertySubType ?? '',
    BedroomsTotal: listing.bedroomsTotal ?? 0,
    BathroomsFull: listing.bathroomsFull ?? 0,
    BathroomsTotalInteger: listing.bathroomsTotalInteger,
    LivingArea: listing.livingArea ?? 0,
    LivingAreaUnits: listing.livingAreaUnits,
    PhotosCount: listing.photosCount ?? 0,
    Media: media ?? undefined,
    MlsStatus: listing.mlsStatus ?? '',
    DaysOnMarket: listing.daysOnMarket ?? 0,
    Latitude: listing.latitude,
    Longitude: listing.longitude,
    ListAgentFullName: listing.listAgentFullName,
    LotSizeAcres: listing.lotSizeAcres,
  }
}

function parseFloatParam(val: string | null): number | undefined {
  if (!val) return undefined
  const n = parseFloat(val)
  return isNaN(n) ? undefined : n
}

function parseIntParam(val: string | null): number | undefined {
  if (!val) return undefined
  const n = parseInt(val, 10)
  return isNaN(n) ? undefined : n
}

function floatRange(gte: string | null, lte: string | null) {
  const gteVal = parseFloatParam(gte)
  const lteVal = parseFloatParam(lte)
  if (gteVal === undefined && lteVal === undefined) return undefined
  const filter: Prisma.FloatNullableFilter<'Listing'> = {}
  if (gteVal !== undefined) filter.gte = gteVal
  if (lteVal !== undefined) filter.lte = lteVal
  return filter
}

function intRange(gte: string | null, lte: string | null) {
  const gteVal = parseIntParam(gte)
  const lteVal = parseIntParam(lte)
  if (gteVal === undefined && lteVal === undefined) return undefined
  const filter: Prisma.IntNullableFilter<'Listing'> = {}
  if (gteVal !== undefined) filter.gte = gteVal
  if (lteVal !== undefined) filter.lte = lteVal
  return filter
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams

    const limit = Math.min(parseIntParam(params.get('limit')) ?? 100, 200)
    const offset = parseIntParam(params.get('offset')) ?? 0

    const where: Prisma.ListingWhereInput = {
      mlgCanView: true,
    }

    const latFilter = floatRange(params.get('Latitude.gte'), params.get('Latitude.lte'))
    if (latFilter) where.latitude = latFilter

    const lngFilter = floatRange(params.get('Longitude.gte'), params.get('Longitude.lte'))
    if (lngFilter) where.longitude = lngFilter

    const priceGte = params.get('ListPrice.gte')
    const priceLte = params.get('ListPrice.lte')
    if (priceGte || priceLte) {
      const priceFilter: Prisma.BigIntNullableFilter<'Listing'> = {}
      if (priceGte) priceFilter.gte = BigInt(priceGte)
      if (priceLte) priceFilter.lte = BigInt(priceLte)
      where.listPrice = priceFilter
    }

    const bedsGte = parseIntParam(params.get('BedroomsTotal.gte'))
    if (bedsGte !== undefined) where.bedroomsTotal = { gte: bedsGte }

    const bathsGte = parseIntParam(params.get('BathroomsTotalInteger.gte'))
    if (bathsGte !== undefined) where.bathroomsTotalInteger = { gte: bathsGte }

    const propertyTypeIn = params.get('PropertyType.in')
    if (propertyTypeIn) where.propertyType = { in: propertyTypeIn.split(',') }

    const mlsStatusIn = params.get('MlsStatus.in')
    if (mlsStatusIn) where.mlsStatus = { in: mlsStatusIn.split(',') }

    const listingKeyIn = params.get('ListingKey.in')
    if (listingKeyIn) where.listingKey = { in: listingKeyIn.split(',') }

    const listingId = params.get('ListingId')
    if (listingId) where.listingId = listingId

    if (params.get('NewConstructionYN') === 'true') where.newConstructionYN = true

    const sqftFilter = intRange(params.get('LivingArea.gte'), params.get('LivingArea.lte'))
    if (sqftFilter) where.livingArea = sqftFilter

    const lotFilter = floatRange(params.get('LotSizeAcres.gte'), params.get('LotSizeAcres.lte'))
    if (lotFilter) where.lotSizeAcres = lotFilter

    const yearFilter = intRange(params.get('YearBuilt.gte'), params.get('YearBuilt.lte'))
    if (yearFilter) where.yearBuilt = yearFilter

    const storiesFilter = intRange(params.get('Stories.gte'), params.get('Stories.lte'))
    if (storiesFilter) where.stories = storiesFilter

    const garageGte = parseIntParam(params.get('GarageSpaces.gte'))
    if (garageGte !== undefined) where.garageSpaces = { gte: garageGte }

    if (params.get('PoolPrivateYN') === 'true') where.poolPrivateYN = true
    if (params.get('CoolingYN') === 'true') where.coolingYN = true
    if (params.get('WaterfrontYN') === 'true') where.waterfrontYN = true
    if (params.get('FireplaceYN') === 'true') where.fireplaceYN = true
    if (params.get('SeniorCommunityYN') === 'true') where.seniorCommunityYN = true
    if (params.get('SpaYN') === 'true') where.spaYN = true
    if (params.get('HorseYN') === 'true') where.horseYN = true
    if (params.get('GarageYN') === 'true') where.garageYN = true
    if (params.get('AttachedGarageYN') === 'true') where.attachedGarageYN = true
    if (params.get('HeatingYN') === 'true') where.heatingYN = true

    if (params.get('Basement.ne') === 'None') {
      where.basement = { isEmpty: false }
    }

    const hoaFilter = intRange(null, params.get('AssociationFee.lte'))
    if (hoaFilter) where.associationFee = hoaFilter

    const domFilter = intRange(params.get('DaysOnMarket.gte'), params.get('DaysOnMarket.lte'))
    if (domFilter) where.daysOnMarket = domFilter

    const taxFilter = intRange(params.get('TaxAnnualAmount.gte'), params.get('TaxAnnualAmount.lte'))
    if (taxFilter) where.taxAnnualAmount = taxFilter

    const coveredGte = parseIntParam(params.get('CoveredSpaces.gte'))
    if (coveredGte !== undefined) where.coveredSpaces = { gte: coveredGte }

    if (params.has('VirtualTourURLUnbranded.ne')) {
      where.virtualTourURLUnbranded = { not: null }
    }

    if (params.has('GreenEnergyEfficient.ne')) {
      where.greenEnergyEfficient = { isEmpty: false }
    }

    const viewIn = params.get('View.in')
    if (viewIn) where.view = { hasSome: viewIn.split(',') }

    const flooringIn = params.get('Flooring.in')
    if (flooringIn) where.flooring = { hasSome: flooringIn.split(',') }

    const appliancesIn = params.get('Appliances.in')
    if (appliancesIn) where.appliances = { hasSome: appliancesIn.split(',') }

    const heatingIn = params.get('Heating.in')
    if (heatingIn) where.heating = { hasSome: heatingIn.split(',') }

    const archStyleIn = params.get('ArchitecturalStyle.in')
    if (archStyleIn) where.architecturalStyle = { hasSome: archStyleIn.split(',') }

    const fencingIn = params.get('Fencing.in')
    if (fencingIn) where.fencing = { hasSome: fencingIn.split(',') }

    const patioIn = params.get('PatioAndPorchFeatures.in')
    if (patioIn) where.patioAndPorchFeatures = { hasSome: patioIn.split(',') }

    const schoolDistrict = params.get('HighSchoolDistrict')
    if (schoolDistrict) {
      where.highSchoolDistrict = { contains: schoolDistrict, mode: 'insensitive' }
    }

    const listings = await prisma.listing.findMany({
      where,
      take: limit,
      skip: offset,
      orderBy: { listPrice: 'desc' },
    })

    const bundle = listings.map(transformListing)

    return NextResponse.json({
      success: true,
      total: bundle.length,
      bundle,
    })
  } catch (error) {
    console.error('Listings API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listings', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
