import { Metadata } from "next";
import Nav from '@/app/components/Nav'
import Footer from '@/app/components/Footer';

export const metadata: Metadata = {
  title: "About Porter Real Estate | Your Northern Colorado Realtors",
  description: "Meet the team at Porter Real Estate. Local experts serving Northern Colorado with personalized real estate services, market expertise, and exceptional client care.",
  openGraph: {
    title: "About Porter Real Estate | Northern Colorado Realtors",
    description: "Your trusted real estate partners in Northern Colorado.",
  },
};

const About = () => {
  return (
    <div className='w-full h-full flex flex-col items-center'>
      <Nav />
      <div className='items-center w-full flex-col relative overflow-hidden min-h-74 lg:min-h-[400px] justify-center flex'>
        <img src='/about-header.jpeg' className='w-full h-auto absolute -z-10 brightness-50' />
        <h1 className='font-bold text-center tracking-tight text-3xl sm:text-5xl lg:text-8xl text-white'>About us</h1>
        <h2 className='mt-6 font-bold tracking-tight text-2xl lg:text-4xl text-white text-center'>
          What makes us unique
        </h2>
      </div>
      <div className='px-6 py-10 flex lg:flex-row flex-col lg:w-[1200px]'>
        <div className='flex justify-center w-full lg:w-[40%] lg:px-6'>
          <img src='/footer-fred-isabella.jpg' className='max-w-[280px] lg:max-w-unset w-full h-auto' />
        </div>
        <div className='flex-col w-full lg:w-[60%] pt-12'>
          <h3 className='text-primary text-xl lg:text-3xl font-semibold tracking-tight mb-8'>Expertise. Honesty. Integrity.</h3>
          <p>
            At Porter Real Estate, we&#39;re more than a real estate company—we&#39;re a family helping other families make confident moves in Northern Colorado.
            With deep roots in the community and decades of combined experience, we offer a personalized, honest approach that big-box brokerages can&#39;t match.
            We live here, raise our families here, and know what makes each neighborhood special—from the best trails and schools to the local breweries and community events.
            Whether you&#39;re buying your first home, right-sizing for the next chapter, or investing in your future, we guide every step with integrity, expertise, and a genuine commitment to what&#39;s best for you.
          </p>
          <h3 className='text-primary text-xl lg:text-3xl font-semibold tracking-tight mt-8'>Real estate is personal—and so are we.</h3>
        </div>
      </div>

      <div className='w-full py-10 px-6 bg-black flex justify-center'>
        <div className='px-6 py-10 flex lg:flex-row flex-col lg:w-[1200px]'>
          <div className='flex-col w-full lg:w-[60%] pt-12'>
            <h3 className='text-primary text-xl lg:text-2xl font-semibold tracking-tight'>Fred Porter</h3>
            <h3 className='text-primary text-xl lg:text-2xl font-semibold tracking-tight mb-8'>BROKER/OWNER</h3>
            <p className='text-white lg:pr-6'>
              I moved to Fort Collins, CO in 1992 from Vermont and went to Colorado State University where I got a bachelor&#39;s degree in Chemical Engineering in 1997.
              Right out of school, I went to work for New Belgium Brewing Company as a mechanic and eventually worked my way up to be the brewery&#39;s environmental engineer.  After 8 years at the Brewery, I went on to consulting engineering, designing, and building industrial wastewater treatment facilities for companies like Alcoa, Avago, Oskar Blues, and Fort Collins Brewery.
              While working as an engineer I got my real estate license, so I could buy and sell investment properties on the side.
              <br></br>
              <br></br>
              After two decades of working in engineering, I grew tired of working for other people and having little to no control over the direction my career was going in. I wanted more connection and interaction with people.  So, in 2013 I decided it was time for a change and took a leap of faith, quit my engineering job and started selling real estate full time.
              The first year was rough as most of my time went into cultivating skills, but I found a niche market in Red Feather Lakes and Livermore.
              I learned everything I could about the area and that combined with my engineering knowledge gave me a solid basis to work from. I&#39;ve always loved to be outside, so servicing rural and mountain properties was a natural fit for me.
              As time went on I also started selling more homes in and around Fort Collins. The “engineering approach” worked well and I started selling homes by creating a streamlined, clear step-by-step process.  Using the systems I developed made the marketing and selling process simple and very profitable for my clients. 
              After several years I decided it was time to open my brokerage, so in 2019 I opened Porter Real Estate!! Then recently, in 2023, I hired my daughter, Isabella.  Now Porter Real Estate is truly a small family-run business!
              I&#39;ve lived in Fort Collins for more than 30 years and watched it grow and evolve.
              <br></br>
              <br></br>
              Like many people here, I love to ski and ride my bike. Fort Collins is within a day&#39;s drive of Summit County and also close to Cameron Pass, which is an amazing playground for skiing in the winter and hiking in the summer.
              Fort Collins also has some of the best mountain biking on the front range and there are an infinite number of gravel and road rides right out your back door. My favorite mountain bike ride is the Blue Sky trail down to the Devil&#39;s Backbone in Loveland.  It&#39;s a great rolling single track that you can rip along with some technical sections and a little climbing too.
              On days when I&#39;m not able to ski or mountain bike, I volunteer as a skating official for the Fort Collins Women&#39;s Roller Derby league and do CrossFit at Crossfit DNR Voted the best Crossfit gym in FoCO several years running!
              <br></br>
              <br></br>
              I love living in Fort Collins, I raised my two daughters here and enjoyed all of the amazing recreation right outside my back door.  Looking back, I&#39;m so grateful I took the “leap of faith”.  Since then,  I&#39;ve helped hundreds of people just like you buy and sell homes in Northern Colorado. I especially love introducing new people to Colorado and the Fort Collins area.
              I&#39;m very grateful for all of my wonderful clients, every year Porter Real Estate has grown and as of 2024 our gross annual sales exceeded $10M. 
            </p>
          </div>
          <div className='flex justify-center w-full lg:w-[40%] lg:pl-6'>
            <img src='/fred.jpg' className='w-full h-auto lg:h-[700px] pt-8 lg:pt-24' />
          </div>
        </div>
      </div>

      <div className='w-full py-10 px-6 flex justify-center'>
        <div className='px-6 py-10 flex lg:flex-row flex-col lg:w-[1200px]'>
          <div className='flex justify-center w-full lg:w-[40%] lg:pr-6'>
            <img src='/isabella.jpg' className='w-full h-auto lg:h-[700px] pt-8 lg:pt-24' />
          </div>
          <div className='flex-col w-full lg:w-[60%] pt-12'>
            <h3 className='text-primary text-xl lg:text-2xl font-semibold tracking-tight w-full text-right'>Isabella Marcus-Porter</h3>
            <h3 className='text-primary text-xl lg:text-2xl font-semibold tracking-tight mb-8 w-full text-right'>MARKETING SPECIALIST</h3>
            <p className='text-black lg:pl-6'>
            Isabella is a Colorado native. Born and raised in Fort Collins, CO and has lived in Livermore, CO. She attended the University of Northern Colorado (UNC) in Greeley, where she got her bachelor&#39;s degree in journalism.
            <br></br>
            <br></br>
            At UNC She&#39;s worked hard on stories, her school&#39;s podcast, and recorded and edited videos for her school&#39;s news. Recently, she is the newest addition to Porter Real Estate where she will take over marketing.
            <br></br>
            <br></br>
            Porter Real Estate is now a true family-run small business in Northern Colorado. Isabella will handle the marketing while her father, Fred focuses on Real Estate sales.
            <br></br>
            <br></br>
            Isabella&#39;s love for photography and videography makes her social media savvy, which will be a great complement and provide a more consistent marketing presence for Porter Real Estate. This will certainly be a great benefit to all Porter Real Estate Clients ensuring even more market exposure for clients&#39; properties.
            <br></br>
            <br></br>
            Her day-to-day activities will include photography, videography, content development, social media posts, and marketing documentation. Prior to her schooling and marketing experience, she has worked at other locally owned businesses Rollerland and Fort Fun, where she got to interact with locals and learn more about the culture that is Fort Collins! When she&#39;s not working she&#39;s playing roller derby with FoCo women&#39;s 
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default About
