'use client'

import Footer from "../components/Footer"
import Nav from "../components/Nav"

const Home = () => (
  <div className='w-full h-full flex-col'>
    <Nav />
    <div className='pb-10 pt-4 flex flex-col w-[100vw] items-center'>
        <iframe src='https://nocorealtor.idxbroker.com/idx/map/mapsearch' width='98%' height={1000} />
        <div className='mt-8' />
        <Footer />
    </div>
  </div>
)

export default Home
