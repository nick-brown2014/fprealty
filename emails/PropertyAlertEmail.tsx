import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import * as React from 'react'

interface PropertyAlertEmailProps {
  userName: string
  searchResults: Array<{
    searchName: string
    properties: Array<{
      address: string
      price: number
      beds: number
      baths: number
      sqft: number
      imageUrl?: string
      listingUrl: string
    }>
  }>
}

export const PropertyAlertEmail = ({
  userName = 'Valued Client',
  searchResults = [],
}: PropertyAlertEmailProps) => {
  const totalProperties = searchResults.reduce((sum, result) => sum + result.properties.length, 0)

  return (
    <Html>
      <Head />
      <Preview>{String(totalProperties)} new listing{totalProperties === 1 ? '' : 's'} just hit the market!</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Listings Alert</Heading>
          <Text style={text}>Hi {userName},</Text>
          <Text style={text}>
            Great news! We found {totalProperties} new {totalProperties === 1 ? 'listing' : 'listings'} from yesterday matching your saved {searchResults.length === 1 ? 'search' : 'searches'}:
          </Text>

          {searchResults.map((result, resultIndex) => (
            <React.Fragment key={resultIndex}>
              {searchResults.length > 1 && (
                <Heading style={searchHeading}>
                  {result.searchName} ({result.properties.length} {result.properties.length === 1 ? 'property' : 'properties'})
                </Heading>
              )}

              {result.properties.map((property, propIndex) => (
                <Section key={`${resultIndex}-${propIndex}`} style={propertyCard}>
                  {property.imageUrl && (
                    <Img
                      src={property.imageUrl}
                      alt={property.address}
                      style={propertyImage}
                    />
                  )}
                  <Heading style={propertyAddress}>{property.address}</Heading>
                  <Text style={propertyPrice}>${property.price.toLocaleString()}</Text>
                  <Text style={propertyDetails}>
                    {property.beds} beds • {property.baths} baths • {property.sqft.toLocaleString()} sqft
                  </Text>
                  <Button style={button} href={property.listingUrl}>
                    View Details
                  </Button>
                </Section>
              ))}
            </React.Fragment>
          ))}

          <Text style={footer}>
            This email was sent because you opted in to receive property alerts from Fred Porter Realty.
            To unsubscribe, please visit your account settings.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

export default PropertyAlertEmail

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
}

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  minWidth: '80%',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const text = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
}

const propertyCard = {
  margin: '24px auto',
  padding: '24px',
  border: '1px solid #e6e6e6',
  borderRadius: '8px',
  backgroundColor: '#ffffff',
  width: '37.5em',
  maxWidth: '90%',
}

const propertyImage = {
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
  marginBottom: '16px',
}

const propertyAddress = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '0 0 8px 0',
}

const propertyPrice = {
  color: '#0066cc',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '0 0 12px 0',
}

const propertyDetails = {
  color: '#666',
  fontSize: '16px',
  margin: '0 0 16px 0',
}

const button = {
  backgroundColor: '#0066cc',
  borderRadius: '5px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  width: '100%',
  padding: '12px',
}

const searchHeading = {
  color: '#555',
  fontSize: '18px',
  fontWeight: 'bold',
  margin: '32px 40px 16px 40px',
  padding: '0',
}

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  marginTop: '32px',
}