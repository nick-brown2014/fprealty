'use client'

import Link from "next/link"
import { usePathname } from 'next/navigation'
import { useState } from "react"

const Nav = () => {
  const [hamburgerOpen, setHamburgerOpen] = useState<boolean>(false)

  const pathName = usePathname()
  const isActive = (param: string) => pathName.includes(param)

  const handleMenuClick = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log('stopping propping')
    event.stopPropagation()
  }

  const closeMenu = () => setHamburgerOpen(false)

  return (
    <>
      <div className='w-full h-16 flex flex-row justify-between items-center p-4 sticky top-0 z-20 bg-background border-b border-foreground relative'>
        <Link href='/'>
          <img src='/logo-small.jpg' className='w-auto h-12 hover:opacity-70' />
        </Link>
        <div className='w-full h-full flex-row justify-end items-center hidden lg:flex'>
          <Link aria-disabled={isActive('search')} href='/search' className={`text-lg font-semibold tracking-tight pr-16 ${isActive('search') ? 'cursor-default text-primary' : 'hover:text-primary transition duration-300'}`}>Search</Link>
          <Link aria-disabled={isActive('buying')} href='/buying' className={`text-lg font-semibold tracking-tight pr-16 ${isActive('buying') ? 'cursor-default text-primary' : 'hover:text-primary transition duration-300'}`}>Buying</Link>
          <Link aria-disabled={isActive('selling')} href='/selling' className={`text-lg font-semibold tracking-tight pr-16 ${isActive('selling') ? 'cursor-default text-primary' : 'hover:text-primary transition duration-300'}`}>Selling</Link>
          <Link aria-disabled={isActive('about')} href='/about' className={`text-lg font-semibold tracking-tight pr-16 ${isActive('about') ? 'cursor-default text-primary' : 'hover:text-primary transition duration-300'}`}>About Us</Link>
        </div>
        <img src='/menu.png' className='w-auto h-8 hover:opacity-70 cursor-pointer lg:hidden' onClick={() => setHamburgerOpen(true)} />
        <div className={`${ hamburgerOpen ? 'block' : 'hidden' } fixed inset-0 z-30 w-screen overflow-y-auto`} onClick={closeMenu}>
          <div
            id='sub-menu'
            className={`flex z-40 flex-col absolute top-16 right-0 w-40 h-56 border border-black bg-white items-center justify-between py-4`}
            onClick={handleMenuClick}
          >
            <Link aria-disabled={isActive('search')} href='/search' className={`text-xl font-semibold tracking-tight ${isActive('search') ? 'cursor-default text-primary' : 'hover:text-primary transition duration-300'}`}>Search</Link>
            <Link aria-disabled={isActive('buying')} href='/buying' className={`text-xl font-semibold tracking-tight ${isActive('buying') ? 'cursor-default text-primary' : 'hover:text-primary transition duration-300'}`}>Buying</Link>
            <Link aria-disabled={isActive('selling')} href='/selling' className={`text-xl font-semibold tracking-tight ${isActive('selling') ? 'cursor-default text-primary' : 'hover:text-primary transition duration-300'}`}>Selling</Link>
            <Link aria-disabled={isActive('about')} href='/about' className={`text-xl font-semibold tracking-tight ${isActive('about') ? 'cursor-default text-primary' : 'hover:text-primary transition duration-300'}`}>About Us</Link>
          </div>
        </div>
      </div>
    </>
  )
}

export default Nav