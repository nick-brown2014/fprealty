import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { Listing as PrismaListing } from '@prisma/client'

function transformListingToDetailedListing(listing: PrismaListing) {
  const media = listing.media as Array<{ MediaURL: string; MediaObjectID: string; Order: number; MimeType: string; ShortDescription?: string }> | null

  return {
    ListingKey: listing.listingKey,
    ListingId: listing.listingId ?? '',
    ListPrice: Number(listing.listPrice ?? 0),
    OriginalListPrice: listing.originalListPrice ? Number(listing.originalListPrice) : undefined,
    ClosePrice: listing.closePrice ? Number(listing.closePrice) : undefined,
    CloseDate: listing.closeDate?.toISOString() ?? null,
    ListingContractDate: listing.listingContractDate?.toISOString(),
    StatusChangeTimestamp: listing.statusChangeTimestamp?.toISOString(),
    PriceChangeTimestamp: listing.priceChangeTimestamp?.toISOString(),

    UnparsedAddress: listing.unparsedAddress ?? undefined,
    StreetNumber: listing.streetNumber ?? undefined,
    StreetName: listing.streetName ?? undefined,
    StreetSuffix: listing.streetSuffix ?? undefined,
    StreetDirPrefix: listing.streetDirPrefix ?? null,
    StreetDirSuffix: listing.streetDirSuffix ?? null,
    UnitNumber: listing.unitNumber ?? null,
    City: listing.city ?? '',
    StateOrProvince: listing.stateOrProvince ?? undefined,
    PostalCode: listing.postalCode ?? undefined,
    CountyOrParish: listing.countyOrParish ?? undefined,
    Country: listing.country ?? undefined,

    PropertyType: listing.propertyType ?? undefined,
    PropertySubType: listing.propertySubType ?? '',
    BedroomsTotal: listing.bedroomsTotal ?? 0,
    BathroomsFull: listing.bathroomsFull ?? 0,
    BathroomsTotalInteger: listing.bathroomsTotalInteger ?? undefined,
    BathroomsHalf: listing.bathroomsHalf ?? 0,
    BathroomsThreeQuarter: listing.bathroomsThreeQuarter ?? 0,
    LivingArea: listing.livingArea ?? 0,
    LivingAreaUnits: listing.livingAreaUnits ?? undefined,

    LotSizeAcres: listing.lotSizeAcres ?? undefined,
    LotSizeSquareFeet: listing.lotSizeSquareFeet ?? undefined,
    LotFeatures: listing.lotFeatures,

    MlsStatus: listing.mlsStatus ?? '',
    DaysOnMarket: listing.daysOnMarket ?? 0,

    Latitude: listing.latitude ?? undefined,
    Longitude: listing.longitude ?? undefined,
    Directions: listing.directions ?? null,
    MLSAreaMajor: listing.mlsAreaMajor ?? undefined,
    SubdivisionName: listing.subdivisionName ?? undefined,

    PhotosCount: listing.photosCount ?? 0,
    Media: media ?? undefined,
    PhotosChangeTimestamp: listing.photosChangeTimestamp?.toISOString(),
    VirtualTourURLUnbranded: listing.virtualTourURLUnbranded ?? null,

    YearBuilt: listing.yearBuilt ?? undefined,
    Stories: listing.stories ?? undefined,
    ArchitecturalStyle: listing.architecturalStyle,
    ConstructionMaterials: listing.constructionMaterials,
    FoundationDetails: listing.foundationDetails,
    Roof: listing.roof,
    NewConstructionYN: listing.newConstructionYN,

    Appliances: listing.appliances,
    LaundryFeatures: listing.laundryFeatures,
    Basement: listing.basement,
    Flooring: listing.flooring,
    InteriorFeatures: listing.interiorFeatures,
    ExteriorFeatures: listing.exteriorFeatures,
    PatioAndPorchFeatures: listing.patioAndPorchFeatures,
    WindowFeatures: listing.windowFeatures,

    FireplaceYN: listing.fireplaceYN ?? false,
    HeatingYN: listing.heatingYN ?? false,
    Heating: listing.heating,
    CoolingYN: listing.coolingYN ?? null,
    Cooling: listing.cooling,
    WaterSource: listing.waterSource,
    Sewer: listing.sewer,
    Utilities: listing.utilities,

    GarageYN: listing.garageYN ?? false,
    AttachedGarageYN: listing.attachedGarageYN ?? false,
    GarageSpaces: listing.garageSpaces ?? 0,
    CoveredSpaces: listing.coveredSpaces ?? 0,
    ParkingFeatures: listing.parkingFeatures,

    GreenEnergyEfficient: listing.greenEnergyEfficient,

    AssociationYN: listing.associationYN ?? false,
    AssociationFee: listing.associationFee ?? undefined,
    AssociationFeeFrequency: listing.associationFeeFrequency ?? undefined,

    ElementarySchool: listing.elementarySchool ?? undefined,
    MiddleOrJuniorSchool: listing.middleOrJuniorSchool ?? undefined,
    HighSchool: listing.highSchool ?? undefined,
    HighSchoolDistrict: listing.highSchoolDistrict ?? undefined,

    PublicRemarks: listing.publicRemarks ?? undefined,
    Zoning: listing.zoning ?? undefined,
    View: listing.view,
    Fencing: listing.fencing,
    PoolPrivateYN: listing.poolPrivateYN ?? null,
    PoolFeatures: listing.poolFeatures,
    SpaYN: listing.spaYN ?? false,
    WaterfrontYN: listing.waterfrontYN ?? false,
    HorseYN: listing.horseYN ?? false,
    SeniorCommunityYN: listing.seniorCommunityYN ?? false,

    ListAgentFullName: listing.listAgentFullName ?? undefined,
    ListAgentMlsId: listing.listAgentMlsId ?? undefined,
    ListAgentKey: listing.listAgentKey ?? undefined,
    ListOfficeKey: listing.listOfficeKey ?? undefined,
    ListOfficeMlsId: listing.listOfficeMlsId ?? undefined,

    TaxYear: listing.taxYear ?? undefined,
    TaxAnnualAmount: listing.taxAnnualAmount ?? null,
    ParcelNumber: listing.parcelNumber ?? undefined,

    ModificationTimestamp: listing.modificationTimestamp?.toISOString(),
    OriginatingSystemName: listing.originatingSystemName ?? undefined,

    ListOfficeName: listing.listOfficeName ?? undefined,
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  if (!id) {
    return NextResponse.json({ error: 'Listing ID is required' }, { status: 400 })
  }

  try {
    const listing = await prisma.listing.findUnique({
      where: { listingKey: id },
    })

    if (!listing) {
      return NextResponse.json({ error: 'Listing not found' }, { status: 404 })
    }

    const transformed = transformListingToDetailedListing(listing)

    return NextResponse.json(transformed)
  } catch (error) {
    console.error('Error fetching listing:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
