'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Footer from '../components/Footer'
import Link from 'next/link'

export default function NewHome() {
  const router = useRouter()
  const [navVisible, setNavVisible] = useState(true)
  const [lastScrollY, setLastScrollY] = useState(0)
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Handle nav visibility
      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        // Scrolling down & past threshold - hide nav
        setNavVisible(false)
        setMobileMenuOpen(false) // Close mobile menu when hiding nav
      } else {
        // Scrolling up - show nav
        setNavVisible(true)
      }

      // Check if scrolled past top
      setIsScrolled(currentScrollY > 50)

      // Handle parallax effect - hero scrolls at 15% speed
      setParallaxOffset(currentScrollY * 0.05)

      setLastScrollY(currentScrollY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [lastScrollY])

  console.log('isScrolled', isScrolled)
  return (
    <div className='w-full h-full relative'>
      {/* Hero Background - Fixed position for parallax */}
      <div className='fixed inset-0 z-0 overflow-hidden'>
        <img
          src='/home-header.jpg'
          alt='Hero background'
          className='absolute w-full min-h-screen object-cover'
          style={{
            top: 0,
            transform: `translateY(-${parallaxOffset}px)`,
            height: 'calc(100vh + 400px)'
          }}
        />
        <div className='absolute inset-0 bg-black' style={{ opacity: 0.6 }} />
      </div>

      {/* Content Container */}
      <div className='relative z-10'>
        {/* Navigation */}
        <nav
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            navVisible ? 'translate-y-0' : '-translate-y-full'
          } ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}
        >
          <div className={`${isScrolled ? '' : 'backdrop-blur-sm'}`}>
            <div className='max-w-7xl mx-auto px-6 py-4'>
              <div className='flex justify-between items-center'>
                {/* Logo */}
                <Link
                  href='/'
                  className={`text-xl font-bold tracking-wide hover:text-primary transition ${
                    isScrolled ? 'text-black' : 'text-white'
                  }`}
                >
                  PORTER REAL ESTATE
                </Link>

                {/* Navigation Links */}
                <div className='hidden md:flex items-center gap-8'>
                  <a
                    href='/search'
                    className={`hover:text-primary transition uppercase tracking-wide text-sm ${
                      isScrolled ? 'text-black' : 'text-white'
                    }`}
                  >
                    Search
                  </a>
                  <a
                    href='/buying'
                    className={`hover:text-primary transition uppercase tracking-wide text-sm ${
                      isScrolled ? 'text-black' : 'text-white'
                    }`}
                  >
                    Buy
                  </a>
                  <a
                    href='/selling'
                    className={`hover:text-primary transition uppercase tracking-wide text-sm ${
                      isScrolled ? 'text-black' : 'text-white'
                    }`}
                  >
                    Sell
                  </a>
                  <a
                    href='/about'
                    className={`hover:text-primary transition uppercase tracking-wide text-sm ${
                      isScrolled ? 'text-black' : 'text-white'
                    }`}
                  >
                    About
                  </a>
                </div>

                {/* Mobile Menu Button */}
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className={`cursor-pointer md:hidden ${isScrolled ? 'text-black' : 'text-white'}`}
                >
                  <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    {mobileMenuOpen ? (
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                    ) : (
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M4 6h16M4 12h16M4 18h16' />
                    )}
                  </svg>
                </button>
              </div>

              {/* Mobile Menu Dropdown */}
              {mobileMenuOpen && (
                <div className='md:hidden mt-4 pb-4'>
                  <div className='flex flex-col gap-4'>
                    <a
                      href='/search'
                      className={`hover:text-primary transition uppercase tracking-wide text-sm ${
                        isScrolled ? 'text-black' : 'text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Search
                    </a>
                    <a
                      href='/buying'
                      className={`hover:text-primary transition uppercase tracking-wide text-sm ${
                        isScrolled ? 'text-black' : 'text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Buy
                    </a>
                    <a
                      href='/selling'
                      className={`hover:text-primary transition uppercase tracking-wide text-sm ${
                        isScrolled ? 'text-black' : 'text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      Sell
                    </a>
                    <a
                      href='/about'
                      className={`hover:text-primary transition uppercase tracking-wide text-sm ${
                        isScrolled ? 'text-black' : 'text-white'
                      }`}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      About
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </nav>

        {/* Hero Content Section */}
        <div className='relative w-full h-screen flex items-center justify-center'>
          <div className='text-center px-6'>
          <h1 className='text-white text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6'>
            Porter Real Estate
          </h1>
          <p className='text-white text-xl md:text-2xl mb-12 tracking-wide'>
            Your ultimate resource to living in Northern Colorado
          </p>

          {/* Search Button */}
          <button
            onClick={() => router.push('/search')}
            className='cursor-pointer bg-transparent border-2 border-white hover:bg-white hover:border-white text-white hover:text-primary px-12 py-4 rounded-full text-lg font-semibold tracking-wide transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105'
          >
            Start Your Search
          </button>
          </div>
        </div>

        {/* Realtor Section */}
        <div className='relative bg-white'>
        <div className='max-w-7xl mx-auto px-6 py-16 lg:py-24 flex flex-col items-center'>
          {/* Section Header */}
          <h2 className='text-3xl lg:text-5xl tracking-wide'>
            Northern Colorado&apos;s Top Realtor
          </h2>
          <h2 className='text-lg lg:text-xl tracking-wide text-primary mt-2'>
            Experience. Commitment. Integrity.
          </h2>
          <div className='w-full flex flex-col items-center lg:items-stretch lg:flex-row max-w-4xl mt-8'>
            {/* Image - 60% width on large screens */}
            <div className='w-full lg:w-[60%]'>
              <img src='/fredshot.jpg' className='w-full h-full max-w-[700px] object-contain m-auto' />
            </div>

            {/* Text - 40% width on large screens */}
            <div className='w-full lg:w-[40%] flex max-w-[700px]'>
              <p className='tracking-wide px-6 py-12 lg:px-12 bg-slate-100 w-full h-full'>
                Porter Real Estate is your trusted NoCo Realtor, dedicated to helping buyers and sellers navigate the Northern Colorado market with expertise and care.
                <br></br>
                <br></br>
                As a family-run business, we take pride in building lasting relationships and providing personalized service tailored to your unique needs.
                <br></br>
                <br></br>
                With deep local roots and a passion for the communities we serve, we offer expert guidance on market trends, lifestyle options, and the best neighborhoods for your next move.
                <br></br>
                <br></br>
                Whether you&apos;re downsizing, relocating, or investing, Porter Real Estate is committed to making your real estate journey smooth and successful.
                <br></br>
                <br></br>
                <span className='text-primary'>
                  Your home, your future—our family is here to help.
                </span>
              </p>
            </div>
          </div>
          
        </div>
      </div>

      {/* Parallax Gap Section - Shows hero background */}
      <div className='relative h-64 overflow-hidden' />


      {/* Cities Section with Parallax Effect */}
      <div className='relative z-20 bg-white'>
        <div className='max-w-9xl mx-auto py-16 lg:py-12 flex flex-col items-center'>
          <h2 className='text-3xl lg:text-5xl tracking-wide'>
            Explore Communities
          </h2>
          <h2 className='text-lg lg:text-xl tracking-wide text-primary mt-2'>
            Colorado Real Estate
          </h2>
          <p className='tracking-wide mt-4 text-center px-12 max-w-6xl'>
            Northern Colorado is a diverse area with cities, towns, and rural areas on the plains and in the mountains. Locating the perfect place to call home can be difficult.
            Let Porter Real Estate be your trusted NoCo resource.
          </p>
          <div className='flex flex-col md:flex-row w-full mt-12 gap-1'>
            {/* Fort Collins */}
            <div
              className='cursor-pointer relative w-full h-64 lg:h-124 overflow-hidden group cursor-pointer'
              onClick={() => router.push('search?location=fort-collins')}>
              <img
                src='/fort-collins.jpg'
                alt='Fort Collins'
                className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-black' style={{ opacity: 0.4 }} />
              <div className='absolute inset-0 flex items-center justify-center'>
                <h3 className='text-white text-4xl lg:text-5xl font-bold tracking-wide'>
                  Fort Collins
                </h3>
              </div>
            </div>

            {/* Denver */}
            <div
              className='cursor-pointer relative w-full h-64 lg:h-124 overflow-hidden group cursor-pointer'
              onClick={() => router.push('search?location=denver')}>
              <img
                src='/denver.jpg'
                alt='Denver'
                className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-black' style={{ opacity: 0.4 }} />
              <div className='absolute inset-0 flex items-center justify-center'>
                <h3 className='text-white text-4xl lg:text-5xl font-bold tracking-wide'>
                  Denver
                </h3>
              </div>
            </div>

            {/* Boulder */}
            <div
            className='cursor-pointer relative w-full h-64 lg:h-124 overflow-hidden group cursor-pointer'
            onClick={() => router.push('search?location=boulder')}>
              <img
                src='/boulder.jpg'
                alt='Boulder'
                className='absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110'
              />
              <div className='absolute inset-0 bg-black' style={{ opacity: 0.4 }} />
              <div className='absolute inset-0 flex items-center justify-center'>
                <h3 className='text-white text-4xl lg:text-5xl font-bold tracking-wide'>
                  Boulder
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Parallax Gap Section - Shows hero background */}
      <div className='relative h-64 overflow-hidden' />

      <div className='relative z-20 bg-white'>
        <div className='max-w-9xl mx-auto py-16 lg:py-12 flex flex-col items-center'>
          <h2 className='text-3xl lg:text-5xl tracking-wide'>
            The Latest on NoCo Living
          </h2>
          <a href='https://www.youtube.com/@porterrealestate' target='_blank' className='text-lg lg:text-xl tracking-wide text-primary mt-2'>
            Subscribe
          </a>
          <p className='tracking-wide mt-4 text-center px-12 max-w-6xl'>
            Follow us to stay up to date with the latest tips and trends on NoCo housing and lifestyle
          </p>

          <div className='mt-8 w-full lg:flex flex-row gap-8 z-10 hidden px-4'>
            <iframe width='450' height='235' src='https://www.youtube.com/embed/VYysxfzgMx0?si=ySI3GUTlvBeLOieG' title='YouTube video player' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerPolicy='strict-origin-when-cross-origin' allowFullScreen></iframe>
            <iframe width='450' height='235' src='https://www.youtube.com/embed/N2g1gFCXq1g?si=5Olg6ebPQNLKE14c' title='YouTube video player' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerPolicy='strict-origin-when-cross-origin' allowFullScreen></iframe>
            <iframe width='450' height='235' src='https://www.youtube.com/embed/_gYoP3U2hFE?si=eF12D5W9AmOxsdI8' title='YouTube video player' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerPolicy='strict-origin-when-cross-origin' allowFullScreen></iframe>
          </div>
          <div className='mt-8 w-full hidden md:flex flex-col gap-8 lg:hidden items-center'>
            <iframe width='450' height='300' src='https://www.youtube.com/embed/VYysxfzgMx0?si=ySI3GUTlvBeLOieG' title='YouTube video player' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerPolicy='strict-origin-when-cross-origin' allowFullScreen></iframe>
            <iframe width='450' height='300' src='https://www.youtube.com/embed/N2g1gFCXq1g?si=5Olg6ebPQNLKE14c' title='YouTube video player' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerPolicy='strict-origin-when-cross-origin' allowFullScreen></iframe>
            <iframe width='450' height='300' src='https://www.youtube.com/embed/_gYoP3U2hFE?si=eF12D5W9AmOxsdI8' title='YouTube video player' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerPolicy='strict-origin-when-cross-origin' allowFullScreen></iframe>
          </div>
          <div className='mt-8 w-full flex flex-col gap-8 md:hidden items-center'>
            <iframe width='300' height='200' src='https://www.youtube.com/embed/VYysxfzgMx0?si=ySI3GUTlvBeLOieG' title='YouTube video player' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerPolicy='strict-origin-when-cross-origin' allowFullScreen></iframe>
            <iframe width='300' height='200' src='https://www.youtube.com/embed/N2g1gFCXq1g?si=5Olg6ebPQNLKE14c' title='YouTube video player' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerPolicy='strict-origin-when-cross-origin' allowFullScreen></iframe>
            <iframe width='300' height='200' src='https://www.youtube.com/embed/_gYoP3U2hFE?si=eF12D5W9AmOxsdI8' title='YouTube video player' allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share' referrerPolicy='strict-origin-when-cross-origin' allowFullScreen></iframe>
          </div>
        </div>
        <Footer />
      </div>

      </div>
    </div>
  )
}
