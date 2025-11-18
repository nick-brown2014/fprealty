'use client'
import { ChangeEvent, useState } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'

const Footer = () => {
  const { openAuthModal } = useAuth()
  const [email, setEmail] = useState<string>('')

  const handleSubscribe = () => {
    openAuthModal(email, true)
  }

  return (
    <div className='w-full bg-foreground px-8 pt-4 pb-12 flex flex-col items-center'>
      <div className='flex w-full flex-col md:flex-row max-w-[1200px]'>
        <div className='flex flex-col mt-4'>
          <p className='text-background font-semibold tracking-tight text-2xl'>
            Let&#39;s stay in touch!
          </p>
          <p className='text-background font-semibold tracking-tight mt-2'>
            Get fresh stories, helpful tips, and the latest updates sent right to your inbox
          </p>
        </div>
        <div className='flex mt-4 md:mt-0 md:items-end'>
          <input
            className='px-2 py-1 rounded-md border-gray-500 w-64 h-8 border-1 bg-slate-100 text-black md:ml-6'
            name='email'
            placeholder='johnsmith@gmail.com'
            value={email}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
          />
          <button
            className='lg:max-w-[180px] max-w-[140px] py-[2px] px-4 lg:px-6 lg:text-xl font-bold bg-linear-to-r from-primary to-5% to-primary from-5% to-white text-black shadow-xl hover:text-white hover:to-primary transition duration-500 ml-4 cursor-pointer'
            onClick={handleSubscribe}
          >
            Subscribe
          </button>
        </div>
      </div>
      <div className='justify-center flex w-full mt-6'>
        <div className='justify-between lg:items-center gap-8 max-w-[1200px] w-full flex flex-col lg:flex-row'>
          <div className='flex flex-col gap-4'>
            <img src='/logo-white.png' className='w-42 h-42' />
            <p className='text-background text-sm hidden lg:block'>
              Built by{' '}
              <a
                href='https://sunnybrown.dev'
                target='_blank'
                rel='noopener noreferrer'
                className='text-amber-500 hover:text-amber-400 transition-colors'
              >
                Sunshine Web Development
              </a>
            </p>
          </div>
          <div className='flex flex-col gap-2 ml-6 lg:ml-0'>
            <p className='text-background font-semibold tracking-tight'>Contact us:</p>
            <p className='text-background font-semibold tracking-tight'>(970) 510-8414</p>
            <p className='text-background font-semibold tracking-tight'>info@nocorealtor.com</p>
          </div>
          <div className='flex flex-col gap-2 ml-6 lg:ml-0 lg:self-end max-w-[600px]'>
            <Link href='/privacy-policy' className='text-background font-semibold tracking-tight'>Privacy policy</Link>
            <p className='text-background text-xs'>
              IDX information is provided exclusively for consumers&#39; personal, non-commercial use, that it may not be used for any purpose other than to identify prospective properties consumers may be interested in purchasing, and that the data is deemed reliable but is not guaranteed accurate by the MLS.
              <br></br>
              The MLS may, at its discretion, require use of other disclaimers as necessary to protect participants and/or the MLS from liability. Information deemed reliable but not guaranteed by the MLS. Information source: Information and Real Estate Services, LLC.
              <br></br>
              Provided for limited non-commercial use only under IRES Rules © Copyright 2018 IRES DMCA Notice
            </p>
            <a
              href='https://www.flaticon.com/'
              target='_blank'
              rel='noopener noreferrer'
              title='flaticon icons'
              className='mt-4 text-background text-xs w-full flex'
            >
                Icons created by Pixel perfect - Flaticon
            </a>
            <Link
              href='/terms-and-conditions'
              target='_blank'
              className='text-background text-xs w-full flex'
            >
              Terms and Conditions
            </Link>
                        <p className='text-background text-sm block lg:hidden'>
              Built by{' '}
              <a
                href='https://sunnybrown.dev'
                target='_blank'
                rel='noopener noreferrer'
                className='text-amber-500 hover:text-amber-400 transition-colors'
              >
                Sunshine Web Development
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer