import Link from 'next/link'
import { requireAdmin } from '@/lib/admin'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Admin · Blog posts' }

export default async function AdminPostsPage() {
  await requireAdmin()
  const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: 'desc' } })

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-7xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <p className='font-condensed text-xs font-bold tracking-[0.22em] uppercase text-primary mb-2'>Blog</p>
            <h1 className='text-3xl font-bold text-gray-900'>Posts</h1>
          </div>
          <div className='flex gap-4 items-center'>
            <Link
              href='/admin/posts/new'
              className='bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700 transition'
            >
              New post
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
                    Title
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Published
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Categories
                  </th>
                  <th className='px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {posts.map((post) => (
                  <tr key={post.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4'>
                      <Link
                        href={`/admin/posts/${post.id}`}
                        className='text-sm font-medium text-blue-600 hover:text-blue-900'
                      >
                        {post.title}
                      </Link>
                      <div className='text-xs text-gray-500'>/blog/{post.slug}</div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-600'>
                      {post.publishedAt.toISOString().slice(0, 10)}
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex flex-wrap gap-1'>
                        {post.categories.map((category) => (
                          <span
                            className='px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800'
                            key={category}
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-right text-sm font-medium'>
                      <Link href={`/blog/${post.slug}`} className='text-blue-600 hover:text-blue-900 mr-4'>
                        View
                      </Link>
                      <Link href={`/admin/posts/${post.id}`} className='text-blue-600 hover:text-blue-900'>
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
                {posts.length === 0 && (
                  <tr>
                    <td colSpan={4} className='px-6 py-4 text-sm text-gray-500'>
                      No posts yet.
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
