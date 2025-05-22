import Footer from "./components/Footer";
import Nav from "./components/Nav";

export default function Home() {
  return (
    <div className='w-full h-full flex-col flex'>
      <Nav />
      <div className='pb-10 items-center flex-col flex'>
        <div className='items-center w-full flex-col relative overflow-hidden lg:min-h-[600px] lg:justify-center flex'>
          <img src='/home-header.jpg' className='w-full h-auto absolute -z-10 brightness-50' />
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
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Fort Collins</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Loveland</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Wellington</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Windsor</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Red Feather Lakes</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Greeley</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Berthoud</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Estes Park</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Longmont</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Lyons</a>
              </div>
              <div className='w-full lg:w-1/2 flex-col gap-2 pr-2 lg:items-end flex'>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Boulder</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Arvada</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Aurora</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Denver</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Livermore</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Bellevue</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Frederick</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Firestone</a>
                <a href='/buying' className='font-semibold tracking-tight uppercase hover:text-secondary transition duration-200'>Johnstown</a>
              </div>
            </div>
          </div>
        </div>

        <div className='w-full py-16 bg-foreground min-h-[400px] justify-center flex'>
          <div className='flex-col w-[1000px] flex'>
            <h1 className='text-5xl font-bold tracking-tight text-background'>
              YouTube Section
            </h1>
          </div>
        </div>

        <div className='w-full lg:w-[1000px] py-16 bg-background flex flex-col lg:flex-row'>
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
        
      </div>
      <Footer />
    </div>
  );
}
