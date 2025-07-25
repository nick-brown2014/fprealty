'use client'

import Footer from '@/app/components/Footer'
import Nav from '@/app/components/Nav'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { useCallback } from 'react'
import NextArrow from '@/app/components/wizards/NextArrow'
import PrevArrow from '@/app/components/wizards/PrevArrow'

type ReviewProps = {
  review: string,
  name: string,
  homeDetails: string,
  date: string,
}

const reviews: ReviewProps[] = [
  {
    review: "If you are looking for a realtor who will go above and beyond your expectations, then you are looking for Porter Real Estate. Fred commuted over multiple weekends, looking at dozens of potential homes. Rather than pushing us into a sale, he used his decades of experience as a realtor and civil engineer to point out flaws that we had missed. When we did decide on a place, he got it for us for well under the original asking price as well! As a first time home owner, his commitment to ensuring that we found the perfect place was an invaluable comfort. We will never use another realtor, and neither should you.",
    name: 'Nick Brown',
    homeDetails: 'Bought a Townhouse home in 2024 in West colfax, Denver, CO.',
    date: '8/21/2024',
  },
  {
    review: "We had the pleasure of working with Fred Porter as our real estate agent and couldn't be happier with the experience. As first-time buyers, Fred was incredibly helpful, taking the time to thoroughly explain each step, ensuring we understood everything. His expertise and proactive approach kept everything moving smoothly, and he was always on top of things. Communicating with Fred was always a pleasure; he was not only responsive but also made sure all our concerns were addressed with patience and clarity. We highly recommend Fred without any hesitation to anyone stepping into the real estate market. His support and guidance were invaluable to us, making our first buying experience a great success!",
    name: 'Esben Retboll',
    homeDetails: 'Bought a Vacant Land home in 2024 in Drake, CO.',
    date: '5/24/2024',
  },
  {
    review: "Top marks. Fred helped with most every aspect of the purchase. Including putting his own vehicle in harm's way helping me with the survey. Will definitely recommend him.",
    name: 'newsomd75',
    homeDetails: 'Bought a Vacant Land home in 2022 in Red feather lakes, CO.',
    date: '8/23/2022',
  },
  {
    review: "Our experience with Fred Porter was excellent! We were selling our house from across the country and Fred’s communication and knowledge were awesome! Fred was always thorough and knew the rules for selling a house. He worked well with the other agent and set up the closing appointment that fit our needs. We would highly recommend Fred to others—whether buying or selling.",
    name: 'zuser20171217205716690',
    homeDetails: 'Sold a Single Family home in 2022 in Johnstown, CO.',
    date: '6/19/2022',
  },
  {
    review: "The best realtor I have ever worked with, this was a very difficult project and Fred took care of every detail he worked on my behalf with the county, surveyors, HOA, and the title company. He returned every phone call in a timely manner and resolved every issue. I highly recommend him.",
    name: 'f f wolf',
    homeDetails: 'Sold a Multiple Occupancy home in 2022 in Red feather lakes, CO.',
    date: '3/15/2022',
  },
]

const Review = ({ review, name, homeDetails, date }: ReviewProps) => (
  <div className='w-full flex flex-col items-center py-8'>
    <p className='font-semibold tracking-tight text-lg my-8'>{review}</p>
    <p className='font-semibold tracking-tight text-center mb-2'>{name} - {date}</p>
    <p className='font-semibold tracking-tight text-center'>{homeDetails}</p>
  </div>
)


export default function Home() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, duration: 60 }, [Autoplay({ delay: 10000 })])

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  return (
    <div className='w-full h-full flex-col flex'>
      <Nav />
      <div className='pb-10 items-center flex-col flex'>
        <div className='items-center w-full flex-col relative overflow-hidden lg:min-h-[600px] lg:justify-center flex'>
          <img src='/home-header.jpg' className='w-full h-auto absolute -z-10 brightness-50 min-h-[300px]' />
          <h1 className='font-bold tracking-tight mt-8 sm:mt-24 lg:mt-0 text-3xl sm:text-5xl lg:text-8xl text-white'>Porter Real Estate</h1>
          <h2 className='mt-6 font-bold tracking-tight text-lg lg:text-2xl text-white text-center'>
            Your ultimate resource to living in Northern Colorado
          </h2>

          <div className='justify-center my-12 gap-8 flex'>
            <a href='/buying' className='py-[4px] px-8 lg:px-12 text-2xl lg:text-3xl font-bold bg-linear-to-r from-primary to-5% to-primary from-5% to-white text-black shadow-xl hover:text-white hover:to-primary transition duration-500'>Buy</a>
            <a href='/selling' className='py-[4px] px-8 lg:px-12 text-2xl lg:text-3xl font-bold bg-linear-to-r from-primary to-5% to-primary from-5% to-white text-black shadow-xl hover:text-white hover:to-primary transition duration-500'>Sell</a>
          </div>
        </div>

        <div className='px-12 flex-col py-16 bg-background gap-4 lg:w-[1000px] lg:px-0 flex'>
          <h2 className='text-lg lg:text-3xl font-bold tracking-tight text-black'>
            Live in Northern Colorado
          </h2>
          <h1 className='text-2xl lg:text-5xl font-bold tracking-tight text-black'>
            Your Guide to Northern Colorado
          </h1>

          <div className='flex space-between pt-4 flex flex-col lg:flex-row'>
            <div className='lg:w-1/2 w-full flex'>
              <p className='text-regular lg:text-lg pr-4 tracking-tight'>
                Northern Colorado is a diverse area with cities, towns, and rural areas on the plains and in the mountains.
                Locating the perfect place to call home can be difficult.
                <br></br>
                <br></br>
                We created a series of local area guides to help you find the perfect location for your next home.
                Our area guides make the process easier by providing unique market insights, lifestyle highlights, and demographic details for each community.
                <br></br>
                <br></br>
                Let Porter Real Estate be your trusted NoCo resource!
              </p>
            </div>
            <div className='flex w-full lg:w-1/2 mt-12 lg:mt-0'>
              <div className='w-full lg:w-1/2 flex-col gap-2 pr-2 lg:items-end flex'>
                <a href='/search?location=Fort%Collins' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Fort Collins</a>
                <a href='/search?location=Loveland' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Loveland</a>
                <a href='/search?location=Wellington' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Wellington</a>
                <a href='/search?location=Windsor' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Windsor</a>
                <a href='/search?location=Red%Feather%Lakes' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Red Feather Lakes</a>
                <a href='/search?location=Greeley' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Greeley</a>
                <a href='/search?location=Berthoud' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Berthoud</a>
                <a href='/search?location=Estes%Park' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Estes Park</a>
                <a href='/search?location=Longmont' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Longmont</a>
                <a href='/search?location=Lyons' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Lyons</a>
              </div>
              <div className='w-full lg:w-1/2 flex-col gap-2 pr-2 lg:items-end flex'>
                <a href='/search?location=Boulder' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Boulder</a>
                <a href='/search?location=Arvada' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Arvada</a>
                <a href='/search?location=Aurora' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Aurora</a>
                <a href='/search?location=Denver' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Denver</a>
                <a href='/search?location=Livermore' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Livermore</a>
                <a href='/search?location=Bellevue' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Bellevue</a>
                <a href='/search?location=Frederick' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Frederick</a>
                <a href='/search?location=Firestone' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Firestone</a>
                <a href='/search?location=Johnstown' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Johnstown</a>
              </div>
            </div>
          </div>
        </div>

        <div className='w-full pt-16 bg-foreground justify-center flex lg:h-[400px]'>
          <div className='flex-col flex px-12 w-full'>
            <div className='w-full flex flex-col md:flex-row gap-8 lg:items-center'>
              <h1 className='text-4xl lg:text-5xl font-bold tracking-tight text-background'>
                The latest on NoCo living
              </h1>
              <a href='https://www.youtube.com/@porterrealestate' target='_blank' className='lg:max-w-[180px] max-w-[140px] py-[3px] px-6 lg:px-8 text-xl lg:text-2xl font-bold bg-linear-to-r from-primary to-5% to-primary from-5% to-white text-black shadow-xl hover:text-white hover:to-primary transition duration-500'>Subscribe</a>
            </div>
            <p className='text-xl text-background tracking-tight font-semibold mt-4'>
              Follow us to stay up to date with the latest <span className='text-primary'>tips</span> and <span className='text-primary'>trends</span> on NoCo housing and lifestyle 
            </p>
            <div className='mt-8 w-full lg:flex flex-row gap-8 z-10 hidden'>
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
        </div>

        <div className='w-full lg:w-[1000px] pb-16 pt-16 lg:pt-24 bg-background flex flex-col lg:flex-row'>
          <div className='w-full lg:w-1/2 lg:pr-8 flex justify-center'>
            <img className='w-[75%] lg:w-full h-auto' src='/footer-fred-isabella.jpg' />
          </div>
          <div className='w-full lg:w-1/2 pl-8 flex'>
            <p className='text-lg tracking-tight mt-8'>
              Porter Real Estate is your trusted <span className='font-semibold'>NoCo Realtor,</span> dedicated to helping buyers and sellers navigate the Northern Colorado market with expertise and care.
              <br></br>
              <br></br>
              As a <span className='font-semibold'>family-run business,</span> we take pride in building lasting relationships and providing personalized service tailored to your unique needs.
              <br></br>
              <br></br>
              With deep local roots and a passion for the communities we serve, we offer expert guidance on market trends, lifestyle options, and the best neighborhoods for your next move.
              <br></br>
              <br></br>
              Whether you&#39;re downsizing, relocating, or investing, Porter Real Estate is committed to making your real estate journey smooth and successful.
              <br></br>
              <br></br>
              <span className='font-semibold'>Your home, your future—our family is here to help.</span>
            </p>
          </div>
        </div>

        <div className='max-w-[100vw] w-full lg:w-[1000px] py-16 bg-background flex flex-col items-center'>
          <img src='/five-stars.png' className='w-[200px] h-[200px] mt-[-100px] mb-[-120px]' />
          <div className='embla'>
            <NextArrow handleClick={scrollNext} />
            <PrevArrow handleClick={scrollPrev} />
            <div className="embla__viewport" ref={emblaRef}>
              <div className='embla__container'>
                {reviews.map((reviewItem, index) => (
                  <div key={index} className='embla__slide'>
                    <Review review={reviewItem.review} name={reviewItem.name} homeDetails={reviewItem.homeDetails} date={reviewItem.date} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
      </div>
      <Footer />
    </div>
  )
}
