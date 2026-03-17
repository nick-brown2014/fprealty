import { Metadata } from "next";
import Nav from "../components/Nav";
import Footer from "../components/Footer";
import NewListingsCarousel from "../components/NewListingsCarousel";
import Link from "next/link";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Buy a Home in Northern Colorado | Expert Buyer's Agents | Porter Real Estate",
  description: "Looking to buy a home in Northern Colorado? Work with experienced buyer's agents at Porter Real Estate. We'll guide you through every step of the home buying process.",
  openGraph: {
    title: "Buy a Home in Northern Colorado | Porter Real Estate",
    description: "Expert guidance for home buyers in NoCo. Find your dream home with Porter Real Estate.",
  },
};

const features = [
  {
    title: "Engineering Edge",
    description:
      "Fred's technical background provides a \"second set of eyes\" on structural integrity and home systems that standard agents might miss.",
    icon: (
      <svg className='w-8 h-8 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M11.42 15.17l-5.1-5.1m0 0L11.42 4.97m-5.1 5.1h13.24M4.93 19.07a10 10 0 1114.14 0M12 2v0' />
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9.75 17L9 20l-1 1h8l-1-1-.75-3M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125z' />
      </svg>
    ),
  },
  {
    title: "Skilled Negotiation",
    description:
      "High-level strategy at the closing table to ensure you get the best possible value and terms.",
    icon: (
      <svg className='w-8 h-8 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M12 3v17.25m0 0c-1.472 0-2.882.265-4.185.75M12 20.25c1.472 0 2.882.265 4.185.75M18.75 4.97A48.416 48.416 0 0012 4.5c-2.291 0-4.545.16-6.75.47m13.5 0c1.01.143 2.01.317 3 .52m-3-.52l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L18.75 4.97zm-16.5.52c.99-.203 1.99-.377 3-.52m0 0l2.62 10.726c.122.499-.106 1.028-.589 1.202a5.989 5.989 0 01-2.031.352 5.989 5.989 0 01-2.031-.352c-.483-.174-.711-.703-.59-1.202L5.25 4.97z' />
      </svg>
    ),
  },
  {
    title: "Local Expertise",
    description:
      "A deep dive into NoCo neighborhoods to find the perfect fit for your lifestyle and budget.",
    icon: (
      <svg className='w-8 h-8 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M15 10.5a3 3 0 11-6 0 3 3 0 016 0z' />
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z' />
      </svg>
    ),
  },
  {
    title: "Full-Spectrum Support",
    description:
      "From pre-approval referrals to final walkthroughs, every step is handled with professional precision.",
    icon: (
      <svg className='w-8 h-8 text-primary' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
        <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1.5} d='M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z' />
      </svg>
    ),
  },
];

const BuyingPage = () => {
  return (
    <div className='w-full h-full flex-col'>
      <Nav />
      <div className='pb-10 items-center flex-col flex'>
        {/* Hero Section */}
        <div className='items-center w-full flex-col relative overflow-hidden min-h-74 lg:min-h-[400px] justify-center flex'>
          <img src='/buying-header.jpeg' className='w-full h-auto absolute -z-10 brightness-50' />
          <h1 className='font-bold text-center tracking-tight text-3xl sm:text-5xl lg:text-7xl text-white'>
            Why buy with Porter Real Estate?
          </h1>
          <h2 className='mt-6 font-bold tracking-tight hidden lg:block text-4xl text-white text-center'>
            Your local NoCo realtor
          </h2>
        </div>

        {/* Main Text */}
        <div className='max-w-[1000px] w-full mt-16 px-4 lg:px-0'>
          <p className='font-semibold tracking-tight text-md lg:text-lg'>
            Buying a home is one of the most significant financial decisions most people make, and if you are working with a realtor, you deserve skilled representation that goes beyond simply opening doors! Porter Real Estate provides this elite level of service by combining local market mastery with technical expertise. Led by Fred Porter, who leverages extensive engineering knowledge to identify potential property issues and seasoned negotiation experience to protect your interests, the team ensures you aren&apos;t just finding a house, but making a sound investment in a home for your family&apos;s future.
          </p>
          <p className='font-semibold tracking-tight text-md lg:text-lg mt-6'>
            Whether you are a first-time buyer or relocating to Northern Colorado, you shouldn&apos;t settle for less than a partner who offers the guidance, tools, and professional advocacy required to navigate a complex market with absolute confidence.
          </p>
        </div>

        {/* Feature Boxes */}
        <div className='max-w-[1100px] w-full mt-16 px-4 lg:px-0'>
          <h2 className='text-2xl lg:text-3xl font-bold tracking-tight text-center mb-10'>
            Why Porter Real Estate is the Standard for Buyer Representation
          </h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            {features.map((feature) => (
              <div
                key={feature.title}
                className='bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col items-center text-center hover:shadow-lg transition-shadow'
              >
                <div className='mb-4 bg-red-50 rounded-full p-3'>
                  {feature.icon}
                </div>
                <h3 className='text-lg font-bold tracking-tight text-gray-900 mb-2'>
                  {feature.title}
                </h3>
                <p className='text-sm text-gray-600 leading-relaxed'>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* New Listings Carousel */}
        <NewListingsCarousel />

        {/* CTA: Create Listing Alert */}
        <div className='max-w-[800px] w-full mt-12 px-4 lg:px-0 text-center'>
          <h2 className='text-2xl lg:text-3xl font-bold tracking-tight mb-6'>
            Create your own personal NEW LISTING update
          </h2>
          <Link
            href='/search'
            className='inline-block bg-primary text-white font-bold text-lg px-8 py-3 rounded-lg hover:opacity-90 transition'
          >
            Create Here
          </Link>
        </div>

        {/* Agent HQ Reviews Widget */}
        <div className='max-w-[1100px] w-full mt-16 px-4 lg:px-0'>
          <h2 className='text-2xl lg:text-3xl font-bold tracking-tight text-center mb-8'>
            What Our Clients Say
          </h2>
          <div className='w-full rounded-xl overflow-hidden'>
            <iframe
              className='lc_reviews_widget'
              src='https://reputationhub.site/reputation/widgets/review_widget/zGwqa9Oyk55imvfPlRzO'
              frameBorder='0'
              style={{ minWidth: '100%', width: '100%' }}
              title='Porter Real Estate Reviews'
            />
            <Script
              src='https://reputationhub.site/reputation/assets/review-widget.js'
              strategy='lazyOnload'
            />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default BuyingPage
