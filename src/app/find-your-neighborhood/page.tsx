import Nav from "../components/Nav";

const Home = () => {
  return (
    <div className='w-full h-full flex-col'>
      <Nav />
      <div className='px-6 py-10 flex flex-col'>
        <h3 className='font-bold tracking-tight text-xl sm:text-3xl lg:text-5xl'>Find your neighborhood</h3>
        {/* <NeighborhoodWizard /> */}
      </div>
    </div>
  );
}

export default Home
