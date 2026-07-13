'use client'

import Script from 'next/script'
import { useEffect } from 'react'

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void
    dataLayer?: Record<string, unknown>[]
  }
}

const HomeValuationForm = () => {
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const message = event.data
      let serialized = ''
      try {
        serialized = typeof message === 'string' ? message : JSON.stringify(message ?? '')
      } catch {
        return
      }
      const type = typeof message === 'object' && message !== null && 'type' in message
        ? String(message.type)
        : ''

      if (!/submit|complete|success/i.test(serialized) || !/form|survey|lead/i.test(`${serialized} ${type}`)) {
        return
      }

      if (typeof window.gtag === 'function' && process.env.NEXT_PUBLIC_GADS_HV_LABEL) {
        window.gtag('event', 'conversion', {
          send_to: `AW-668025904/${process.env.NEXT_PUBLIC_GADS_HV_LABEL}`,
        })
      }

      window.dataLayer = window.dataLayer || []
      window.dataLayer.push({ event: 'generate_lead', form: 'home_valuation' })
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [])

  return (
    <div className='w-full overflow-hidden bg-white border border-black/10 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.18)]'>
      <iframe
        src='https://link.myagenthq.com/widget/survey/9e0TyYPTgaMudAz7DEbf'
        style={{ border: 'none', width: '100%', minHeight: '700px' }}
        scrolling='no'
        id='9e0TyYPTgaMudAz7DEbf'
        title='survey'
        className='block w-full'
      />
      <Script
        src='https://link.myagenthq.com/js/form_embed.js'
        strategy='afterInteractive'
      />
    </div>
  )
}

export default HomeValuationForm
