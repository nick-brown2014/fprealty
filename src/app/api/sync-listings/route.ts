import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const maxDuration = 300

const MLS_GRID_BASE_URL = 'https://api.mlsgrid.com/v2'
const ORIGINATING_SYSTEM = 'ires'
const BATCH_SIZE = 200
const MAX_RECORDS_PER_INVOCATION = 1000

interface MLSGridMedia {
  MediaKey: string
  MediaURL: string
  Order: number
  LongDescription?: string
  ImageWidth?: number
  ImageHeight?: number
  MediaModificationTimestamp?: string
}

interface MLSGridProperty {
  ListingKey: string
  ListingId?: string
  MlsStatus?: string
  StandardStatus?: string
  PropertyType?: string
  PropertySubType?: string
  ListPrice?: number
  OriginalListPrice?: number
  ClosePrice?: number
  CloseDate?: string
  ListingContractDate?: string
  StatusChangeTimestamp?: string
  PriceChangeTimestamp?: string
  DaysOnMarket?: number
  UnparsedAddress?: string
  StreetNumber?: string
  StreetName?: string
  StreetSuffix?: string
  StreetDirPrefix?: string
  StreetDirSuffix?: string
  UnitNumber?: string
  City?: string
  StateOrProvince?: string
  PostalCode?: string
  CountyOrParish?: string
  Country?: string
  Latitude?: number
  Longitude?: number
  Directions?: string
  SubdivisionName?: string
  MLSAreaMajor?: string
  BedroomsTotal?: number
  BathroomsFull?: number
  BathroomsTotalInteger?: number
  BathroomsHalf?: number
  BathroomsThreeQuarter?: number
  LivingArea?: number
  LivingAreaUnits?: string
  LotSizeAcres?: number
  LotSizeSquareFeet?: number
  YearBuilt?: number
  Stories?: number
  GarageSpaces?: number
  CoveredSpaces?: number
  NewConstructionYN?: boolean
  PoolPrivateYN?: boolean
  SpaYN?: boolean
  WaterfrontYN?: boolean
  FireplaceYN?: boolean
  SeniorCommunityYN?: boolean
  HorseYN?: boolean
  GarageYN?: boolean
  AttachedGarageYN?: boolean
  HeatingYN?: boolean
  CoolingYN?: boolean
  AssociationYN?: boolean
  AssociationFee?: number
  AssociationFeeFrequency?: string
  PublicRemarks?: string
  VirtualTourURLUnbranded?: string
  Zoning?: string
  ListAgentFullName?: string
  ListAgentMlsId?: string
  ListAgentKey?: string
  ListOfficeKey?: string
  ListOfficeMlsId?: string
  ListOfficeName?: string
  TaxYear?: number
  TaxAnnualAmount?: number
  ParcelNumber?: string
  ElementarySchool?: string
  MiddleOrJuniorSchool?: string
  HighSchool?: string
  HighSchoolDistrict?: string
  PhotosCount?: number
  PhotosChangeTimestamp?: string
  Media?: MLSGridMedia[]
  Appliances?: string[]
  ArchitecturalStyle?: string[]
  Basement?: string[]
  ConstructionMaterials?: string[]
  Cooling?: string[]
  ExteriorFeatures?: string[]
  Fencing?: string[]
  Flooring?: string[]
  FoundationDetails?: string[]
  GreenEnergyEfficient?: string[]
  Heating?: string[]
  InteriorFeatures?: string[]
  LaundryFeatures?: string[]
  LotFeatures?: string[]
  ParkingFeatures?: string[]
  PatioAndPorchFeatures?: string[]
  PoolFeatures?: string[]
  PropertyCondition?: string[]
  Roof?: string[]
  Sewer?: string[]
  Utilities?: string[]
  View?: string[]
  WaterSource?: string[]
  WindowFeatures?: string[]
  MlgCanView?: boolean
  ModificationTimestamp?: string
  OriginatingSystemName?: string
}

interface MLSGridResponse {
  '@odata.context'?: string
  '@odata.nextLink'?: string
  '@odata.count'?: number
  value: MLSGridProperty[]
}

function parseDate(dateStr: string | undefined): Date | null {
  if (!dateStr) return null
  const date = new Date(dateStr)
  return isNaN(date.getTime()) ? null : date
}

const INT4_MAX = 2147483647
function safeInt(val: number | undefined): number | null {
  if (val === undefined || val === null) return null
  if (val > INT4_MAX || val < -INT4_MAX) return null
  return val
}

function transformPropertyToListing(property: MLSGridProperty) {
  return {
    listingKey: property.ListingKey,
    listingId: property.ListingId || null,
    mlsStatus: property.MlsStatus || null,
    standardStatus: property.StandardStatus || null,
    propertyType: property.PropertyType || null,
    propertySubType: property.PropertySubType || null,
    listPrice: property.ListPrice || null,
    originalListPrice: property.OriginalListPrice || null,
    closePrice: property.ClosePrice || null,
    closeDate: parseDate(property.CloseDate),
    listingContractDate: parseDate(property.ListingContractDate),
    statusChangeTimestamp: parseDate(property.StatusChangeTimestamp),
    priceChangeTimestamp: parseDate(property.PriceChangeTimestamp),
    daysOnMarket: safeInt(property.DaysOnMarket),
    unparsedAddress: property.UnparsedAddress || null,
    streetNumber: property.StreetNumber || null,
    streetName: property.StreetName || null,
    streetSuffix: property.StreetSuffix || null,
    streetDirPrefix: property.StreetDirPrefix || null,
    streetDirSuffix: property.StreetDirSuffix || null,
    unitNumber: property.UnitNumber || null,
    city: property.City || null,
    stateOrProvince: property.StateOrProvince || null,
    postalCode: property.PostalCode || null,
    countyOrParish: property.CountyOrParish || null,
    country: property.Country || null,
    latitude: property.Latitude || null,
    longitude: property.Longitude || null,
    directions: property.Directions || null,
    subdivisionName: property.SubdivisionName || null,
    mlsAreaMajor: property.MLSAreaMajor || null,
    bedroomsTotal: safeInt(property.BedroomsTotal),
    bathroomsFull: safeInt(property.BathroomsFull),
    bathroomsTotalInteger: safeInt(property.BathroomsTotalInteger),
    bathroomsHalf: safeInt(property.BathroomsHalf),
    bathroomsThreeQuarter: safeInt(property.BathroomsThreeQuarter),
    livingArea: safeInt(property.LivingArea),
    livingAreaUnits: property.LivingAreaUnits || null,
    lotSizeAcres: property.LotSizeAcres || null,
    lotSizeSquareFeet: property.LotSizeSquareFeet || null,
    yearBuilt: safeInt(property.YearBuilt),
    stories: safeInt(property.Stories),
    garageSpaces: safeInt(property.GarageSpaces),
    coveredSpaces: safeInt(property.CoveredSpaces),
    newConstructionYN: property.NewConstructionYN ?? false,
    poolPrivateYN: property.PoolPrivateYN ?? null,
    spaYN: property.SpaYN ?? null,
    waterfrontYN: property.WaterfrontYN ?? null,
    fireplaceYN: property.FireplaceYN ?? null,
    seniorCommunityYN: property.SeniorCommunityYN ?? null,
    horseYN: property.HorseYN ?? null,
    garageYN: property.GarageYN ?? null,
    attachedGarageYN: property.AttachedGarageYN ?? null,
    heatingYN: property.HeatingYN ?? null,
    coolingYN: property.CoolingYN ?? null,
    associationYN: property.AssociationYN ?? null,
    associationFee: safeInt(property.AssociationFee),
    associationFeeFrequency: property.AssociationFeeFrequency || null,
    publicRemarks: property.PublicRemarks || null,
    virtualTourURLUnbranded: property.VirtualTourURLUnbranded || null,
    zoning: property.Zoning || null,
    listAgentFullName: property.ListAgentFullName || null,
    listAgentMlsId: property.ListAgentMlsId || null,
    listAgentKey: property.ListAgentKey || null,
    listOfficeKey: property.ListOfficeKey || null,
    listOfficeMlsId: property.ListOfficeMlsId || null,
    listOfficeName: property.ListOfficeName || null,
    taxYear: safeInt(property.TaxYear),
    taxAnnualAmount: safeInt(property.TaxAnnualAmount),
    parcelNumber: property.ParcelNumber || null,
    elementarySchool: property.ElementarySchool || null,
    middleOrJuniorSchool: property.MiddleOrJuniorSchool || null,
    highSchool: property.HighSchool || null,
    highSchoolDistrict: property.HighSchoolDistrict || null,
    photosCount: safeInt(property.PhotosCount),
    photosChangeTimestamp: parseDate(property.PhotosChangeTimestamp),
    media: property.Media ? transformMedia(property.Media) : undefined,
    appliances: property.Appliances || [],
    architecturalStyle: property.ArchitecturalStyle || [],
    basement: property.Basement || [],
    constructionMaterials: property.ConstructionMaterials || [],
    cooling: property.Cooling || [],
    exteriorFeatures: property.ExteriorFeatures || [],
    fencing: property.Fencing || [],
    flooring: property.Flooring || [],
    foundationDetails: property.FoundationDetails || [],
    greenEnergyEfficient: property.GreenEnergyEfficient || [],
    heating: property.Heating || [],
    interiorFeatures: property.InteriorFeatures || [],
    laundryFeatures: property.LaundryFeatures || [],
    lotFeatures: property.LotFeatures || [],
    parkingFeatures: property.ParkingFeatures || [],
    patioAndPorchFeatures: property.PatioAndPorchFeatures || [],
    poolFeatures: property.PoolFeatures || [],
    propertyCondition: property.PropertyCondition || [],
    roof: property.Roof || [],
    sewer: property.Sewer || [],
    utilities: property.Utilities || [],
    view: property.View || [],
    waterSource: property.WaterSource || [],
    windowFeatures: property.WindowFeatures || [],
    mlgCanView: property.MlgCanView ?? true,
    modificationTimestamp: parseDate(property.ModificationTimestamp),
    originatingSystemName: property.OriginatingSystemName || null,
  }
}

function transformMedia(media: MLSGridMedia[]) {
  return media
    .sort((a, b) => (a.Order || 0) - (b.Order || 0))
    .map(m => ({
      MediaKey: m.MediaKey,
      MediaURL: m.MediaURL,
      Order: m.Order,
      ShortDescription: m.LongDescription,
      MediaObjectID: m.MediaKey,
      MimeType: 'image/jpeg',
    }))
}

async function fetchFromMLSGrid(url: string): Promise<MLSGridResponse> {
  const token = process.env.MLS_GRID_ACCESS_TOKEN
  if (!token) {
    throw new Error('MLS_GRID_ACCESS_TOKEN not configured')
  }

  const response = await fetch(url, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'Accept-Encoding': 'gzip',
    },
  })

  if (!response.ok) {
    const errorText = await response.text()
    throw new Error(`MLS Grid API error: ${response.status} - ${errorText}`)
  }

  return response.json()
}

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const secret = request.nextUrl.searchParams.get('secret')

    if (authHeader !== `Bearer ${process.env.CRON_SECRET}` && secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const mode = request.nextUrl.searchParams.get('mode') || 'incremental'
    const resetFullSync = request.nextUrl.searchParams.get('reset') === 'true'
    const isFullSync = mode === 'full'

    console.log(`Starting ${isFullSync ? 'full' : 'incremental'} sync from MLS Grid...`)

    let syncState = await prisma.syncState.findUnique({
      where: { id: 'mls-grid-sync' }
    })

    if (!syncState) {
      syncState = await prisma.syncState.create({
        data: { id: 'mls-grid-sync' }
      })
    }

    if (resetFullSync && isFullSync) {
      await prisma.syncState.update({
        where: { id: 'mls-grid-sync' },
        data: { fullSyncInProgress: false, fullSyncCursor: null }
      })
      syncState = { ...syncState, fullSyncInProgress: false, fullSyncCursor: null }
    }

    let baseFilter = `OriginatingSystemName eq '${ORIGINATING_SYSTEM}'`

    if (isFullSync) {
      baseFilter += ' and MlgCanView eq true'
      
      if (syncState.fullSyncCursor) {
        const cursor = syncState.fullSyncCursor.toISOString()
        baseFilter += ` and ModificationTimestamp gt ${cursor}`
      }
      
      if (!syncState.fullSyncInProgress) {
        await prisma.syncState.update({
          where: { id: 'mls-grid-sync' },
          data: { fullSyncInProgress: true }
        })
      }
    } else if (syncState.lastSyncTimestamp) {
      const timestamp = syncState.lastSyncTimestamp.toISOString()
      baseFilter += ` and ModificationTimestamp gt ${timestamp}`
    } else {
      baseFilter += ' and MlgCanView eq true'
    }

    let url = `${MLS_GRID_BASE_URL}/Property?$filter=${encodeURIComponent(baseFilter)}&$expand=Media&$top=${BATCH_SIZE}&$orderby=ModificationTimestamp`

    let totalProcessed = 0
    let totalUpserted = 0
    let totalDeleted = 0
    let latestTimestamp: Date | null = null
    let hasMoreData = false

    while (url && totalProcessed < MAX_RECORDS_PER_INVOCATION) {
      console.log(`Fetching batch from: ${url}`)

      const data = await fetchFromMLSGrid(url)
      const properties = data.value || []

      console.log(`Received ${properties.length} properties`)

      if (properties.length === 0) {
        break
      }

      const toUpsert: ReturnType<typeof transformPropertyToListing>[] = []
      const toDelete: string[] = []

      for (const property of properties) {
        const listingData = transformPropertyToListing(property)

        if (listingData.modificationTimestamp) {
          if (!latestTimestamp || listingData.modificationTimestamp > latestTimestamp) {
            latestTimestamp = listingData.modificationTimestamp
          }
        }

        if (!listingData.mlgCanView) {
          toDelete.push(listingData.listingKey)
        } else {
          toUpsert.push(listingData)
        }

        totalProcessed++
      }

      if (toDelete.length > 0) {
        const deleted = await prisma.listing.deleteMany({
          where: { listingKey: { in: toDelete } }
        })
        totalDeleted += deleted.count
      }

      if (toUpsert.length > 0) {
        const upsertOperations = toUpsert.map(listingData =>
          prisma.listing.upsert({
            where: { listingKey: listingData.listingKey },
            update: listingData,
            create: listingData,
          })
        )

        const UPSERT_CHUNK_SIZE = 50
        for (let i = 0; i < upsertOperations.length; i += UPSERT_CHUNK_SIZE) {
          const chunk = upsertOperations.slice(i, i + UPSERT_CHUNK_SIZE)
          await prisma.$transaction(chunk)
        }
        totalUpserted += toUpsert.length
      }

      const nextLink = data['@odata.nextLink']
      
      if (nextLink && totalProcessed < MAX_RECORDS_PER_INVOCATION) {
        url = nextLink
        await new Promise(resolve => setTimeout(resolve, 100))
      } else {
        hasMoreData = !!nextLink
        url = ''
      }
    }

    const totalListings = await prisma.listing.count({
      where: { mlgCanView: true }
    })

    if (isFullSync) {
      if (hasMoreData && latestTimestamp) {
        await prisma.syncState.update({
          where: { id: 'mls-grid-sync' },
          data: {
            fullSyncCursor: latestTimestamp,
            totalListings
          }
        })

        console.log(`Full sync in progress: processed ${totalProcessed} this invocation, cursor at ${latestTimestamp.toISOString()}`)

        return NextResponse.json({
          success: true,
          mode: 'full',
          status: 'in_progress',
          processed: totalProcessed,
          upserted: totalUpserted,
          deleted: totalDeleted,
          totalListings,
          hasMoreData: true,
          cursor: latestTimestamp.toISOString(),
          message: `Processed ${totalProcessed} records this invocation. Call again to continue.`
        })
      } else {
        await prisma.syncState.update({
          where: { id: 'mls-grid-sync' },
          data: {
            lastSyncTimestamp: latestTimestamp || new Date(),
            lastFullSyncAt: new Date(),
            fullSyncInProgress: false,
            fullSyncCursor: null,
            totalListings
          }
        })

        console.log(`Full sync complete: ${totalProcessed} records processed this invocation`)

        await triggerPropertyAlerts(request)

        return NextResponse.json({
          success: true,
          mode: 'full',
          status: 'complete',
          processed: totalProcessed,
          upserted: totalUpserted,
          deleted: totalDeleted,
          totalListings,
          hasMoreData: false,
          lastSyncTimestamp: latestTimestamp?.toISOString()
        })
      }
    } else {
      await prisma.syncState.update({
        where: { id: 'mls-grid-sync' },
        data: {
          lastSyncTimestamp: latestTimestamp || new Date(),
          totalListings
        }
      })

      console.log(`Incremental sync complete: ${totalProcessed} processed, ${totalUpserted} upserted, ${totalDeleted} deleted`)

      await triggerPropertyAlerts(request)

      return NextResponse.json({
        success: true,
        mode: 'incremental',
        processed: totalProcessed,
        upserted: totalUpserted,
        deleted: totalDeleted,
        totalListings,
        lastSyncTimestamp: latestTimestamp?.toISOString()
      })
    }
  } catch (error) {
    console.error('Sync error:', error)
    return NextResponse.json(
      { error: 'Sync failed', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

async function triggerPropertyAlerts(request: NextRequest) {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || `${request.nextUrl.protocol}//${request.nextUrl.host}`
    const alertsUrl = `${baseUrl}/api/send-property-alerts`

    console.log(`Triggering property alerts at ${alertsUrl}...`)

    const response = await fetch(alertsUrl, {
      headers: {
        'Authorization': `Bearer ${process.env.CRON_SECRET}`,
      },
    })

    const result = await response.json()

    if (response.ok) {
      console.log('Property alerts triggered successfully:', result)
    } else {
      console.error('Property alerts call returned error:', response.status, result)
    }
  } catch (error) {
    console.error('Failed to trigger property alerts (non-fatal):', error)
  }
}
