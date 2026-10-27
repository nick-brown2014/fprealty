import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { toDenverInputValue } from '@/lib/webinars'
import WebinarForm from '../webinar-form'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Admin · Edit webinar' }

export default async function EditWebinarPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const webinar = await prisma.webinar.findUnique({ where: { id } })
  if (!webinar) notFound()

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <p className='font-condensed text-xs font-bold tracking-[0.22em] uppercase text-primary mb-2'>Home page</p>
            <h1 className='text-3xl font-bold text-gray-900'>Edit webinar</h1>
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
            id: webinar.id,
            title: webinar.title,
            description: webinar.description,
            image: webinar.image ?? '',
            signUpUrl: webinar.signUpUrl ?? '',
            startsAt: toDenverInputValue(webinar.startsAt),
          }}
        />
      </div>
    </div>
  )
}
