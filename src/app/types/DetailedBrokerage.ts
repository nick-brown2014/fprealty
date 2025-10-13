import { Media } from '../hooks/useMapDisplay'

export interface DetailedBrokerage {
  OfficeFax: string
  OfficePhone: string
  OfficeKeyNumeric: number
  OfficeKey: string
  BridgeModificationTimestamp: string
  OfficeStatus: string
  OriginatingSystemName: string
  IRESDS_OfficeLogo: string
  OfficeCity: string
  SocialMediaWebsiteUrlOrId: string
  IRESDS_ManagerName: string
  ModificationTimestamp: string
  OfficeStateOrProvince: string
  Media: Media[]
  OfficePostalCodePlus4: string | null
  OriginatingSystemID: string | null
  OfficeAddress2: string | null
  OfficeAddress1: string
  OriginatingSystemOfficeKey: string
  IRESDS_TollFreeNumber: string | null
  OfficeEmail: string | null
  IRESDS_ManagerFirstName: string
  OfficeMlsId: string
  IRESDS_ManagerLastName: string
  OfficePostalCode: string
  OfficeName: string
  FeedTypes: Media[]
  url: string
}
