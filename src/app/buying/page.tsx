import { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";
import NewListingsCarousel from "@/app/components/NewListingsCarousel";

export const metadata: Metadata = {
  title: "Buy a Home in Northern Colorado | Expert Buyer's Agents | Porter Real Estate",
  description: "Looking to buy a home in Northern Colorado? Work with experienced buyer's agents at Porter Real Estate. We'll guide you through every step of the home buying process.",
  openGraph: {
    title: "Buy a Home in Northern Colorado | Porter Real Estate",
    description: "Expert guidance for home buyers in NoCo. Find your dream home with Porter Real Estate.",
  },
};

const whyCards = [
  {
    icon: "🔧",
    title: "Engineering Edge",
    text: "Fred's technical background provides a second set of eyes on structural integrity and home systems that standard agents miss. You'll know what you're buying — before you sign.",
  },
  {
    icon: "🤝",
    title: "Skilled Negotiation",
    text: "High-level strategy at the closing table. Fred negotiates price, terms, contingencies, and credits to get you the strongest possible deal — not just the easiest one.",
  },
  {
    icon: "📍",
    title: "Hyper-Local Expertise",
    text: "Fort Collins, Loveland, Timnath, Wellington, Red Feather — Fred knows the streets, the schools, the comps, and which neighborhoods are quietly trending up.",
  },
  {
    icon: "🛡️",
    title: "Full-Spectrum Support",
    text: "Pre-approval referrals, inspections, appraisals, final walkthroughs — every step handled with professional precision. You're never left guessing what comes next.",
  },
  {
    icon: "⚡",
    title: "One Agent. Always.",
    text: "You call Fred. Fred answers. No team handoffs, no junior agents showing homes — the same trusted advisor from your first showing to closing day.",
  },
  {
    icon: "🏔️",
    title: "Relocation Specialist",
    text: "Moving to NoCo from out of state? Fred guides relocating buyers through neighborhoods, schools, commutes, and lifestyle fit — not just listings.",
  },
];

const stats = [
  { num: "30+", label: "Years in Fort Collins" },
  { num: "100%", label: "Buyer Representation" },
  { num: "1", label: "Agent. Always." },
  { num: "$0", label: "Cost to Buyers*" },
];

const processSteps = [
  {
    time: "Step 1 — Discovery Call",
    title: "Understand Your Goals & Budget",
    desc: "Fred starts with a no-pressure conversation about your timeline, priorities, must-haves vs. nice-to-haves, and budget reality. Then connects you with trusted lenders for pre-approval if needed.",
    chips: ["Free consultation", "Lender referrals", "Budget clarity"],
  },
  {
    time: "Step 2 — Search Strategy",
    title: "Custom Search & Neighborhood Mapping",
    desc: "Together you map the neighborhoods, school districts, and property types that fit your life. Fred sets up tailored listing alerts so you see the right homes the moment they hit the market.",
    chips: ["Curated alerts", "Neighborhood deep-dives", "School matching"],
  },
  {
    time: "Step 3 — Showings",
    title: "Walk Properties With An Expert",
    desc: "Fred walks every property with you personally — pointing out structural concerns, system age, layout issues, and value drivers most buyers miss. No junior agent. Just Fred.",
    chips: ["Engineer's eye", "Honest assessments", "Fred is there"],
  },
  {
    time: "Step 4 — Offer & Negotiation",
    title: "Strategic Offer Crafting",
    desc: "When you find the one, Fred builds an offer that competes — strong terms, smart contingencies, leverage points. Then negotiates hard to protect your price, your timeline, and your interests.",
    chips: ["Offer strategy", "Counter-negotiation", "Term protection"],
  },
  {
    time: "Step 5 — Under Contract",
    title: "Inspections, Appraisal & Due Diligence",
    desc: "Fred manages inspectors, reviews reports line-by-line, identifies what's a red flag versus normal wear, and negotiates repair credits or seller concessions when warranted.",
    chips: ["Inspection guidance", "Repair negotiation", "Appraisal coordination"],
  },
  {
    time: "Closing Day",
    title: "Keys in Hand — Zero Surprises",
    desc: "Title work, final walkthrough, closing disclosures — Fred is at the table with you. When you sign, you understand every page. Then he hands you the keys.",
    chips: ["Final walkthrough", "Closing prep", "Keys delivered"],
  },
];

const neighborhoods = [
  { name: "Old Town Fort Collins", desc: "Historic character, walkability, and CSU proximity — a perennial demand market for buyers seeking lifestyle." },
  { name: "Timnath & Wellington", desc: "Newer construction, family-friendly suburbs, strong school districts, and growth corridors with appreciation upside." },
  { name: "Loveland & Berthoud", desc: "More space for the money, lake access, and a small-town feel within easy reach of Fort Collins amenities." },
  { name: "Red Feather & Livermore", desc: "Rural escapes, mountain views, well & septic — Fred navigates the specialized due diligence rural buyers need." },
  { name: "Windsor & Severance", desc: "Master-planned communities, golf course living, and a sweet spot between Fort Collins and Greeley." },
  { name: "University Acres", desc: "Walk-to-CSU charm, rental potential, and a stable buyer pool driving consistent demand year over year." },
];

const testimonials = [
  {
    text: "Fred walked through every house with us like he was buying it himself. He pointed out things we never would have caught — foundation issues, an aging HVAC, water staining behind the drywall. We bought a home we love, with eyes wide open.",
    meta: "— Jenna & Mark P., Relocated from Austin",
  },
  {
    text: "First-time buyers, so we had a million questions. Fred answered every single one — even at 9pm on a Sunday. We never felt rushed, never felt like just another transaction. He genuinely cared whether we found the right place.",
    meta: "— Alex & Priya S., Fort Collins First-Time Buyers",
  },
];

const SectionLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`font-condensed text-xs font-bold tracking-[0.22em] uppercase text-primary flex items-center gap-2.5 mb-3.5 ${className}`}>
    <span className='block w-5 h-0.5 bg-current' />
    {children}
  </div>
);

const BuyingPage = () => {
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
                "linear-gradient(180deg, rgba(2,1,0,0.55) 0%, rgba(2,1,0,0.82) 100%), url('/buying-header.jpeg')",
            }}
          />
          <div className='relative z-[2] flex-1 flex flex-col justify-between px-7 py-10 lg:px-16 lg:pt-16 lg:pb-14'>
            <div className='flex items-center gap-3 flex-wrap mb-9'>
              <div className='font-condensed font-black text-[15px] text-white tracking-[0.08em] uppercase border-[1.5px] border-white/40 px-4 py-[7px] rounded-sm'>
                PR / Porter Real Estate
              </div>
              <span className='text-xs text-white/55 tracking-[0.14em] uppercase font-medium'>
                Buyer Representation Done Right
              </span>
            </div>
            <div>
              <div className='font-condensed font-bold text-[13px] tracking-[0.2em] uppercase text-primary mb-5 flex items-center gap-3'>
                <span className='block w-7 h-0.5 bg-primary' />
                Fort Collins &amp; Northern Colorado
              </div>
              <h1 className='font-serif text-4xl lg:text-[58px] leading-[1.04] text-white font-bold max-w-[640px] mb-7'>
                Buy Your NoCo Home <em className='italic text-[#90A4AE]'>Smart</em> — With an Agent Who Sees What Others Miss.
              </h1>
              <p className='text-base lg:text-[17px] leading-relaxed text-white/70 max-w-[520px] font-light mb-11'>
                Engineering expertise. Sharp negotiation. Thirty years of NoCo market knowledge. Fred Porter walks every property with you — and tells you the truth about what you&#39;re buying.
              </p>
              <div className='flex gap-3.5 flex-wrap'>
                <Link
                  href='/search'
                  className='bg-primary text-white font-condensed font-extrabold text-sm tracking-[0.14em] uppercase px-8 py-4 rounded-sm inline-block transition-opacity hover:opacity-90'
                >
                  Start Searching
                </Link>
                <a
                  href='tel:9705108414'
                  className='group bg-white/10 backdrop-blur-sm text-white border border-white/30 font-condensed font-extrabold text-sm tracking-[0.14em] uppercase px-8 py-4 rounded-sm inline-grid transition-colors hover:bg-white/20'
                >
                  <span className='col-start-1 row-start-1 transition-opacity duration-300 ease-out group-hover:opacity-0'>Call Fred Directly</span>
                  <span className='col-start-1 row-start-1 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100'>(970) 510-8414</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* STATS STRIP */}
        <section className='bg-[#37474F] px-7 py-10 lg:px-16 lg:py-12'>
          <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
            {stats.map((stat) => (
              <div key={stat.label} className='text-center md:text-left'>
                <div className='font-serif text-4xl lg:text-[44px] font-bold text-white leading-none mb-2'>{stat.num}</div>
                <div className='text-[11px] font-semibold tracking-[0.16em] uppercase text-white/60'>{stat.label}</div>
              </div>
            ))}
          </div>
          <p className='text-[11px] text-white/40 mt-6 tracking-wide'>*Buyer&#39;s agent commissions are typically paid by the seller. Ask Fred for details.</p>
        </section>

        {/* INTRO */}
        <section className='bg-white px-7 py-14 lg:px-16 lg:py-[72px]'>
          <SectionLabel>The Porter Difference</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-6 text-black max-w-[640px]'>
            Buying a Home Is Too Important For an Agent Who Just Opens Doors.
          </h2>
          <p className='text-base lg:text-[17px] leading-relaxed text-[#555] font-light max-w-[640px] mb-5'>
            Buying a home is one of the most significant financial decisions you&#39;ll ever make. You deserve representation that goes beyond opening doors — someone who combines local market mastery with the technical expertise to spot what others miss.
          </p>
          <p className='text-base lg:text-[17px] leading-relaxed text-[#555] font-light max-w-[640px]'>
            Fred Porter brings extensive engineering knowledge to identify potential property issues, seasoned negotiation experience to protect your interests, and 30 years of NoCo expertise to ensure you&#39;re not just finding a house — you&#39;re making a sound investment in your family&#39;s future.
          </p>
        </section>

        {/* WHY CARDS */}
        <section className='bg-[#F8F6F2] px-7 py-14 lg:px-16 lg:py-[72px]'>
          <SectionLabel>Why Buyers Choose Fred</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-13 text-black max-w-[600px]'>
            Six Reasons Fred Is the Standard for Buyer Representation.
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 mt-10'>
            {whyCards.map((card) => (
              <div
                key={card.title}
                className='bg-white border border-black/10 rounded p-7 transition-colors hover:border-primary/40'
              >
                <div className='text-3xl mb-4'>{card.icon}</div>
                <div className='font-condensed text-[18px] font-bold uppercase tracking-[0.04em] text-black mb-2.5'>{card.title}</div>
                <div className='text-sm text-[#555] leading-[1.65] font-light'>{card.text}</div>
              </div>
            ))}
          </div>
        </section>

        {/* PROCESS */}
        <section className='bg-[#1a2226] px-7 py-14 lg:px-16 lg:py-[72px]'>
          <SectionLabel className='text-primary'>The Buying Process</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-4 text-white max-w-[600px]'>
            From First Showing to Keys in Hand.
          </h2>
          <p className='text-base leading-relaxed text-white/60 max-w-[600px] font-light mb-10'>
            Here&#39;s exactly what working with Fred looks like — every step, every conversation, every safeguard.
          </p>
          <div className='mt-8 grid grid-cols-1 lg:grid-cols-2 gap-5'>
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

        {/* NEW LISTINGS CAROUSEL */}
        <section className='bg-white px-7 py-14 lg:px-16 lg:py-[72px]'>
          <SectionLabel>Fresh on the Market</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-4 text-black max-w-[600px]'>
            The Latest NoCo Listings.
          </h2>
          <p className='text-base leading-relaxed text-[#555] font-light max-w-[600px] mb-10'>
            A taste of what&#39;s active right now. Want a personalized feed? Set up custom alerts and Fred will help you cut through the noise.
          </p>
          <div className='-mx-7 lg:-mx-16'>
            <NewListingsCarousel />
          </div>
        </section>

        {/* NEIGHBORHOODS */}
        <section className='bg-[#37474F] px-7 py-14 lg:px-16 lg:py-[72px]'>
          <SectionLabel>Where Fred Works</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-4 text-white'>
            NoCo Neighborhoods, Inside and Out.
          </h2>
          <p className='text-base leading-relaxed text-white/60 max-w-[600px] font-light mb-13'>
            Whether you&#39;re hunting in historic Old Town or scouting acreage outside Livermore — Fred knows the comps, the quirks, and the trends that shape every micro-market.
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

        {/* TESTIMONIALS */}
        <section className='bg-[#F8F6F2] px-7 py-14 lg:px-16 lg:py-[72px]'>
          <SectionLabel>Real Buyers, Real Results</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-10 text-black max-w-[600px]'>
            What NoCo Buyers Say About Working With Fred.
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-5'>
            {testimonials.map((t) => (
              <div
                key={t.meta}
                className='bg-white border border-black/10 rounded p-8'
              >
                <div className='font-serif text-3xl text-primary leading-none mb-4'>&ldquo;</div>
                <p className='text-[15px] leading-[1.7] text-[#333] font-light mb-5'>{t.text}</p>
                <div className='text-[12px] font-semibold tracking-[0.1em] uppercase text-black/55'>{t.meta}</div>
              </div>
            ))}
          </div>

          {/* Reviews widget */}
          <div className='mt-12'>
            <div className='font-condensed text-xs font-bold tracking-[0.22em] uppercase text-primary mb-5 flex items-center gap-2.5'>
              <span className='block w-5 h-0.5 bg-current' />
              More Reviews
            </div>
            <div className='w-full bg-white border border-black/10 rounded overflow-hidden'>
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
        </section>

        {/* FINAL CTA */}
        <section className='bg-primary px-7 py-16 lg:px-16 lg:py-20 text-center'>
          <SectionLabel className='justify-center text-white/70 [&>span]:bg-white/50'>Ready to Buy?</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[46px] font-bold text-white leading-[1.1] mb-4'>
            Get Personal NoCo Listing Alerts — Free.
          </h2>
          <p className='text-base lg:text-[17px] text-white/[0.78] font-light leading-relaxed max-w-[500px] mx-auto mb-11'>
            Set your criteria. Get matching listings the moment they hit the market. No spam, no junk — just the right homes, the moment they show up.
          </p>
          <div className='flex gap-3.5 flex-wrap justify-center'>
            <Link
              href='/search'
              className='bg-white text-primary font-condensed font-extrabold text-base tracking-[0.14em] uppercase px-13 py-5 rounded-sm inline-block transition-opacity hover:opacity-90'
            >
              Create My Alert
            </Link>
            <a
              href='tel:9705108414'
              className='group bg-transparent text-white border border-white/40 font-condensed font-extrabold text-base tracking-[0.14em] uppercase px-13 py-5 rounded-sm inline-grid transition-colors hover:bg-white/10'
            >
              <span className='col-start-1 row-start-1 transition-opacity duration-300 ease-out group-hover:opacity-0'>Call Fred</span>
              <span className='col-start-1 row-start-1 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100'>(970) 510-8414</span>
            </a>
          </div>
          <span className='block text-[13px] text-white/65 tracking-[0.1em] mt-6 font-medium'>
            Or call directly: (970) 510-8414 &nbsp;·&nbsp; www.nocorealtor.com
          </span>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default BuyingPage;
