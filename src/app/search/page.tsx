'use client'

import Nav from "../components/Nav"
import { useEffect } from "react"

const Home = () => {

  useEffect(() => {
    const script = document.createElement('script')
    script.src = '//jaycee.idxbroker.com/idx/widgets/77302'
    script.id = 'idxwidgetsrc-77302'
    script.type = 'text/javascript'
    script.async = true
    document.getElementById('find-map-widget')?.appendChild(script)

    return () => {
      document.getElementById('wid77302')?.remove()
    }
  }, [])

  return (
    <div className='w-full h-full flex-col'>
      <Nav />
      <div className='px-6 py-10 flex flex-col'>
          <div id='find-map-widget' />
      </div>
    </div>
  )
}

export default Home
