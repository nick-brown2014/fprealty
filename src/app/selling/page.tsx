import Nav from "@/app/components/Nav";
import SellingWizard from "@/app/components/wizards/SellingWizard";

const SellingPage = () => {
  return (
    <div className='w-full h-full flex-col'>
      <Nav />
      <div className='pb-10 items-center flex-col flex'>
        <div className='items-center w-full flex-col relative overflow-hidden min-h-74 lg:min-h-[400px] justify-center flex'>
          <img src='/selling-header.jpg' className='w-full h-auto absolute -z-10 brightness-50' />
          <h1 className='font-bold text-center tracking-tight text-3xl sm:text-5xl lg:text-7xl text-white'>Why sell with Porter Real Estate?</h1>
        </div>
        <p className='max-w-[1000px] font-semibold tracking-tight w-full text-md lg:text-lg my-16 px-12 lg:px-0'>
          The Northern Colorado real estate market is constantly evolving—making it more important than ever to have experienced, strategic professionals by your side.
          At Porter Real Estate, we&#39;re your trusted NoCo Realtors, combining local expertise with a proven approach to help you sell with confidence and clarity.
        </p>
        <div className='bg-black flex flex-col w-full py-24 px-12 items-center'>
          <h2 className='text-left w-full max-w-[1000px] font-bold tracking-tight mb-6 lg:text-4xl text-2xl text-white'>
            Let&#39;s talk about your <span className='text-primary'>next move.</span>
          </h2>
          <p className='max-w-[1000px] font-semibold tracking-tight lg:text-xl text-white'>
            Share a few quick details with us, and schedule a no-pressure video consultation from the comfort of your home.
            The first step to a smooth, successful sale starts right here—with the Porter Real Estate, your NoCO Realtors who know how to get it done.
          </p>
        </div>
        <div className='w-full flex justify-center py-8 lg:py-16'>
          <SellingWizard />
        </div>
      </div>
    </div>
  );
}

export default SellingPage
