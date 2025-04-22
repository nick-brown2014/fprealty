import Nav from "./components/Nav";

export default function Home() {
  return (
    <div className='w-full h-full flex-col'>
      <Nav />
      <div className='pb-10 pt-40 items-center flex-col'>
        <div className='items-center w-full flex-col'>
          <h1 className='font-bold tracking-tight text-6xl mt-24'>Porter Real Estate</h1>
          <h1 className='font-bold tracking-tight text-6xl mt-2'>Your NoCo Realtor</h1>
          <h2 className='mt-6 font-bold tracking-tight text-2xl'>
            Your ultimate resource to living in Northern Colorado
          </h2>

          <div className='justify-center my-12 gap-8'>
            <a href='/buying' className='py-2 px-8 text-3xl font-bold border'>Buy</a>
            <a href='/selling' className='py-2 px-8 text-3xl font-bold border'>Sell</a>
          </div>
        </div>

      </div>
    </div>
  );
}
