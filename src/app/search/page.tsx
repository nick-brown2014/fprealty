'use client'

import { useSearchParams } from 'next/navigation'
import Footer from "../components/Footer"
import Nav from "../components/Nav"

const Home = () => {
  const searchParams = useSearchParams()
  const location = searchParams.get('location')
  const mapUrl = `https://nocorealtor.idxbroker.com/idx/map/mapsearch?city=${!!location ? location : 'Fort%Collins'}`

  return (
    <div className='w-full h-full flex-col'>
      <Nav />
      <div className='pb-10 pt-4 flex flex-col w-[100vw] items-center'>
          <iframe src={mapUrl} width='98%' height={1000} />
          <div className='mt-8' />
          <Footer />
      </div>
    </div>
  )
}

export default Home
