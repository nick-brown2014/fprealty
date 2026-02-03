-- CreateTable
CREATE TABLE "Listing" (
    "listingKey" TEXT NOT NULL,
    "listingId" TEXT,
    "mlsStatus" TEXT,
    "standardStatus" TEXT,
    "propertyType" TEXT,
    "propertySubType" TEXT,
    "listPrice" INTEGER,
    "originalListPrice" INTEGER,
    "closePrice" INTEGER,
    "closeDate" TIMESTAMP(3),
    "listingContractDate" TIMESTAMP(3),
    "statusChangeTimestamp" TIMESTAMP(3),
    "priceChangeTimestamp" TIMESTAMP(3),
    "daysOnMarket" INTEGER,
    "unparsedAddress" TEXT,
    "streetNumber" TEXT,
    "streetName" TEXT,
    "streetSuffix" TEXT,
    "streetDirPrefix" TEXT,
    "streetDirSuffix" TEXT,
    "unitNumber" TEXT,
    "city" TEXT,
    "stateOrProvince" TEXT,
    "postalCode" TEXT,
    "countyOrParish" TEXT,
    "country" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "directions" TEXT,
    "subdivisionName" TEXT,
    "mlsAreaMajor" TEXT,
    "bedroomsTotal" INTEGER,
    "bathroomsFull" INTEGER,
    "bathroomsTotalInteger" INTEGER,
    "bathroomsHalf" INTEGER,
    "bathroomsThreeQuarter" INTEGER,
    "livingArea" INTEGER,
    "livingAreaUnits" TEXT,
    "lotSizeAcres" DOUBLE PRECISION,
    "lotSizeSquareFeet" DOUBLE PRECISION,
    "yearBuilt" INTEGER,
    "stories" INTEGER,
    "garageSpaces" INTEGER,
    "coveredSpaces" INTEGER,
    "newConstructionYN" BOOLEAN NOT NULL DEFAULT false,
    "poolPrivateYN" BOOLEAN,
    "spaYN" BOOLEAN,
    "waterfrontYN" BOOLEAN,
    "fireplaceYN" BOOLEAN,
    "seniorCommunityYN" BOOLEAN,
    "horseYN" BOOLEAN,
    "garageYN" BOOLEAN,
    "attachedGarageYN" BOOLEAN,
    "heatingYN" BOOLEAN,
    "coolingYN" BOOLEAN,
    "associationYN" BOOLEAN,
    "associationFee" INTEGER,
    "associationFeeFrequency" TEXT,
    "publicRemarks" TEXT,
    "virtualTourURLUnbranded" TEXT,
    "zoning" TEXT,
    "listAgentFullName" TEXT,
    "listAgentMlsId" TEXT,
    "listAgentKey" TEXT,
    "listOfficeKey" TEXT,
    "listOfficeMlsId" TEXT,
    "listOfficeName" TEXT,
    "taxYear" INTEGER,
    "taxAnnualAmount" INTEGER,
    "parcelNumber" TEXT,
    "elementarySchool" TEXT,
    "middleOrJuniorSchool" TEXT,
    "highSchool" TEXT,
    "highSchoolDistrict" TEXT,
    "photosCount" INTEGER,
    "photosChangeTimestamp" TIMESTAMP(3),
    "media" JSONB,
    "appliances" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "architecturalStyle" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "basement" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "constructionMaterials" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "cooling" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "exteriorFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "fencing" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "flooring" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "foundationDetails" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "greenEnergyEfficient" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "heating" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "interiorFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "laundryFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "lotFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "parkingFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "patioAndPorchFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "poolFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "propertyCondition" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "roof" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "sewer" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "utilities" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "view" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "waterSource" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "windowFeatures" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "mlgCanView" BOOLEAN NOT NULL DEFAULT true,
    "modificationTimestamp" TIMESTAMP(3),
    "originatingSystemName" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Listing_pkey" PRIMARY KEY ("listingKey")
);

-- CreateTable
CREATE TABLE "SyncState" (
    "id" TEXT NOT NULL DEFAULT 'mls-grid-sync',
    "lastSyncTimestamp" TIMESTAMP(3),
    "lastFullSyncAt" TIMESTAMP(3),
    "totalListings" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SyncState_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Listing_mlsStatus_idx" ON "Listing"("mlsStatus");

-- CreateIndex
CREATE INDEX "Listing_standardStatus_idx" ON "Listing"("standardStatus");

-- CreateIndex
CREATE INDEX "Listing_propertyType_idx" ON "Listing"("propertyType");

-- CreateIndex
CREATE INDEX "Listing_listPrice_idx" ON "Listing"("listPrice");

-- CreateIndex
CREATE INDEX "Listing_bedroomsTotal_idx" ON "Listing"("bedroomsTotal");

-- CreateIndex
CREATE INDEX "Listing_bathroomsTotalInteger_idx" ON "Listing"("bathroomsTotalInteger");

-- CreateIndex
CREATE INDEX "Listing_latitude_idx" ON "Listing"("latitude");

-- CreateIndex
CREATE INDEX "Listing_longitude_idx" ON "Listing"("longitude");

-- CreateIndex
CREATE INDEX "Listing_city_idx" ON "Listing"("city");

-- CreateIndex
CREATE INDEX "Listing_mlgCanView_idx" ON "Listing"("mlgCanView");

-- CreateIndex
CREATE INDEX "Listing_modificationTimestamp_idx" ON "Listing"("modificationTimestamp");

-- CreateIndex
CREATE INDEX "Listing_listingContractDate_idx" ON "Listing"("listingContractDate");
