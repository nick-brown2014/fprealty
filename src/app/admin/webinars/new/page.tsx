import Link from 'next/link'
import { requireAdmin } from '@/lib/admin'
import WebinarForm from '../webinar-form'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Admin · New webinar' }

export default async function NewWebinarPage() {
  await requireAdmin()
  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <p className='font-condensed text-xs font-bold tracking-[0.22em] uppercase text-primary mb-2'>Home page</p>
            <h1 className='text-3xl font-bold text-gray-900'>New webinar</h1>
          </div>
          <div className='flex gap-4 items-center'>
            <Link href='/admin/webinars' className='text-blue-600 hover:text-blue-800 transition'>
              All webinars
            </Link>
            <Link href='/admin' className='text-blue-600 hover:text-blue-800 transition'>
              Admin dashboard
            </Link>
          </div>
        </div>
        <WebinarForm
          webinar={{
            title: '',
            description: '',
            image: '',
            signUpUrl: '',
            startsAt: '',
          }}
        />
      </div>
    </div>
  )
}
