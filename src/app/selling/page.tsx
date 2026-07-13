import { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import SellingWizard from "@/app/components/wizards/SellingWizard";

export const metadata: Metadata = {
  title: "Sell Your NoCo Home | Fred Porter | Porter Real Estate",
  description: "Sell your Northern Colorado home fast with Fred Porter — a 30-year Fort Collins local who lists, markets, and closes your home personally, every time.",
  openGraph: {
    title: "Sell Your Home in Northern Colorado | Porter Real Estate",
    description: "Get the best price for your NoCo home with expert listing agent Fred Porter at Porter Real Estate.",
  },
};

const whyCards = [
  {
    icon: "🎯",
    title: "Hyper-Local Pricing",
    text: "Fred has watched Fort Collins neighborhoods evolve for three decades. Your pricing isn't just a Zestimate — it's grounded in streets he drives every day.",
  },
  {
    icon: "⚡",
    title: "One Agent, Zero Handoffs",
    text: "You call Fred. Fred answers. You get the same experienced agent who listed your home through every showing, every offer, and every negotiation.",
  },
  {
    icon: "📸",
    title: "Pro-Grade Marketing",
    text: "Professional photography, targeted digital ads, Instagram campaigns, and email blasts — your home gets maximum visibility before it hits the MLS.",
  },
  {
    icon: "🏡",
    title: "Rural Property Expertise",
    text: "Red Feather Lakes, Livermore, rural Larimer County — not every agent can navigate well permits, acreage comps, and county roads. Fred can.",
  },
  {
    icon: "📊",
    title: "Data-Driven Strategy",
    text: "Days on market, absorption rates, neighborhood-level price trends. Every decision is backed by current NoCo market data, not gut feelings.",
  },
  {
    icon: "🤝",
    title: "Honest. Always.",
    text: "Fred will tell you what your home is actually worth — not what you want to hear. Overpriced homes sit. He'd rather sell yours fast and for top dollar.",
  },
];

const testimonials = [
  {
    text: "Fred priced our Old Fort Collins High School home better than two other agents we interviewed. We had multiple offers in four days and closed over asking. He was reachable every single time we called — that alone was worth everything.",
    meta: "— Sarah & Mike T., Historic Old Fort Collins HS District",
  },
  {
    text: "We had a complicated rural property out toward Livermore. Fred knew the area, knew the comps, knew what buyers were looking for. We didn't have to educate our own agent. That was a first.",
    meta: "— Dan R., Rural Larimer County",
  },
];

const processSteps = [
  {
    time: "Day 1 — Free & Fast",
    title: "Strategy Call + Home Valuation",
    desc: "Fred talks through your timeline, your goals, your situation. Then delivers a no-fluff Comparative Market Analysis — an honest number backed by real NoCo data, not an algorithm.",
    chips: ["Free CMA", "No obligation", "Same-day turnaround"],
  },
  {
    time: "Days 2–5 — Get Ready",
    title: "Prep, Staging Guidance & Photography",
    desc: "Fred walks through your home and gives you a prioritized punch list — only the fixes that move the needle. Then professional photos are scheduled. First impressions are digital. We nail them.",
    chips: ["Pro photography", "Staging consult", "Pre-listing checklist"],
  },
  {
    time: "Day 5–7 — Go Live",
    title: "Strategic Launch & Maximum Exposure",
    desc: "Your listing hits the MLS, Zillow, Realtor.com — and Fred's targeted digital ad campaigns, Instagram posts, and email lists go live simultaneously. Flood the market on day one.",
    chips: ["MLS + all portals", "Instagram / social", "Email campaign", "Digital ads"],
  },
  {
    time: "Ongoing — Fred Is There",
    title: "Showings & Buyer Communication",
    desc: "Every showing is tracked. Every buyer is followed up with — by Fred. You get weekly updates, feedback from every showing, and honest market intel. No silence, no guessing.",
    chips: ["Showing feedback", "Weekly reports", "Fred answers directly"],
  },
  {
    time: "Offer Stage",
    title: "Offer Review, Negotiation & Selection",
    desc: "When offers come in, Fred breaks down every term — price, contingencies, closing timeline, strength of buyer. He negotiates hard for you, and gives you a straight recommendation, not a sales pitch.",
    chips: ["Side-by-side offer analysis", "Counter-offer strategy", "Net proceeds breakdown"],
  },
  {
    time: "Closing Day",
    title: "Contract to Close — Zero Surprises",
    desc: "Inspections, appraisals, title work — Fred manages every moving part through closing. When you sit down at the closing table, there are no surprises. Just a check and the keys handed over.",
    chips: ["Inspection management", "Title coordination", "Closing day presence"],
  },
];

const stats = [
  { num: "30+", label: "Years in Fort Collins" },
  { num: "97%", label: "List-to-Sale Price" },
  { num: "21", label: "Avg. Days on Market" },
  { num: "1", label: "Agent. Always." },
];

const photos = [
  { src: "https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=700&q=80", alt: "Fort Collins home", tall: true },
  { src: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&q=80", alt: "NoCo home", tall: false },
  { src: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=400&q=80", alt: "Colorado home", tall: false },
];

const photosWide = [
  { src: "https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=600&q=80", alt: "Rural NoCo property" },
  { src: "https://images.unsplash.com/photo-1549517045-bc93de075e53?w=600&q=80", alt: "Colorado mountain home" },
];

const neighborhoods = [
  { name: "Old Fort Collins HS", desc: "Historic prestige, unique architecture, strong buyer demand for character homes." },
  { name: "Highlander Heights", desc: "Speed-of-sale play — move-in ready buyers, competitive pricing, fast turnover." },
  { name: "University Acres", desc: "Investment buyer pool, CSU proximity, strong rental demand driving prices." },
  { name: "Timnath & Wellington", desc: "Suburban growth corridors — new construction comps, growing buyer pools." },
  { name: "Red Feather & Livermore", desc: "Rural acreage, mountain properties, well permits — specialized expertise required." },
  { name: "Huntington Hills", desc: "Established neighborhood, stable equity, strong family buyer demographic." },
];

const SectionLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`font-condensed text-xs font-bold tracking-[0.22em] uppercase text-primary flex items-center gap-2.5 mb-3.5 ${className}`}>
    <span className='block w-5 h-0.5 bg-current' />
    {children}
  </div>
);

const SellingPage = () => {
  return (
    <div className='w-full font-body bg-[#F8F6F2] text-black'>
      <Nav alwaysSolid />
      <div className='max-w-[1280px] mx-auto pt-20 pb-10'>
        {/* HERO */}
        <section className='relative overflow-hidden min-h-[560px] flex flex-col bg-black'>
          <div
            className='absolute inset-0 bg-cover bg-center bg-no-repeat'
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(2,1,0,0.55) 0%, rgba(2,1,0,0.82) 100%), url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1400&q=80')",
            }}
          />
          <div className='relative z-[2] flex-1 flex flex-col justify-between px-7 py-10 lg:px-16 lg:pt-16 lg:pb-14'>
            <div className='flex items-center gap-3 flex-wrap mb-9'>
              <div className='font-condensed font-black text-[15px] text-white tracking-[0.08em] uppercase border-[1.5px] border-white/40 px-4 py-[7px] rounded-sm'>
                PR / Porter Real Estate
              </div>
              <span className='text-xs text-white/55 tracking-[0.14em] uppercase font-medium'>
                NoCo&#39;s Local Expert
              </span>
            </div>
            <div>
              <div className='font-condensed font-bold text-[13px] tracking-[0.2em] uppercase text-primary mb-5 flex items-center gap-3'>
                <span className='block w-7 h-0.5 bg-primary' />
                Fort Collins &amp; Northern Colorado
              </div>
              <h1 className='font-serif text-4xl lg:text-[58px] leading-[1.04] text-white font-bold max-w-[620px] mb-7'>
                Sell Your Home <em className='italic text-[#90A4AE]'>Fast</em> — With the Agent Who Shows Up.
              </h1>
              <p className='text-base lg:text-[17px] leading-relaxed text-white/70 max-w-[500px] font-light mb-11'>
                No team. No handoffs. No corporate runaround. Just Fred Porter — a 30-year Fort Collins local who lists, markets, and closes your home personally, every time.
              </p>
              <div className='flex gap-4 items-center flex-wrap'>
                <a
                  href='#valuation'
                  className='bg-primary text-white font-condensed font-bold text-[15px] tracking-[0.12em] uppercase px-10 py-[17px] rounded-sm transition-colors hover:bg-[#8B0A0C]'
                >
                  Get My Free Home Value
                </a>
                <a
                  href='#process'
                  className='text-white font-condensed font-semibold text-sm tracking-[0.1em] uppercase border border-white/35 px-9 py-4 rounded-sm transition-colors hover:border-white/70'
                >
                  See Our Process
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* STAT BAR */}
        <section className='bg-primary px-7 py-6 lg:px-16 grid grid-cols-2 md:grid-cols-4'>
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className={`text-center px-0 py-2 md:py-0 ${i < stats.length - 1 ? 'md:border-r md:border-white/20' : ''}`}
            >
              <span className='font-condensed text-[38px] font-black text-white leading-none block'>{stat.num}</span>
              <span className='text-[11px] text-white/70 tracking-[0.12em] uppercase font-medium block mt-1.5'>{stat.label}</span>
            </div>
          ))}
        </section>

        {/* PHOTOS */}
        <section className='bg-white px-7 py-14 lg:px-16 lg:py-[72px]'>
          <SectionLabel>Northern Colorado Homes</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-4 text-black'>
            From Fort Collins Neighborhoods to Rural Larimer County
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-[2fr_1fr_1fr] gap-3 mt-8 mb-3'>
            {photos.map((photo) => (
              <div key={photo.src} className='rounded overflow-hidden bg-[#37474F]'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading='lazy'
                  className={`w-full h-full object-cover block ${photo.tall ? 'min-h-[300px]' : 'min-h-[160px]'}`}
                />
              </div>
            ))}
          </div>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-3'>
            {photosWide.map((photo) => (
              <div key={photo.src} className='rounded overflow-hidden bg-[#37474F]'>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo.src}
                  alt={photo.alt}
                  loading='lazy'
                  className='w-full h-full object-cover block min-h-[160px]'
                />
              </div>
            ))}
          </div>
        </section>

        {/* WHY FRED */}
        <section className='px-7 py-14 lg:px-16 lg:py-[72px]'>
          <SectionLabel>Why Sellers Choose Fred Porter</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-3 text-black'>
            The Difference Is Simple. It&#39;s Always Fred.
          </h2>
          <p className='text-base leading-relaxed text-[#555] max-w-[600px] font-light mb-13'>
            When big teams hand you off to an assistant, deals fall through the cracks. With Fred Porter, your listing gets his undivided expertise — start to closing table.
          </p>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5 mt-13'>
            {whyCards.map((card) => (
              <div key={card.title} className='bg-[#F8F6F2] rounded p-7 border-l-[3px] border-primary'>
                <span className='text-[28px] mb-3.5 block'>{card.icon}</span>
                <div className='font-condensed text-lg font-bold uppercase tracking-[0.06em] text-black mb-2'>{card.title}</div>
                <p className='text-sm leading-relaxed text-[#666]'>{card.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className='bg-white px-7 pt-6 pb-14 lg:px-16'>
          {testimonials.map((t) => (
            <div
              key={t.meta}
              className='bg-[#F8F6F2] rounded p-8 lg:px-13 lg:py-10 mb-5 relative border-l-4 border-primary'
            >
              <span className='font-serif text-[96px] text-primary/10 absolute top-2 left-7 leading-none select-none'>&ldquo;</span>
              <p className='font-serif text-lg leading-[1.7] italic text-black mb-5 relative z-[1]'>{t.text}</p>
              <div className='text-[13px] font-semibold uppercase tracking-[0.12em] text-secondary'>{t.meta}</div>
            </div>
          ))}
        </section>

        {/* PROCESS */}
        <section id='process' className='bg-black px-7 py-14 lg:px-16 lg:py-[72px]'>
          <div className='font-condensed text-xs font-bold tracking-[0.22em] uppercase text-[#F48882] flex items-center gap-2.5 mb-3.5'>
            <span className='block w-5 h-0.5 bg-primary' />
            The Fred Porter Selling Process
          </div>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-4 text-white'>
            6 Steps From Decision to Closed.
          </h2>
          <p className='text-base leading-relaxed text-white/[0.62] max-w-[600px] font-light mb-13'>
            A predictable, transparent process built around getting you to the table faster — at the highest price the market will bear.
          </p>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-5'>
            {processSteps.map((step, i) => (
              <div
                key={step.title}
                className='bg-white/[0.04] border border-white/10 rounded-lg p-7 lg:p-8'
              >
                <div className='flex items-center gap-4 mb-4'>
                  <div className='w-12 h-12 rounded-full bg-primary flex items-center justify-center font-condensed text-xl font-black text-white shrink-0'>
                    {i + 1}
                  </div>
                  <div className='text-[11px] font-semibold tracking-[0.16em] uppercase text-[#90A4AE]'>{step.time}</div>
                </div>
                <div className='font-condensed text-[22px] font-bold uppercase tracking-[0.04em] text-white mb-2.5'>{step.title}</div>
                <p className='text-sm leading-[1.68] text-white/60 font-light'>{step.desc}</p>
                <div className='mt-3.5 flex gap-2 flex-wrap'>
                  {step.chips.map((chip) => (
                    <span
                      key={chip}
                      className='text-[11px] font-medium tracking-[0.08em] uppercase bg-primary/20 text-[#F48882] px-3 py-[5px] rounded-sm border border-primary/30'
                    >
                      {chip}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* NEIGHBORHOODS */}
        <section className='bg-[#37474F] px-7 py-14 lg:px-16 lg:py-[72px]'>
          <SectionLabel>Market Coverage</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-4 text-white'>
            Fred Knows Every Corner of NoCo.
          </h2>
          <p className='text-base leading-relaxed text-white/60 max-w-[600px] font-light mb-13'>
            Whether you&#39;re in a historic Fort Collins neighborhood or on 20 acres outside Livermore — Fred knows the market, the buyers, and the pricing dynamics specific to your area.
          </p>
          <div className='grid grid-cols-2 md:grid-cols-3 gap-3.5'>
            {neighborhoods.map((hood) => (
              <div
                key={hood.name}
                className='bg-white/[0.06] border border-white/10 rounded p-5 transition-colors hover:bg-primary/[0.12] hover:border-primary/35'
              >
                <div className='font-condensed text-[17px] font-bold uppercase tracking-[0.06em] text-white mb-2'>{hood.name}</div>
                <div className='text-[13px] text-white/50 leading-snug'>{hood.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* VALUATION WIZARD */}
        <section id='valuation' className='bg-white px-4 py-14 lg:px-16 lg:py-[72px] flex flex-col items-center'>
          <div className='w-full max-w-[600px] text-center'>
            <SectionLabel className='justify-center'>Get Your Free Home Value</SectionLabel>
            <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-4 text-black'>
              Let&#39;s Find Out What Your Home Is Worth.
            </h2>
            <p className='text-base leading-relaxed text-[#555] font-light mb-10'>
              Share a few quick details and schedule a no-pressure consultation with Fred — directly. No bait-and-switch valuations, just a real number from a real agent who knows your street.
            </p>
          </div>
          <SellingWizard />
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default SellingPage;
