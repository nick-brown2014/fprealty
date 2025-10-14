'use client'

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Nav from "../components/Nav";
import Footer from "../components/Footer";

 const SettingsPage = () => {
  const { user } = useAuth()
  const router = useRouter()

  // If no user, redirect to home page
  if (!user) return router.push('/')

  return (
    <div className='w-full h-full flex-col'>
      <Nav />
      <div className='pb-10 flex flex-col w-[100vw] items-center'>
        <div className='w-[90vw] max-w-[1200px] mt-8 flex flex-col'>

        </div>
      </div>
      <Footer />
    </div>
  )
 }

 export default SettingsPage