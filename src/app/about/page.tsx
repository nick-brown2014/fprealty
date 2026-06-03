import { Metadata } from "next";
import Nav from "@/app/components/Nav";
import Footer from "@/app/components/Footer";

export const metadata: Metadata = {
  title: "About Porter Real Estate | Your Northern Colorado Realtors",
  description: "Meet the team at Porter Real Estate. Local experts serving Northern Colorado with personalized real estate services, market expertise, and exceptional client care.",
  openGraph: {
    title: "About Porter Real Estate | Northern Colorado Realtors",
    description: "Your trusted real estate partners in Northern Colorado.",
  },
};

const values = [
  {
    icon: "🎯",
    title: "Expertise",
    text: "Decades of NoCo market knowledge, an engineer's eye for property, and the negotiation experience to protect every client at the closing table.",
  },
  {
    icon: "🤝",
    title: "Honesty",
    text: "Real numbers. Real assessments. We tell you what your home is actually worth — and what a property is actually worth buying — every time.",
  },
  {
    icon: "🛡️",
    title: "Integrity",
    text: "We live here, raise our families here, and stake our reputation on every transaction. Your interests come first. Always.",
  },
];

const stats = [
  { num: "30+", label: "Years in Fort Collins" },
  { num: "$10M+", label: "Annual Sales (2024)" },
  { num: "100s", label: "Families Served" },
  { num: "1", label: "Family Business" },
];

const SectionLabel = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`font-condensed text-xs font-bold tracking-[0.22em] uppercase text-primary flex items-center gap-2.5 mb-3.5 ${className}`}>
    <span className='block w-5 h-0.5 bg-current' />
    {children}
  </div>
);

const About = () => {
  return (
    <div className='w-full font-body bg-[#F8F6F2] text-black'>
      <Nav alwaysSolid />
      <div className='max-w-[960px] mx-auto pt-20'>
        {/* HERO */}
        <section className='relative overflow-hidden min-h-[520px] flex flex-col bg-black'>
          <div
            className='absolute inset-0 bg-cover bg-center bg-no-repeat'
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(2,1,0,0.55) 0%, rgba(2,1,0,0.82) 100%), url('/about-header.jpeg')",
            }}
          />
          <div className='relative z-[2] flex-1 flex flex-col justify-between px-7 py-10 lg:px-16 lg:pt-16 lg:pb-14'>
            <div className='flex items-center gap-3 flex-wrap mb-9'>
              <div className='font-condensed font-black text-[15px] text-white tracking-[0.08em] uppercase border-[1.5px] border-white/40 px-4 py-[7px] rounded-sm'>
                PR / Porter Real Estate
              </div>
              <span className='text-xs text-white/55 tracking-[0.14em] uppercase font-medium'>
                A NoCo Family Business
              </span>
            </div>
            <div>
              <div className='font-condensed font-bold text-[13px] tracking-[0.2em] uppercase text-primary mb-5 flex items-center gap-3'>
                <span className='block w-7 h-0.5 bg-primary' />
                Meet the Team
              </div>
              <h1 className='font-serif text-4xl lg:text-[58px] leading-[1.04] text-white font-bold max-w-[640px] mb-7'>
                More Than Realtors — A <em className='italic text-[#90A4AE]'>Family</em> Helping NoCo Families Move Forward.
              </h1>
              <p className='text-base lg:text-[17px] leading-relaxed text-white/70 max-w-[520px] font-light'>
                We live here. We raised our kids here. And we&#39;ve spent thirty years learning every neighborhood, every market shift, and every reason people fall in love with Northern Colorado.
              </p>
            </div>
          </div>
        </section>

        {/* INTRO / VALUES INTRO */}
        <section className='bg-white px-7 py-14 lg:px-16 lg:py-[72px]'>
          <SectionLabel>What Makes Us Different</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-6 text-black max-w-[640px]'>
            Real Estate Is Personal — And So Are We.
          </h2>
          <p className='text-base lg:text-[17px] leading-relaxed text-[#555] font-light max-w-[640px] mb-5'>
            At Porter Real Estate, we&#39;re more than a real estate company — we&#39;re a family helping other families make confident moves in Northern Colorado. With deep roots in the community and decades of combined experience, we offer a personalized, honest approach that big-box brokerages can&#39;t match.
          </p>
          <p className='text-base lg:text-[17px] leading-relaxed text-[#555] font-light max-w-[640px]'>
            We know what makes each neighborhood special — from the best trails and schools to the local breweries and community events. Whether you&#39;re buying your first home, right-sizing for the next chapter, or investing in your future, we guide every step with integrity and a genuine commitment to what&#39;s best for you.
          </p>
        </section>

        {/* VALUES */}
        <section className='bg-[#F8F6F2] px-7 py-14 lg:px-16 lg:py-[72px]'>
          <SectionLabel>Our Values</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.12] font-bold mb-10 text-black max-w-[600px]'>
            Expertise. Honesty. Integrity.
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-3.5'>
            {values.map((v) => (
              <div
                key={v.title}
                className='bg-white border border-black/10 rounded p-7 transition-colors hover:border-primary/40'
              >
                <div className='text-3xl mb-4'>{v.icon}</div>
                <div className='font-condensed text-[18px] font-bold uppercase tracking-[0.04em] text-black mb-2.5'>{v.title}</div>
                <div className='text-sm text-[#555] leading-[1.65] font-light'>{v.text}</div>
              </div>
            ))}
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
        </section>

        {/* FRED PORTER */}
        <section className='bg-[#1a2226] px-7 py-14 lg:px-16 lg:py-[72px]'>
          <SectionLabel className='text-primary'>Broker / Owner</SectionLabel>
          <div className='grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-10 lg:gap-14 items-start'>
            <div>
              <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.1] font-bold mb-2 text-white'>
                Fred Porter
              </h2>
              <div className='font-condensed text-[13px] font-bold tracking-[0.18em] uppercase text-[#90A4AE] mb-7'>
                30 Years in Fort Collins · Engineer Turned Broker
              </div>
              <p className='text-[15px] lg:text-base leading-[1.78] text-white/70 font-light mb-5'>
                Fred moved to Fort Collins in 1992 and earned a Chemical Engineering degree from Colorado State University. He spent two decades as an environmental and process engineer — including 8 years at New Belgium Brewing — before taking the leap into real estate full-time in 2013. Early on, he carved out a niche in Red Feather Lakes and Livermore, then expanded into Fort Collins by applying an &ldquo;engineering approach&rdquo; that turned every transaction into a clear, step-by-step process.
              </p>
              <p className='text-[15px] lg:text-base leading-[1.78] text-white/70 font-light mb-5'>
                In 2019 he opened Porter Real Estate, and in 2023 he brought on his daughter Isabella — making it a true family-run business. With over 30 years in Fort Collins and $10M+ in 2024 sales, Fred has helped hundreds of families buy and sell across Northern Colorado.
              </p>
              <p className='text-[15px] lg:text-base leading-[1.78] text-white/70 font-light'>
                Outside the office, Fred skis Cameron Pass, rides Blue Sky to the Devil&#39;s Backbone, volunteers as a roller derby skating official, and trains at CrossFit DNR. He especially loves introducing newcomers to everything that makes NoCo home.
              </p>
              <div className='mt-7 flex gap-2 flex-wrap'>
                {["Chemical Engineer, CSU '97", "Rural & Mountain Specialist", "Fort Collins Local Since 1992", "Family-Run Brokerage"].map((chip) => (
                  <span
                    key={chip}
                    className='text-[11px] font-medium tracking-[0.08em] uppercase bg-primary/20 text-[#F48882] px-3 py-[5px] rounded-sm border border-primary/30'
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
            <div className='order-first lg:order-last'>
              <img
                src='/fred.jpg'
                alt='Fred Porter, Broker/Owner of Porter Real Estate'
                className='w-full h-auto rounded-sm border border-white/10'
              />
            </div>
          </div>
        </section>

        {/* ISABELLA */}
        <section className='bg-white px-7 py-14 lg:px-16 lg:py-[72px]'>
          <SectionLabel>Marketing Specialist</SectionLabel>
          <div className='grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10 lg:gap-14 items-start'>
            <div>
              <img
                src='/isabella.jpg'
                alt='Isabella Marcus-Porter, Marketing Specialist'
                className='w-full h-auto rounded-sm border border-black/10'
              />
            </div>
            <div>
              <h2 className='font-serif text-3xl lg:text-[40px] leading-[1.1] font-bold mb-2 text-black'>
                Isabella Marcus-Porter
              </h2>
              <div className='font-condensed text-[13px] font-bold tracking-[0.18em] uppercase text-[#90A4AE] mb-7'>
                Colorado Native · Journalism, UNC
              </div>
              <p className='text-[15px] lg:text-base leading-[1.78] text-[#555] font-light mb-5'>
                Isabella is a Colorado native — born and raised in Fort Collins with time spent in Livermore. She earned her bachelor&#39;s degree in journalism at the University of Northern Colorado, where she honed her craft writing stories, producing podcasts, and recording and editing video for the school&#39;s news team.
              </p>
              <p className='text-[15px] lg:text-base leading-[1.78] text-[#555] font-light mb-5'>
                As the newest addition to Porter Real Estate, Isabella runs marketing — photography, videography, content development, social media, and listing documentation. Her creative eye gives every Porter Real Estate property a stronger, more consistent presence, delivering better market exposure for clients.
              </p>
              <p className='text-[15px] lg:text-base leading-[1.78] text-[#555] font-light'>
                Before joining the family business, Isabella worked at local NoCo staples like Rollerland and Fort Fun. When she&#39;s off the clock, you&#39;ll find her at FoCo Women&#39;s Roller Derby.
              </p>
              <div className='mt-7 flex gap-2 flex-wrap'>
                {["Journalism, UNC", "Photo & Video", "Social Media", "Fort Collins Native"].map((chip) => (
                  <span
                    key={chip}
                    className='text-[11px] font-medium tracking-[0.08em] uppercase bg-primary/10 text-primary px-3 py-[5px] rounded-sm border border-primary/25'
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAMILY PHOTO + QUOTE */}
        <section className='bg-[#F8F6F2] px-7 py-14 lg:px-16 lg:py-[72px]'>
          <div className='grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center'>
            <div>
              <img
                src='/footer-fred-isabella.jpg'
                alt='Fred and Isabella Porter'
                className='w-full h-auto rounded-sm border border-black/10'
              />
            </div>
            <div>
              <SectionLabel>A Family Business</SectionLabel>
              <h2 className='font-serif text-3xl lg:text-[38px] leading-[1.12] font-bold mb-6 text-black'>
                When You Work With Porter, You Work With Family.
              </h2>
              <p className='text-base leading-[1.75] text-[#555] font-light'>
                No call centers. No handoffs to junior agents. Just Fred and Isabella — a father and daughter who treat every client like one of our own. Thirty years of expertise, a true family business, and a genuine commitment to your move.
              </p>
            </div>
          </div>
        </section>

        {/* FINAL CTA */}
        <section className='bg-primary px-7 py-16 lg:px-16 lg:py-20 text-center'>
          <SectionLabel className='justify-center text-white/70 [&>span]:bg-white/50'>Let&#39;s Talk</SectionLabel>
          <h2 className='font-serif text-3xl lg:text-[46px] font-bold text-white leading-[1.1] mb-4'>
            Ready to Make Your NoCo Move?
          </h2>
          <p className='text-base lg:text-[17px] text-white/[0.78] font-light leading-relaxed max-w-[500px] mx-auto mb-11'>
            Whether you&#39;re buying, selling, or just kicking the tires — Fred answers his own phone. Give him a call.
          </p>
          <a
            href='tel:9705108414'
            className='group bg-white text-primary font-condensed font-extrabold text-base tracking-[0.14em] uppercase px-13 py-5 rounded-sm inline-grid transition-opacity hover:opacity-90'
          >
            <span className='col-start-1 row-start-1 transition-opacity duration-300 ease-out group-hover:opacity-0'>Call Fred Directly</span>
            <span className='col-start-1 row-start-1 opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100'>(970) 510-8414</span>
          </a>
          <span className='block text-[13px] text-white/65 tracking-[0.1em] mt-6 font-medium'>
            (970) 510-8414 &nbsp;·&nbsp; www.nocorealtor.com
          </span>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default About;
