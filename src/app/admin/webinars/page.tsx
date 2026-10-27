import Link from 'next/link'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'
import { formatWebinarDate } from '@/lib/webinars'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Admin · Webinars' }

export default async function AdminWebinarsPage() {
  await requireAdmin()
  const webinars = await prisma.webinar.findMany({ orderBy: { startsAt: 'desc' } })
  const now = Date.now()

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <p className='font-condensed text-xs font-bold tracking-[0.22em] uppercase text-primary mb-2'>Home page</p>
            <h1 className='text-3xl font-bold text-gray-900'>Webinars</h1>
          </div>
          <div className='flex gap-4 items-center'>
            <Link
              href='/admin/webinars/new'
              className='bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition'
            >
              New webinar
            </Link>
            <Link href='/admin' className='text-blue-600 hover:text-blue-800 transition'>
              Admin dashboard
            </Link>
            <Link href='/' className='text-blue-600 hover:text-blue-800 transition'>
              Back to Site
            </Link>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-md overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Webinar
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Date
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Status
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {webinars.map((webinar) => {
                  const isPast = webinar.startsAt.getTime() < now
                  return (
                    <tr key={webinar.id} className='hover:bg-gray-50'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-4'>
                          <div className='w-14 h-14 flex-shrink-0 bg-gray-200 rounded overflow-hidden'>
                            {webinar.image && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={webinar.image} alt='' className='w-full h-full object-cover' loading='lazy' />
                            )}
                          </div>
                          <div className='min-w-0'>
                            <Link
                              href={`/admin/webinars/${webinar.id}`}
                              className='text-sm font-medium text-blue-600 hover:text-blue-900'
                            >
                              {webinar.title}
                            </Link>
                            <div className='text-xs text-gray-500 truncate max-w-md'>
                              {webinar.signUpUrl || 'No sign-up link'}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                        {formatWebinarDate(webinar.startsAt)}
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap'>
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            isPast ? 'bg-gray-100 text-gray-800' : webinar.signUpUrl ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {isPast ? 'Past' : webinar.signUpUrl ? 'Open' : 'Coming soon'}
                        </span>
                      </td>
                      <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                        <Link href={`/admin/webinars/${webinar.id}`} className='text-blue-600 hover:text-blue-900'>
                          Edit
                        </Link>
                      </td>
                    </tr>
                  )
                })}
                {webinars.length === 0 && (
                  <tr>
                    <td colSpan={4} className='px-6 py-4 text-sm text-gray-500'>
                      No webinars yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
