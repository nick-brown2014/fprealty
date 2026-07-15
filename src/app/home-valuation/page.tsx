import { Metadata } from 'next'
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer'
import HomeValuationForm from '@/app/components/wizards/HomeValuationForm'

export const metadata: Metadata = {
  title: 'Free Home Valuation | Porter Real Estate',
  description: 'Find out what your Northern Colorado home is worth with a free, no-obligation valuation prepared personally by local broker Fred Porter.',
  openGraph: {
    title: 'Free Home Valuation | Porter Real Estate',
    description: 'Get a free Northern Colorado home value report from Fort Collins local Fred Porter — no obligation and no generic algorithm.',
    images: ['https://www.nocorealtor.com/home-header.jpg'],
  },
}

const stats = [
  { num: '$50M+', label: 'In homes sold (2024)' },
  { num: '100s', label: 'Of NoCo families helped' },
  { num: '30+ yrs', label: 'Living in Fort Collins' },
  { num: '★★★★★', label: '5-star rated by clients' },
]

const steps = [
  {
    title: 'Tell us about your home',
    text: 'Share a few details about your property and your goals through our quick, secure survey.',
  },
  {
    title: 'Fred researches your market',
    text: 'Fred personally reviews recent sales, neighborhood trends, and the details that make your home unique.',
  },
  {
    title: 'Get your report within 24 hours',
    text: 'Receive a clear, useful home value report with no obligation and no pressure to list.',
  },
]

const reasons = [
  ['Family-run, not faceless.', 'You work directly with Fred — the owner — start to finish. No call centres, no handoffs.'],
  ['An engineer’s selling system.', 'A clear, proven, step-by-step process that prices and markets your home to sell for more.'],
  ['In-house marketing.', 'Professional photography and video on every listing, so your home shows at its best.'],
  ['Honest, no-pressure advice.', 'Fred points out what others miss and never pushes you into a sale.'],
]

const testimonials = [
  {
    text: 'We were selling our house from across the country and Fred’s communication and knowledge were awesome! He knew the rules for selling a house and set up the closing to fit our needs. We’d highly recommend Fred — whether buying or selling.',
    meta: 'Home seller · Johnstown, CO · 2022',
  },
  {
    text: 'If you’re looking for a realtor who’ll go above and beyond, you’re looking for Porter Real Estate. Rather than pushing us into a sale, Fred used his decades of experience to point out flaws we’d missed — and got it for us well under asking.',
    meta: 'Home buyer · Denver, CO · 2024',
  },
  {
    text: 'The best realtor I have ever worked with. A very difficult project, and Fred took care of every detail — working with the county, surveyors, HOA and title company. He returned every call and resolved every issue.',
    meta: 'Seller · Red Feather Lakes, CO · 2022',
  },
]

const towns = [
  'Fort Collins',
  'Loveland',
  'Windsor',
  'Greeley',
  'Timnath',
  'Wellington',
  'Red Feather Lakes',
  'Livermore',
  'Boulder',
  'Denver Metro',
]

const faqs = [
  ['Is the valuation really free?', 'Yes — completely free and with no obligation. The report is yours to keep, whether or not you decide to sell.'],
  ['Do I have to list with Porter Real Estate?', 'Not at all. There’s no commitment. Plenty of homeowners just want to know where they stand, and that’s perfectly fine.'],
  ['How accurate is it?', 'Your valuation is prepared by Fred — a local expert who knows your neighborhood — not an automated online guess. That local knowledge is what makes it accurate.'],
  ['How fast will I get my report?', 'Within 24 hours. Fred prepares each one personally. Need it sooner? Just call (970) 510-8414.'],
  ['Who sees my details?', 'Only Fred. Your information is used solely to prepare your valuation and is never sold or shared.'],
]

const SectionLabel = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`font-condensed text-xs font-bold tracking-[0.22em] uppercase text-primary flex items-center gap-2.5 mb-3.5 ${className}`}>
    <span className='block w-5 h-0.5 bg-current' />
    {children}
  </div>
)

const HomeValuationPage = () => (
  <div className='w-full font-body bg-[#F8F6F2] text-black'>
    <Nav alwaysSolid />
    <div className='max-w-[1280px] mx-auto pt-20 pb-10'>
      <section className='relative overflow-hidden bg-black'>
        <div
          className='absolute inset-0 bg-cover bg-center bg-no-repeat'
          style={{
            backgroundImage: "linear-gradient(180deg, rgba(2,1,0,0.55) 0%, rgba(2,1,0,0.84) 100%), url('https://www.nocorealtor.com/home-header.jpg')",
          }}
        />
        <div className='relative z-[2] grid grid-cols-1 lg:grid-cols-[1fr_0.9fr] gap-9 px-7 py-10 lg:px-16 lg:py-16 items-center'>
          <div>
            <SectionLabel>Free Home Valuation · Northern Colorado</SectionLabel>
            <h1 className='font-serif text-4xl lg:text-[54px] leading-[1.04] text-white font-bold max-w-[560px] mb-6'>
              What&apos;s Your <em className='italic text-primary'>Fort Collins</em> Home Worth?
            </h1>
            <p className='text-base lg:text-[17px] leading-relaxed text-white/70 max-w-[500px] font-light mb-7'>
              Get a free, no-obligation home value report — prepared by a local expert, not a generic algorithm.
            </p>
            <div className='flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-white/75'>
              <span className='text-[#F5B301] tracking-[0.12em]'>★★★★★</span><b className='text-white'>5-star rated</b>
              <span className='text-white/40'>•</span><b className='text-white'>$50M+</b> in homes sold
              <span className='text-white/40'>•</span><b className='text-white'>Family-run</b> since 2019
            </div>
            <div className='flex items-center gap-3 mt-7 bg-white/10 border border-white/20 px-3.5 py-2.5 rounded-full w-fit max-w-full'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src='https://www.nocorealtor.com/fredshot.jpg' alt='Fred Porter' loading='lazy' className='w-11 h-11 rounded-full object-cover border-2 border-primary' />
              <div className='text-sm text-white/75'>
                <b className='block text-white'>Fred Porter</b>
                Broker/Owner · 30+ years in NoCo
              </div>
            </div>
            <div className='flex gap-4 items-center flex-wrap mt-8'>
              <a href='#valuation' className='bg-primary text-white font-condensed font-bold text-[15px] tracking-[0.12em] uppercase px-7 py-4 rounded-sm transition-colors hover:bg-[#8B0A0C]'>
                Get My Free Home Value
              </a>
              <a href='#how-it-works' className='text-white font-condensed font-semibold text-sm tracking-[0.1em] uppercase border border-white/35 px-7 py-3.5 rounded-sm hover:border-white/70'>
                How It Works
              </a>
            </div>
          </div>
          <div id='valuation' className='scroll-mt-24'>
            <div className='bg-white p-4 lg:p-5'>
              <div className='mb-4'>
                <div className='font-condensed text-lg font-bold uppercase tracking-[0.06em]'>Get your free home value</div>
                <p className='text-sm text-black/60 mt-1'>A few details is all it takes to get started.</p>
              </div>
              <HomeValuationForm />
            </div>
          </div>
        </div>
      </section>

      <section className='bg-primary px-7 py-6 lg:px-16 grid grid-cols-2 md:grid-cols-4'>
        {stats.map((stat, i) => (
          <div key={stat.label} className={`text-center px-0 py-2 md:py-0 ${i < stats.length - 1 ? 'md:border-r md:border-white/20' : ''}`}>
            <span className='font-condensed text-[30px] lg:text-[38px] font-black text-white leading-none block'>{stat.num}</span>
            <span className='text-[11px] text-white/70 tracking-[0.12em] uppercase font-medium block mt-1.5'>{stat.label}</span>
          </div>
        ))}
      </section>

      <section className='bg-white px-7 py-14 lg:px-16 lg:py-[72px] grid grid-cols-1 md:grid-cols-[0.82fr_1.18fr] gap-9 lg:gap-12 items-center'>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src='https://www.nocorealtor.com/fred.jpg' alt='Fred Porter, Broker and Owner of Porter Real Estate' loading='lazy' className='w-full max-w-[380px] mx-auto aspect-[4/5] object-cover rounded shadow-[0_8px_30px_-12px_rgba(0,0,0,0.25)]' />
        <div>
          <SectionLabel>Meet your agent</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-1'>Fred Porter</h2>
          <p className='font-condensed text-lg uppercase tracking-[0.04em] text-primary font-bold mb-5'>Broker / Owner · Serving Northern Colorado since 2013</p>
          <p className='text-base leading-relaxed text-[#555] font-light mb-4'>Fred spent two decades as an engineer before taking a leap into real estate in 2013. He brings that same engineer&apos;s mindset to selling homes — a clear, systematic, step-by-step process that takes the stress out of selling and gets his clients the best possible price.</p>
          <p className='text-base leading-relaxed text-[#555] font-light'>Thirty-plus years in Fort Collins means Fred knows these neighborhoods inside out — the schools, the trails, the market. And because Porter Real Estate is family-run, every client gets personal, honest attention a big-box brokerage simply can&apos;t match.</p>
          <div className='flex flex-wrap gap-2 mt-5'>
            {['Engineer-turned-realtor', 'Family-run brokerage', '$50M+ sold in 2024', 'Hundreds of homes sold'].map((chip) => (
              <span key={chip} className='bg-[#F8F6F2] border border-black/10 rounded-full px-3.5 py-1.5 text-xs font-semibold text-primary'>{chip}</span>
            ))}
          </div>
        </div>
      </section>

      <section id='how-it-works' className='bg-black px-7 py-14 lg:px-16 lg:py-[72px]'>
        <SectionLabel>Simple from start to finish</SectionLabel>
        <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-4 text-white'>How your free valuation works</h2>
        <p className='text-base leading-relaxed text-white/[0.62] max-w-[600px] font-light mb-9'>A straightforward way to understand your home&apos;s value, with a local expert in your corner.</p>
        <div className='grid grid-cols-1 lg:grid-cols-3 gap-5'>
          {steps.map((step, i) => (
            <div key={step.title} className='bg-white/[0.04] border border-white/10 rounded-lg p-7 lg:p-8'>
              <div className='w-12 h-12 rounded-full bg-primary flex items-center justify-center font-condensed text-xl font-black text-white shrink-0 mb-4'>{i + 1}</div>
              <div className='font-condensed text-[22px] font-bold uppercase tracking-[0.04em] text-white mb-2'>{step.title}</div>
              <p className='text-sm leading-[1.68] text-white/60 font-light'>{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className='px-7 py-14 lg:px-16 lg:py-[72px] grid grid-cols-1 md:grid-cols-[1.1fr_0.9fr] gap-9 lg:gap-12 items-center'>
        <div>
          <SectionLabel>Why Porter Real Estate</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-7'>A local family who sells homes the right way</h2>
          <ul className='grid gap-5'>
            {reasons.map(([title, text]) => (
              <li key={title} className='flex gap-3.5 items-start text-sm leading-relaxed text-[#555]'>
                <span className='flex-none w-8 h-8 rounded bg-primary/10 text-primary flex items-center justify-center font-bold'>✓</span>
                <span><b className='text-black'>{title}</b> {text}</span>
              </li>
            ))}
          </ul>
        </div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src='https://www.nocorealtor.com/footer-fred-isabella.jpg' alt='Fred Porter and daughter Isabella — the family team behind Porter Real Estate' loading='lazy' className='w-full aspect-square object-cover rounded' />
      </section>

      <section className='bg-white px-7 py-14 lg:px-16 lg:py-[72px]'>
        <SectionLabel>Real clients, real results</SectionLabel>
        <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-8'>What Northern Colorado homeowners say</h2>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
          {testimonials.map((testimonial) => (
            <div key={testimonial.meta} className='bg-[#F8F6F2] rounded p-7 relative border-l-4 border-primary'>
              <span className='font-serif text-[86px] text-primary/10 absolute top-1 left-5 leading-none select-none'>&ldquo;</span>
              <div className='text-[#F5B301] tracking-[0.12em] mb-3 relative z-[1]'>★★★★★</div>
              <p className='font-serif text-base leading-[1.65] italic text-black mb-5 relative z-[1]'>{testimonial.text}</p>
              <div className='text-[11px] font-semibold uppercase tracking-[0.12em] text-secondary'>{testimonial.meta}</div>
            </div>
          ))}
        </div>
      </section>

      <section className='bg-[#F8F6F2] px-7 py-14 lg:px-16 lg:py-[72px]'>
        <div className='text-center max-w-[640px] mx-auto mb-9'>
          <SectionLabel className='justify-center'>Proudly local</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-3'>Serving all of Northern Colorado</h2>
          <p className='text-base text-[#555] font-light'>From Fort Collins to the foothills — if it&apos;s NoCo, Fred knows it.</p>
        </div>
        <div className='flex flex-wrap justify-center gap-2.5 max-w-[760px] mx-auto mb-9'>
          {towns.map((town) => <span key={town} className='bg-white border border-black/10 rounded-full px-4 py-2 text-sm font-semibold text-primary'>{town}</span>)}
        </div>
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
          {[
            ['fort-collins.jpg', 'Fort Collins'],
            ['boulder.jpg', 'Boulder'],
            ['denver.jpg', 'Denver'],
          ].map(([file, name]) => (
            <figure key={name} className='rounded overflow-hidden relative'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={`https://www.nocorealtor.com/${file}`} alt={`${name}, Colorado`} loading='lazy' className='aspect-[3/2] object-cover w-full' />
              <figcaption className='absolute left-3.5 bottom-3 text-white font-condensed font-bold uppercase tracking-[0.08em] text-lg [text-shadow:0_2px_10px_rgba(0,0,0,0.6)]'>{name}</figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className='bg-white px-7 py-14 lg:px-16 lg:py-[72px]'>
        <div className='text-center max-w-[640px] mx-auto mb-9'>
          <SectionLabel className='justify-center'>Good to know</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold'>Questions, answered</h2>
        </div>
        <div className='max-w-[780px] mx-auto'>
          {faqs.map(([question, answer], i) => (
            <details key={question} open={i === 0} className='border border-black/10 rounded mb-3 bg-[#F8F6F2] overflow-hidden group'>
              <summary className='px-5 py-4 font-condensed text-lg font-bold uppercase tracking-[0.03em] cursor-pointer flex justify-between items-center gap-3 list-none [&::-webkit-details-marker]:hidden'>
                {question}<span className='text-primary text-2xl leading-none group-open:before:content-["–"] before:content-["+"]' />
              </summary>
              <div className='px-5 pb-4 text-sm leading-relaxed text-[#555]'>{answer}</div>
            </details>
          ))}
        </div>
      </section>

      <section className='relative overflow-hidden bg-black text-white text-center px-7 py-16 lg:px-16 lg:py-20'>
        <div className='absolute inset-0 bg-cover bg-center opacity-30' style={{ backgroundImage: "url('https://www.nocorealtor.com/home-header.jpg')" }} />
        <div className='relative z-[1]'>
          <h2 className='font-serif text-3xl lg:text-[42px] leading-[1.12] font-bold mb-3'>Find out what your home is worth</h2>
          <p className='text-white/75 text-base lg:text-lg max-w-[560px] mx-auto mb-7'>Free, no-obligation, and prepared by Northern Colorado&apos;s trusted family-run realtor.</p>
          <a href='#valuation' className='inline-flex bg-primary text-white font-condensed font-bold text-[15px] tracking-[0.12em] uppercase px-8 py-4 rounded-sm hover:bg-[#8B0A0C]'>Get My Free Home Value Report</a>
          <div className='mt-4 text-sm text-white/65'>or call Fred direct at <a href='tel:+19705108414' className='text-primary font-bold'>(970) 510-8414</a></div>
        </div>
      </section>
    </div>
    <Footer />
  </div>
)

export default HomeValuationPage
