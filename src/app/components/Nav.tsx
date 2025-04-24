import Link from "next/link"

const Nav = () => (
  <div className='w-full h:16 lg:h-32 flex flex-row justify-between items-center p-4 sticky top-0 z-50 bg-background border-b border-foreground'>
    <Link href='/'>
      <img src='/ingrid.png' className='w-auto h-16 lg:h-24 hover:opacity-70' />
    </Link>
    <div className='w-full h-full flex-row justify-end items-center hidden lg:flex'>
      <Link href='/find-your-neighborhood' className='text-lg font-semibold tracking-tight pr-16 hover:text-primary transition duration-300'>Find your neighborhood</Link>
      <Link href='/buying' className='text-lg font-semibold tracking-tight pr-16 hover:text-primary transition duration-300'>Buying</Link>
      <Link href='/selling' className='text-lg font-semibold tracking-tight pr-16 hover:text-primary transition duration-300'>Selling</Link>
      <Link href='/about' className='text-lg font-semibold tracking-tight pr-16 hover:text-primary transition duration-300'>About us</Link>
    </div>
  </div>
)

export default Nav