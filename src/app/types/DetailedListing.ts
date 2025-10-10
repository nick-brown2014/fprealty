import { Media } from '../hooks/useMapDisplay'

export type DetailedListing = {
  // Core identification
  ListingKey: string
  ListingKeyNumeric: number
  ListingId: string
  SourceSystemKey: string

  // Pricing
  ListPrice: number
  OriginalListPrice?: number
  ClosePrice?: number

  // Address
  UnparsedAddress?: string
  StreetNumber?: string
  StreetName?: string
  StreetSuffix?: string
  StreetDirPrefix?: string | null
  StreetDirSuffix?: string | null
  StreetAdditionalInfo?: string | null
  UnitNumber?: string | null
  City: string
  StateOrProvince?: string
  PostalCode?: string
  PostalCodePlus4?: string | null
  CountyOrParish?: string
  Country?: string

  // Property basics
  PropertyType?: string
  PropertySubType: string
  PropertyCondition?: string[]
  BedroomsTotal: number
  BathroomsFull: number
  BathroomsTotalInteger?: number
  BathroomsHalf: number
  BathroomsThreeQuarter: number
  LivingArea: number
  LivingAreaUnits?: string
  BuildingAreaTotal?: number
  AboveGradeFinishedArea?: number
  BelowGradeFinishedArea?: number | null

  // Lot information
  LotSizeAcres?: number
  LotSizeSquareFeet?: number
  LotSizeArea?: number
  LotSizeUnits?: string
  LotFeatures?: string[]

  // Status
  MlsStatus: string
  StandardStatus?: string
  DaysOnMarket: number
  CumulativeDaysOnMarket?: number
  OnMarketDate?: string
  StatusChangeTimestamp?: string
  PendingTimestamp?: string | null
  CloseDate?: string | null
  ListingContractDate?: string
  PriceChangeTimestamp?: string

  // Location
  Latitude?: number
  Longitude?: number
  Directions?: string | null
  DirectionFaces?: string
  MLSAreaMajor?: string
  SubdivisionName?: string

  // Media
  PhotosCount: number
  Media?: Media[]
  PhotosChangeTimestamp?: string
  VirtualTourURLUnbranded?: string | null

  // Structure details
  YearBuilt?: number
  Stories?: number
  ArchitecturalStyle?: string[]
  ConstructionMaterials?: string[]
  FoundationDetails?: string[]
  Roof?: string[]
  NewConstructionYN: boolean

  // Room details
  RoomMasterBedroomLevel?: string
  RoomMasterBedroomLength?: number
  RoomMasterBedroomWidth?: number
  RoomMasterBedroomArea?: number
  RoomMasterBedroomFeatures?: string[]
  RoomMasterBathroomFeatures?: string[]

  RoomBedroom2Level?: string | null
  RoomBedroom2Length?: number | null
  RoomBedroom2Width?: number | null
  RoomBedroom2Area?: number | null
  RoomBedroom2Features?: string[]

  RoomBedroom3Level?: string | null
  RoomBedroom3Length?: number | null
  RoomBedroom3Width?: number | null
  RoomBedroom3Area?: number | null
  RoomBedroom3Features?: string[]

  RoomBedroom4Level?: string | null
  RoomBedroom4Length?: number | null
  RoomBedroom4Width?: number | null
  RoomBedroom4Area?: number | null
  RoomBedroom4Features?: string[]

  RoomBedroom5Level?: string | null
  RoomBedroom5Length?: number | null
  RoomBedroom5Width?: number | null
  RoomBedroom5Area?: number | null
  RoomBedroom5Features?: string[]

  RoomBedroomLevel?: string | null
  RoomBedroomLength?: number | null
  RoomBedroomWidth?: number | null
  RoomBedroomArea?: number | null
  RoomBedroomFeatures?: string[]

  RoomLivingRoomLevel?: string | null
  RoomLivingRoomLength?: number | null
  RoomLivingRoomWidth?: number | null
  RoomLivingRoomArea?: number | null
  RoomLivingRoomFeatures?: string[]

  RoomKitchenLevel?: string
  RoomKitchenLength?: number
  RoomKitchenWidth?: number
  RoomKitchenArea?: number
  RoomKitchenFeatures?: string[]

  RoomDiningRoomLevel?: string | null
  RoomDiningRoomLength?: number | null
  RoomDiningRoomWidth?: number | null
  RoomDiningRoomArea?: number | null
  RoomDiningRoomFeatures?: string[]

  RoomFamilyRoomLevel?: string | null
  RoomFamilyRoomLength?: number | null
  RoomFamilyRoomWidth?: number | null
  RoomFamilyRoomArea?: number | null
  RoomFamilyRoomFeatures?: string[]

  // Features and amenities
  Appliances?: string[]
  LaundryFeatures?: string[]
  Basement?: string[]
  Flooring?: string[]
  InteriorFeatures?: string[]
  ExteriorFeatures?: string[]
  PatioAndPorchFeatures?: string[]
  WindowFeatures?: string[]
  DoorFeatures?: string[]
  FireplaceYN: boolean
  FireplaceFeatures?: string[]

  // Utilities
  Heating?: string[]
  HeatingYN: boolean
  Cooling?: string[]
  CoolingYN: boolean | null
  WaterSource?: string[]
  Sewer?: string[]
  Electric?: string[]
  Gas?: string[]
  Utilities?: string[]

  // Garage and parking
  GarageYN: boolean
  AttachedGarageYN: boolean
  GarageSpaces: number
  CoveredSpaces: number
  ParkingFeatures?: string[]

  // Green/Energy features
  GreenEnergyGeneration?: string[]
  GreenEnergyEfficient?: string[]
  GreenWaterConservation?: string[]
  GreenBuildingVerificationType?: string[]

  // HOA
  AssociationYN: boolean
  AssociationFee?: number
  AssociationFeeFrequency?: string
  AssociationFee2?: number | null
  AssociationFee2Frequency?: string | null
  AssociationFeeIncludes?: string[]

  // Schools
  ElementarySchool?: string
  MiddleOrJuniorSchool?: string
  HighSchool?: string
  HighSchoolDistrict?: string

  // Other
  PublicRemarks?: string
  BuilderName?: string | null
  Zoning?: string
  View?: string[]
  Fencing?: string[]
  PoolPrivateYN: boolean | null
  PoolFeatures?: string[]
  SpaYN: boolean
  SpaFeatures?: string[]
  WaterfrontYN: boolean
  WaterfrontFeatures?: string[]
  HorseYN: boolean
  HorseAmenities?: string[]
  SeniorCommunityYN: boolean

  // Agent information
  ListAgentFullName?: string
  ListAgentMlsId?: string
  ListAgentKey?: string
  ListAgentKeyNumeric?: number
  ListOfficeKey?: string
  ListOfficeMlsId?: string

  BuyerAgentFullName?: string | null
  BuyerAgentMlsId?: string | null
  BuyerAgentKey?: string | null
  BuyerAgentKeyNumeric?: number | null
  BuyerOfficeMlsId?: string | null

  CoListAgentFullName?: string | null
  CoListAgentMlsId?: string | null
  CoListAgentKey?: string | null
  CoListAgentKeyNumeric?: number | null
  CoListOfficeKey?: string | null
  CoListOfficeMlsId?: string | null
  CoListOfficeKeyNumeric?: number | null

  // Tax information
  TaxYear?: number
  TaxAnnualAmount?: number | null
  ParcelNumber?: string

  // Display settings
  InternetAddressDisplayYN: boolean
  InternetEntireListingDisplayYN: boolean
  InternetAutomatedValuationDisplayYN: boolean
  InternetConsumerCommentYN: boolean
  IDXParticipationYN: boolean

  // Metadata
  ModificationTimestamp?: string
  BridgeModificationTimestamp?: string
  OriginatingSystemName?: string
  OriginatingSystemKey?: string | null

  // Custom/computed fields
  streetAddress?: string
}
