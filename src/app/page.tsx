'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Footer from './components/Footer'
import Nav from './components/Nav'

type ReviewProps = {
  review: string,
  homeDetails: string,
  date: string,
}

const reviews: ReviewProps[] = [
  {
    review: "If you are looking for a realtor who will go above and beyond your expectations, then you are looking for Porter Real Estate. Fred commuted over multiple weekends, looking at dozens of potential homes. Rather than pushing us into a sale, he used his decades of experience as a realtor and civil engineer to point out flaws that we had missed. When we did decide on a place, he got it for us for well under the original asking price as well! As a first time home owner, his commitment to ensuring that we found the perfect place was an invaluable comfort. We will never use another realtor, and neither should you.",
    homeDetails: 'Bought a Townhouse home in 2024 in West colfax, Denver, CO.',
    date: '8/21/2024',
  },
  {
    review: "We had the pleasure of working with Fred Porter as our real estate agent and couldn't be happier with the experience. As first-time buyers, Fred was incredibly helpful, taking the time to thoroughly explain each step, ensuring we understood everything. His expertise and proactive approach kept everything moving smoothly, and he was always on top of things. Communicating with Fred was always a pleasure; he was not only responsive but also made sure all our concerns were addressed with patience and clarity. We highly recommend Fred without any hesitation to anyone stepping into the real estate market. His support and guidance were invaluable to us, making our first buying experience a great success!",
    homeDetails: 'Bought a Vacant Land home in 2024 in Drake, CO.',
    date: '5/24/2024',
  },
  {
    review: "Top marks. Fred helped with most every aspect of the purchase. Including putting his own vehicle in harm's way helping me with the survey. Will definitely recommend him.",
    homeDetails: 'Bought a Vacant Land home in 2022 in Red feather lakes, CO.',
    date: '8/23/2022',
  },
  {
    review: "Our experience with Fred Porter was excellent! We were selling our house from across the country and Fred’s communication and knowledge were awesome! Fred was always thorough and knew the rules for selling a house. He worked well with the other agent and set up the closing appointment that fit our needs. We would highly recommend Fred to others—whether buying or selling.",
    homeDetails: 'Sold a Single Family home in 2022 in Johnstown, CO.',
    date: '6/19/2022',
  },
  {
    review: "The best realtor I have ever worked with, this was a very difficult project and Fred took care of every detail he worked on my behalf with the county, surveyors, HOA, and the title company. He returned every phone call in a timely manner and resolved every issue. I highly recommend him.",
    homeDetails: 'Sold a Multiple Occupancy home in 2022 in Red feather lakes, CO.',
    date: '3/15/2022',
  },
]

export default function NewHome() {
  const router = useRouter()
  const [parallaxOffset, setParallaxOffset] = useState(0)
  const [currentReview, setCurrentReview] = useState(0)

  // Auto-rotate reviews every 10 seconds (resets when manually selecting)
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentReview((prev) => (prev + 1) % reviews.length)
    }, 10000)

    return () => clearInterval(interval)
  }, [currentReview])

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY
      // Handle parallax effect - hero scrolls at 5% speed
      setParallaxOffset(currentScrollY * 0.05)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])
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
        <Nav />

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

          {/* Reviews Slider */}
          <div className='w-full max-w-7xl mt-46 lg:mt-24'>
            <div className='relative p-8 lg:p-12 flex items-center'>
              {reviews.map((review, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 p-8 lg:p-12 transition-opacity duration-500 flex flex-col justify-center ${
                    index === currentReview ? 'opacity-100' : 'opacity-0'
                  }`}
                >
                  <p className='italic text-gray-700 mb-6 text-center'>
                    &ldquo;{review.review}&rdquo;
                  </p>
                  <p className='text-sm text-gray-600 text-center mt-1'>
                    {review.homeDetails}
                  </p>
                  <p className='text-sm text-gray-500 text-center mt-1'>
                    {review.date}
                  </p>
                </div>
              ))}
            </div>

            {/* Slider Indicators */}
            <div className='flex justify-center gap-2 lg:mt-16 mt-46'>
              {reviews.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentReview(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentReview ? 'bg-primary w-8' : 'bg-gray-300'
                  }`}
                  aria-label={`Go to review ${index + 1}`}
                />
              ))}
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
