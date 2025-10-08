'use client'

import { useMapsLibrary } from '@vis.gl/react-google-maps'

type PlacesAutocompleteProps = {
  value: string
  onPlaceSelect: (place: string) => void
}

const PlacesAutocomplete = ({ onPlaceSelect }: PlacesAutocompleteProps) => {
  useMapsLibrary('places')

  async function handlePlaceSelect(place: google.maps.places.Place) {
    await place.fetchFields({
      fields: ['displayName', 'formattedAddress', 'location', 'addressComponents']
    })

    const address = place.formattedAddress || place.displayName
    onPlaceSelect(address ?? '')
  }

  return (
    <div className='flex-1'>
      <style jsx global>{`
        gmp-place-autocomplete {
          width: 100%;
          border: 1px solid #e2e8f0;
          border-radius: 0.375rem;
          font-size: 1rem;
          outline: none;
          color-scheme: light;
        }
      `}</style>
      <gmp-place-autocomplete
        placeholder='Search by city, address, or ZIP...'
        // @ts-ignore
        ongmp-select={(ev: any) =>
          void handlePlaceSelect(ev.placePrediction?.toPlace?.() || ev.place)
        }
        // @ts-ignore
        ongmp-placeselect={(ev: any) => void handlePlaceSelect(ev.place)}
      />
    </div>
  )
}

// Declare the custom element for TypeScript
declare module 'react' {
  namespace JSX {
    interface IntrinsicElements {
      'gmp-place-autocomplete': React.DetailedHTMLProps<
        React.HTMLAttributes<HTMLElement> & {
          placeholder?: string
        },
        HTMLElement
      >
    }
  }
}

export default PlacesAutocomplete
