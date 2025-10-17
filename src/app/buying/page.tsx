import { Metadata } from "next";
import Nav from "../components/Nav";
import BuyingWizard from "../components/wizards/BuyingWizard";

export const metadata: Metadata = {
  title: "Buy a Home in Northern Colorado | Expert Buyer's Agents | Porter Real Estate",
  description: "Looking to buy a home in Northern Colorado? Work with experienced buyer's agents at Porter Real Estate. We'll guide you through every step of the home buying process.",
  openGraph: {
    title: "Buy a Home in Northern Colorado | Porter Real Estate",
    description: "Expert guidance for home buyers in NoCo. Find your dream home with Porter Real Estate.",
  },
};

const BuyingPage = () => {
  return (
    <div className='w-full h-full flex-col'>
      <Nav />
      <div className='pb-10 items-center flex-col flex'>
        <div className='items-center w-full flex-col relative overflow-hidden min-h-74 lg:min-h-[400px] justify-center flex'>
          <img src='/buying-header.jpeg' className='w-full h-auto absolute -z-10 brightness-50' />
          <h1 className='font-bold text-center tracking-tight text-3xl sm:text-5xl lg:text-7xl text-white'>Why buy with Porter Real Estate?</h1>
          <h2 className='mt-6 font-bold tracking-tight hidden lg:block text-4xl text-white text-center'>
            Your local NoCo realtor
          </h2>
        </div>
        <p className='max-w-[1000px] font-semibold tracking-tight w-full text-md lg:text-lg mt-16 px-4 lg:px-0'>
          Whether you&#39;re a first-time homebuyer or relocating to Northern Colorado (NoCO), Porter Real Estate is here to make the process smooth and stress-free.
          As local experts, we know the neighborhoods, the market, and how to navigate every step—from your first search to final closing.
          In person or virtually, we&#39;ll be by your side with the guidance, tools, and support you need to make confident decisions.
        </p>
        <div className='w-full flex justify-center py-8 lg:py-16'>
          <BuyingWizard />
        </div>
      </div>
    </div>
  );
}

export default BuyingPage
