'use client'

import Footer from "../components/Footer"
import Nav from "../components/Nav"
import { useEffect } from "react"

const Home = () => {

  useEffect(() => {
    const mapScript = document.createElement('script')
    mapScript.src = '//nocorealtor.idxbroker.com/idx/widgets/108423'
    mapScript.id = 'idxwidgetsrc-108423'
    mapScript.type = 'text/javascript'
    mapScript.async = true
    document.getElementById('find-map-widget')?.appendChild(mapScript)

    const searchScript = document.createElement('script')
    searchScript.src = '//nocorealtor.idxbroker.com/idx/widgets/107914'
    searchScript.id = 'idxwidgetsrc-107914'
    searchScript.type = 'text/javascript'
    searchScript.async = true
    document.getElementById('search-widget')?.appendChild(searchScript)

    return () => {
      document.getElementById('wid108423')?.remove()
      document.getElementById('wid107914')?.remove()
    }
  }, [])

  return (
    <div className='w-full h-full flex-col'>
      <Nav />
      <div className='px-6 pb-10 pt-4 flex flex-col'>
          <div id='search-widget' />
          <div id='find-map-widget' />
          <div className='mt-8' />
          <Footer />
      </div>
    </div>
  )
}

export default Home
