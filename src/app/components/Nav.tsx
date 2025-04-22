import Link from "next/link"

const Nav = () => {
  const logoSource = '@/public/logo-small.jpg'

  return (
    <div className='w-full h-32 flex-row justify-between items-center p-4 fixed top-0 left-0'>
      <Link href='/'>
        <img src={logoSource} className='w-auto h-24 hover:opacity-70' />
      </Link>
      <div className='w-full h-full flex-row justify-end items-center'>
        <Link href='/find-your-neighborhood' className='font-semibold tracking-tight pr-10 hover:opacity-70'>Find your neighborhood</Link>
        <Link href='/buying' className='font-semibold tracking-tight pr-10 hover:opacity-70'>Buying</Link>
        <Link href='/selling' className='font-semibold tracking-tight pr-10 hover:opacity-70'>Selling</Link>
        <Link href='/about' className='font-semibold tracking-tight pr-10 hover:opacity-70'>About Us</Link>
      </div>
    </div>
  )
}

export default Nav