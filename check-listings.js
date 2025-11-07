const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  // First, list all users to find the right email
  const allUsers = await prisma.user.findMany({
    select: { id: true, email: true, firstName: true, lastName: true }
  });

  console.log('Available users:');
  allUsers.forEach(u => console.log(`  - ${u.email} (${u.firstName} ${u.lastName})`));
  console.log('');

  // Get Nick's user and saved searches
  let user = await prisma.user.findUnique({
    where: { email: 'nick.brown2014@gmail.com' },
    include: {
      savedSearches: true
    }
  });

  if (!user) {
    console.log('No users with emailOptIn found');
    return;
  }

  console.log(`Found user: ${user.firstName} ${user.lastName}`);
  console.log(`Email: ${user.email}`);
  console.log(`Saved searches: ${user.savedSearches.length}\n`);

  // Calculate yesterday's date
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayFormatted = yesterday.toISOString().split('T')[0];
  console.log(`Checking for listings with ListingContractDate = ${yesterdayFormatted}\n`);

  const apiToken = process.env.NEXT_PUBLIC_BROWSER_TOKEN;
  let totalListings = 0;

  // Query each saved search
  for (const savedSearch of user.savedSearches) {
    console.log(`\n--- ${savedSearch.name} ---`);

    // Build filters
    const filters = {
      limit: 100,
      offset: 0,
      fields: 'ListingKey,ListPrice,UnparsedAddress,BedroomsTotal,BathroomsTotalInteger,LivingArea,ListingContractDate'
    };

    // Use bounds if available
    if (savedSearch.bounds) {
      filters['Latitude.gte'] = savedSearch.bounds.south;
      filters['Latitude.lte'] = savedSearch.bounds.north;
      filters['Longitude.gte'] = savedSearch.bounds.west;
      filters['Longitude.lte'] = savedSearch.bounds.east;
    } else if (savedSearch.searchQuery) {
      filters.near = savedSearch.searchQuery;
      filters.radius = 4;
    }

    // Price filters
    if (savedSearch.minPrice) filters['ListPrice.gte'] = savedSearch.minPrice;
    if (savedSearch.maxPrice) filters['ListPrice.lte'] = savedSearch.maxPrice;

    // Bedroom/bathroom filters
    if (savedSearch.minBeds) filters['BedroomsTotal.gte'] = savedSearch.minBeds;
    if (savedSearch.minBaths) filters['BathroomsTotalInteger.gte'] = savedSearch.minBaths;

    // Property types
    const propertySubTypes = [...(savedSearch.propertyTypes || [])];
    if (savedSearch.includeLand) {
      propertySubTypes.push('Unimproved Land');
    }
    if (propertySubTypes.length > 0) {
      filters['PropertySubType.in'] = propertySubTypes.join(',');
    }

    // PropertyType
    if (savedSearch.includeLand) {
      filters['PropertyType.in'] = 'Residential,Land';
    } else {
      filters['PropertyType.in'] = 'Residential';
    }

    // Status filter
    if (savedSearch.statuses && savedSearch.statuses.length > 0) {
      filters['StandardStatus.in'] = savedSearch.statuses.join(',');
    } else {
      filters['StandardStatus.in'] = 'Active';
    }

    // Add yesterday's date filter
    filters['ListingContractDate'] = yesterdayFormatted;

    // Build query string
    const queryString = Object.entries(filters)
      .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`)
      .join('&');

    const apiUrl = `https://api.bridgedataoutput.com/api/v2/iresds/listings?access_token=${apiToken}&${queryString}`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const listings = data.bundle || [];

      console.log(`Found ${listings.length} listings`);
      totalListings += listings.length;

      // Show first few listings
      if (listings.length > 0) {
        console.log('Sample listings:');
        listings.slice(0, 3).forEach(listing => {
          console.log(`  - ${listing.UnparsedAddress}: $${listing.ListPrice?.toLocaleString()} (Contract: ${listing.ListingContractDate})`);
        });
      }
    } catch (error) {
      console.error(`Error fetching listings: ${error.message}`);
    }
  }

  console.log(`\n=== TOTAL: ${totalListings} listings across all saved searches ===`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
