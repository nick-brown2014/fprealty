'use client'

import Link from "next/link"
import { usePathname } from 'next/navigation'

const Nav = () => {
  const pathName = usePathname()
  const isActive = (param: string) => pathName.includes(param)

  return (
    <div className='w-full h:16 lg:h-32 flex flex-row justify-between items-center p-4 sticky top-0 z-[1000] bg-background border-b border-foreground'>
      <Link href='/'>
        <img src='/logo-small.jpg' className='w-auto h-16 lg:h-24 hover:opacity-70' />
      </Link>
      <div className='w-full h-full flex-row justify-end items-center hidden lg:flex'>
        <Link aria-disabled={isActive('neighborhood')} href='/find-your-neighborhood' className={`text-lg font-semibold tracking-tight pr-16 ${isActive('neighborhood') ? 'cursor-default text-primary' : 'hover:text-primary transition duration-300'}`}>Find your neighborhood</Link>
        <Link aria-disabled={isActive('buying')} href='/buying' className={`text-lg font-semibold tracking-tight pr-16 ${isActive('buying') ? 'cursor-default text-primary' : 'hover:text-primary transition duration-300'}`}>Buying</Link>
        <Link aria-disabled={isActive('selling')} href='/selling' className={`text-lg font-semibold tracking-tight pr-16 ${isActive('selling') ? 'cursor-default text-primary' : 'hover:text-primary transition duration-300'}`}>Selling</Link>
        <Link aria-disabled={isActive('about')} href='/about' className={`text-lg font-semibold tracking-tight pr-16 ${isActive('about') ? 'cursor-default text-primary' : 'hover:text-primary transition duration-300'}`}>About Us</Link>
      </div>
    </div>
  )
}

export default Nav