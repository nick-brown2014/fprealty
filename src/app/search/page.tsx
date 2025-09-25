'use client'

import { useSearchParams } from 'next/navigation'
import Footer from "../components/Footer"
import Nav from "../components/Nav"

const Search = () => {
  const searchParams = useSearchParams()
  const location = searchParams.get('location')
  const mapUrl = location? `https://nocorealtor.idxbroker.com/i/${location}` : 'https://nocorealtor.idxbroker.com/idx/map/mapsearch'

  return (
    <div className='w-full h-full flex-col'>
      <Nav />
      <div className='pb-10 pt-4 flex flex-col w-[100vw] pl-4 md:pl-0 md:items-center'>
          <iframe src={mapUrl} width='90%' height={1000} />
          <div className='mt-8' />
          <Footer />
      </div>
    </div>
  )
}

export default Search
