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

    const showcaseScript = document.createElement('script')
    showcaseScript.src = '//nocorealtor.idxbroker.com/idx/widgets/104535'
    showcaseScript.id = 'idxwidgetsrc-104535'
    showcaseScript.type = 'text/javascript'
    showcaseScript.async = true
    document.getElementById('showcase-listing-widget')?.appendChild(showcaseScript)

    const searchScript = document.createElement('script')
    searchScript.src = '//nocorealtor.idxbroker.com/idx/widgets/107914'
    searchScript.id = 'idxwidgetsrc-107914'
    searchScript.type = 'text/javascript'
    searchScript.async = true
    document.getElementById('search-widget')?.appendChild(searchScript)

    return () => {
      document.getElementById('wid104535')?.remove()
      document.getElementById('wid108423')?.remove()
      document.getElementById('wid107914')?.remove()
    }
  }, [])

  return (
    <div className='w-full h-full flex-col'>
      <Nav />
      <div className='px-6 py-10 flex flex-col'>
          <div id='search-widget' />
          <div id='find-map-widget' />
          <div className='mt-8' />
          <div id='showcase-listing-widget' />
          <div className='mt-8' />
          <Footer />
      </div>
    </div>
  )
}

export default Home
