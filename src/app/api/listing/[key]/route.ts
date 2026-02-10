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

function transformDetailedListing(listing: Prisma.ListingGetPayload<object>) {
  const media = listing.media as MediaItem[] | null
  return {
    ListingKey: listing.listingKey,
    ListingId: listing.listingId,
    ListPrice: bigIntToNumber(listing.listPrice) ?? 0,
    OriginalListPrice: bigIntToNumber(listing.originalListPrice),
    ClosePrice: bigIntToNumber(listing.closePrice),
    CloseDate: listing.closeDate?.toISOString() ?? null,
    ListingContractDate: listing.listingContractDate?.toISOString() ?? null,
    StatusChangeTimestamp: listing.statusChangeTimestamp?.toISOString() ?? null,
    PriceChangeTimestamp: listing.priceChangeTimestamp?.toISOString() ?? null,
    City: listing.city ?? '',
    StateOrProvince: listing.stateOrProvince,
    PostalCode: listing.postalCode,
    CountyOrParish: listing.countyOrParish,
    Country: listing.country,
    UnparsedAddress: listing.unparsedAddress,
    StreetNumber: listing.streetNumber,
    StreetName: listing.streetName,
    StreetSuffix: listing.streetSuffix,
    StreetDirPrefix: listing.streetDirPrefix,
    StreetDirSuffix: listing.streetDirSuffix,
    UnitNumber: listing.unitNumber,
    PropertyType: listing.propertyType,
    PropertySubType: listing.propertySubType ?? '',
    BedroomsTotal: listing.bedroomsTotal ?? 0,
    BathroomsFull: listing.bathroomsFull ?? 0,
    BathroomsTotalInteger: listing.bathroomsTotalInteger,
    BathroomsHalf: listing.bathroomsHalf ?? 0,
    BathroomsThreeQuarter: listing.bathroomsThreeQuarter ?? 0,
    LivingArea: listing.livingArea ?? 0,
    LivingAreaUnits: listing.livingAreaUnits,
    LotSizeAcres: listing.lotSizeAcres,
    LotSizeSquareFeet: listing.lotSizeSquareFeet,
    MlsStatus: listing.mlsStatus ?? '',
    DaysOnMarket: listing.daysOnMarket ?? 0,
    Latitude: listing.latitude,
    Longitude: listing.longitude,
    Directions: listing.directions,
    SubdivisionName: listing.subdivisionName,
    MLSAreaMajor: listing.mlsAreaMajor,
    PhotosCount: listing.photosCount ?? 0,
    PhotosChangeTimestamp: listing.photosChangeTimestamp?.toISOString() ?? null,
    Media: media ?? undefined,
    VirtualTourURLUnbranded: listing.virtualTourURLUnbranded,
    YearBuilt: listing.yearBuilt,
    Stories: listing.stories,
    ArchitecturalStyle: listing.architecturalStyle,
    ConstructionMaterials: listing.constructionMaterials,
    FoundationDetails: listing.foundationDetails,
    Roof: listing.roof,
    NewConstructionYN: listing.newConstructionYN,
    GarageSpaces: listing.garageSpaces ?? 0,
    CoveredSpaces: listing.coveredSpaces ?? 0,
    GarageYN: listing.garageYN ?? false,
    AttachedGarageYN: listing.attachedGarageYN ?? false,
    ParkingFeatures: listing.parkingFeatures,
    Appliances: listing.appliances,
    LaundryFeatures: listing.laundryFeatures,
    Basement: listing.basement,
    Flooring: listing.flooring,
    InteriorFeatures: listing.interiorFeatures,
    ExteriorFeatures: listing.exteriorFeatures,
    PatioAndPorchFeatures: listing.patioAndPorchFeatures,
    WindowFeatures: listing.windowFeatures,
    FireplaceYN: listing.fireplaceYN ?? false,
    Heating: listing.heating,
    HeatingYN: listing.heatingYN ?? false,
    Cooling: listing.cooling,
    CoolingYN: listing.coolingYN,
    WaterSource: listing.waterSource,
    Sewer: listing.sewer,
    Utilities: listing.utilities,
    PoolPrivateYN: listing.poolPrivateYN,
    PoolFeatures: listing.poolFeatures,
    SpaYN: listing.spaYN ?? false,
    WaterfrontYN: listing.waterfrontYN ?? false,
    HorseYN: listing.horseYN ?? false,
    SeniorCommunityYN: listing.seniorCommunityYN ?? false,
    Fencing: listing.fencing,
    View: listing.view,
    GreenEnergyEfficient: listing.greenEnergyEfficient,
    AssociationYN: listing.associationYN ?? false,
    AssociationFee: listing.associationFee,
    AssociationFeeFrequency: listing.associationFeeFrequency,
    ElementarySchool: listing.elementarySchool,
    MiddleOrJuniorSchool: listing.middleOrJuniorSchool,
    HighSchool: listing.highSchool,
    HighSchoolDistrict: listing.highSchoolDistrict,
    PublicRemarks: listing.publicRemarks,
    Zoning: listing.zoning,
    ListAgentFullName: listing.listAgentFullName,
    ListAgentMlsId: listing.listAgentMlsId,
    ListAgentKey: listing.listAgentKey,
    ListOfficeKey: listing.listOfficeKey,
    ListOfficeMlsId: listing.listOfficeMlsId,
    ListOfficeName: listing.listOfficeName,
    TaxYear: listing.taxYear,
    TaxAnnualAmount: listing.taxAnnualAmount,
    ParcelNumber: listing.parcelNumber,
    ModificationTimestamp: listing.modificationTimestamp?.toISOString() ?? null,
    OriginatingSystemName: listing.originatingSystemName,
    LotFeatures: listing.lotFeatures,
    PropertyCondition: listing.propertyCondition,
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params

    const listing = await prisma.listing.findUnique({
      where: { listingKey: key },
    })

    if (!listing) {
      return NextResponse.json(
        { success: false, error: 'Listing not found' },
        { status: 404 }
      )
    }

    const bundle = transformDetailedListing(listing)

    return NextResponse.json({
      success: true,
      status: 200,
      bundle,
    })
  } catch (error) {
    console.error('Listing detail API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch listing', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
