import Link from 'next/link'
import { notFound } from 'next/navigation'
import { requireAdmin } from '@/lib/admin'
import { blogCategories } from '@/lib/blog-categories'
import { prisma } from '@/lib/prisma'
import PostForm from '../post-form'

export const dynamic = 'force-dynamic'

export const metadata = { title: 'Admin · Edit post' }

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  await requireAdmin()
  const { id } = await params
  const [post, existingCategories] = await Promise.all([
    prisma.blogPost.findUnique({ where: { id } }),
    blogCategories(),
  ])
  if (!post) notFound()

  return (
    <div className='min-h-screen bg-gray-50 p-8'>
      <div className='max-w-4xl mx-auto'>
        <div className='flex justify-between items-center mb-8'>
          <div>
            <p className='font-condensed text-xs font-bold tracking-[0.22em] uppercase text-primary mb-2'>Blog</p>
            <h1 className='text-3xl font-bold text-gray-900'>Edit post</h1>
          </div>
          <div className='flex gap-4 items-center'>
            <Link href='/admin/posts' className='text-blue-600 hover:text-blue-800 transition'>
              All posts
            </Link>
            <Link href='/admin' className='text-blue-600 hover:text-blue-800 transition'>
              Admin dashboard
            </Link>
          </div>
        </div>
        <PostForm
          post={{
            id: post.id,
            slug: post.slug,
            title: post.title,
            excerpt: post.excerpt,
            content: post.content ?? '',
            categories: post.categories,
            heroImage: post.heroImage ?? '',
            publishedAt: post.publishedAt.toISOString().slice(0, 10),
          }}
          existingCategories={existingCategories}
        />
      </div>
    </div>
  )
}
